/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OrderStatus, PaymentProvider } from '../../src/types/index.js';
import { config } from '../config.js';

interface PesaPalTokenResponse {
  token: string;
  expiryDate: string;
  error: string | null;
  status: string;
}

interface SubmitOrderPayload {
  id: string; // Merchant Reference
  currency: string;
  amount: number;
  description: string;
  callback_url: string;
  notification_id: string;
  billing_address: {
    email_address: string;
    phone_number?: string;
    country_code?: string;
    first_name?: string;
    last_name?: string;
  };
}

interface PesaPalSubmitOrderResponse {
  order_tracking_id: string;
  merchant_reference: string;
  redirect_url: string;
  error: any;
  status: string;
}

class PesaPalService {
  private cachedToken: string | null = null;
  private tokenExpiry: number = 0;

  isConfigured(): boolean {
    return Boolean(
      config.pesapal.consumerKey &&
      config.pesapal.consumerSecret &&
      config.pesapal.consumerKey.trim().length > 0 &&
      config.pesapal.consumerSecret.trim().length > 0
    );
  }

  getEnvironment(): 'sandbox' | 'live' {
    return config.pesapal.environment;
  }

  /**
   * Request or reuse PesaPal v3 Bearer Token
   */
  async getAuthToken(): Promise<string | null> {
    if (!this.isConfigured()) {
      return null;
    }

    const now = Date.now();
    if (this.cachedToken && this.tokenExpiry > now + 60000) {
      return this.cachedToken;
    }

    try {
      const url = `${config.pesapal.baseUrl}/api/Auth/RequestToken`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          consumer_key: config.pesapal.consumerKey,
          consumer_secret: config.pesapal.consumerSecret,
        }),
      });

      if (!response.ok) {
        console.error('PesaPal Auth failed with status:', response.status);
        return null;
      }

      const data: PesaPalTokenResponse = await response.json();
      if (data.token) {
        this.cachedToken = data.token;
        // Expire in 5 minutes by default if expiryDate not parsed
        this.tokenExpiry = data.expiryDate ? new Date(data.expiryDate).getTime() : now + 300000;
        return this.cachedToken;
      }
      return null;
    } catch (error) {
      console.error('Error fetching PesaPal token:', error);
      return null;
    }
  }

  /**
   * Submit an order to PesaPal Payment Gateway
   */
  async submitOrder(order: {
    merchantReference: string;
    amount: number;
    currency: string;
    description: string;
    userEmail: string;
    displayName?: string;
    callbackUrl: string;
  }): Promise<{
    success: boolean;
    redirectUrl?: string;
    orderTrackingId?: string;
    merchantReference: string;
    isConfigured: boolean;
    error?: string;
  }> {
    if (!this.isConfigured()) {
      return {
        success: false,
        merchantReference: order.merchantReference,
        isConfigured: false,
        error: 'PesaPal credentials (PESAPAL_CONSUMER_KEY and PESAPAL_CONSUMER_SECRET) are not yet configured in server environment.',
      };
    }

    const token = await this.getAuthToken();
    if (!token) {
      return {
        success: false,
        merchantReference: order.merchantReference,
        isConfigured: true,
        error: 'Failed to authenticate with PesaPal Gateway. Verify credentials.',
      };
    }

    try {
      const nameParts = (order.displayName || 'Enermind Student').split(' ');
      const payload: SubmitOrderPayload = {
        id: order.merchantReference,
        currency: order.currency,
        amount: order.amount,
        description: order.description,
        callback_url: order.callbackUrl,
        notification_id: config.pesapal.ipnId || 'default-ipn-id',
        billing_address: {
          email_address: order.userEmail,
          first_name: nameParts[0] || 'Enermind',
          last_name: nameParts.slice(1).join(' ') || 'User',
        },
      };

      const url = `${config.pesapal.baseUrl}/api/Transactions/SubmitOrderRequest`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data: PesaPalSubmitOrderResponse = await res.json();
      if (res.ok && data.redirect_url) {
        return {
          success: true,
          redirectUrl: data.redirect_url,
          orderTrackingId: data.order_tracking_id,
          merchantReference: data.merchant_reference,
          isConfigured: true,
        };
      }

      return {
        success: false,
        merchantReference: order.merchantReference,
        isConfigured: true,
        error: data.error?.message || 'PesaPal rejected the transaction payload.',
      };
    } catch (err: any) {
      return {
        success: false,
        merchantReference: order.merchantReference,
        isConfigured: true,
        error: err?.message || 'Network error connecting to PesaPal gateway.',
      };
    }
  }

  /**
   * Verify transaction status via PesaPal IPN or manual poll
   */
  async getTransactionStatus(orderTrackingId: string): Promise<{
    status: OrderStatus;
    paymentMethod?: string;
    amount?: number;
    currency?: string;
    rawStatus?: string;
    verified: boolean;
  }> {
    if (!this.isConfigured() || !orderTrackingId) {
      return { status: OrderStatus.PENDING, verified: false };
    }

    const token = await this.getAuthToken();
    if (!token) {
      return { status: OrderStatus.PENDING, verified: false };
    }

    try {
      const url = `${config.pesapal.baseUrl}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`;
      const res = await fetch(url, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        return { status: OrderStatus.PENDING, verified: false };
      }

      const data = await res.json();
      let status = OrderStatus.PENDING;
      if (data.status_code === 1 || data.payment_status_description === 'Completed') {
        status = OrderStatus.PAID;
      } else if (data.status_code === 2 || data.payment_status_description === 'Failed') {
        status = OrderStatus.FAILED;
      } else if (data.status_code === 3 || data.payment_status_description === 'Reversed') {
        status = OrderStatus.REFUNDED;
      }

      return {
        status,
        paymentMethod: data.payment_method,
        amount: data.amount,
        currency: data.currency,
        rawStatus: data.payment_status_description,
        verified: true,
      };
    } catch (err) {
      console.error('Error checking PesaPal transaction status:', err);
      return { status: OrderStatus.PENDING, verified: false };
    }
  }
}

export const pesapalService = new PesaPalService();

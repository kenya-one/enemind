/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CurrencyRate } from '../../src/types/index.js';
import { config } from '../config.js';

// Base currency is USD (rateToUSD = 1.0)
export const DEFAULT_CURRENCIES: Record<string, CurrencyRate> = {
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', rateToUSD: 1.0, flag: '🇺🇸', lastUpdated: new Date().toISOString() },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', rateToUSD: 0.79, flag: '🇬🇧', lastUpdated: new Date().toISOString() },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', rateToUSD: 0.92, flag: '🇪🇺', lastUpdated: new Date().toISOString() },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', rateToUSD: 1.36, flag: '🇨🇦', lastUpdated: new Date().toISOString() },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rateToUSD: 1.52, flag: '🇦🇺', lastUpdated: new Date().toISOString() },
  KES: { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', rateToUSD: 129.5, flag: '🇰🇪', lastUpdated: new Date().toISOString() },
  NGN: { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', rateToUSD: 1540.0, flag: '🇳🇬', lastUpdated: new Date().toISOString() },
  ZAR: { code: 'ZAR', name: 'South African Rand', symbol: 'R', rateToUSD: 18.25, flag: '🇿🇦', lastUpdated: new Date().toISOString() },
  GHS: { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵', rateToUSD: 15.6, flag: '🇬🇭', lastUpdated: new Date().toISOString() },
  UGX: { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', rateToUSD: 3720.0, flag: '🇺🇬', lastUpdated: new Date().toISOString() },
  TZS: { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', rateToUSD: 2600.0, flag: '🇹🇿', lastUpdated: new Date().toISOString() },
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', rateToUSD: 84.1, flag: '🇮🇳', lastUpdated: new Date().toISOString() },
  AED: { code: 'AED', name: 'UAE Dirham', symbol: 'AED', rateToUSD: 3.67, flag: '🇦🇪', lastUpdated: new Date().toISOString() },
  SGD: { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rateToUSD: 1.34, flag: '🇸🇬', lastUpdated: new Date().toISOString() },
};

class CurrencyService {
  private rates: Map<string, CurrencyRate> = new Map();

  constructor() {
    for (const [code, rate] of Object.entries(DEFAULT_CURRENCIES)) {
      this.rates.set(code, rate);
    }
  }

  getRates(): CurrencyRate[] {
    return Array.from(this.rates.values());
  }

  getRate(currencyCode: string): CurrencyRate {
    const uppercase = currencyCode.toUpperCase();
    return this.rates.get(uppercase) || this.rates.get('USD')!;
  }

  /**
   * Convert an amount from one currency to another without destroying original record
   */
  convert(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): {
    originalAmount: number;
    originalCurrency: string;
    targetAmount: number;
    targetCurrency: string;
    rate: number;
    rateTimestamp: string;
    isEstimate: boolean;
  } {
    const from = this.getRate(fromCurrency);
    const to = this.getRate(toCurrency);

    // Convert from origin to USD, then from USD to target
    const amountInUSD = amount / from.rateToUSD;
    const targetAmount = Number((amountInUSD * to.rateToUSD).toFixed(2));
    const effectiveRate = Number((to.rateToUSD / from.rateToUSD).toFixed(6));

    return {
      originalAmount: amount,
      originalCurrency: from.code,
      targetAmount,
      targetCurrency: to.code,
      rate: effectiveRate,
      rateTimestamp: new Date().toISOString(),
      isEstimate: from.code !== to.code,
    };
  }

  format(amount: number, currencyCode: string): string {
    const rate = this.getRate(currencyCode);
    return `${rate.symbol} ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

export const currencyService = new CurrencyService();

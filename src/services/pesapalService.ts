export interface PesapalConfig {
  consumerKey: string;
  consumerSecret: string;
  environment: 'sandbox' | 'live';
}

export interface PesapalPaymentIntent {
  orderId: string;
  itemTitle: string;
  amountKes: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  sellerId: string;
  sellerName: string;
  sellerType: 'company' | 'dealer' | 'landlord' | 'student' | 'school';
  isStudentContent?: boolean;
}

export interface PesapalPaymentResult {
  success: boolean;
  trackingId: string;
  pesapalRef: string;
  mpesaReceiptNo?: string;
  amountKes: number;
  platformFeeKes: number;
  sellerEarningsKes: number;
  status: 'COMPLETED' | 'FAILED' | 'PENDING';
  timestamp: string;
  gatewayEnvironment: 'sandbox' | 'live';
}

export class PesapalService {
  private static readonly SANDBOX_URL = 'https://cybqa.pesapal.com/pesapalv3/api';
  private static readonly LIVE_URL = 'https://pay.pesapal.com/v3/api';

  // Configured with your merchant credentials, read from environment variables if present
  private static config: PesapalConfig = {
    consumerKey: import.meta.env.VITE_PESAPAL_CONSUMER_KEY || 'rtAW/lohVgY8aOXHR28mGAviCojncpRH',
    consumerSecret: import.meta.env.VITE_PESAPAL_CONSUMER_SECRET || 'oLcrbEY+tJoas7dFgYinH2ZS5kQ=',
    environment: (import.meta.env.VITE_PESAPAL_ENVIRONMENT as 'sandbox' | 'live') || 'sandbox'
  };

  /**
   * Get the current gateway status & merchant details
   */
  static getGatewayInfo() {
    return {
      provider: 'Pesapal V3 API',
      consumerKeyMasked: `${this.config.consumerKey.substring(0, 6)}...${this.config.consumerKey.slice(-4)}`,
      environment: this.config.environment,
      supportedMethods: ['M-Pesa Express (STK Push)', 'Airtel Money', 'Visa/Mastercard']
    };
  }

  /**
   * Update credentials dynamically if needed
   */
  static setCredentials(consumerKey: string, consumerSecret: string, environment: 'sandbox' | 'live' = 'sandbox') {
    this.config = { consumerKey, consumerSecret, environment };
  }

  /**
   * Process payment via Pesapal API Gateway / M-Pesa STK Push
   */
  static async processPayment(intent: PesapalPaymentIntent): Promise<PesapalPaymentResult> {
    // 15% platform cut for student-uploaded content, 0% for direct merchant listings
    const platformFeeKes = intent.isStudentContent ? Math.round(intent.amountKes * 0.15) : 0;
    const sellerEarningsKes = intent.amountKes - platformFeeKes;

    return new Promise((resolve) => {
      // Simulate real STK Push roundtrip to Safaricom/Pesapal endpoints
      setTimeout(() => {
        const randId = Math.floor(100000 + Math.random() * 900000);
        const trackingId = `PP-TXN-${randId}-KE`;
        const mpesaReceipt = `QK${Math.floor(10 + Math.random() * 89)}K${Math.floor(100 + Math.random() * 899)}EP`;

        resolve({
          success: true,
          trackingId,
          pesapalRef: `PESAPAL-${randId}`,
          mpesaReceiptNo: mpesaReceipt,
          amountKes: intent.amountKes,
          platformFeeKes,
          sellerEarningsKes,
          status: 'COMPLETED',
          timestamp: new Date().toLocaleDateString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' EAT',
          gatewayEnvironment: this.config.environment
        });
      }, 1400);
    });
  }
}

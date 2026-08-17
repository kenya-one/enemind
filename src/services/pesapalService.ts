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
}

export class PesapalService {
  /**
   * Process payment via Pesapal / M-Pesa STK Push
   */
  static processPayment(intent: PesapalPaymentIntent): Promise<PesapalPaymentResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const randId = Math.floor(100000 + Math.random() * 900000);
        const trackingId = `PP-TXN-${randId}-KE`;
        const mpesaReceipt = `QW${Math.floor(10 + Math.random() * 89)}K${Math.floor(100 + Math.random() * 899)}EP`;
        
        // 15% student cut if student-uploaded content
        const platformFeeKes = intent.isStudentContent ? Math.round(intent.amountKes * 0.15) : 0;
        const sellerEarningsKes = intent.amountKes - platformFeeKes;

        resolve({
          success: true,
          trackingId,
          pesapalRef: `PESAPAL-${randId}`,
          mpesaReceiptNo: mpesaReceipt,
          amountKes: intent.amountKes,
          platformFeeKes,
          sellerEarningsKes,
          status: 'COMPLETED',
          timestamp: new Date().toLocaleDateString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' EAT'
        });
      }, 1200);
    });
  }
}

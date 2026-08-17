import React, { useState } from 'react';
import { X, Smartphone, CreditCard, CheckCircle2, Shield, AlertCircle, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { PesapalService } from '../services/pesapalService';
import { DriveSheetsService } from '../services/driveSheetsService';

export const PesapalModal: React.FC = () => {
  const { checkoutIntent, closeCheckout, addOrder, showToast } = useApp();
  const { user } = useAuth();
  
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card'>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '0743112233');
  const [deliveryAddress, setDeliveryAddress] = useState('Nairobi, Kenya');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  if (!checkoutIntent) return null;

  const platformFee = checkoutIntent.isStudentContent ? Math.round(checkoutIntent.amountKes * 0.15) : 0;
  const sellerEarnings = checkoutIntent.amountKes - platformFee;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const result = await PesapalService.processPayment({
        ...checkoutIntent,
        customerPhone: phoneNumber
      });

      if (result.success) {
        setReceiptData(result);
        setPaymentSuccess(true);

        // Record in central state
        const orderId = checkoutIntent.orderId || `ORD-${Date.now()}`;
        addOrder({
          id: orderId,
          buyerId: user?.id || 'guest_buyer',
          buyerName: checkoutIntent.customerName,
          buyerPhone: phoneNumber,
          buyerEmail: checkoutIntent.customerEmail,
          sellerId: checkoutIntent.sellerId,
          sellerName: checkoutIntent.sellerName,
          itemTitle: checkoutIntent.itemTitle,
          quantity: 1,
          totalPriceKes: checkoutIntent.amountKes,
          status: 'paid_escrow',
          paymentMethod: paymentMethod === 'mpesa' ? 'M-Pesa STK Push' : 'Pesapal',
          pesapalTrackingId: result.trackingId,
          deliveryAddress,
          timestamp: result.timestamp
        });

        // Auto-log to Google Drive Sheets for Seller
        DriveSheetsService.addRowToSheet(checkoutIntent.sellerId, 'Sales', {
          Order_ID: orderId,
          Customer_Name: checkoutIntent.customerName,
          Customer_Phone: phoneNumber,
          Amount_KES: checkoutIntent.amountKes,
          Payment_Status: 'PAID_PESAPAL',
          Delivery_Location: deliveryAddress
        });

        if (checkoutIntent.isStudentContent) {
          DriveSheetsService.addRowToSheet(checkoutIntent.sellerId, 'Earnings', {
            Txn_ID: result.trackingId,
            Item_Sold: checkoutIntent.itemTitle,
            Gross_KES: checkoutIntent.amountKes,
            Enemind_15Pct_Cut_KES: platformFee,
            Net_Earnings_KES: sellerEarnings
          });
        }

        showToast('Payment successful! Auto-recorded in your Google Drive Sheets.');
      }
    } catch (err) {
      showToast('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              P
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pesapal Secure Checkout</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-[10px] font-semibold text-slate-600">
                  Pesapal V3 Gateway Active • STK Push & Card
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={closeCheckout}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {!paymentSuccess ? (
            <form onSubmit={handlePay} className="space-y-4">
              
              {/* Order Summary Box */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[11px] font-semibold text-blue-600 uppercase">Item / Service</p>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{checkoutIntent.itemTitle}</h4>
                    <p className="text-xs text-slate-500">Seller: {checkoutIntent.sellerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-extrabold text-blue-900">
                      KES {checkoutIntent.amountKes.toLocaleString()}
                    </p>
                  </div>
                </div>

                {checkoutIntent.isStudentContent && (
                  <div className="pt-2 border-t border-blue-200/60 text-[11px] text-blue-700 flex justify-between">
                    <span>Creator Net Earnings (85%):</span>
                    <span className="font-semibold">KES {sellerEarnings.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Payment Method Switcher */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Select Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition ${
                      paymentMethod === 'mpesa'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-200'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>M-Pesa STK Push</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition ${
                      paymentMethod === 'card'
                        ? 'border-blue-500 bg-blue-50 text-blue-800 ring-2 ring-blue-200'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>Card / Visa</span>
                  </button>
                </div>
              </div>

              {/* M-Pesa Input Form */}
              {paymentMethod === 'mpesa' ? (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Safaricom M-Pesa Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 0743112233 or 254712345678"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    An instant STK Push prompt will be sent to your phone to enter M-Pesa PIN.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="4000 1234 5678 9010"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-500 outline-none"
                      defaultValue="4000 8899 7766 5544"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      defaultValue="12/28"
                      className="px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-blue-500 outline-none"
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      defaultValue="123"
                      className="px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Delivery / Recipient Location */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Delivery Address / Campus Hostel Location
                </label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="e.g. Chiromo Campus Hostel Hall 4 or Ruiru Bypass"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-500 outline-none"
                />
              </div>

              {/* Trust Badge */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs text-slate-600">
                <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Protected by Pesapal Double-Confirmation Escrow</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing via Pesapal STK Push...</span>
                  </>
                ) : (
                  <>
                    <span>Pay KES {checkoutIntent.amountKes.toLocaleString()}</span>
                  </>
                )}
              </button>

            </form>
          ) : (
            /* Payment Receipt Confirmation */
            <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900">Payment Confirmed!</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your transaction has been processed via Pesapal and logged to Google Sheets.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">M-Pesa Receipt:</span>
                  <span className="font-bold text-slate-900">{receiptData?.mpesaReceiptNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pesapal Tracking ID:</span>
                  <span className="font-bold text-slate-900">{receiptData?.trackingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Paid:</span>
                  <span className="font-bold text-emerald-600">KES {receiptData?.amountKes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Logged to Sheet:</span>
                  <span className="font-semibold text-blue-600">Sales & Orders</span>
                </div>
              </div>

              <button
                onClick={closeCheckout}
                className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
              >
                Done & Return to Marketplace
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

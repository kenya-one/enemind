/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  DollarSign,
  Lock,
  CreditCard,
  Phone,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Task, TaskApplication } from '../../types/index.js';
import { useCurrency } from '../../context/CurrencyContext.js';
import { api } from '../../services/api.js';

interface TaskPaymentModalProps {
  task: Task | null;
  application: TaskApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: () => void;
}

export function TaskPaymentModal({
  task,
  application,
  isOpen,
  onClose,
  onPaymentComplete,
}: TaskPaymentModalProps) {
  const { formatPrice } = useCurrency();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'MPESA' | 'AIRTEL' | 'CARD'>('MPESA');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !task || !application) return null;

  const totalAmount = application.bidAmount;

  async function handleConfirmPayment(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      // Simulate real PesaPal server-side tokenized checkout authorization
      const fakeRef = `PESAPAL-TASK-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      const res = await api.assignWorkerAndFund(task!.id, application!.id, `ord-${Date.now()}`, fakeRef);

      if (res.success) {
        onPaymentComplete();
        onClose();
      } else {
        setError('Payment verification failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed.');
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Protected Task Payment</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Authorize funding via PesaPal to officially assign this task.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleConfirmPayment} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Assigned Worker Summary */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Selected Worker:</span>
              <span className="font-bold text-slate-200">{application.workerName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Agreed Bid Amount:</span>
              <span className="font-bold text-emerald-400 text-sm">
                {formatPrice(totalAmount, application.currency)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Estimated Delivery:</span>
              <span className="text-slate-200">{application.estimatedDuration}</span>
            </div>
          </div>

          {/* PesaPal Guarantee Notice */}
          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-xs text-slate-300 space-y-1">
            <div className="font-bold text-emerald-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Enermind Protected Payment Terms</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Your payment will be securely held in protected custody by Enermind. Funds are only released to the worker once you review and approve their completed deliverables.
            </p>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Select PesaPal Channel
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('MPESA')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'MPESA'
                    ? 'bg-emerald-950/40 border-emerald-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold">M-Pesa</div>
                <div className="text-[10px] text-slate-400 mt-0.5">STK Push</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('AIRTEL')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'AIRTEL'
                    ? 'bg-red-950/40 border-red-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold">Airtel Money</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Mobile Pay</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'CARD'
                    ? 'bg-blue-950/40 border-blue-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold">Credit / Debit</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Visa/Mastercard</div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Mobile Number for PesaPal Prompt
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+254 700 000000"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-colors disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Authorizing PesaPal Payment...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authorize & Assign ({formatPrice(totalAmount, application.currency)})</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

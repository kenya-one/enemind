/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  Building2,
  Calendar,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Shield,
} from 'lucide-react';
import { AccommodationListing } from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';
import { api } from '../../services/api.js';

interface InquiryModalProps {
  property: AccommodationListing | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function InquiryModal({ property, isOpen, onClose, onSuccess }: InquiryModalProps) {
  const { user } = useAuth();
  const [moveInDate, setMoveInDate] = useState('');
  const [durationMonths, setDurationMonths] = useState('6');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !property) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      await api.createPropertyInquiry({
        propertyId: property.id,
        message: message.trim(),
        moveInDate: moveInDate || undefined,
        durationMonths: durationMonths ? parseInt(durationMonths, 10) : undefined,
      });

      setIsSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2200);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit inquiry');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        id="inquiry-modal"
        className="relative w-full max-w-lg bg-[#12141D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#171923]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#50E3C2]/10 text-[#50E3C2] flex items-center justify-center border border-[#50E3C2]/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Contact Property Manager</h2>
              <p className="text-xs text-white/40 truncate max-w-[280px]">{property.title}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Inquiry Sent Successfully!</h3>
            <p className="text-xs text-white/60">
              Your inquiry has been dispatched to <span className="text-white font-medium">{property.ownerName}</span>.
              You will receive updates in your Student Inquiries inbox.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errorMessage && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Property Summary Pill */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="font-semibold text-white">{property.title}</div>
                <div className="text-white/40">{property.city} • {property.currency} {property.price.toLocaleString()}/mo</div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-[#50E3C2]/10 text-[#50E3C2] border border-[#50E3C2]/20">
                {property.availableUnits} units free
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-white/60 uppercase mb-1">
                  Expected Move-in Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-white/60 uppercase mb-1">
                  Stay Duration (Months)
                </label>
                <select
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(e.target.value)}
                  className="w-full p-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]"
                >
                  <option value="1" className="bg-[#12141D]">1 Month (Short Stay)</option>
                  <option value="3" className="bg-[#12141D]">3 Months (1 Trimester)</option>
                  <option value="6" className="bg-[#12141D]">6 Months (1 Semester)</option>
                  <option value="12" className="bg-[#12141D]">12 Months (Full Academic Year)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-white/60 uppercase mb-1">
                Your Message / Viewing Request <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi! I am a student at University of Nairobi looking for a single room. Can I schedule a physical viewing this Saturday?"
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#50E3C2]"
                required
              />
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-white/50 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-[#50E3C2] shrink-0" />
              <span>Your contact details ({user?.displayName || 'Student'}, {user?.email}) will be securely shared with the owner.</span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#50E3C2] hover:bg-[#38cbb0] text-black transition-all flex items-center gap-2 shadow-lg shadow-[#50E3C2]/10 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending...' : 'Send Inquiry'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

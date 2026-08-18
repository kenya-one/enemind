/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Send,
} from 'lucide-react';
import { AccommodationListing, PropertyReportReason } from '../../types/index.js';
import { api } from '../../services/api.js';

interface ReportListingModalProps {
  property: AccommodationListing | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReportListingModal({ property, isOpen, onClose }: ReportListingModalProps) {
  const [reason, setReason] = useState<PropertyReportReason>(PropertyReportReason.INCORRECT_PRICE);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !property) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!details.trim()) return;

    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      await api.reportProperty({
        propertyId: property.id,
        reason,
        details: details.trim(),
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        id="report-listing-modal"
        className="relative w-full max-w-md bg-[#12141D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#171923]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Report Accommodation Listing</h2>
              <p className="text-xs text-white/40 truncate max-w-[240px]">{property.title}</p>
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
            <h3 className="text-base font-bold text-white">Report Logged for Investigation</h3>
            <p className="text-xs text-white/60">
              Thank you for keeping Enermind safe. Our campus moderation team has received your ticket and will audit this listing.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-white/60 uppercase mb-1">Reason for Report</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as any)}
                className="w-full p-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
              >
                <option value={PropertyReportReason.INCORRECT_PRICE} className="bg-[#12141D]">Inaccurate or Misleading Price</option>
                <option value={PropertyReportReason.SUSPECTED_SCAM} className="bg-[#12141D]">Suspected Scam / Fake Landlord</option>
                <option value={PropertyReportReason.UNAVAILABLE_OR_FULL} className="bg-[#12141D]">Property is Already Full / Unavailable</option>
                <option value={PropertyReportReason.INCORRECT_LOCATION} className="bg-[#12141D]">Incorrect Campus Distance / Location</option>
                <option value={PropertyReportReason.INAPPROPRIATE_PHOTOS} className="bg-[#12141D]">Inappropriate / Stolen Photos</option>
                <option value={PropertyReportReason.OTHER} className="bg-[#12141D]">Other Issue</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-white/60 uppercase mb-1">
                Details & Evidence <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={4}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Explain why this listing is inaccurate or fraudulent..."
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-rose-500"
                required
              />
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
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white transition-all flex items-center gap-2 shadow-lg shadow-rose-500/20 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Report'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

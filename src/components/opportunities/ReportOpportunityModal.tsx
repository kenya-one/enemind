/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert, Send, CheckCircle2 } from 'lucide-react';
import { Opportunity } from '../../types/index.js';
import { api } from '../../services/api.js';

interface ReportOpportunityModalProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReportOpportunityModal({
  opportunity,
  isOpen,
  onClose,
}: ReportOpportunityModalProps) {
  const [reason, setReason] = useState<string>('SUSPECTED_SCAM');
  const [details, setDetails] = useState<string>('');
  const [reporterEmail, setReporterEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !opportunity) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!details || details.trim().length < 10) {
      setError('Please provide at least 10 characters describing the issue.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await api.reportOpportunity(opportunity!.id, {
        reason,
        details,
        reporterEmail: reporterEmail || undefined,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit report.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        id="modal-report-opportunity"
        className="relative w-full max-w-lg bg-[#12141D] border border-rose-500/20 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-rose-500/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Report Opportunity</h2>
              <p className="text-xs text-white/40 truncate max-w-xs">{opportunity.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Report Received</h3>
            <p className="text-xs text-white/60">
              Thank you for keeping the student community safe. Our trust and safety moderation team will investigate this listing immediately.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 text-xs font-bold transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs text-white/60 font-medium">Reason for Report</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 bg-[#1A1D28] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500/50"
              >
                <option value="SUSPECTED_SCAM">Suspected Scam or Fraud</option>
                <option value="APPLICATION_FEE_REQUEST">Employer Requested Money / Application Fee</option>
                <option value="FAKE_ORGANIZATION">Fake or Impersonated Organization</option>
                <option value="DISCRIMINATION">Discriminatory or Inappropriate Content</option>
                <option value="EXPIRED_OR_BROKEN_LINK">Expired Listing or Broken Application URL</option>
                <option value="OTHER">Other Violation</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/60 font-medium">Specific Details *</label>
              <textarea
                rows={4}
                required
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe what occurred or why you believe this listing violates student safety rules..."
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500/50 resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/60 font-medium">Your Email (For follow-up, optional)</label>
              <input
                type="email"
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500/50"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs text-white/70"
              >
                Cancel
              </button>
              <button
                id="btn-submit-report-confirm"
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Report'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

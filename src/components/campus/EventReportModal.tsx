/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Flag, AlertTriangle, ShieldAlert } from 'lucide-react';
import { CampusEvent } from '../../types/index.js';
import { api } from '../../services/api.js';

interface EventReportModalProps {
  event: CampusEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onReportSubmitted: () => void;
}

export function EventReportModal({ event, isOpen, onClose, onReportSubmitted }: EventReportModalProps) {
  const [reason, setReason] = useState('INACCURATE_INFORMATION');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !event) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!details.trim()) {
      setError('Please provide specific details explaining the issue.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await api.reportCampusEvent(event!.id, { reason, details });
      onReportSubmitted();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit report.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        id="report-event-modal"
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2 text-rose-400">
            <Flag className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white">Report Campus Event</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <p className="text-slate-300 font-semibold mb-1">Target Event:</p>
            <p className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium truncate">
              {event.title}
            </p>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1.5">Reason for Report *</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
            >
              <option value="INACCURATE_INFORMATION">Inaccurate or Fake Information</option>
              <option value="UNAUTHORIZED_OFFICIAL_CLAIM">Impersonating Official University Administration</option>
              <option value="SPAM_OR_DUPLICATE">Spam or Duplicate Event</option>
              <option value="INAPPROPRIATE_CONTENT">Inappropriate or Offensive Content</option>
              <option value="SCAM_OR_FRAUD">Scam, Commercial Solicitation, or Fee Fraud</option>
              <option value="OTHER">Other Reason</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1.5">Detailed Explanation *</label>
            <textarea
              required
              rows={3}
              placeholder="Describe the discrepancy, broken link, or fraudulent details..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 text-white font-bold transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

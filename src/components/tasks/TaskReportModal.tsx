/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Task } from '../../types/index.js';
import { api } from '../../services/api.js';

interface TaskReportModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskReportModal({ task, isOpen, onClose }: TaskReportModalProps) {
  const [reason, setReason] = useState('ACADEMIC_CHEATING');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !task) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!details.trim() || details.length < 10) {
      setError('Please provide details for the report (at least 10 characters).');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.reportTask(task.id, {
        reason,
        details: details.trim(),
      });

      if (res.success) {
        setIsSuccess(true);
      } else {
        setError('Failed to report task.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to report task.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col">
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>Report Task Violation</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Task: <strong className="text-slate-200">{task.title}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-6 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">Report Submitted</h3>
            <p className="text-xs text-slate-400">
              Thank you for keeping Enermind safe. Our campus moderation team will review this task promptly.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold mt-2"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                Violation Category *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200"
              >
                <option value="ACADEMIC_CHEATING">Academic Dishonesty (Exam, Test, or Assignment Taking)</option>
                <option value="SCAM_FRAUD">Scam, Payment Fraud, or Phishing</option>
                <option value="INAPPROPRIATE">Inappropriate or Offensive Content</option>
                <option value="SPAM">Spam or Duplicate Post</option>
                <option value="OFF_PLATFORM_PAYMENT">Soliciting Off-Platform Escrow Bypasses</option>
                <option value="OTHER">Other Terms Violation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                Detailed Explanation *
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Provide evidence, specific violations, or context for the moderators..."
                rows={4}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 leading-relaxed"
                required
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold disabled:opacity-50"
              >
                {isSubmitting ? 'Reporting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

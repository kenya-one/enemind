/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  DollarSign,
  Clock,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Plus,
  Trash2,
  ShieldCheck,
} from 'lucide-react';
import { Task } from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';
import { useCurrency } from '../../context/CurrencyContext.js';
import { api } from '../../services/api.js';

interface ApplyTaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onApplicationSubmitted: () => void;
}

export function ApplyTaskModal({ task, isOpen, onClose, onApplicationSubmitted }: ApplyTaskModalProps) {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();

  const [proposal, setProposal] = useState('');
  const [bidAmount, setBidAmount] = useState<number>(task ? task.budgetMin : 25);
  const [estimatedDuration, setEstimatedDuration] = useState(task?.estimatedDuration || '2-3 days');
  const [portfolioLinks, setPortfolioLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState('');
  const [relevantSkills, setRelevantSkills] = useState<string[]>(task?.skills || []);
  const [isAILoading, setIsAILoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !task) return null;

  const platformFee = (bidAmount * (task.platformFeeWorkerPercent || 10)) / 100;
  const netEarnings = Math.max(0, bidAmount - platformFee);

  function addPortfolioLink() {
    if (newLink.trim()) {
      setPortfolioLinks([...portfolioLinks, newLink.trim()]);
      setNewLink('');
    }
  }

  function removePortfolioLink(index: number) {
    setPortfolioLinks(portfolioLinks.filter((_, i) => i !== index));
  }

  async function handleAIAssist() {
    setIsAILoading(true);
    setError(null);

    try {
      const res = await api.assistTaskAI({
        action: 'DRAFT_PROPOSAL',
        taskContext: {
          title: task.title,
          category: task.category,
          description: task.description,
          requirements: task.requirements,
          deliverables: task.deliverables,
        },
        workerContext: {
          skills: relevantSkills,
          portfolio: portfolioLinks,
        },
      });

      if (res.result) {
        setProposal(res.result);
      }
    } catch (err: any) {
      setError(err.message || 'AI proposal assistant failed.');
    } finally {
      setIsAILoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!proposal.trim() || proposal.length < 20) {
      setError('Please provide a meaningful proposal explaining your approach (at least 20 characters).');
      return;
    }
    if (bidAmount <= 0) {
      setError('Bid amount must be greater than 0.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.submitTaskApplication(task.id, {
        proposal: proposal.trim(),
        bidAmount: Number(bidAmount),
        currency: task.currency,
        estimatedDuration,
        relevantSkills,
        portfolioLinks,
      });

      if (res.success) {
        onApplicationSubmitted();
        onClose();
      } else {
        setError('Failed to submit application.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit proposal.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-950/60 shrink-0">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-400" />
              <span>Submit a Proposal</span>
            </h2>
            <p className="text-xs text-slate-400">
              Applying for: <strong className="text-slate-200">{task.title}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* AI Drafting Toolbar */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-slate-950 border border-blue-800/30 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI Proposal Pitch Assistant</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Draft a high-converting, tailored proposal highlighting your qualifications.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAIAssist}
              disabled={isAILoading}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors shrink-0 disabled:opacity-50"
            >
              {isAILoading ? (
                <span>Drafting...</span>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Draft Proposal</span>
                </>
              )}
            </button>
          </div>

          {/* Proposal Cover Letter */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Your Proposal & Approach *
            </label>
            <textarea
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              placeholder="Detail your relevant experience, proposed methodology, milestones, and how you will execute this task successfully..."
              rows={5}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 leading-relaxed"
              required
            />
          </div>

          {/* Bid Amount & Fee Breakdown */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Your Bid & Protected Earnings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Bid Amount ({task.currency}) *
                </label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(parseFloat(e.target.value) || 0)}
                  min={1}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Poster budget: {formatPrice(task.budgetMin, task.currency)}
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Estimated Delivery Time *
                </label>
                <input
                  type="text"
                  value={estimatedDuration}
                  onChange={(e) => setEstimatedDuration(e.target.value)}
                  placeholder="e.g., 2 days, 24 hours"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Fee Transparency Box */}
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-slate-400">
                <span>Task Bid Amount:</span>
                <span className="font-semibold text-slate-200">{formatPrice(bidAmount, task.currency)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Platform Worker Fee ({task.platformFeeWorkerPercent || 10}%):</span>
                <span className="text-slate-400">-{formatPrice(platformFee, task.currency)}</span>
              </div>
              <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-slate-200 font-bold">
                <span className="text-emerald-400">Your Net Protected Earnings:</span>
                <span className="text-emerald-400 text-sm">{formatPrice(netEarnings, task.currency)}</span>
              </div>
            </div>
          </div>

          {/* Portfolio & Sample Links */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Portfolio Links / Sample Works (Optional)
            </label>
            <div className="space-y-2">
              {portfolioLinks.map((link, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs text-blue-400 truncate">
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate flex-1">{link}</span>
                  <button
                    type="button"
                    onClick={() => removePortfolioLink(i)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <div className="flex gap-2">
                <input
                  type="url"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPortfolioLink())}
                  placeholder="https://github.com/..., https://figma.com/..., etc."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={addPortfolioLink}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Link</span>
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>PesaPal payment protection guaranteed on assignment</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

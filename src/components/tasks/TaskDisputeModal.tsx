/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  ShieldAlert,
  Plus,
  Trash2,
  FileText,
} from 'lucide-react';
import { Task } from '../../types/index.js';
import { api } from '../../services/api.js';

interface TaskDisputeModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onDisputeOpened: () => void;
}

export function TaskDisputeModal({
  task,
  isOpen,
  onClose,
  onDisputeOpened,
}: TaskDisputeModalProps) {
  const [reason, setReason] = useState('UNRESPONSIVE');
  const [description, setDescription] = useState('');
  const [evidence, setEvidence] = useState<string[]>([]);
  const [newEvidence, setNewEvidence] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !task) return null;

  function addEvidence() {
    if (newEvidence.trim()) {
      setEvidence([...evidence, newEvidence.trim()]);
      setNewEvidence('');
    }
  }

  function removeEvidence(idx: number) {
    setEvidence(evidence.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!description.trim() || description.length < 20) {
      setError('Please provide a detailed dispute description (at least 20 characters).');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.openTaskDispute(task.id, {
        reason,
        description: description.trim(),
        evidence,
      });

      if (res.success) {
        onDisputeOpened();
        onClose();
      } else {
        setError('Failed to open dispute.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to open dispute.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-950/60 shrink-0">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>Open Dispute / Mediation</span>
            </h2>
            <p className="text-xs text-slate-400">
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Primary Dispute Reason *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="UNRESPONSIVE">Party is unresponsive</option>
              <option value="QUALITY_NOT_MET">Deliverables do not meet task requirements</option>
              <option value="MISSED_DEADLINE">Missed deadline without communication</option>
              <option value="UNREASONABLE_REVISIONS">Excessive or out-of-scope revision demands</option>
              <option value="ACADEMIC_VIOLATION">Attempted academic integrity violation</option>
              <option value="OTHER">Other contractual dispute</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Dispute Details & Timeline *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="State what occurred, communication attempts, and desired resolution..."
              rows={4}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 leading-relaxed"
              required
            />
          </div>

          {/* Evidence links */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Evidence Links or References
            </label>
            <div className="space-y-1.5">
              {evidence.map((ev, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300">
                  <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="flex-1 truncate">{ev}</span>
                  <button
                    type="button"
                    onClick={() => removeEvidence(i)}
                    className="text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newEvidence}
                  onChange={(e) => setNewEvidence(e.target.value)}
                  placeholder="URL link, screenshot link, or message quote..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                />
                <button
                  type="button"
                  onClick={addEvidence}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-800/40 text-[11px] text-slate-300">
            An Enermind campus administrator will review the task deliverables, conversation logs, and evidence to arbitrate a fair resolution.
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
              {isSubmitting ? 'Opening Dispute...' : 'Submit Dispute to Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

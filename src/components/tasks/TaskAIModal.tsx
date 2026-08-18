/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, CheckCircle2, AlertTriangle, Layers, Lightbulb } from 'lucide-react';
import { api } from '../../services/api.js';

interface TaskAIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TaskAIModal({ isOpen, onClose }: TaskAIModalProps) {
  const [prompt, setPrompt] = useState('');
  const [action, setAction] = useState<'DRAFT_TASK' | 'SUGGEST_MILESTONES' | 'EXPLAIN_TASK' | 'CHECK_INTEGRITY'>('SUGGEST_MILESTONES');
  const [response, setResponse] = useState<string | null>(null);
  const [actionItems, setActionItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleConsultAI(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);
    setActionItems([]);

    try {
      const res = await api.assistTaskAI({
        action,
        customPrompt: prompt.trim(),
      });

      setResponse(res.result);
      setActionItems(res.actionItems || []);
    } catch (err: any) {
      setError(err.message || 'AI assistant request failed.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Gemini Task & Freelance Advisor</h2>
              <p className="text-xs text-slate-400">
                AI powered planning, milestone structuring, and integrity check for student tasks.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick presets */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setAction('SUGGEST_MILESTONES');
                setPrompt('Break down a React & Tailwind student portal dashboard task into 3 clear deliverables with deadlines.');
              }}
              className="text-xs bg-slate-950 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Suggest Project Milestones</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAction('CHECK_INTEGRITY');
                setPrompt('Check if offering Python statistical analysis for a campus lab experiment complies with academic integrity.');
              }}
              className="text-xs bg-slate-950 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5 transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Check Task Integrity</span>
            </button>
          </div>

          {/* AI Response Output */}
          {response && (
            <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                <Bot className="w-4 h-4 text-purple-400" />
                <span>Advisor Recommendation:</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                {response}
              </p>

              {actionItems.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400">Action Items:</span>
                  {actionItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleConsultAI} className="space-y-3">
            <div className="flex items-center gap-2">
              <select
                value={action}
                onChange={(e: any) => setAction(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
              >
                <option value="SUGGEST_MILESTONES">Suggest Milestones</option>
                <option value="DRAFT_TASK">Draft Task Scope</option>
                <option value="CHECK_INTEGRITY">Verify Academic Compliance</option>
                <option value="EXPLAIN_TASK">Explain Technical Requirements</option>
              </select>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask anything about task scoping, pricing benchmarks, or freelance proposals..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isLoading ? 'Thinking...' : 'Consult'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

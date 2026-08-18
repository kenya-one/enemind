/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Send,
  FileText,
  Copy,
  Check,
  Briefcase,
  Lightbulb,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { Opportunity } from '../../types/index.js';
import { api } from '../../services/api.js';

interface CareerAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAction?: string;
  targetOpportunity?: Opportunity | null;
}

export function CareerAIModal({
  isOpen,
  onClose,
  initialAction = 'COVER_LETTER',
  targetOpportunity = null,
}: CareerAIModalProps) {
  const [action, setAction] = useState<string>(initialAction);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resultText, setResultText] = useState<string>('');
  const [actionItems, setActionItems] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setAction(initialAction);
      runTool(initialAction);
    }
  }, [isOpen, initialAction, targetOpportunity]);

  async function runTool(selectedAction = action) {
    try {
      setIsLoading(true);
      setError(null);
      setCopied(false);

      const response = await api.runCareerAITool({
        action: selectedAction,
        opportunityId: targetOpportunity?.id,
        customPrompt: customPrompt || undefined,
      });

      setResultText(response.result || '');
      setActionItems(response.actionItems || []);
    } catch (err: any) {
      setError(err.message || 'Failed to generate career AI insights.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleCopy() {
    if (!resultText) return;
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        id="modal-career-ai"
        className="relative w-full max-w-3xl my-8 bg-[#12141D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#50E3C2]/20 to-indigo-500/20 text-[#50E3C2] flex items-center justify-center border border-[#50E3C2]/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Google-Native Career AI Companion</span>
              </h2>
              <p className="text-xs text-white/40">
                {targetOpportunity
                  ? `Analyzing: ${targetOpportunity.title} at ${targetOpportunity.organizationName}`
                  : 'Empowering your student career trajectory with grounded intelligence'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="px-6 py-3 border-b border-white/5 bg-white/[0.01] flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'COVER_LETTER', label: '✉️ Cover Letter' },
            { id: 'IMPROVE_CV', label: '📄 Resume Tailor' },
            { id: 'INTERVIEW_PREP', label: '🎯 Interview Coach' },
            { id: 'SKILL_GAP', label: '📊 Skill Gap Analysis' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => {
                setAction(mode.id);
                runTool(mode.id);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                action === mode.id
                  ? 'bg-[#50E3C2] text-black'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
              {error}
            </div>
          )}

          {/* Action Items List */}
          {actionItems && actionItems.length > 0 && (
            <div className="p-4 rounded-xl bg-[#50E3C2]/10 border border-[#50E3C2]/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#50E3C2]">
                <Lightbulb className="w-4 h-4" />
                <span>Recommended Action Steps</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {actionItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-white/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#50E3C2] mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Result Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white/60">Generated Output</span>
              {resultText && (
                <button
                  id="btn-copy-career-ai"
                  onClick={handleCopy}
                  className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-white/50" />}
                  <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="p-12 rounded-2xl bg-white/5 border border-white/10 text-center space-y-3">
                <div className="w-8 h-8 rounded-full border-2 border-[#50E3C2] border-t-transparent animate-spin mx-auto" />
                <p className="text-xs text-white/60">Consulting Gemini Career Model...</p>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/90 leading-relaxed font-mono whitespace-pre-wrap max-h-96 overflow-y-auto">
                {resultText || 'Click generate to see tailored recommendations.'}
              </div>
            )}
          </div>

          {/* Custom Prompt Form */}
          <div className="space-y-2">
            <label className="text-xs text-white/60 font-medium">Refine or Ask a Custom Question</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g. Highlight my experience with Python and machine learning..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') runTool();
                }}
                className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]/50"
              />
              <button
                id="btn-run-career-ai-refine"
                onClick={() => runTool()}
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl bg-[#50E3C2] hover:bg-[#40cbb0] text-black font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Regenerate</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-xs text-white/40">
          <span>Google-Native Gemini Engine</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/80"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

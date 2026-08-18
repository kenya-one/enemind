/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle2,
  Send,
  Loader2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../../services/api.js';

interface CampusAICalendarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CampusAICalendarDrawer({ isOpen, onClose }: CampusAICalendarDrawerProps) {
  const [activeTab, setActiveTab] = useState<'PLAN_MY_WEEK' | 'STUDY_PLAN_EXAM' | 'EVENT_QA'>('PLAN_MY_WEEK');
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    summary: string;
    suggestedSchedule?: Array<{ day: string; time: string; activity: string; type: string; itemTitle: string }>;
    actionItems: string[];
    groundedItemIds: string[];
  } | null>(null);

  if (!isOpen) return null;

  async function handleExecuteAction(action: 'PLAN_MY_WEEK' | 'STUDY_PLAN_EXAM' | 'EVENT_QA', customPrompt?: string) {
    try {
      setIsLoading(true);
      setResult(null);
      const res = await api.assistCampusCalendarAI({
        action,
        query: customPrompt || query || undefined,
      });
      setResult(res);
    } catch (err) {
      console.error('Campus AI planner error:', err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-slideLeft">
      {/* Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-950 text-purple-400 border border-purple-900">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Campus AI Advisor
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                Grounded
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Personalized timetable planner, study generator & Q&A.
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Action Tabs */}
      <div className="p-3 bg-slate-950/30 border-b border-slate-800/80 flex items-center gap-1.5">
        <button
          onClick={() => {
            setActiveTab('PLAN_MY_WEEK');
            handleExecuteAction('PLAN_MY_WEEK');
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'PLAN_MY_WEEK'
              ? 'bg-purple-600 text-white shadow'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          Weekly Planner
        </button>

        <button
          onClick={() => {
            setActiveTab('STUDY_PLAN_EXAM');
            handleExecuteAction('STUDY_PLAN_EXAM');
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'STUDY_PLAN_EXAM'
              ? 'bg-purple-600 text-white shadow'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          Exam Timetable
        </button>

        <button
          onClick={() => {
            setActiveTab('EVENT_QA');
            setResult(null);
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'EVENT_QA'
              ? 'bg-purple-600 text-white shadow'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          Ask AI
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-5 space-y-4 overflow-y-auto no-scrollbar">
        {activeTab === 'EVENT_QA' && (
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-300">
              Ask any question about campus events, exam venues, or registration dates:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. When is the CS301 final exam and where?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleExecuteAction('EVENT_QA', query)}
                className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
              />
              <button
                disabled={isLoading || !query.trim()}
                onClick={() => handleExecuteAction('EVENT_QA', query)}
                className="p-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 text-white rounded-xl transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="p-8 text-center space-y-3">
            <Loader2 className="w-6 h-6 text-purple-400 animate-spin mx-auto" />
            <p className="text-xs text-slate-400">
              Analyzing campus events, course deadlines & exam timetables...
            </p>
          </div>
        )}

        {/* Empty initial state for Planner */}
        {!isLoading && !result && activeTab !== 'EVENT_QA' && (
          <div className="p-8 text-center space-y-3 bg-slate-950/40 rounded-2xl border border-slate-800/80">
            <Calendar className="w-8 h-8 text-purple-400 mx-auto" />
            <p className="text-xs text-slate-300">
              Click to generate an AI-optimized schedule grounded in your real academic deadlines and exams.
            </p>
            <button
              onClick={() => handleExecuteAction(activeTab)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow transition-colors"
            >
              Generate AI Schedule
            </button>
          </div>
        )}

        {/* Results Presentation */}
        {result && (
          <div className="space-y-4 animate-fadeIn">
            {/* Grounding Badge */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Grounded in Verified Campus Catalog
              </span>
              <span>{result.groundedItemIds.length} Verified Items</span>
            </div>

            {/* Summary */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {result.summary}
            </div>

            {/* Suggested Schedule Items */}
            {result.suggestedSchedule && result.suggestedSchedule.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Recommended Time Allocation
                </h4>
                <div className="space-y-1.5">
                  {result.suggestedSchedule.map((slot, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-300">
                          {slot.day} • {slot.time}
                        </span>
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          {slot.type}
                        </span>
                      </div>
                      <p className="text-xs text-white font-medium">{slot.activity}</p>
                      {slot.itemTitle && (
                        <p className="text-[11px] text-slate-400">Target: {slot.itemTitle}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Items */}
            {result.actionItems && result.actionItems.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Key Action Checklist
                </h4>
                <div className="space-y-1.5">
                  {result.actionItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-start gap-2 text-xs text-slate-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60 text-center">
        <p className="text-[10px] text-slate-500">
          Enermind Campus AI advisor uses real-time university database feeds.
        </p>
      </div>
    </div>
  );
}

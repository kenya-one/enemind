/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Calendar,
  Layers,
  ShieldCheck,
  Building,
  MapPin,
  HelpCircle,
} from 'lucide-react';
import { TaskCategory, RemoteType, BudgetType } from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';
import { useCurrency } from '../../context/CurrencyContext.js';
import { api } from '../../services/api.js';

interface PostTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
}

const COMMON_SKILLS = [
  'Python',
  'React',
  'TypeScript',
  'Graphic Design',
  'Figma',
  'Video Editing',
  'Calculus',
  'Statistics',
  'Academic Proofreading',
  'Copywriting',
  'Social Media',
  'Audio Mixing',
  'Event Logistics',
  'Data Entry',
  'SEO',
  'Translation',
];

export function PostTaskModal({ isOpen, onClose, onTaskCreated }: PostTaskModalProps) {
  const { user } = useAuth();
  const { currentCurrency, formatPrice } = useCurrency();

  const [category, setCategory] = useState<TaskCategory>(TaskCategory.CAMPUS_TASK);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [remoteType, setRemoteType] = useState<RemoteType>(RemoteType.REMOTE);
  const [city, setCity] = useState(user?.city || 'Nairobi');
  const [country, setCountry] = useState(user?.country || 'Kenya');
  const [campusName, setCampusName] = useState(user?.campusName || 'Main Campus');

  const [budgetType, setBudgetType] = useState<BudgetType>(BudgetType.FIXED);
  const [budgetMin, setBudgetMin] = useState<number>(25);
  const [budgetMax, setBudgetMax] = useState<number>(50);
  const [currency, setCurrency] = useState<string>(currentCurrency?.code || 'USD');
  const [deadline, setDeadline] = useState<string>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [estimatedDuration, setEstimatedDuration] = useState('3-5 days');
  const [maxRevisions, setMaxRevisions] = useState<number>(2);

  // Requirements & Deliverables dynamic lists
  const [requirements, setRequirements] = useState<string[]>(['Relevant prior portfolio / experience']);
  const [newRequirement, setNewRequirement] = useState('');
  const [deliverables, setDeliverables] = useState<string[]>(['Final source files or shared Google Drive deliverables']);
  const [newDeliverable, setNewDeliverable] = useState('');
  const [skills, setSkills] = useState<string[]>(['Research']);
  const [customSkill, setCustomSkill] = useState('');

  // AI Assistance & Academic Integrity State
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [academicIntegrityChecked, setAcademicIntegrityChecked] = useState(false);

  if (!isOpen) return null;

  function addRequirement() {
    if (newRequirement.trim()) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement('');
    }
  }

  function removeRequirement(index: number) {
    setRequirements(requirements.filter((_, i) => i !== index));
  }

  function addDeliverable() {
    if (newDeliverable.trim()) {
      setDeliverables([...deliverables, newDeliverable.trim()]);
      setNewDeliverable('');
    }
  }

  function removeDeliverable(index: number) {
    setDeliverables(deliverables.filter((_, i) => i !== index));
  }

  function toggleSkill(s: string) {
    if (skills.includes(s)) {
      setSkills(skills.filter((item) => item !== s));
    } else {
      setSkills([...skills, s]);
    }
  }

  function addCustomSkill() {
    if (customSkill.trim() && !skills.includes(customSkill.trim())) {
      setSkills([...skills, customSkill.trim()]);
      setCustomSkill('');
    }
  }

  async function handleAIAssist() {
    if (!title.trim() && !description.trim()) {
      setError('Please enter a brief task title or description for the AI to draft from.');
      return;
    }

    setIsAILoading(true);
    setError(null);
    setAiSuggestion(null);

    try {
      const res = await api.assistTaskAI({
        action: 'DRAFT_TASK',
        taskContext: {
          title,
          category,
          description,
          budgetType,
        },
      });

      if (res.suggestedData) {
        if (res.suggestedData.title) setTitle(res.suggestedData.title);
        if (res.suggestedData.description) setDescription(res.suggestedData.description);
        if (res.suggestedData.requirements?.length) setRequirements(res.suggestedData.requirements);
        if (res.suggestedData.deliverables?.length) setDeliverables(res.suggestedData.deliverables);
        if (res.suggestedData.skills?.length) setSkills(res.suggestedData.skills);
        if (res.suggestedData.estimatedDuration) setEstimatedDuration(res.suggestedData.estimatedDuration);
      }
      setAiSuggestion(res.result);
    } catch (err: any) {
      setError(err.message || 'AI assistant encountered an issue.');
    } finally {
      setIsAILoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }
    if (!description.trim() || description.length < 20) {
      setError('Please provide a descriptive task overview (at least 20 characters).');
      return;
    }
    if (budgetMin <= 0) {
      setError('Budget must be greater than 0.');
      return;
    }
    if (!academicIntegrityChecked) {
      setError('You must confirm that this task adheres to academic integrity rules.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.createTask({
        title: title.trim(),
        description: description.trim(),
        category,
        remoteType,
        country,
        city,
        campusName,
        budgetType,
        budgetMin: Number(budgetMin),
        budgetMax: budgetMax ? Number(budgetMax) : Number(budgetMin),
        currency,
        deadline: new Date(deadline).toISOString(),
        estimatedDuration,
        requirements,
        deliverables,
        skills,
        maxRevisions: Number(maxRevisions),
      });

      if (res.success) {
        onTaskCreated();
        onClose();
      } else {
        setError(res.error || 'Failed to create task.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create task.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              <span>Post a New Task or Student Gig</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Publish task requirements and find skilled campus peers with PesaPal protected payments.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
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
                <span>Gemini AI Task Architect</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Auto-generate structured deliverables, clear requirements, and skills from your title.
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
                  <span>Draft with AI</span>
                </>
              )}
            </button>
          </div>

          {aiSuggestion && (
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-blue-500/30 text-xs text-slate-300 space-y-1">
              <span className="font-bold text-blue-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                AI Assistant Feedback:
              </span>
              <p className="leading-relaxed text-slate-300">{aiSuggestion}</p>
            </div>
          )}

          {/* Category & Remote Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value={TaskCategory.CAMPUS_TASK}>Campus Task / Errand</option>
                <option value={TaskCategory.DESIGN_CREATIVE}>Design & Creative</option>
                <option value={TaskCategory.TECH_DEV}>Programming & Tech</option>
                <option value={TaskCategory.WRITING_TRANSLATION}>Writing & Translation</option>
                <option value={TaskCategory.TUTORING_RESEARCH}>Tutoring & Research Assistance</option>
                <option value={TaskCategory.MARKETING_SOCIAL}>Marketing & Social Media</option>
                <option value={TaskCategory.VIDEO_AUDIO}>Video & Audio Production</option>
                <option value={TaskCategory.ADMINISTRATIVE_VIRTUAL}>Administrative & Virtual Assistant</option>
                <option value={TaskCategory.EVENTS_LOGISTICS}>Events & Campus Logistics</option>
                <option value={TaskCategory.OTHER}>Other Student Services</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Location / Remote Mode *
              </label>
              <select
                value={remoteType}
                onChange={(e) => setRemoteType(e.target.value as RemoteType)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value={RemoteType.REMOTE}>Fully Remote</option>
                <option value={RemoteType.HYBRID}>Hybrid (Remote + Campus)</option>
                <option value={RemoteType.ON_SITE}>On-Campus / In-Person</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Redesign Mobile UI in Figma for Student Startup"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              maxLength={120}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Detailed Description & Context *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the background, goals, expectations, and any reference materials..."
              rows={4}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 leading-relaxed"
              required
            />
          </div>

          {/* Requirements Builder */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Specific Requirements / Qualifications
            </label>
            <div className="space-y-2">
              {requirements.map((req, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  <span className="flex-1">{req}</span>
                  <button
                    type="button"
                    onClick={() => removeRequirement(i)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                  placeholder="Add a requirement (e.g., Must have published Figma designs)"
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={addRequirement}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Deliverables Checklist Builder */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Expected Deliverables Checklist
            </label>
            <div className="space-y-2">
              {deliverables.map((del, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="flex-1">{del}</span>
                  <button
                    type="button"
                    onClick={() => removeDeliverable(i)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newDeliverable}
                  onChange={(e) => setNewDeliverable(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addDeliverable())}
                  placeholder="Add a deliverable item (e.g., Figma link + exported PNG bundle)"
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={addDeliverable}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Skills Tag Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Relevant Skills
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_SKILLS.map((sk) => {
                const isSelected = skills.includes(sk);
                return (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => toggleSkill(sk)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {sk}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
                placeholder="Custom skill tag..."
                className="w-48 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={addCustomSkill}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
              >
                + Add Tag
              </button>
            </div>
          </div>

          {/* Budget & Timeline Grid */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Budget & Timeline
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Budget Type</label>
                <select
                  value={budgetType}
                  onChange={(e) => setBudgetType(e.target.value as BudgetType)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                >
                  <option value={BudgetType.FIXED}>Fixed Project Price</option>
                  <option value={BudgetType.HOURLY}>Hourly Rate</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Budget ({currency}) *
                </label>
                <input
                  type="number"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(parseFloat(e.target.value) || 0)}
                  min={1}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Max Budget ({currency})
                </label>
                <input
                  type="number"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(parseFloat(e.target.value) || 0)}
                  min={budgetMin}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Delivery Deadline *</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Estimated Duration</label>
                <input
                  type="text"
                  value={estimatedDuration}
                  onChange={(e) => setEstimatedDuration(e.target.value)}
                  placeholder="e.g. 3-5 days"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Included Revisions</label>
                <select
                  value={maxRevisions}
                  onChange={(e) => setMaxRevisions(parseInt(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                >
                  <option value={1}>1 revision</option>
                  <option value={2}>2 revisions</option>
                  <option value={3}>3 revisions</option>
                  <option value={5}>5 revisions</option>
                </select>
              </div>
            </div>
          </div>

          {/* Academic Integrity Pledge Mandatory Checkbox */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-2">
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                id="academicIntegrity"
                checked={academicIntegrityChecked}
                onChange={(e) => setAcademicIntegrityChecked(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-blue-600 bg-slate-900 border-slate-700 focus:ring-0 shrink-0 cursor-pointer"
              />
              <label htmlFor="academicIntegrity" className="text-xs text-slate-300 leading-relaxed cursor-pointer">
                <strong className="text-amber-300">Academic Integrity & Policy Compliance:</strong> I certify that this task is legitimate student assistance, freelance work, or campus service and does <strong>NOT</strong> solicit taking exams, cheating on tests, or completing graded academic submissions on behalf of another student.
              </label>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400">
            Protected with <strong className="text-slate-200 font-semibold">PesaPal</strong> on assignment
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
              {isSubmitting ? 'Publishing...' : 'Publish Task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

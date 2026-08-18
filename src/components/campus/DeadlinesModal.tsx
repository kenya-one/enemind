/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Calendar,
  Plus,
  CheckCircle2,
  Trash2,
  AlertCircle,
  BookOpen,
  ShieldCheck,
  CalendarPlus,
} from 'lucide-react';
import { AcademicDeadline, PersonalDeadline, UserRole } from '../../types/index.js';
import { api } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.js';

interface DeadlinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeadlinesModal({ isOpen, onClose }: DeadlinesModalProps) {
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'OFFICIAL' | 'PERSONAL'>('OFFICIAL');
  const [academicDeadlines, setAcademicDeadlines] = useState<AcademicDeadline[]>([]);
  const [personalDeadlines, setPersonalDeadlines] = useState<PersonalDeadline[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // New Personal Deadline Form
  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCategory, setNewCategory] = useState<'ASSIGNMENT' | 'PROJECT' | 'READING' | 'REVISION' | 'OTHER'>('ASSIGNMENT');
  const [newPriority, setNewPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('MEDIUM');

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, user?.institutionId]);

  async function loadData() {
    try {
      setIsLoading(true);
      const [acadRes, persRes] = await Promise.all([
        api.getAcademicDeadlines({ institutionId: user?.institutionId || 'inst-uon-ke' }),
        api.getPersonalDeadlines(),
      ]);
      setAcademicDeadlines(acadRes.deadlines || []);
      setPersonalDeadlines(persRes.personalDeadlines || []);
    } catch (err) {
      console.error('Failed to load deadlines:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddPersonalDeadline(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle || !newDueDate) return;

    try {
      const res = await api.createPersonalDeadline({
        title: newTitle,
        dueDateTime: new Date(newDueDate).toISOString(),
        courseCode: newCourseCode || undefined,
        category: newCategory,
        priority: newPriority,
      });
      if (res.success && res.personalDeadline) {
        setPersonalDeadlines([...personalDeadlines, res.personalDeadline]);
        setNewTitle('');
        setNewDueDate('');
        setNewCourseCode('');
      }
    } catch (err) {
      console.error('Failed to add personal deadline:', err);
    }
  }

  async function handleTogglePersonal(id: string) {
    try {
      const res = await api.togglePersonalDeadline(id);
      if (res.success && res.personalDeadline) {
        setPersonalDeadlines(
          personalDeadlines.map((d) => (d.id === id ? res.personalDeadline : d))
        );
      }
    } catch (err) {
      console.error('Failed to toggle deadline:', err);
    }
  }

  async function handleDeletePersonal(id: string) {
    try {
      await api.deletePersonalDeadline(id);
      setPersonalDeadlines(personalDeadlines.filter((d) => d.id !== id));
    } catch (err) {
      console.error('Failed to delete deadline:', err);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div
        id="campus-deadlines-modal"
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-950 text-amber-400 border border-amber-900">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Academic Deadlines & Study Planner</h2>
              <p className="text-xs text-slate-400">
                Official institution milestones and private assignment tracking.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 border border-slate-700 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="px-6 pt-4 flex items-center gap-2 border-b border-slate-800/80">
          <button
            onClick={() => setActiveSubTab('OFFICIAL')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors ${
              activeSubTab === 'OFFICIAL'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            🏛️ Official Academic Milestones ({academicDeadlines.length})
          </button>
          <button
            onClick={() => setActiveSubTab('PERSONAL')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors ${
              activeSubTab === 'PERSONAL'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            🔒 My Private Planner ({personalDeadlines.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto no-scrollbar">
          {activeSubTab === 'OFFICIAL' ? (
            <div className="space-y-3">
              {academicDeadlines.map((dl) => {
                const dueDate = new Date(dl.deadline);
                const isPast = dueDate.getTime() < Date.now();
                return (
                  <div
                    key={dl.id}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                            dl.priority === 'CRITICAL'
                              ? 'bg-rose-950 text-rose-400 border-rose-800'
                              : dl.priority === 'HIGH'
                              ? 'bg-amber-950 text-amber-400 border-amber-800'
                              : 'bg-blue-950 text-blue-400 border-blue-800'
                          }`}
                        >
                          {dl.priority}
                        </span>
                        {dl.isOfficial && (
                          <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                            <ShieldCheck className="w-3 h-3" /> Official
                          </span>
                        )}
                        {dl.courseCode && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                            {dl.courseCode}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-white">{dl.title}</h4>
                      <p className="text-[11px] text-slate-400">{dl.description}</p>
                    </div>

                    <div className="text-right sm:shrink-0">
                      <div className="text-xs font-mono font-bold text-amber-300">
                        {dueDate.toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <p className="text-[10px] text-slate-400">
                        {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-5">
              {/* Add Personal Deadline Form */}
              <form
                onSubmit={handleAddPersonalDeadline}
                className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs"
              >
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-amber-400" /> Add Private Task / Assignment
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    required
                    placeholder="Task title (e.g. Lab 4 Submission)"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="datetime-local"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    placeholder="Course code (e.g. CS301)"
                    value={newCourseCode}
                    onChange={(e) => setNewCourseCode(e.target.value)}
                    className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="ASSIGNMENT">Assignment</option>
                    <option value="PROJECT">Project Milestone</option>
                    <option value="READING">Reading</option>
                    <option value="REVISION">Exam Revision</option>
                    <option value="OTHER">Other</option>
                  </select>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="LOW">Low Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="HIGH">High Priority</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold transition-colors"
                  >
                    Save to Private Planner
                  </button>
                </div>
              </form>

              {/* Personal Deadline List */}
              <div className="space-y-2">
                {personalDeadlines.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">
                    No personal deadlines added yet. Add your homework or reading targets above.
                  </p>
                ) : (
                  personalDeadlines.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-colors ${
                        item.isCompleted
                          ? 'bg-slate-950/40 border-slate-800/40 text-slate-500'
                          : 'bg-slate-950/60 border-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => handleTogglePersonal(item.id)}
                          className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                            item.isCompleted
                              ? 'bg-emerald-600 border-emerald-500 text-white'
                              : 'border-slate-700 bg-slate-900 hover:border-slate-500'
                          }`}
                        >
                          {item.isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>
                        <div className={item.isCompleted ? 'line-through' : ''}>
                          <span className="font-semibold text-white">{item.title}</span>
                          {item.courseCode && (
                            <span className="ml-2 font-mono text-[10px] text-amber-400">
                              [{item.courseCode}]
                            </span>
                          )}
                          <p className="text-[11px] text-slate-400">
                            Due:{' '}
                            {new Date(item.dueDateTime).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeletePersonal(item.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  CalendarPlus,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { ExamEvent } from '../../types/index.js';
import { api } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.js';

interface ExamsTimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExamsTimetableModal({ isOpen, onClose }: ExamsTimetableModalProps) {
  const { user } = useAuth();
  const [exams, setExams] = useState<ExamEvent[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadExams();
    }
  }, [isOpen, user?.institutionId]);

  async function loadExams() {
    try {
      setIsLoading(true);
      const res = await api.getExamsTimetable({
        institutionId: user?.institutionId || 'inst-uon-ke',
      });
      setExams(res.exams || []);
    } catch (err) {
      console.error('Failed to load exams timetable:', err);
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) return null;

  const filteredExams = exams.filter((x) =>
    x.courseCode.toLowerCase().includes(search.toLowerCase()) ||
    x.courseName.toLowerCase().includes(search.toLowerCase()) ||
    x.venue.toLowerCase().includes(search.toLowerCase())
  );

  function handleAddToGoogleCalendar(exam: ExamEvent) {
    const startIso = new Date(exam.dateTime).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endDate = new Date(new Date(exam.dateTime).getTime() + exam.durationMinutes * 60000);
    const endIso = endDate.toISOString().replace(/-|:|\.\d\d\d/g, '');

    const details = `Course: ${exam.courseCode} - ${exam.courseName}\nVenue: ${exam.venue} (${exam.room || 'Main Hall'})\nDuration: ${exam.durationMinutes} minutes\nInstructions: ${exam.instructions || 'Bring Student ID & Exam Card'}`;
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `EXAM: ${exam.courseCode} - ${exam.courseName}`
    )}&dates=${startIso}/${endIso}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(
      exam.venue
    )}&sf=true&output=xml`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div
        id="exams-timetable-modal"
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-950 text-rose-400 border border-rose-900">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Examination Timetable & Venues</h2>
              <p className="text-xs text-slate-400">
                Official institution exam dates, seating halls, and invigilation notices.
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

        {/* Search */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/20">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search course code or exam hall..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* Exam List */}
        <div className="p-6 space-y-3 max-h-[65vh] overflow-y-auto no-scrollbar">
          {filteredExams.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">
              No examination schedules found matching your query.
            </p>
          ) : (
            filteredExams.map((exam) => {
              const examDate = new Date(exam.dateTime);
              const daysRemaining = Math.ceil((examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              const isPast = daysRemaining < 0;

              return (
                <div
                  key={exam.id}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                          {exam.courseCode}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          {exam.examType}
                        </span>
                        {exam.isOfficial && (
                          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Official
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white">{exam.courseName}</h4>
                    </div>

                    <div className="text-right shrink-0">
                      {isPast ? (
                        <span className="text-[10px] font-bold text-slate-500">Concluded</span>
                      ) : daysRemaining === 0 ? (
                        <span className="text-xs font-bold text-rose-400 animate-pulse">TODAY</span>
                      ) : (
                        <span className="text-xs font-mono font-bold text-amber-300">
                          in {daysRemaining} days
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      <span>
                        {examDate.toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}{' '}
                        •{' '}
                        <span className="font-mono text-white">
                          {examDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Duration: {exam.durationMinutes} minutes</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span className="font-medium text-slate-200">
                        {exam.venue} {exam.room ? `(${exam.room})` : ''}
                      </span>
                    </div>

                    {exam.instructions && (
                      <div className="text-slate-400 text-[11px]">
                        Note: {exam.instructions}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handleAddToGoogleCalendar(exam)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
                    >
                      <CalendarPlus className="w-3.5 h-3.5 text-blue-400" />
                      <span>Add to Google Calendar</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

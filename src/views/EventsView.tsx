/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Search,
  Filter,
  CheckCircle,
  Plus,
  Sparkles,
  BookOpen,
  Users,
  Bell,
  Bookmark,
  CalendarPlus,
  ShieldCheck,
  Globe,
  Download,
  AlertCircle,
  Megaphone,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import {
  CampusEvent,
  EventRegistration,
  AcademicDeadline,
  ExamEvent,
  CampusAnnouncement,
  Club,
  UserRole,
} from '../types/index.js';
import { EventCard } from '../components/campus/EventCard.js';
import { EventDetailsModal } from '../components/campus/EventDetailsModal.js';
import { PublishEventModal } from '../components/campus/PublishEventModal.js';
import { CampusAICalendarDrawer } from '../components/campus/CampusAICalendarDrawer.js';
import { DeadlinesModal } from '../components/campus/DeadlinesModal.js';
import { ExamsTimetableModal } from '../components/campus/ExamsTimetableModal.js';
import { ClubsListModal } from '../components/campus/ClubsListModal.js';
import { EventReportModal } from '../components/campus/EventReportModal.js';

export function EventsView() {
  const { user } = useAuth();

  // Navigation Tabs
  const [activeMainTab, setActiveMainTab] = useState<'EVENTS' | 'DEADLINES' | 'EXAMS' | 'ANNOUNCEMENTS' | 'MY_SCHEDULE'>(
    'EVENTS'
  );

  // Filters & State
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [announcements, setAnnouncements] = useState<CampusAnnouncement[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [savedEvents, setSavedEvents] = useState<Array<CampusEvent & { savedReminderMinutes?: number }>>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [timeframeFilter, setTimeframeFilter] = useState<'ALL' | 'TODAY' | 'THIS_WEEK' | 'THIS_MONTH' | 'UPCOMING'>('ALL');
  const [officialOnly, setOfficialOnly] = useState(false);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClubFilter, setSelectedClubFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals & Drawers
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);
  const [isDeadlinesModalOpen, setIsDeadlinesModalOpen] = useState(false);
  const [isExamsModalOpen, setIsExamsModalOpen] = useState(false);
  const [isClubsModalOpen, setIsClubsModalOpen] = useState(false);
  const [reportingEvent, setReportingEvent] = useState<CampusEvent | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadAllCampusData();
  }, [user?.institutionId, user?.campusId]);

  async function loadAllCampusData() {
    try {
      setIsLoading(true);
      const [eventsRes, annRes, regRes, savedRes] = await Promise.all([
        api.getCampusEvents({
          institutionId: user?.institutionId || 'inst-uon-ke',
          campusId: user?.campusId,
        }),
        api.getCampusAnnouncements(user?.institutionId || 'inst-uon-ke', user?.campusId),
        api.getMyCampusRegistrations(),
        api.getSavedCampusEvents(),
      ]);

      setEvents(eventsRes.events || []);
      setAnnouncements(annRes.announcements || []);
      setRegistrations(regRes.registrations || []);
      setSavedEvents(savedRes.savedEvents || []);
    } catch (err) {
      console.error('Failed to load campus calendar data:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleToggleSave(event: CampusEvent) {
    try {
      const res = await api.toggleSaveCampusEvent(event.id);
      if (res.isSaved) {
        setSavedEvents([...savedEvents, event]);
        showNotification('Event saved to your personal campus schedule!');
      } else {
        setSavedEvents(savedEvents.filter((e) => e.id !== event.id));
        showNotification('Event removed from saved bookmarks.');
      }
    } catch (err) {
      console.error('Failed to toggle save:', err);
    }
  }

  async function handleRegister(event: CampusEvent) {
    try {
      const res = await api.registerForCampusEvent(event.id);
      if (res.success && res.registration) {
        setRegistrations([...registrations, res.registration]);
        // Update registered count locally
        setEvents(
          events.map((e) =>
            e.id === event.id
              ? {
                  ...e,
                  registeredCount: res.isWaitlisted ? e.registeredCount : (e.registeredCount || 0) + 1,
                  waitlistCount: res.isWaitlisted ? (e.waitlistCount || 0) + 1 : e.waitlistCount,
                }
              : e
          )
        );
        showNotification(res.message || 'Registration confirmed!');
      }
    } catch (err: any) {
      alert(err.message || 'Registration failed.');
    }
  }

  async function handleCancelRegistration(event: CampusEvent) {
    try {
      const res = await api.cancelCampusEventRegistration(event.id);
      if (res.success) {
        setRegistrations(registrations.filter((r) => r.eventId !== event.id));
        setEvents(
          events.map((e) =>
            e.id === event.id ? { ...e, registeredCount: Math.max(0, (e.registeredCount || 1) - 1) } : e
          )
        );
        showNotification(res.message || 'Registration canceled.');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to cancel registration.');
    }
  }

  async function handleExportDrive(event: CampusEvent) {
    try {
      const res = await api.exportEventToDrive(event.id);
      if (res.success) {
        showNotification(`Event Dossier saved to Google Drive: ${res.fileName}`);
      }
    } catch (err: any) {
      alert(err.message || 'Google Drive export failed.');
    }
  }

  function showNotification(msg: string) {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  }

  // Filtered Events Logic
  const filteredEvents = events.filter((e) => {
    const matchesCat = categoryFilter === 'ALL' || e.category === categoryFilter;
    const matchesOfficial = !officialOnly || e.isOfficial;
    const matchesOnline = !onlineOnly || e.locationType === 'ONLINE' || e.locationType === 'HYBRID';
    const matchesClub = !selectedClubFilter || e.clubName === selectedClubFilter;

    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.tags && e.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    let matchesTime = true;
    const eventTime = new Date(e.startDateTime).getTime();
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const todayEnd = todayStart + 86400000;
    const weekEnd = todayStart + 7 * 86400000;
    const monthEnd = todayStart + 30 * 86400000;

    if (timeframeFilter === 'TODAY') {
      matchesTime = eventTime >= todayStart && eventTime < todayEnd;
    } else if (timeframeFilter === 'THIS_WEEK') {
      matchesTime = eventTime >= todayStart && eventTime < weekEnd;
    } else if (timeframeFilter === 'THIS_MONTH') {
      matchesTime = eventTime >= todayStart && eventTime < monthEnd;
    } else if (timeframeFilter === 'UPCOMING') {
      matchesTime = eventTime >= Date.now();
    }

    return matchesCat && matchesOfficial && matchesOnline && matchesClub && matchesSearch && matchesTime;
  });

  const savedEventIds = new Set(savedEvents.map((s) => s.id));
  const registrationMap = new Map(registrations.map((r) => [r.eventId, r]));

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Notification */}
      {actionSuccessMsg && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-2xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-blue-950 text-blue-400 border border-blue-900 shadow">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Campus Calendar & Events
                <span className="text-xs font-normal text-blue-400 px-2 py-0.5 rounded-lg bg-blue-950/80 border border-blue-900">
                  {user?.institutionName || 'Global Campus Network'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Official institution timetables, academic deadlines, exams, hackathons, and student societies.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* AI Advisor Button */}
          <button
            id="campus-ai-advisor-btn"
            onClick={() => setIsAIDrawerOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-purple-950/80 hover:bg-purple-900/80 text-purple-300 border border-purple-800/80 text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Campus AI Advisor</span>
          </button>

          {/* Publish Event */}
          <button
            id="publish-campus-event-btn"
            onClick={() => setIsPublishModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Event</span>
          </button>
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveMainTab('EVENTS')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeMainTab === 'EVENTS'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Campus Events ({events.length})</span>
        </button>

        <button
          onClick={() => setIsDeadlinesModalOpen(true)}
          className="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap bg-slate-900 text-slate-400 hover:text-white border border-slate-800 flex items-center gap-1.5 transition-colors"
        >
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>Academic Deadlines & Planner</span>
        </button>

        <button
          onClick={() => setIsExamsModalOpen(true)}
          className="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap bg-slate-900 text-slate-400 hover:text-white border border-slate-800 flex items-center gap-1.5 transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5 text-rose-400" />
          <span>Exams Timetable</span>
        </button>

        <button
          onClick={() => setIsClubsModalOpen(true)}
          className="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap bg-slate-900 text-slate-400 hover:text-white border border-slate-800 flex items-center gap-1.5 transition-colors"
        >
          <Users className="w-3.5 h-3.5 text-teal-400" />
          <span>Clubs & Societies</span>
        </button>

        <button
          onClick={() => setActiveMainTab('ANNOUNCEMENTS')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeMainTab === 'ANNOUNCEMENTS'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Megaphone className="w-3.5 h-3.5 text-amber-400" />
          <span>Announcements ({announcements.length})</span>
        </button>

        <button
          onClick={() => setActiveMainTab('MY_SCHEDULE')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeMainTab === 'MY_SCHEDULE'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5 text-blue-400" />
          <span>My Schedule ({registrations.length + savedEvents.length})</span>
        </button>
      </div>

      {/* Announcements Banner List if any urgent exists */}
      {announcements.some((a) => a.priority === 'URGENT' || a.priority === 'EMERGENCY') && (
        <div className="space-y-2">
          {announcements
            .filter((a) => a.priority === 'URGENT' || a.priority === 'EMERGENCY')
            .map((ann) => (
              <div
                key={ann.id}
                className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/80 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-2.5">
                  <Megaphone className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{ann.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-900 text-rose-200">
                        {ann.priority}
                      </span>
                      {ann.isOfficial && (
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3" /> Official
                        </span>
                      )}
                    </div>
                    <p className="text-slate-300 mt-1 leading-relaxed">{ann.content}</p>
                  </div>
                </div>
                {ann.actionUrl && (
                  <a
                    href={ann.actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold flex items-center gap-1 hover:bg-rose-500 transition-colors"
                  >
                    <span>{ann.actionLabel || 'Details'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Main Tab Views */}
      {activeMainTab === 'EVENTS' && (
        <div className="space-y-4">
          {/* Search, Timeframe & Filter Toolbar */}
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search campus events, workshops, guest speakers, halls, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Timeframe selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[
                { label: 'All Dates', val: 'ALL' },
                { label: 'Today', val: 'TODAY' },
                { label: 'This Week', val: 'THIS_WEEK' },
                { label: 'This Month', val: 'THIS_MONTH' },
                { label: 'Upcoming', val: 'UPCOMING' },
              ].map((tf) => (
                <button
                  key={tf.val}
                  onClick={() => setTimeframeFilter(tf.val as any)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                    timeframeFilter === tf.val
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>

            {/* Toggles (Official Only, Online Only) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setOfficialOnly(!officialOnly)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
                  officialOnly
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Official Only</span>
              </button>

              <button
                onClick={() => setOnlineOnly(!onlineOnly)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
                  onlineOnly
                    ? 'bg-teal-950/80 text-teal-300 border-teal-700'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Virtual / Online</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'ALL', label: 'All Categories' },
              { id: 'ACADEMIC', label: 'Academic & Seminars' },
              { id: 'WORKSHOP', label: 'Workshops & Bootcamps' },
              { id: 'CAREER', label: 'Career Fairs' },
              { id: 'HACKATHON', label: 'Hackathons' },
              { id: 'CLUB', label: 'Clubs & Societies' },
              { id: 'SPORTS', label: 'Sports & Athletics' },
              { id: 'SOCIAL', label: 'Social & Cultural' },
              { id: 'ORIENTATION', label: 'Orientation' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-colors ${
                  categoryFilter === cat.id
                    ? 'bg-slate-800 text-blue-400 font-bold border border-blue-500/50'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}

            {selectedClubFilter && (
              <button
                onClick={() => setSelectedClubFilter(null)}
                className="px-2.5 py-1.5 rounded-xl bg-teal-950 text-teal-300 border border-teal-800 text-xs font-semibold flex items-center gap-1"
              >
                <span>Club: {selectedClubFilter}</span>
                <span className="text-slate-400 hover:text-white">✕</span>
              </button>
            )}
          </div>

          {/* Events Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse" />
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
              <Calendar className="w-10 h-10 text-slate-500 mx-auto" />
              <h4 className="text-base font-bold text-white">No campus events found</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No events currently match your selected filters. Try broadening your timeframe or category.
              </p>
              <button
                onClick={() => {
                  setCategoryFilter('ALL');
                  setTimeframeFilter('ALL');
                  setOfficialOnly(false);
                  setOnlineOnly(false);
                  setSearchQuery('');
                  setSelectedClubFilter(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredEvents.map((evt) => (
                <EventCard
                  key={evt.id}
                  event={evt}
                  isSaved={savedEventIds.has(evt.id)}
                  userRegistration={registrationMap.get(evt.id)}
                  onSelect={(e) => setSelectedEvent(e)}
                  onToggleSave={handleToggleSave}
                  onRegister={handleRegister}
                  onCancelRegistration={handleCancelRegistration}
                  onReport={(e) => setReportingEvent(e)}
                  onExportDrive={handleExportDrive}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Announcements Tab View */}
      {activeMainTab === 'ANNOUNCEMENTS' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Official University Announcements & Bulletins</h3>
            <span className="text-xs text-slate-400">{announcements.length} notices published</span>
          </div>

          <div className="space-y-3">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          ann.priority === 'EMERGENCY' || ann.priority === 'URGENT'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-blue-950 text-blue-300 border border-blue-800'
                        }`}
                      >
                        {ann.priority}
                      </span>
                      {ann.isOfficial && (
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Official Notice
                        </span>
                      )}
                      <span className="text-xs text-slate-400">• {ann.source}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{ann.title}</h4>
                  </div>
                  <span className="text-xs font-mono text-slate-400 shrink-0">
                    {new Date(ann.publishedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">{ann.content}</p>

                {ann.actionUrl && (
                  <div className="pt-2 border-t border-slate-800/80 flex justify-end">
                    <a
                      href={ann.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <span>{ann.actionLabel || 'Action / Link'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Schedule Tab View */}
      {activeMainTab === 'MY_SCHEDULE' && (
        <div className="space-y-6">
          {/* Registered Events */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>My Event Registrations & RSVPs ({registrations.length})</span>
            </h3>

            {registrations.length === 0 ? (
              <p className="text-xs text-slate-400 p-6 bg-slate-900/40 rounded-2xl border border-slate-800 text-center">
                You have not registered for any upcoming events yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events
                  .filter((e) => registrationMap.has(e.id))
                  .map((evt) => (
                    <EventCard
                      key={evt.id}
                      event={evt}
                      isSaved={savedEventIds.has(evt.id)}
                      userRegistration={registrationMap.get(evt.id)}
                      onSelect={(e) => setSelectedEvent(e)}
                      onToggleSave={handleToggleSave}
                      onRegister={handleRegister}
                      onCancelRegistration={handleCancelRegistration}
                      onReport={(e) => setReportingEvent(e)}
                      onExportDrive={handleExportDrive}
                    />
                  ))}
              </div>
            )}
          </div>

          {/* Bookmarked Events */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-blue-400" />
              <span>Saved Event Bookmarks ({savedEvents.length})</span>
            </h3>

            {savedEvents.length === 0 ? (
              <p className="text-xs text-slate-400 p-6 bg-slate-900/40 rounded-2xl border border-slate-800 text-center">
                No saved event bookmarks. Click the bookmark icon on any event to pin it here.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedEvents.map((evt) => (
                  <EventCard
                    key={evt.id}
                    event={evt}
                    isSaved={true}
                    userRegistration={registrationMap.get(evt.id)}
                    onSelect={(e) => setSelectedEvent(e)}
                    onToggleSave={handleToggleSave}
                    onRegister={handleRegister}
                    onCancelRegistration={handleCancelRegistration}
                    onReport={(e) => setReportingEvent(e)}
                    onExportDrive={handleExportDrive}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals & AI Drawers */}
      <EventDetailsModal
        event={selectedEvent}
        isSaved={selectedEvent ? savedEventIds.has(selectedEvent.id) : false}
        userRegistration={selectedEvent ? registrationMap.get(selectedEvent.id) : undefined}
        onClose={() => setSelectedEvent(null)}
        onToggleSave={handleToggleSave}
        onRegister={handleRegister}
        onCancelRegistration={handleCancelRegistration}
        onReport={(e) => {
          setSelectedEvent(null);
          setReportingEvent(e);
        }}
        onExportDrive={handleExportDrive}
      />

      <PublishEventModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onEventCreated={(newEvent) => {
          setEvents([newEvent, ...events]);
          showNotification('Campus event published successfully!');
        }}
      />

      <CampusAICalendarDrawer
        isOpen={isAIDrawerOpen}
        onClose={() => setIsAIDrawerOpen(false)}
      />

      <DeadlinesModal
        isOpen={isDeadlinesModalOpen}
        onClose={() => setIsDeadlinesModalOpen(false)}
      />

      <ExamsTimetableModal
        isOpen={isExamsModalOpen}
        onClose={() => setIsExamsModalOpen(false)}
      />

      <ClubsListModal
        isOpen={isClubsModalOpen}
        onClose={() => setIsClubsModalOpen(false)}
        onSelectClubFilter={(clubName) => {
          setSelectedClubFilter(clubName);
          setActiveMainTab('EVENTS');
        }}
      />

      <EventReportModal
        event={reportingEvent}
        isOpen={Boolean(reportingEvent)}
        onClose={() => setReportingEvent(null)}
        onReportSubmitted={() => {
          showNotification('Report received by university moderation team.');
        }}
      />
    </div>
  );
}

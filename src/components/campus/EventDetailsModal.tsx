/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Globe,
  Users,
  ShieldCheck,
  ExternalLink,
  Bookmark,
  Share2,
  CheckCircle,
  AlertCircle,
  FileText,
  Download,
  CalendarPlus,
  Flag,
  UserCheck,
  Building,
  Mail,
  Phone,
  Sparkles,
} from 'lucide-react';
import { CampusEvent, EventRegistration, UserRole } from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';
import { api } from '../../services/api.js';

interface EventDetailsModalProps {
  event: CampusEvent | null;
  isSaved?: boolean;
  userRegistration?: EventRegistration;
  onClose: () => void;
  onToggleSave: (event: CampusEvent) => void;
  onRegister: (event: CampusEvent) => void;
  onCancelRegistration: (event: CampusEvent) => void;
  onReport: (event: CampusEvent) => void;
  onExportDrive: (event: CampusEvent) => void;
}

export function EventDetailsModal({
  event,
  isSaved = false,
  userRegistration,
  onClose,
  onToggleSave,
  onRegister,
  onCancelRegistration,
  onReport,
  onExportDrive,
}: EventDetailsModalProps) {
  const { user } = useAuth();
  const [attendees, setAttendees] = useState<EventRegistration[]>([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [showAttendees, setShowAttendees] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!event) return null;

  const isCreatorOrAdmin =
    user?.id === event.createdBy ||
    user?.role === UserRole.ADMIN ||
    user?.role === UserRole.SUPER_ADMIN;

  const startDate = new Date(event.startDateTime);
  const endDate = event.endDateTime ? new Date(event.endDateTime) : null;
  const isPast = startDate.getTime() < Date.now();
  const isRegistered = userRegistration?.status === 'REGISTERED';
  const isWaitlisted = userRegistration?.status === 'WAITLISTED';

  useEffect(() => {
    if (isCreatorOrAdmin && showAttendees) {
      loadAttendees();
    }
  }, [isCreatorOrAdmin, showAttendees, event.id]);

  async function loadAttendees() {
    try {
      setLoadingAttendees(true);
      const res = await api.getCampusEventAttendees(event.id);
      setAttendees(res.attendees || []);
    } catch (err) {
      console.error('Failed to load attendees:', err);
    } finally {
      setLoadingAttendees(false);
    }
  }

  function handleAddToGoogleCalendar() {
    const startIso = new Date(event.startDateTime).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endIso = event.endDateTime
      ? new Date(event.endDateTime).toISOString().replace(/-|:|\.\d\d\d/g, '')
      : startIso;
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title
    )}&dates=${startIso}/${endIso}&details=${encodeURIComponent(
      event.description + (event.onlineUrl ? `\nOnline Join Link: ${event.onlineUrl}` : '')
    )}&location=${encodeURIComponent(event.location)}&sf=true&output=xml`;
    window.open(gCalUrl, '_blank', 'noopener,noreferrer');
  }

  function handleShare() {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div
        id="campus-event-details-modal"
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8"
      >
        {/* Header Bar */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-blue-950/80 text-blue-400 border border-blue-800/60">
              {event.category.replace('_', ' ')}
            </span>
            {event.isOfficial && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                Official Institution Event
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(event)}
              title={isSaved ? 'Remove Bookmark' : 'Save Event'}
              className={`p-2 rounded-xl border transition-colors ${
                isSaved
                  ? 'bg-blue-600/20 text-blue-400 border-blue-600/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-blue-400' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              title="Share"
              className="p-2 rounded-xl bg-slate-800 text-slate-400 border border-slate-700 hover:text-white transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 border border-slate-700 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
          {/* Title & Organization Banner */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">{event.title}</h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
              <span className="text-slate-300 font-medium">{event.institutionName}</span>
              {event.campusName && <span>• {event.campusName}</span>}
              {event.departmentName && <span>• {event.departmentName}</span>}
              {event.clubName && <span className="text-teal-400 font-medium">• {event.clubName}</span>}
            </div>
          </div>

          {/* Schedule & Venue Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            {/* Date & Time */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-slate-300">Date & Schedule</span>
              </div>
              <p className="text-xs text-white pl-5.5 font-medium">
                {startDate.toLocaleDateString(undefined, {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
              <p className="text-xs text-slate-300 pl-5.5 font-mono">
                {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {endDate && ` - ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                {` (${event.timezone || 'Local'})`}
              </p>
            </div>

            {/* Location */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                {event.locationType === 'ONLINE' ? (
                  <Globe className="w-4 h-4 text-emerald-400" />
                ) : (
                  <MapPin className="w-4 h-4 text-rose-400" />
                )}
                <span className="font-semibold text-slate-300">Location & Venue</span>
              </div>
              <p className="text-xs text-white pl-5.5 font-medium">
                {event.locationType === 'ONLINE' ? 'Online Virtual Event' : event.venueName || event.location}
              </p>
              {event.locationType === 'PHYSICAL' && (event.building || event.room) && (
                <p className="text-xs text-slate-300 pl-5.5">
                  {event.building ? `Building: ${event.building}` : ''}
                  {event.room ? ` • Room: ${event.room}` : ''}
                </p>
              )}
              {event.onlineUrl && (
                <a
                  href={event.onlineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 pl-5.5 flex items-center gap-1 font-medium"
                >
                  Join Meeting URL <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Event Details</h4>
            <p className="text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Organizer Dossier */}
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Host & Organizer</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-950 text-blue-400 border border-blue-800 flex items-center justify-center font-bold text-sm">
                  {event.organizerName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">{event.organizerName}</h5>
                  <p className="text-[11px] text-slate-400">{event.organizerRole || 'Campus Organizer'}</p>
                </div>
              </div>

              {event.organizerEmail && (
                <a
                  href={`mailto:${event.organizerEmail}`}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden sm:inline">Contact</span>
                </a>
              )}
            </div>
          </div>

          {/* Materials & Resources */}
          {event.materials && event.materials.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Event Materials & Documents
              </h4>
              <div className="space-y-1.5">
                {event.materials.map((mat, i) => (
                  <a
                    key={i}
                    href={mat.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between text-xs transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span className="text-slate-200 group-hover:text-white font-medium">{mat.title}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {event.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/60 text-slate-300 border border-slate-700/60"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Organizer Attendee Roster (Strictly restricted to authorized host/admin) */}
          {isCreatorOrAdmin && (
            <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-blue-400" />
                    Organizer Access: Registered Attendees ({event.registeredCount || 0})
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Private attendee roster is strictly restricted to event hosts and university administrators.
                  </p>
                </div>
                <button
                  onClick={() => setShowAttendees(!showAttendees)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/40 text-blue-300 text-xs font-semibold border border-blue-600/50"
                >
                  {showAttendees ? 'Hide Roster' : 'View Roster'}
                </button>
              </div>

              {showAttendees && (
                <div className="space-y-2 pt-2 border-t border-blue-900/40">
                  {loadingAttendees ? (
                    <p className="text-xs text-slate-400 py-2">Loading attendee roster...</p>
                  ) : attendees.length === 0 ? (
                    <p className="text-xs text-slate-400 py-2">No student registrations recorded yet.</p>
                  ) : (
                    <div className="max-h-48 overflow-y-auto space-y-1.5">
                      {attendees.map((att) => (
                        <div
                          key={att.id}
                          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                        >
                          <div>
                            <p className="text-white font-medium">{att.userName}</p>
                            <p className="text-[11px] text-slate-400">{att.userEmail}</p>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              att.status === 'REGISTERED'
                                ? 'bg-emerald-950 text-emerald-400'
                                : 'bg-amber-950 text-amber-400'
                            }`}
                          >
                            {att.status} {att.waitlistPosition ? `#${att.waitlistPosition}` : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleAddToGoogleCalendar}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <CalendarPlus className="w-4 h-4 text-blue-400" />
              <span>Google Calendar</span>
            </button>

            <button
              onClick={() => onExportDrive(event)}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Google Drive</span>
            </button>

            <button
              onClick={() => onReport(event)}
              title="Report Event"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>

          {/* Registration / Waitlist CTA */}
          <div className="w-full sm:w-auto flex items-center justify-end gap-2">
            {isRegistered ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> You're registered
                </span>
                <button
                  onClick={() => onCancelRegistration(event)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  Cancel RSVP
                </button>
              </div>
            ) : isWaitlisted ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                  <Clock className="w-4 h-4" /> On Waitlist ({userRegistration?.waitlistPosition ? `#${userRegistration.waitlistPosition}` : 'Queued'})
                </span>
                <button
                  onClick={() => onCancelRegistration(event)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  Leave Waitlist
                </button>
              </div>
            ) : event.registrationRequired ? (
              <button
                id="modal-register-cta-btn"
                onClick={() => onRegister(event)}
                disabled={isPast || event.status === 'CANCELLED'}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-bold transition-colors"
              >
                {event.capacity && (event.registeredCount || 0) >= event.capacity
                  ? 'Join Waitlist'
                  : 'Register / RSVP for Event'}
              </button>
            ) : (
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium border border-slate-700 transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
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
  Sparkles,
  Download,
  CalendarPlus,
  Flag,
} from 'lucide-react';
import { CampusEvent, EventRegistration } from '../../types/index.js';

interface EventCardProps {
  event: CampusEvent;
  isSaved?: boolean;
  userRegistration?: EventRegistration;
  onSelect: (event: CampusEvent) => void;
  onToggleSave: (event: CampusEvent) => void;
  onRegister: (event: CampusEvent) => void;
  onCancelRegistration?: (event: CampusEvent) => void;
  onReport: (event: CampusEvent) => void;
  onExportDrive?: (event: CampusEvent) => void;
}

export function EventCard({
  event,
  isSaved = false,
  userRegistration,
  onSelect,
  onToggleSave,
  onRegister,
  onCancelRegistration,
  onReport,
  onExportDrive,
}: EventCardProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  const startDate = new Date(event.startDateTime);
  const endDate = event.endDateTime ? new Date(event.endDateTime) : null;
  const isPast = startDate.getTime() < Date.now();
  const isToday =
    new Date().toDateString() === startDate.toDateString();

  const isFull =
    event.capacity !== undefined &&
    (event.registeredCount || 0) >= event.capacity;

  const isRegistered = userRegistration?.status === 'REGISTERED';
  const isWaitlisted = userRegistration?.status === 'WAITLISTED';

  const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
    ACADEMIC: { bg: 'bg-indigo-950/60', text: 'text-indigo-400', border: 'border-indigo-800/60' },
    CAREER: { bg: 'bg-emerald-950/60', text: 'text-emerald-400', border: 'border-emerald-800/60' },
    WORKSHOP: { bg: 'bg-amber-950/60', text: 'text-amber-400', border: 'border-amber-800/60' },
    SPORTS: { bg: 'bg-rose-950/60', text: 'text-rose-400', border: 'border-rose-800/60' },
    SOCIAL: { bg: 'bg-fuchsia-950/60', text: 'text-fuchsia-400', border: 'border-fuchsia-800/60' },
    CLUB: { bg: 'bg-teal-950/60', text: 'text-teal-400', border: 'border-teal-800/60' },
    ORIENTATION: { bg: 'bg-sky-950/60', text: 'text-sky-400', border: 'border-sky-800/60' },
    HACKATHON: { bg: 'bg-cyan-950/60', text: 'text-cyan-400', border: 'border-cyan-800/60' },
  };

  const catStyle = categoryColors[event.category] || {
    bg: 'bg-slate-900',
    text: 'text-slate-400',
    border: 'border-slate-800',
  };

  function handleShare(e: React.MouseEvent) {
    e.stopPropagation();
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  function handleAddToGoogleCalendar(e: React.MouseEvent) {
    e.stopPropagation();
    const startIso = new Date(event.startDateTime).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endIso = event.endDateTime
      ? new Date(event.endDateTime).toISOString().replace(/-|:|\.\d\d\d/g, '')
      : startIso;
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title
    )}&dates=${startIso}/${endIso}&details=${encodeURIComponent(
      event.description + (event.onlineUrl ? `\nOnline Link: ${event.onlineUrl}` : '')
    )}&location=${encodeURIComponent(event.location)}&sf=true&output=xml`;
    window.open(gCalUrl, '_blank', 'noopener,noreferrer');
  }

  return (
    <div
      id={`campus-event-card-${event.id}`}
      onClick={() => onSelect(event)}
      className="group relative rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-blue-600/50 transition-all duration-200 overflow-hidden flex flex-col justify-between cursor-pointer hover:shadow-xl hover:shadow-blue-950/20"
    >
      {/* Top Banner / Badges */}
      <div>
        <div className="p-5 pb-3">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Category */}
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
              >
                {event.category.replace('_', ' ')}
              </span>

              {/* Official Verified Institution Badge */}
              {event.isOfficial && (
                <span
                  title="Verified Official Institution Event"
                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800/70"
                >
                  <ShieldCheck className="w-3 h-3" />
                  Official
                </span>
              )}

              {/* Status Notice if Canceled/Postponed */}
              {event.status === 'CANCELLED' && (
                <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-rose-950/90 text-rose-400 border border-rose-800">
                  Canceled
                </span>
              )}
              {event.status === 'POSTPONED' && (
                <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-amber-950/90 text-amber-400 border border-amber-800">
                  Postponed
                </span>
              )}

              {/* Today Pill */}
              {isToday && (
                <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-blue-600 text-white animate-pulse">
                  Today
                </span>
              )}
            </div>

            {/* Bookmark & Actions */}
            <div className="flex items-center gap-1">
              <button
                id={`save-event-btn-${event.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSave(event);
                }}
                title={isSaved ? 'Remove from saved' : 'Save event'}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isSaved
                    ? 'bg-blue-600/20 text-blue-400 border-blue-600/40 hover:bg-blue-600/30'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-blue-400' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                title="Share event"
                className="p-1.5 rounded-lg bg-slate-800/60 text-slate-400 border border-slate-700 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Title & Description */}
          <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1 mb-1.5">
            {event.title}
          </h3>
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
            {event.description}
          </p>

          {/* Key Schedule Information */}
          <div className="space-y-2 text-xs text-slate-300">
            {/* Date & Time */}
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>
                {startDate.toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
                {' • '}
                <span className="font-mono text-slate-200">
                  {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {endDate && (
                  <span className="text-slate-400 font-mono">
                    {' - '}
                    {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </span>
            </div>

            {/* Location / Mode */}
            <div className="flex items-center gap-2">
              {event.locationType === 'ONLINE' ? (
                <>
                  <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate text-emerald-300 font-medium">Virtual / Online Event</span>
                </>
              ) : (
                <>
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="truncate text-slate-300 font-medium">
                    {event.venueName || event.location}
                    {event.building ? ` (${event.building}${event.room ? `, ${event.room}` : ''})` : ''}
                  </span>
                </>
              )}
            </div>

            {/* Organizer */}
            <div className="flex items-center gap-2 text-slate-400">
              <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">
                {event.organizerName}
                {event.clubName ? ` • ${event.clubName}` : ''}
                {event.campusName ? ` (${event.campusName})` : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Capacity / Registration Status Bar */}
        {event.capacity !== undefined && (
          <div className="px-5 py-2 bg-slate-950/40 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">
              Capacity: <span className="text-white font-medium">{event.registeredCount || 0}</span> /{' '}
              {event.capacity} seats
            </span>
            {isFull ? (
              <span className="text-amber-400 font-medium">
                {event.waitlistCount && event.waitlistCount > 0
                  ? `${event.waitlistCount} on Waitlist`
                  : 'Full (Waitlist Available)'}
              </span>
            ) : (
              <span className="text-emerald-400 font-medium">
                {event.capacity - (event.registeredCount || 0)} spots left
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer CTAs */}
      <div className="p-4 pt-3 bg-slate-900/90 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleAddToGoogleCalendar}
            title="Add to Google Calendar"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs flex items-center gap-1 transition-colors"
          >
            <CalendarPlus className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Google Cal</span>
          </button>

          {onExportDrive && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onExportDrive(event);
              }}
              title="Save Event Dossier to Google Drive"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs flex items-center gap-1 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Drive</span>
            </button>
          )}
        </div>

        {/* User Registration CTA */}
        <div className="flex items-center gap-2">
          {isRegistered ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-semibold">
              <CheckCircle className="w-3.5 h-3.5" />
              RSVP Confirmed
            </span>
          ) : isWaitlisted ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950 text-amber-400 border border-amber-800 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5" />
              Waitlisted ({userRegistration?.waitlistPosition ? `#${userRegistration.waitlistPosition}` : 'Queue'})
            </span>
          ) : event.registrationRequired ? (
            <button
              id={`register-btn-${event.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onRegister(event);
              }}
              disabled={isPast || event.status === 'CANCELLED'}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-semibold transition-colors flex items-center gap-1"
            >
              <span>{isFull ? 'Join Waitlist' : 'Register / RSVP'}</span>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(event);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
            >
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

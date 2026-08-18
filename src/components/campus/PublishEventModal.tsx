/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Globe,
  Users,
  ShieldAlert,
  Building,
  Link as LinkIcon,
  Tag,
  FileText,
  Plus,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { api } from '../../services/api.js';
import { CampusEvent, EventCategory, EventType, LocationType, UserRole } from '../../types/index.js';

interface PublishEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: (event: CampusEvent) => void;
}

export function PublishEventModal({ isOpen, onClose, onEventCreated }: PublishEventModalProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<EventCategory>('ACADEMIC');
  const [type, setType] = useState<EventType>('PUBLIC_CAMPUS_EVENT');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [timezone, setTimezone] = useState('Africa/Nairobi');

  // Location
  const [locationType, setLocationType] = useState<LocationType>('PHYSICAL');
  const [location, setLocation] = useState('');
  const [venueName, setVenueName] = useState('');
  const [building, setBuilding] = useState('');
  const [room, setRoom] = useState('');
  const [onlineUrl, setOnlineUrl] = useState('');

  // Organization
  const [organizerName, setOrganizerName] = useState(user?.name || '');
  const [organizerRole, setOrganizerRole] = useState(user?.role === UserRole.STUDENT ? 'Student Organizer' : 'University Staff');
  const [organizerEmail, setOrganizerEmail] = useState(user?.email || '');
  const [clubName, setClubName] = useState('');

  // Registration & Capacity
  const [registrationRequired, setRegistrationRequired] = useState(false);
  const [capacity, setCapacity] = useState<string>('');
  const [registrationDeadline, setRegistrationDeadline] = useState('');

  // Tags & Materials
  const [tagsInput, setTagsInput] = useState('');
  const [materials, setMaterials] = useState<Array<{ title: string; url: string; type: string }>>([]);
  const [newMatTitle, setNewMatTitle] = useState('');
  const [newMatUrl, setNewMatUrl] = useState('');

  if (!isOpen) return null;

  const isStaff = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;

  function handleAddMaterial() {
    if (!newMatTitle || !newMatUrl) return;
    setMaterials([...materials, { title: newMatTitle, url: newMatUrl, type: 'DOCUMENT' }]);
    setNewMatTitle('');
    setNewMatUrl('');
  }

  function handleRemoveMaterial(index: number) {
    setMaterials(materials.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !description || !startDateTime || !location || !organizerName) {
      setError('Please fill in all required fields (Title, Description, Start Time, Location, Organizer).');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const parsedTags = tagsInput
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean);

      const res = await api.createCampusEvent({
        title,
        description,
        category,
        type,
        startDateTime: new Date(startDateTime).toISOString(),
        endDateTime: endDateTime ? new Date(endDateTime).toISOString() : new Date(startDateTime).toISOString(),
        timezone,
        locationType,
        location,
        venueName,
        building,
        room,
        onlineUrl: locationType === 'ONLINE' || locationType === 'HYBRID' ? onlineUrl : undefined,
        organizerName,
        organizerRole,
        organizerEmail,
        clubName: clubName || undefined,
        institutionId: user?.institutionId || 'inst-uon-ke',
        institutionName: user?.institutionName || 'University of Nairobi',
        campusId: user?.campusId,
        campusName: user?.campusName,
        capacity: capacity ? Number(capacity) : undefined,
        registrationRequired,
        registrationDeadline: registrationDeadline ? new Date(registrationDeadline).toISOString() : undefined,
        tags: parsedTags,
        materials,
      });

      if (res.success && res.event) {
        onEventCreated(res.event);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to publish campus event.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div
        id="publish-event-modal"
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-950 text-blue-400 border border-blue-900">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Publish Campus Event</h2>
              <p className="text-xs text-slate-400">
                Post academic workshops, club sessions, career fairs, or campus activities.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 border border-slate-700 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[72vh] overflow-y-auto no-scrollbar">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Verification Notice */}
          <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-900/50 text-xs text-slate-300 space-y-1">
            <p className="font-semibold text-blue-300">
              {isStaff ? '🛡️ Institutional Publishing Mode (Official Verified)' : '📌 Community & Student Publishing'}
            </p>
            <p className="text-slate-400">
              {isStaff
                ? 'Your account has verified staff privileges. This event will display with the Official badge.'
                : 'Student submissions are marked as Community Submitted until reviewed by verified campus administrators.'}
            </p>
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Event Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. AI & Machine Learning Student Hackathon 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EventCategory)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="ACADEMIC">Academic & Seminars</option>
                  <option value="WORKSHOP">Workshop & Bootcamps</option>
                  <option value="CAREER">Career & Internships</option>
                  <option value="HACKATHON">Hackathon & Competitions</option>
                  <option value="CLUB">Clubs & Societies</option>
                  <option value="SPORTS">Sports & Athletics</option>
                  <option value="SOCIAL">Social & Cultural</option>
                  <option value="ORIENTATION">Orientation & Welcome</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Event Scope</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as EventType)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="PUBLIC_CAMPUS_EVENT">Public Campus Event</option>
                  <option value="DEPARTMENT_EVENT">Departmental Event</option>
                  <option value="CLUB_EVENT">Club / Society Event</option>
                  <option value="CAREER_FAIR">Career Fair</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Detailed Description *</label>
              <textarea
                required
                rows={3}
                placeholder="Describe agenda, guest speakers, prerequisites, and what students should bring..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-300">Date & Schedule</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Start Date & Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={startDateTime}
                  onChange={(e) => setStartDateTime(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">End Date & Time</label>
                <input
                  type="datetime-local"
                  value={endDateTime}
                  onChange={(e) => setEndDateTime(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Location & Format */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-300">Location & Venue</h4>
            <div className="flex items-center gap-2 mb-2">
              {(['PHYSICAL', 'ONLINE', 'HYBRID'] as LocationType[]).map((mode) => (
                <button
                  type="button"
                  key={mode}
                  onClick={() => setLocationType(mode)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    locationType === mode
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Location / Campus *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chiromo Science Campus"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Venue / Hall Name</label>
                <input
                  type="text"
                  placeholder="e.g. Millennium Hall 1"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {locationType !== 'ONLINE' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Building</label>
                  <input
                    type="text"
                    placeholder="e.g. Science Complex"
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Room / Lab No.</label>
                  <input
                    type="text"
                    placeholder="e.g. Room SC-204"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {(locationType === 'ONLINE' || locationType === 'HYBRID') && (
              <div>
                <label className="block text-xs text-slate-400 mb-1">Meeting URL / Livestream Link</label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/... or Zoom Link"
                  value={onlineUrl}
                  onChange={(e) => setOnlineUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}
          </div>

          {/* Registration & Capacity Controls */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-300">Registration & RSVP</h4>
                <p className="text-[11px] text-slate-400">Require students to register with seat capacity and waitlist management.</p>
              </div>
              <input
                type="checkbox"
                checked={registrationRequired}
                onChange={(e) => setRegistrationRequired(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-800 focus:ring-0"
              />
            </div>

            {registrationRequired && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Seat Capacity (Optional)</label>
                  <input
                    type="number"
                    placeholder="e.g. 50 (leave empty for unlimited)"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Registration Cut-off Deadline</label>
                  <input
                    type="datetime-local"
                    value={registrationDeadline}
                    onChange={(e) => setRegistrationDeadline(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Organizer Dossier */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-300">Organizer Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Organizer / Lead Name *</label>
                <input
                  type="text"
                  required
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={organizerEmail}
                  onChange={(e) => setOrganizerEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Associated Club (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. IEEE Student Branch"
                  value={clubName}
                  onChange={(e) => setClubName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="block text-xs font-bold text-slate-300">Tags (Comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. ai, hackathon, cs, engineering"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Attach Materials */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-300">Attach Materials / Slides</h4>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Document Title"
                value={newMatTitle}
                onChange={(e) => setNewMatTitle(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500"
              />
              <input
                type="url"
                placeholder="https://drive.google.com/..."
                value={newMatUrl}
                onChange={(e) => setNewMatUrl(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={handleAddMaterial}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            {materials.length > 0 && (
              <div className="space-y-1.5">
                {materials.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-300 font-medium">{m.title}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMaterial(idx)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              id="publish-event-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              {isSubmitting ? 'Publishing Event...' : 'Publish Campus Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

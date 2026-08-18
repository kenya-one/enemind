/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Building, PlusCircle, X, CheckCircle, AlertCircle, MapPin, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import { Institution, InstitutionType, DuplicateCheckResult, CountryInfo } from '../types/index.js';

interface AddInstitutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (institution: Institution) => void;
  mode?: 'INSTITUTION' | 'CAMPUS';
  parentInstitution?: Institution | null;
  countries?: CountryInfo[];
}

export function AddInstitutionModal({
  isOpen,
  onClose,
  onCreated,
  mode = 'INSTITUTION',
  parentInstitution,
  countries = [],
}: AddInstitutionModalProps) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState(parentInstitution?.countryCode || 'KE');
  const [city, setCity] = useState('');
  const [campusName, setCampusName] = useState('');
  const [type, setType] = useState<InstitutionType>(InstitutionType.UNIVERSITY);
  const [website, setWebsite] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Duplicate check state
  const [duplicateCheck, setDuplicateCheck] = useState<DuplicateCheckResult | null>(null);
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);

  // Debounced duplicate detection
  useEffect(() => {
    if (mode !== 'INSTITUTION' || !name.trim() || name.trim().length < 3) {
      setDuplicateCheck(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsCheckingDuplicates(true);
        const result = await api.checkInstitutionDuplicates(name.trim(), countryCode);
        setDuplicateCheck(result);
      } catch (err) {
        console.error('Failed to check duplicates:', err);
      } finally {
        setIsCheckingDuplicates(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [name, countryCode, mode]);

  if (!isOpen) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (mode === 'CAMPUS') {
      if (!parentInstitution || !campusName.trim() || !city.trim()) {
        setStatusMessage({ type: 'error', text: 'Please fill in campus name and city.' });
        return;
      }

      try {
        setIsSubmitting(true);
        setStatusMessage(null);

        const res = await api.submitCampus({
          institutionId: parentInstitution.id,
          campusName: campusName.trim(),
          city: city.trim(),
          countryCode,
          website: website.trim() || undefined,
          description: notes.trim() || undefined,
          submittedByUserId: user?.id,
        });

        setStatusMessage({
          type: 'success',
          text: `Campus "${res.submission.campusName}" proposed successfully! It is pending moderation in admin review.`,
        });

        setTimeout(() => {
          onClose();
          setCampusName('');
          setCity('');
          setNotes('');
          setStatusMessage(null);
        }, 1400);
      } catch (err: any) {
        setStatusMessage({ type: 'error', text: err.message || 'Failed to submit campus proposal.' });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Institution submission
    if (!name.trim() || !city.trim()) {
      setStatusMessage({ type: 'error', text: 'Please fill in the required university name and city/campus.' });
      return;
    }

    try {
      setIsSubmitting(true);
      setStatusMessage(null);

      const res = await api.proposeInstitution({
        name: name.trim(),
        countryCode,
        campusName: campusName.trim() || `${city.trim()} Main Campus`,
        city: city.trim(),
        type,
        website: website.trim() || undefined,
        submittedByUserId: user?.id,
        submissionNotes: notes.trim() || undefined,
      });

      setStatusMessage({
        type: 'success',
        text: 'Institution proposed successfully! It has been placed in the moderation queue with status PENDING.',
      });

      onCreated(res.institution);
      setTimeout(() => {
        onClose();
        setName('');
        setCity('');
        setCampusName('');
        setWebsite('');
        setNotes('');
        setStatusMessage(null);
      }, 1500);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to submit institution proposal.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0B10]/85 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-[#12141D] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#50E3C2]/10 text-[#50E3C2] flex items-center justify-center border border-[#50E3C2]/20">
              {mode === 'CAMPUS' ? <MapPin className="w-4 h-4" /> : <Building className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                {mode === 'CAMPUS' ? `Add Campus to ${parentInstitution?.name || 'Institution'}` : 'Propose New Institution'}
              </h3>
              <p className="text-[11px] text-white/40">
                {mode === 'CAMPUS' ? 'Submit a new branch campus or satellite location' : 'Add your university/college to the global directory'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/40 hover:text-white rounded-lg bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {statusMessage && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
            }`}
          >
            {statusMessage.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Duplicate Warning Box */}
        {duplicateCheck && duplicateCheck.hasPotentialDuplicates && (
          <div className="p-3.5 bg-amber-950/30 border border-amber-500/30 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold">
              <AlertCircle className="w-4 h-4" />
              <span>Potential Existing Matches Detected</span>
            </div>
            <p className="text-[11px] text-amber-200/70">
              We found institutions that may already exist in this country:
            </p>
            <ul className="text-xs text-white/80 list-disc list-inside space-y-1">
              {duplicateCheck.matches.map((m) => (
                <li key={m.id} className="font-medium text-amber-100">
                  {m.name} ({m.campusesCount} campuses)
                </li>
              ))}
            </ul>
            <p className="text-[10px] text-white/40">
              If your institution is distinct, you may proceed with the submission.
            </p>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'INSTITUTION' ? (
            <>
              <div>
                <label className="block text-white/70 mb-1.5 font-medium">Institution Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Technical University of Munich"
                    className="w-full bg-[#181B26] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-[#50E3C2]/50 text-xs"
                  />
                  {isCheckingDuplicates && (
                    <div className="absolute right-3 top-2.5 text-white/30 text-[10px]">
                      Checking...
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1.5 font-medium">Country *</label>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full bg-[#181B26] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#50E3C2]/50 text-xs"
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flagEmoji} {c.name}
                      </option>
                    ))}
                    {countries.length === 0 && (
                      <>
                        <option value="KE">🇰🇪 Kenya</option>
                        <option value="US">🇺🇸 United States</option>
                        <option value="GB">🇬🇧 United Kingdom</option>
                        <option value="CA">🇨🇦 Canada</option>
                        <option value="AU">🇦🇺 Australia</option>
                        <option value="ZA">🇿🇦 South Africa</option>
                        <option value="NG">🇳🇬 Nigeria</option>
                        <option value="IN">🇮🇳 India</option>
                        <option value="DE">🇩🇪 Germany</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 mb-1.5 font-medium">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as InstitutionType)}
                    className="w-full bg-[#181B26] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#50E3C2]/50 text-xs"
                  >
                    <option value={InstitutionType.UNIVERSITY}>University</option>
                    <option value={InstitutionType.COLLEGE}>College</option>
                    <option value={InstitutionType.TECHNICAL_INSTITUTION}>Technical Institute</option>
                    <option value={InstitutionType.VOCATIONAL_INSTITUTION}>Vocational / TVET</option>
                    <option value={InstitutionType.ONLINE_INSTITUTION}>Online Institution</option>
                    <option value={InstitutionType.OTHER}>Other Academy</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1.5 font-medium">Primary Campus / City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Munich"
                    className="w-full bg-[#181B26] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-[#50E3C2]/50 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1.5 font-medium">Campus Name (Optional)</label>
                  <input
                    type="text"
                    value={campusName}
                    onChange={(e) => setCampusName(e.target.value)}
                    placeholder="e.g. Main Campus"
                    className="w-full bg-[#181B26] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-[#50E3C2]/50 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 mb-1.5 font-medium">Official Website (Optional)</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#181B26] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-[#50E3C2]/50 text-xs"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-white/70 mb-1.5 font-medium">Campus Name *</label>
                <input
                  type="text"
                  required
                  value={campusName}
                  onChange={(e) => setCampusName(e.target.value)}
                  placeholder="e.g. City Satellite Campus, West Campus"
                  className="w-full bg-[#181B26] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-[#50E3C2]/50 text-xs"
                />
              </div>
              <div>
                <label className="block text-white/70 mb-1.5 font-medium">City / Location *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Nairobi, London, Toronto"
                  className="w-full bg-[#181B26] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-[#50E3C2]/50 text-xs"
                />
              </div>
              <div>
                <label className="block text-white/70 mb-1.5 font-medium">Website / Location Map (Optional)</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#181B26] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-[#50E3C2]/50 text-xs"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-white/70 mb-1.5 font-medium">Additional Notes (Optional)</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any details to help moderators verify this addition..."
              className="w-full bg-[#181B26] border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-white/20 focus:outline-none focus:border-[#50E3C2]/50 text-xs resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white/60 hover:text-white rounded-xl bg-white/5 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#50E3C2] text-[#0A0B10] font-semibold rounded-xl hover:bg-[#40C9AB] transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit for Moderation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

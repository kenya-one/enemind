/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  User,
  GraduationCap,
  MapPin,
  Building,
  Calendar,
  DollarSign,
  Shield,
  CheckCircle,
  X,
  AlertTriangle,
  HardDrive,
  Table,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useCurrency } from '../context/CurrencyContext.js';
import { api } from '../services/api.js';
import { CountryInfo, Institution, YearLevel, UserRole } from '../types/index.js';

interface MyCampusProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const YEAR_LEVELS: YearLevel[] = [
  { id: 'yr-1', label: 'Year 1 / Freshman', order: 1 },
  { id: 'yr-2', label: 'Year 2 / Sophomore', order: 2 },
  { id: 'yr-3', label: 'Year 3 / Junior', order: 3 },
  { id: 'yr-4', label: 'Year 4 / Senior', order: 4 },
  { id: 'yr-5', label: 'Year 5 / Final Year', order: 5 },
  { id: 'yr-grad', label: 'Graduate / Master', order: 6 },
  { id: 'yr-phd', label: 'Postgraduate / PhD', order: 7 },
  { id: 'yr-other', label: 'Diploma / Certificate / Other', order: 8 },
];

export function MyCampusProfileModal({ isOpen, onClose }: MyCampusProfileModalProps) {
  const { user, updateUserProfile, switchRole } = useAuth();
  const { setCurrency } = useCurrency();

  const [countries, setCountries] = useState<CountryInfo[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);

  // Form Fields
  const [countryCode, setCountryCode] = useState(user?.countryCode || 'KE');
  const [institutionId, setInstitutionId] = useState(user?.institutionId || '');
  const [campusId, setCampusId] = useState(user?.campusId || '');
  const [courseName, setCourseName] = useState(user?.courseName || '');
  const [yearLevelLabel, setYearLevelLabel] = useState(user?.yearLevelLabel || 'Year 1');
  const [preferredCurrency, setPreferredCurrency] = useState(user?.preferredCurrency || 'USD');

  // Confirmation state
  const [isConfirmingChange, setIsConfirmingChange] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setCountryCode(user.countryCode || 'KE');
      setInstitutionId(user.institutionId || '');
      setCampusId(user.campusId || '');
      setCourseName(user.courseName || '');
      setYearLevelLabel(user.yearLevelLabel || 'Year 1');
      setPreferredCurrency(user.preferredCurrency || 'USD');
    }
  }, [user]);

  useEffect(() => {
    async function loadData() {
      try {
        const [cRes, iRes] = await Promise.all([
          api.getCountries(),
          api.getInstitutions(countryCode),
        ]);
        setCountries(cRes.countries || []);
        setInstitutions(iRes.institutions || []);
      } catch (err) {
        console.error('Failed to load profile data:', err);
      }
    }
    if (isOpen) {
      loadData();
    }
  }, [isOpen, countryCode]);

  if (!isOpen) return null;

  const currentInst = institutions.find((i) => i.id === institutionId) || institutions[0];
  const currentCampus = currentInst?.campuses.find((c) => c.id === campusId) || currentInst?.campuses[0];

  const hasInstitutionChanged = user?.institutionId !== institutionId;

  async function handleSaveProfile() {
    if (hasInstitutionChanged && !isConfirmingChange) {
      setIsConfirmingChange(true);
      return;
    }

    try {
      setIsSaving(true);
      await updateUserProfile({
        countryCode,
        institutionId: currentInst?.id,
        institutionName: currentInst?.name,
        campusId: currentCampus?.id,
        campusName: currentCampus?.name,
        courseName: courseName.trim() || 'General Academic Studies',
        yearLevelLabel,
        preferredCurrency,
      });

      setCurrency(preferredCurrency);
      setSaveSuccess(true);
      setIsConfirmingChange(false);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0B10]/90 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl bg-[#12141D] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#50E3C2]/40 p-0.5 bg-[#0A0B10]">
              <img
                src={user?.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user?.displayName || 'User Avatar'}
                className="w-full h-full rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">My Campus Profile & Settings</h2>
              <p className="text-xs text-white/40 font-mono">
                Enermind ID: {user?.id} • {user?.role}
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

        {/* Section 1: Google Identity */}
        <div className="bg-[#181B26]/70 border border-white/10 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#50E3C2]" />
              <span>Google Identity</span>
            </span>
            <span className="text-[10px] font-mono text-[#50E3C2] bg-[#50E3C2]/10 border border-[#50E3C2]/20 px-2 py-0.5 rounded">
              Verified & Linked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-white/30 block">Name</span>
              <span className="font-semibold text-white">{user?.displayName || 'Joice Barasa'}</span>
            </div>
            <div>
              <span className="text-[10px] text-white/30 block">Email</span>
              <span className="font-semibold text-white truncate block">{user?.email}</span>
            </div>
            <div>
              <span className="text-[10px] text-white/30 block">Google Subject ID</span>
              <span className="font-mono text-white/60 text-[11px] truncate block">
                {user?.googleSubjectId || '109283746592837465'}
              </span>
            </div>
          </div>
        </div>

        {/* Confirmation Warning if Changing Institution */}
        {isConfirmingChange && (
          <div className="p-4 bg-amber-950/40 border border-amber-500/40 rounded-2xl space-y-2 animate-in fade-in">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>Confirm Institution Change</span>
            </div>
            <p className="text-xs text-amber-200/80">
              Changing your university to <strong className="text-white">{currentInst?.name}</strong> will update your campus feed, past examination papers, accommodation listings, and local marketplace. Are you sure you want to proceed?
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmingChange(false)}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs rounded-xl text-white/70"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-4 py-1.5 bg-amber-400 text-black text-xs font-bold rounded-xl hover:bg-amber-300 transition-colors"
              >
                Yes, Confirm & Update
              </button>
            </div>
          </div>
        )}

        {/* Section 2: Academic Identity Form */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-[#50E3C2]" />
            <span>Academic Identity</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-white/70 mb-1 font-medium">Country / Region</label>
              <select
                value={countryCode}
                onChange={(e) => {
                  setCountryCode(e.target.value);
                  setInstitutionId('');
                }}
                className="w-full bg-[#181B26] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#50E3C2]/50 text-xs"
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flagEmoji} {c.name} ({c.currency})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/70 mb-1 font-medium">Preferred Currency</label>
              <select
                value={preferredCurrency}
                onChange={(e) => setPreferredCurrency(e.target.value)}
                className="w-full bg-[#181B26] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#50E3C2]/50 text-xs font-mono"
              >
                <option value="USD">USD ($ - United States)</option>
                <option value="KES">KES (KSh - Kenya)</option>
                <option value="GBP">GBP (£ - United Kingdom)</option>
                <option value="EUR">EUR (€ - Europe)</option>
                <option value="CAD">CAD (CA$ - Canada)</option>
                <option value="AUD">AUD (AU$ - Australia)</option>
                <option value="ZAR">ZAR (R - South Africa)</option>
                <option value="NGN">NGN (₦ - Nigeria)</option>
                <option value="INR">INR (₹ - India)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-white/70 mb-1 font-medium">University / Institution</label>
              <select
                value={institutionId}
                onChange={(e) => {
                  setInstitutionId(e.target.value);
                  const inst = institutions.find((i) => i.id === e.target.value);
                  if (inst && inst.campuses.length > 0) {
                    setCampusId(inst.campuses[0].id);
                  }
                }}
                className="w-full bg-[#181B26] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#50E3C2]/50 text-xs"
              >
                {institutions.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name} ({inst.shortName || inst.countryCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/70 mb-1 font-medium">Campus Location</label>
              <select
                value={campusId}
                onChange={(e) => setCampusId(e.target.value)}
                className="w-full bg-[#181B26] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#50E3C2]/50 text-xs"
              >
                {currentInst?.campuses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.city})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-white/70 mb-1 font-medium">Degree / Program of Study</label>
              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="e.g. BSc Computer Science"
                className="w-full bg-[#181B26] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#50E3C2]/50 text-xs"
              />
            </div>

            <div>
              <label className="block text-white/70 mb-1 font-medium">Year Level</label>
              <select
                value={yearLevelLabel}
                onChange={(e) => setYearLevelLabel(e.target.value)}
                className="w-full bg-[#181B26] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#50E3C2]/50 text-xs"
              >
                {YEAR_LEVELS.map((yr) => (
                  <option key={yr.id} value={yr.label}>
                    {yr.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Privacy & Google Services Clear Explanations */}
        <div className="bg-[#181B26]/40 border border-white/5 rounded-2xl p-4 space-y-3">
          <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider block">
            Google Workspace Permissions & Privacy
          </span>
          <p className="text-xs text-white/60 leading-relaxed">
            Enermind uses Google services to provide features such as your personal files and spreadsheets. We request only the permissions needed for the features you choose. Your files in the Enermind/ folder remain private in your Google account.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
              <span className="text-white/80">Google Drive Vault</span>
              <span className="text-[10px] font-mono text-[#50E3C2]">CONNECTED</span>
            </div>
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
              <span className="text-white/80">Sheets Engine</span>
              <span className="text-[10px] font-mono text-[#50E3C2]">READY</span>
            </div>
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
              <span className="text-white/80">Gemini 3.7 AI</span>
              <span className="text-[10px] font-mono text-[#50E3C2]">SERVER-SIDE</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="text-xs text-white/40">
            {saveSuccess && (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Profile updated successfully!</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-white/60 hover:text-white rounded-xl bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="px-6 py-2 bg-[#50E3C2] text-[#0A0B10] text-xs font-bold rounded-xl hover:bg-[#40C9AB] transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

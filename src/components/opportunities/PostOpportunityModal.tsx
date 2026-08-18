/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Building2,
  MapPin,
  Globe,
  DollarSign,
  Calendar,
  Briefcase,
  Plus,
  Trash2,
  ShieldCheck,
  Send,
  Sparkles,
} from 'lucide-react';
import { OpportunityType, RemoteType, SalaryPeriod, ApplicationMethod, PromotionTier } from '../../types/index.js';
import { useCurrency } from '../../context/CurrencyContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { api } from '../../services/api.js';

interface PostOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PostOpportunityModal({ isOpen, onClose, onSuccess }: PostOpportunityModalProps) {
  const { activeRate, rates } = useCurrency();
  const { user } = useAuth();

  const [organizationName, setOrganizationName] = useState<string>('');
  const [organizationWebsite, setOrganizationWebsite] = useState<string>('');
  const [organizationLogo, setOrganizationLogo] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [type, setType] = useState<OpportunityType>(OpportunityType.INTERNSHIP);
  const [industry, setIndustry] = useState<string>('Technology & Software');
  const [location, setLocation] = useState<string>('');
  const [country, setCountry] = useState<string>('United States');
  const [countryCode, setCountryCode] = useState<string>('US');
  const [city, setCity] = useState<string>('');
  const [remoteType, setRemoteType] = useState<RemoteType>(RemoteType.HYBRID);
  const [salaryMin, setSalaryMin] = useState<string>('');
  const [salaryMax, setSalaryMax] = useState<string>('');
  const [salaryCurrency, setSalaryCurrency] = useState<string>(activeRate?.code || 'USD');
  const [salaryPeriod, setSalaryPeriod] = useState<SalaryPeriod>(SalaryPeriod.MONTHLY);
  const [isSalaryDisclosed, setIsSalaryDisclosed] = useState<boolean>(true);
  const [applicationDeadline, setApplicationDeadline] = useState<string>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [duration, setDuration] = useState<string>('3 Months');
  const [description, setDescription] = useState<string>('');
  const [requirements, setRequirements] = useState<string[]>([
    'Enrolled in relevant degree or diploma program',
    'Demonstrated passion and foundational coursework',
  ]);
  const [responsibilities, setResponsibilities] = useState<string[]>([
    'Contribute to project sprint tasks under mentor supervision',
  ]);
  const [skills, setSkills] = useState<string>('Python, React, TypeScript');
  const [targetCourses, setTargetCourses] = useState<string>('Computer Science, Software Engineering');
  const [applicationMethod, setApplicationMethod] = useState<ApplicationMethod>(ApplicationMethod.ENERMIND);
  const [applicationUrl, setApplicationUrl] = useState<string>('');
  const [promotionTier, setPromotionTier] = useState<PromotionTier>(PromotionTier.NORMAL);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  function addRequirement() {
    setRequirements([...requirements, '']);
  }

  function updateRequirement(index: number, val: string) {
    const next = [...requirements];
    next[index] = val;
    setRequirements(next);
  }

  function removeRequirement(index: number) {
    setRequirements(requirements.filter((_, i) => i !== index));
  }

  function addResponsibility() {
    setResponsibilities([...responsibilities, '']);
  }

  function updateResponsibility(index: number, val: string) {
    const next = [...responsibilities];
    next[index] = val;
    setResponsibilities(next);
  }

  function removeResponsibility(index: number) {
    setResponsibilities(responsibilities.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !organizationName || !description) {
      setError('Please fill in all mandatory fields (Title, Organization, Description).');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const parsedSkills = skills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const parsedCourses = targetCourses
        .split(',')
        .map((c) => c.trim())
        .filter((c) => c.length > 0);

      const payload = {
        organizationName,
        organizationWebsite,
        organizationLogo,
        title,
        type,
        industry,
        location: location || `${city || 'Remote'}, ${country}`,
        country,
        countryCode,
        city: city || 'Remote',
        remoteType,
        salaryMin: salaryMin ? parseFloat(salaryMin) : undefined,
        salaryMax: salaryMax ? parseFloat(salaryMax) : undefined,
        salaryCurrency,
        salaryPeriod,
        isSalaryDisclosed,
        applicationDeadline: new Date(applicationDeadline).toISOString(),
        duration,
        description,
        requirements: requirements.filter((r) => r.trim().length > 0),
        responsibilities: responsibilities.filter((r) => r.trim().length > 0),
        skills: parsedSkills,
        courseRequirements: parsedCourses,
        applicationMethod,
        applicationUrl: applicationMethod === ApplicationMethod.EXTERNAL_URL ? applicationUrl : undefined,
        promotionTier,
      };

      await api.createOpportunity(payload);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to post opportunity.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        id="modal-post-opportunity"
        className="relative w-full max-w-3xl my-8 bg-[#12141D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#50E3C2]/10 text-[#50E3C2] flex items-center justify-center border border-[#50E3C2]/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Post Opportunity</h2>
              <p className="text-xs text-white/40">Connect with students and graduates across global campuses</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
              {error}
            </div>
          )}

          {/* Organization & Branding */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#50E3C2] uppercase tracking-wider">1. Organization Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-white/60 font-medium">Organization / Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Tech Global"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-white/60 font-medium">Website URL</label>
                <input
                  type="url"
                  placeholder="https://company.com"
                  value={organizationWebsite}
                  onChange={(e) => setOrganizationWebsite(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]/50"
                />
              </div>
            </div>
          </div>

          {/* Role Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#50E3C2] uppercase tracking-wider">2. Role Specification</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-white/60 font-medium">Opportunity Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Software Engineering Summer Intern"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/60 font-medium">Opportunity Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as OpportunityType)}
                  className="w-full px-3 py-2 bg-[#1A1D28] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]/50"
                >
                  <option value={OpportunityType.INTERNSHIP}>Internship</option>
                  <option value={OpportunityType.ATTACHMENT}>Academic Attachment / Placement</option>
                  <option value={OpportunityType.GRADUATE_PROGRAM}>Graduate Program</option>
                  <option value={OpportunityType.CAMPUS_JOB}>Campus Job / Work Study</option>
                  <option value={OpportunityType.FREELANCE}>Freelance / Contract</option>
                  <option value={OpportunityType.JOB}>Full-Time / Part-Time Job</option>
                  <option value={OpportunityType.SCHOLARSHIP}>Scholarship / Fellowship</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-white/60 font-medium">Workplace Mode</label>
                <select
                  value={remoteType}
                  onChange={(e) => setRemoteType(e.target.value as RemoteType)}
                  className="w-full px-3 py-2 bg-[#1A1D28] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]/50"
                >
                  <option value={RemoteType.HYBRID}>Hybrid</option>
                  <option value={RemoteType.REMOTE}>100% Remote</option>
                  <option value={RemoteType.ON_SITE}>On-Site</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/60 font-medium">City / Town</label>
                <input
                  type="text"
                  placeholder="e.g. Nairobi, New York, London"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/60 font-medium">Country</label>
                <input
                  type="text"
                  placeholder="e.g. Kenya, United States"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]/50"
                />
              </div>
            </div>
          </div>

          {/* Compensation & Deadline */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#50E3C2] uppercase tracking-wider">3. Compensation & Timing</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-white/60 font-medium">Min Amount</label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-white/60 font-medium">Max Amount</label>
                <input
                  type="number"
                  placeholder="e.g. 80000"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-white/60 font-medium">Currency</label>
                <select
                  value={salaryCurrency}
                  onChange={(e) => setSalaryCurrency(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1A1D28] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]/50"
                >
                  <option value="USD">USD ($)</option>
                  <option value="KES">KES (KSh)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="CAD">CAD (C$)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-white/60 font-medium">Period</label>
                <select
                  value={salaryPeriod}
                  onChange={(e) => setSalaryPeriod(e.target.value as SalaryPeriod)}
                  className="w-full px-3 py-2 bg-[#1A1D28] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]/50"
                >
                  <option value={SalaryPeriod.MONTHLY}>Monthly</option>
                  <option value={SalaryPeriod.ANNUAL}>Annual</option>
                  <option value={SalaryPeriod.WEEKLY}>Weekly</option>
                  <option value={SalaryPeriod.HOURLY}>Hourly</option>
                  <option value={SalaryPeriod.PROJECT}>Project-Based</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-white/60 font-medium">Application Deadline *</label>
                <input
                  type="date"
                  required
                  value={applicationDeadline}
                  onChange={(e) => setApplicationDeadline(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-white/60 font-medium">Program Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 12 Weeks, 6 Months, Permanent"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]/50"
                />
              </div>
            </div>
          </div>

          {/* Description & Requirements */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#50E3C2] uppercase tracking-wider">4. Description & Qualifications</h3>
            <div className="space-y-1">
              <label className="text-xs text-white/60 font-medium">Role Overview *</label>
              <textarea
                rows={4}
                required
                placeholder="Describe the opportunity, key learning outcomes, and day-to-day work..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]/50 resize-none"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-white/60 font-medium">Requirements & Qualifications</label>
                <button
                  type="button"
                  onClick={addRequirement}
                  className="text-xs text-[#50E3C2] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add item
                </button>
              </div>
              {requirements.map((req, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => updateRequirement(i, e.target.value)}
                    placeholder="e.g. Proficient with Python and Git"
                    className="flex-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]/50"
                  />
                  {requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRequirement(i)}
                      className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-white/60 font-medium">Key Skills (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="Python, React, SQL, Cloud Computing"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-white/60 font-medium">Target Courses / Majors</label>
                <input
                  type="text"
                  placeholder="Computer Science, Engineering, Business"
                  value={targetCourses}
                  onChange={(e) => setTargetCourses(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]/50"
                />
              </div>
            </div>
          </div>

          {/* Application Method & Promotion Tier */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#50E3C2] uppercase tracking-wider">5. Application Routing & Promotion</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-white/60 font-medium">Application Method</label>
                <select
                  value={applicationMethod}
                  onChange={(e) => setApplicationMethod(e.target.value as ApplicationMethod)}
                  className="w-full px-3 py-2 bg-[#1A1D28] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]/50"
                >
                  <option value={ApplicationMethod.ENERMIND}>Direct Enermind Application (Recommended)</option>
                  <option value={ApplicationMethod.EXTERNAL_URL}>External Company Portal URL</option>
                </select>
              </div>

              {applicationMethod === ApplicationMethod.EXTERNAL_URL && (
                <div className="space-y-1">
                  <label className="text-xs text-white/60 font-medium">External Application Link *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://careers.company.com/apply/123"
                    value={applicationUrl}
                    onChange={(e) => setApplicationUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]/50"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs text-white/70"
            >
              Cancel
            </button>
            <button
              id="btn-post-opportunity-submit"
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-full bg-[#50E3C2] hover:bg-[#40cbb0] text-black font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Publishing...' : 'Publish Opportunity'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

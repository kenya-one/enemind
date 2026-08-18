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
  Calendar,
  DollarSign,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  Sparkles,
  ExternalLink,
  Send,
  FileText,
  AlertTriangle,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Clock,
  HelpCircle,
  Share2,
} from 'lucide-react';
import { Opportunity, RemoteType, ApplicationMethod, ApplicationStatus } from '../../types/index.js';
import { useCurrency } from '../../context/CurrencyContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { api } from '../../services/api.js';

interface OpportunityDetailModalProps {
  opportunity: Opportunity;
  isOpen: boolean;
  onClose: () => void;
  isSaved?: boolean;
  onToggleSave: (oppId: string, e: React.MouseEvent) => void;
  onOpenReport: (opp: Opportunity) => void;
  onTriggerCareerAI: (action: string, opp: Opportunity) => void;
  onApplicationSubmitted?: () => void;
}

export function OpportunityDetailModal({
  opportunity,
  isOpen,
  onClose,
  isSaved = false,
  onToggleSave,
  onOpenReport,
  onTriggerCareerAI,
  onApplicationSubmitted,
}: OpportunityDetailModalProps) {
  const { formatPrice } = useCurrency();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'APPLY'>('OVERVIEW');
  const [applicantName, setApplicantName] = useState<string>(user?.displayName || '');
  const [applicantEmail, setApplicantEmail] = useState<string>(user?.email || '');
  const [applicantPhone, setApplicantPhone] = useState<string>(user?.phoneNumber || '');
  const [resumeFileName, setResumeFileName] = useState<string>('My_University_Resume_2026.pdf');
  const [resumeDriveLink, setResumeDriveLink] = useState<string>('');
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Format salary
  const formatSalary = () => {
    if (!opportunity.isSalaryDisclosed || !opportunity.salaryMin) {
      return 'Salary not disclosed';
    }
    const minFormatted = formatPrice(opportunity.salaryMin, opportunity.salaryCurrency || 'USD');
    const periodLabel = opportunity.salaryPeriod ? `/${opportunity.salaryPeriod.toLowerCase().replace('_', ' ')}` : '/mo';
    if (opportunity.salaryMax) {
      const maxFormatted = formatPrice(opportunity.salaryMax, opportunity.salaryCurrency || 'USD');
      return `${minFormatted} - ${maxFormatted} ${periodLabel}`;
    }
    return `${minFormatted} ${periodLabel}`;
  };

  const deadlineDate = new Date(opportunity.applicationDeadline);
  const diffDays = Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isExpired = diffDays < 0;

  async function handleApplySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!applicantName || !applicantEmail) {
      setSubmitError('Name and email are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await api.applyToOpportunity(opportunity.id, {
        applicantName,
        applicantEmail,
        applicantPhone,
        resumeFileName,
        resumeDriveLink,
        coverLetter,
      });
      setSubmitSuccess(true);
      if (onApplicationSubmitted) onApplicationSubmitted();
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit application.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        id={`modal-opp-detail-${opportunity.id}`}
        className="relative w-full max-w-3xl my-8 bg-[#12141D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Top Header / Bar */}
        <div className="p-6 border-b border-white/10 flex items-start justify-between gap-4 bg-white/[0.02]">
          <div className="flex items-start gap-4 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
              {opportunity.organizationLogo ? (
                <img
                  src={opportunity.organizationLogo}
                  alt={opportunity.organizationName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Building2 className="w-8 h-8 text-white/40" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-white/80">{opportunity.organizationName}</span>
                {opportunity.verificationStatus === 'VERIFIED' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Employer
                  </span>
                )}
                {opportunity.organizationWebsite && (
                  <a
                    href={opportunity.organizationWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-white/40 hover:text-white inline-flex items-center gap-1"
                  >
                    <span>Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <h2 className="text-xl font-bold text-white mt-1 leading-snug">{opportunity.title}</h2>

              <div className="flex items-center gap-4 text-xs text-white/60 mt-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-white/40" />
                  <span>{opportunity.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-white/40" />
                  <span>
                    {opportunity.remoteType === RemoteType.REMOTE
                      ? '100% Remote'
                      : opportunity.remoteType === RemoteType.HYBRID
                      ? 'Hybrid'
                      : 'On-site'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-white/40" />
                  <span>{opportunity.type.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id={`btn-modal-save-${opportunity.id}`}
              onClick={(e) => onToggleSave(opportunity.id, e)}
              className={`p-2 rounded-xl border transition-colors ${
                isSaved
                  ? 'bg-[#50E3C2]/20 border-[#50E3C2]/40 text-[#50E3C2]'
                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
              }`}
              title="Save opportunity"
            >
              {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
            </button>
            <button
              id="btn-close-opp-modal"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-white/5 flex items-center gap-4 bg-white/[0.01]">
          <button
            id="tab-opp-overview"
            onClick={() => setActiveTab('OVERVIEW')}
            className={`py-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'OVERVIEW'
                ? 'border-[#50E3C2] text-[#50E3C2]'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            Role Overview & Requirements
          </button>
          <button
            id="tab-opp-apply"
            onClick={() => setActiveTab('APPLY')}
            className={`py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'APPLY'
                ? 'border-[#50E3C2] text-[#50E3C2]'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <span>Apply Now</span>
            {opportunity.applicationMethod === ApplicationMethod.ENERMIND && (
              <span className="w-2 h-2 rounded-full bg-[#50E3C2]" />
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'OVERVIEW' && (
            <>
              {/* Key Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[11px] text-white/40 font-medium">Compensation</div>
                  <div className="text-sm font-bold text-white mt-0.5">{formatSalary()}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[11px] text-white/40 font-medium">Deadline</div>
                  <div className={`text-sm font-bold mt-0.5 ${diffDays <= 7 ? 'text-amber-400' : 'text-white'}`}>
                    {new Date(opportunity.applicationDeadline).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[11px] text-white/40 font-medium">Duration</div>
                  <div className="text-sm font-bold text-white mt-0.5">{opportunity.duration || 'Standard'}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[11px] text-white/40 font-medium">Applicants</div>
                  <div className="text-sm font-bold text-[#50E3C2] mt-0.5">{opportunity.applicationsCount || 0} applied</div>
                </div>
              </div>

              {/* AI Career Assistant Shortcuts */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#50E3C2]/10 to-indigo-500/10 border border-[#50E3C2]/20 space-y-3">
                <div className="flex items-center gap-2 text-[#50E3C2] text-xs font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Enermind AI Career Companion</span>
                </div>
                <p className="text-xs text-white/70">
                  Leverage Google-native AI tools to optimize your chances for this role:
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    id="btn-ai-tailor-cv"
                    onClick={() => onTriggerCareerAI('IMPROVE_CV', opportunity)}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors"
                  >
                    📄 Tailor My Resume
                  </button>
                  <button
                    id="btn-ai-cover-letter"
                    onClick={() => onTriggerCareerAI('COVER_LETTER', opportunity)}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors"
                  >
                    ✉️ Draft Cover Letter
                  </button>
                  <button
                    id="btn-ai-interview-prep"
                    onClick={() => onTriggerCareerAI('INTERVIEW_PREP', opportunity)}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors"
                  >
                    🎯 Practice Interview
                  </button>
                  <button
                    id="btn-ai-skill-gap"
                    onClick={() => onTriggerCareerAI('SKILL_GAP', opportunity)}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors"
                  >
                    📊 Skill Gap Analysis
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">About the Role</h4>
                <p className="text-xs text-white/70 leading-relaxed whitespace-pre-line">
                  {opportunity.description}
                </p>
              </div>

              {/* Responsibilities */}
              {opportunity.responsibilities && opportunity.responsibilities.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white">Key Responsibilities</h4>
                  <ul className="space-y-1.5">
                    {opportunity.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-white/70">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#50E3C2] mt-1.5 flex-shrink-0" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {opportunity.requirements && opportunity.requirements.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white">Qualifications & Requirements</h4>
                  <ul className="space-y-1.5">
                    {opportunity.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-white/70">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills & Course Targeting */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {opportunity.skills && opportunity.skills.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-white/80">Required / Desired Skills</h4>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {opportunity.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/80"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {opportunity.courseRequirements && opportunity.courseRequirements.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-white/80">Target Academic Programs</h4>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {opportunity.courseRequirements.map((course, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Safety Notice & Scam Warning */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start justify-between gap-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="text-amber-200/90 leading-relaxed">
                    <span className="font-semibold text-white">Student Safety Commitment: </span>
                    Enermind partners never charge application fees. If an employer requests money or suspicious private credentials, report them immediately.
                  </div>
                </div>
                <button
                  id="btn-report-opp"
                  onClick={() => onOpenReport(opportunity)}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold whitespace-nowrap transition-colors"
                >
                  Report
                </button>
              </div>
            </>
          )}

          {activeTab === 'APPLY' && (
            <div className="space-y-6">
              {submitSuccess ? (
                <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Application Successfully Submitted!</h3>
                  <p className="text-xs text-white/70 max-w-md mx-auto">
                    Your application for <span className="font-semibold text-white">{opportunity.title}</span> at <span className="font-semibold text-white">{opportunity.organizationName}</span> has been securely transmitted. You can track status updates in your Application Tracker.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 rounded-full bg-[#50E3C2] text-black font-bold text-xs hover:bg-[#40cbb0] transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : opportunity.applicationMethod === ApplicationMethod.EXTERNAL_URL ? (
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center space-y-4">
                  <ExternalLink className="w-10 h-10 text-[#50E3C2] mx-auto" />
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white">External Employer Application</h3>
                    <p className="text-xs text-white/60 max-w-md mx-auto">
                      This verified employer accepts applications directly via their official recruitment portal.
                    </p>
                  </div>

                  <a
                    id="btn-apply-external-link"
                    href={opportunity.applicationUrl || opportunity.organizationWebsite || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#50E3C2] hover:bg-[#40cbb0] text-black font-bold text-xs transition-colors"
                  >
                    <span>Proceed to Official Application Portal</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white">Submit Enermind Application</h3>
                    <p className="text-xs text-white/50">
                      Apply directly with your verified student profile and credentials.
                    </p>
                  </div>

                  {submitError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                      {submitError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-white/60 font-medium">Full Name</label>
                      <input
                        type="text"
                        required
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-white/60 font-medium">Email Address</label>
                      <input
                        type="email"
                        required
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-white/60 font-medium">Phone Number (Optional)</label>
                      <input
                        type="tel"
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-white/60 font-medium">Resume / CV Document</label>
                      <input
                        type="text"
                        value={resumeFileName}
                        onChange={(e) => setResumeFileName(e.target.value)}
                        placeholder="Resume_Name.pdf or Drive link"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-white/60 font-medium">Cover Letter / Note to Hiring Team</label>
                      <button
                        type="button"
                        onClick={() => onTriggerCareerAI('COVER_LETTER', opportunity)}
                        className="text-[11px] text-[#50E3C2] hover:underline flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        Draft with AI
                      </button>
                    </div>
                    <textarea
                      rows={4}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Highlight relevant projects, coursework, or why you are excited about this opportunity..."
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]/50 resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab('OVERVIEW')}
                      className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs text-white/70"
                    >
                      Back to Overview
                    </button>
                    <button
                      id="btn-submit-app-confirm"
                      type="submit"
                      disabled={isSubmitting || isExpired}
                      className="px-6 py-2 rounded-full bg-[#50E3C2] hover:bg-[#40cbb0] text-black font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Submitting...' : 'Submit Application'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="p-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between gap-3 text-xs">
          <div className="text-white/40">
            {opportunity.country} • {opportunity.city}
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'OVERVIEW' && (
              <button
                id="btn-footer-apply"
                onClick={() => setActiveTab('APPLY')}
                className="px-5 py-2 rounded-full bg-[#50E3C2] hover:bg-[#40cbb0] text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
              >
                <span>Apply for this Role</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Clock,
  ShieldCheck,
  Globe,
  Building2,
} from 'lucide-react';
import { Opportunity, OpportunityType, RemoteType } from '../../types/index.js';
import { useCurrency } from '../../context/CurrencyContext.js';

interface OpportunityCardProps {
  key?: React.Key;
  opportunity: Opportunity;
  isSaved?: boolean;
  onSelect: (opp: Opportunity) => void;
  onToggleSave: (oppId: string, e: React.MouseEvent) => void;
  onApplyDirect?: (opp: Opportunity, e: React.MouseEvent) => void;
  matchScore?: number;
  matchReasons?: string[];
}

export function OpportunityCard({
  opportunity,
  isSaved = false,
  onSelect,
  onToggleSave,
  onApplyDirect,
  matchScore,
  matchReasons,
}: OpportunityCardProps) {
  const { formatPrice } = useCurrency();

  // Calculate days left
  const deadlineDate = new Date(opportunity.applicationDeadline);
  const now = new Date();
  const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isClosingSoon = diffDays > 0 && diffDays <= 7;
  const isExpired = diffDays < 0;

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

  const getTypeBadgeColor = (type: OpportunityType) => {
    switch (type) {
      case OpportunityType.INTERNSHIP:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case OpportunityType.ATTACHMENT:
        return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
      case OpportunityType.GRADUATE_PROGRAM:
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case OpportunityType.CAMPUS_JOB:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case OpportunityType.FREELANCE:
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case OpportunityType.SCHOLARSHIP:
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  return (
    <div
      id={`opportunity-card-${opportunity.id}`}
      onClick={() => onSelect(opportunity)}
      className="group relative p-5 rounded-2xl bg-[#12141D] border border-white/5 hover:border-[#50E3C2]/40 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4 shadow-lg hover:shadow-xl hover:shadow-[#50E3C2]/5"
    >
      {/* Top Banner / Match reason if provided */}
      {matchReasons && matchReasons.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#50E3C2]/10 border border-[#50E3C2]/20 text-[#50E3C2] text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{matchReasons[0]}</span>
          {matchScore && (
            <span className="ml-auto text-[11px] font-bold px-1.5 py-0.5 rounded bg-[#50E3C2]/20 text-[#50E3C2]">
              {matchScore}% Match
            </span>
          )}
        </div>
      )}

      {/* Header Info */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {/* Logo or Icon */}
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
            {opportunity.organizationLogo ? (
              <img
                src={opportunity.organizationLogo}
                alt={opportunity.organizationName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <Building2 className="w-6 h-6 text-white/40" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-white/80 hover:text-white truncate">
                {opportunity.organizationName}
              </span>
              {opportunity.verificationStatus === 'VERIFIED' && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-medium" title="Verified Employer">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </span>
              )}
              {opportunity.isPromoted && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-medium">
                  ⭐ Featured
                </span>
              )}
            </div>

            <h3 className="text-base font-bold text-white group-hover:text-[#50E3C2] transition-colors leading-snug mt-0.5 line-clamp-1">
              {opportunity.title}
            </h3>

            <div className="flex items-center gap-3 text-xs text-white/50 mt-1 flex-wrap">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-white/40" />
                <span className="truncate">{opportunity.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-white/40" />
                <span>
                  {opportunity.remoteType === RemoteType.REMOTE
                    ? 'Remote'
                    : opportunity.remoteType === RemoteType.HYBRID
                    ? 'Hybrid'
                    : 'On-site'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bookmark Action */}
        <button
          id={`btn-save-opp-${opportunity.id}`}
          onClick={(e) => onToggleSave(opportunity.id, e)}
          className={`p-2 rounded-xl transition-colors ${
            isSaved
              ? 'bg-[#50E3C2]/20 text-[#50E3C2]'
              : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
          }`}
          title={isSaved ? 'Saved opportunity' : 'Save opportunity'}
        >
          {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        </button>
      </div>

      {/* Description Snippet */}
      <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
        {opportunity.description}
      </p>

      {/* Skills Chips */}
      {opportunity.skills && opportunity.skills.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {opportunity.skills.slice(0, 4).map((skill, i) => (
            <span
              key={i}
              className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-white/70"
            >
              {skill}
            </span>
          ))}
          {opportunity.skills.length > 4 && (
            <span className="text-[11px] text-white/40">
              +{opportunity.skills.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Footer / Compensation & Apply */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-3 text-xs">
        <div className="min-w-0">
          <div className="font-semibold text-white truncate">
            {formatSalary()}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-white/40 mt-0.5">
            <Clock className="w-3 h-3" />
            {isExpired ? (
              <span className="text-rose-400">Applications Closed</span>
            ) : isClosingSoon ? (
              <span className="text-amber-400 font-medium">Closes in {diffDays} {diffDays === 1 ? 'day' : 'days'}</span>
            ) : (
              <span>Closes {new Date(opportunity.applicationDeadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full border text-[11px] font-medium whitespace-nowrap ${getTypeBadgeColor(opportunity.type)}`}>
            {opportunity.type.replace('_', ' ')}
          </span>

          <button
            id={`btn-view-opp-${opportunity.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(opportunity);
            }}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#50E3C2] text-white hover:text-black font-semibold text-xs flex items-center gap-1 transition-all"
          >
            <span>View</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

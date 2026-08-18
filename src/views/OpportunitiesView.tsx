/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  Sparkles,
  MapPin,
  Globe,
  DollarSign,
  Bookmark,
  Send,
  Plus,
  User,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  ArrowUpDown,
  FileText,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Award,
  BookOpen,
} from 'lucide-react';
import {
  Opportunity,
  OpportunityType,
  RemoteType,
  ApplicationStatus,
  OpportunityApplication,
} from '../types/index.js';
import { api } from '../services/api.js';
import { useCurrency } from '../context/CurrencyContext.js';
import { useAuth } from '../context/AuthContext.js';
import { OpportunityCard } from '../components/opportunities/OpportunityCard.js';
import { OpportunityDetailModal } from '../components/opportunities/OpportunityDetailModal.js';
import { PostOpportunityModal } from '../components/opportunities/PostOpportunityModal.js';
import { CareerAIModal } from '../components/opportunities/CareerAIModal.js';
import { ReportOpportunityModal } from '../components/opportunities/ReportOpportunityModal.js';
import { CareerProfileModal } from '../components/opportunities/CareerProfileModal.js';

export function OpportunitiesView() {
  const { activeRate, formatPrice, convertPrice } = useCurrency();
  const { user } = useAuth();

  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<
    'DISCOVER' | 'RECOMMENDED' | 'APPLICATIONS' | 'SAVED' | 'EMPLOYER'
  >('DISCOVER');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedRemote, setSelectedRemote] = useState<string>('ALL');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Data State
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [recommendedOpportunities, setRecommendedOpportunities] = useState<
    Array<{ opportunity: Opportunity; score: number; matchReasons: string[] }>
  >([]);
  const [applications, setApplications] = useState<OpportunityApplication[]>([]);
  const [savedOpportunities, setSavedOpportunities] = useState<Opportunity[]>([]);
  const [savedOppIds, setSavedOppIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState<boolean>(false);
  const [isCareerAIModalOpen, setIsCareerAIModalOpen] = useState<boolean>(false);
  const [aiModalAction, setAiModalAction] = useState<string>('COVER_LETTER');
  const [aiTargetOpportunity, setAiTargetOpportunity] = useState<Opportunity | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [reportTargetOpportunity, setReportTargetOpportunity] = useState<Opportunity | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Load initial data
  useEffect(() => {
    loadOpportunities();
    loadSavedOpportunities();
  }, [selectedType, selectedRemote, sortBy]);

  // Load contextual data when tabs switch
  useEffect(() => {
    if (activeTab === 'RECOMMENDED') {
      loadRecommendations();
    } else if (activeTab === 'APPLICATIONS') {
      loadApplications();
    } else if (activeTab === 'SAVED') {
      loadSavedOpportunities();
    }
  }, [activeTab]);

  async function loadOpportunities() {
    try {
      setIsLoading(true);
      const params: any = {
        q: searchQuery || undefined,
        type: selectedType !== 'ALL' ? selectedType : undefined,
        remoteType: selectedRemote !== 'ALL' ? selectedRemote : undefined,
        country: selectedCountry || undefined,
        currency: activeRate?.code || 'USD',
        sortBy,
      };
      const data = await api.searchOpportunities(params);
      setOpportunities(data.opportunities || []);
      setTotalCount(data.total || 0);
    } catch (err) {
      console.error('Failed to search opportunities:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadRecommendations() {
    try {
      setIsLoading(true);
      const data = await api.getRecommendedOpportunities();
      setRecommendedOpportunities(data.recommendations || []);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadApplications() {
    try {
      setIsLoading(true);
      const data = await api.getStudentApplications();
      setApplications(data.applications || []);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadSavedOpportunities() {
    try {
      const data = await api.getSavedOpportunities();
      const list = data.saved || [];
      setSavedOpportunities(list);
      setSavedOppIds(new Set(list.map((o) => o.id)));
    } catch (err) {
      console.error('Failed to load saved opportunities:', err);
    }
  }

  async function handleToggleSave(oppId: string, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      const res = await api.toggleSaveOpportunity(oppId);
      const next = new Set(savedOppIds);
      if (res.isSaved) {
        next.add(oppId);
      } else {
        next.delete(oppId);
      }
      setSavedOppIds(next);
      loadSavedOpportunities();
    } catch (err) {
      console.error('Failed to toggle save:', err);
    }
  }

  function handleOpenDetail(opp: Opportunity) {
    setSelectedOpportunity(opp);
    setIsDetailModalOpen(true);
  }

  function handleTriggerAI(action: string, opp: Opportunity) {
    setAiModalAction(action);
    setAiTargetOpportunity(opp);
    setIsCareerAIModalOpen(true);
  }

  function handleOpenReport(opp: Opportunity) {
    setReportTargetOpportunity(opp);
    setIsReportModalOpen(true);
  }

  async function handleWithdrawApp(appId: string) {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    try {
      await api.withdrawApplication(appId);
      loadApplications();
    } catch (err) {
      console.error('Failed to withdraw application:', err);
    }
  }

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.ACCEPTED:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case ApplicationStatus.INTERVIEW:
        return 'bg-[#50E3C2]/10 text-[#50E3C2] border-[#50E3C2]/20';
      case ApplicationStatus.SHORTLISTED:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case ApplicationStatus.UNDER_REVIEW:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case ApplicationStatus.REJECTED:
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case ApplicationStatus.WITHDRAWN:
        return 'bg-white/5 text-white/40 border-white/10';
      default:
        return 'bg-white/10 text-white/70 border-white/10';
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner / Hero Header */}
      <div className="p-6 rounded-2xl bg-[#12141D] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#50E3C2]/10 text-[#50E3C2] flex items-center justify-center border border-[#50E3C2]/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Global Opportunities & Internships
              </h1>
            </div>
          </div>
          <p className="text-xs text-white/50 max-w-xl">
            Verified student internships, academic attachments, graduate programs, and campus jobs tailored to your university discipline.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="btn-open-career-profile"
            onClick={() => setIsProfileModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
          >
            <User className="w-3.5 h-3.5 text-[#50E3C2]" />
            <span>Career Profile</span>
          </button>

          <button
            id="btn-open-ai-companion"
            onClick={() => {
              setAiTargetOpportunity(null);
              setAiModalAction('COVER_LETTER');
              setIsCareerAIModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#50E3C2]/20 to-indigo-500/20 hover:from-[#50E3C2]/30 hover:to-indigo-500/30 border border-[#50E3C2]/30 text-xs font-semibold text-[#50E3C2] flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Companion</span>
          </button>

          <button
            id="btn-post-opp-open"
            onClick={() => setIsPostModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#50E3C2] hover:bg-[#40cbb0] text-black font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-[#50E3C2]/10"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post Opportunity</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'DISCOVER', label: 'Discover Roles', icon: Search, count: totalCount },
          { id: 'RECOMMENDED', label: 'AI Recommended', icon: Sparkles },
          { id: 'APPLICATIONS', label: 'My Applications', icon: Send, count: applications.length },
          { id: 'SAVED', label: 'Saved Roles', icon: Bookmark, count: savedOpportunities.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-opp-${tab.id.toLowerCase()}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white text-black shadow-md'
                  : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-black/10 text-black' : 'bg-white/10 text-white/80'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: DISCOVER */}
      {activeTab === 'DISCOVER' && (
        <div className="space-y-5">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-white/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="input-search-opportunities"
                type="text"
                placeholder="Search by role title, organization, skills, or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') loadOpportunities();
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#50E3C2]/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-search-exec"
                onClick={loadOpportunities}
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
              >
                Search
              </button>

              <button
                id="btn-toggle-filters"
                onClick={() => setShowFilters(!showFilters)}
                className={`px-3 py-2.5 rounded-2xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  showFilters
                    ? 'bg-[#50E3C2]/20 border-[#50E3C2]/40 text-[#50E3C2]'
                    : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Quick Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'ALL', label: 'All Roles' },
              { id: 'INTERNSHIP', label: 'Internships' },
              { id: 'ATTACHMENT', label: 'Attachments' },
              { id: 'GRADUATE_PROGRAM', label: 'Graduate Programs' },
              { id: 'CAMPUS_JOB', label: 'Campus Work' },
              { id: 'FREELANCE', label: 'Freelance & Projects' },
              { id: 'JOB', label: 'Full / Part Time' },
              { id: 'SCHOLARSHIP', label: 'Scholarships' },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedType === type.id
                    ? 'bg-[#50E3C2] text-black font-bold'
                    : 'bg-white/5 text-white/60 hover:text-white border border-white/5'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Expanded Filters Drawer */}
          {showFilters && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-white/50 font-medium">Workplace Mode</label>
                <select
                  value={selectedRemote}
                  onChange={(e) => setSelectedRemote(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1A1D28] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]/50"
                >
                  <option value="ALL">All Modes (Remote + Hybrid + On-site)</option>
                  <option value="REMOTE">100% Remote</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="ON_SITE">On-Site Only</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-white/50 font-medium">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1A1D28] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#50E3C2]/50"
                >
                  <option value="newest">Recently Posted</option>
                  <option value="closing_soon">Closing Soon</option>
                  <option value="salary_high">Highest Salary</option>
                  <option value="popular">Most Applied</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedType('ALL');
                    setSelectedRemote('ALL');
                    setSelectedCountry('');
                    setSearchQuery('');
                    setSortBy('newest');
                  }}
                  className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs text-white/60 hover:text-white transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          )}

          {/* Results Grid */}
          {isLoading ? (
            <div className="p-16 text-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#50E3C2] border-t-transparent animate-spin mx-auto" />
              <p className="text-xs text-white/40">Loading opportunities...</p>
            </div>
          ) : opportunities.length === 0 ? (
            <div className="p-16 rounded-2xl bg-white/5 border border-white/10 text-center space-y-3">
              <Briefcase className="w-12 h-12 text-white/20 mx-auto" />
              <h3 className="text-base font-bold text-white">No Opportunities Found</h3>
              <p className="text-xs text-white/50 max-w-sm mx-auto">
                No active listings match your current filters. Try broadening your search or resetting filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {opportunities.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  isSaved={savedOppIds.has(opp.id)}
                  onSelect={handleOpenDetail}
                  onToggleSave={handleToggleSave}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: RECOMMENDED */}
      {activeTab === 'RECOMMENDED' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#50E3C2]/10 to-indigo-500/10 border border-[#50E3C2]/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-[#50E3C2] flex-shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-white">AI-Powered Career Matching</h3>
                <p className="text-xs text-white/60">
                  Matches based on your university major, registered skills, and career preferences.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white whitespace-nowrap transition-colors"
            >
              Tune Preferences
            </button>
          </div>

          {isLoading ? (
            <div className="p-16 text-center">
              <div className="w-8 h-8 rounded-full border-2 border-[#50E3C2] border-t-transparent animate-spin mx-auto" />
            </div>
          ) : recommendedOpportunities.length === 0 ? (
            <div className="p-12 rounded-2xl bg-white/5 border border-white/10 text-center space-y-3">
              <Award className="w-10 h-10 text-white/30 mx-auto" />
              <h3 className="text-sm font-bold text-white">No Tailored Recommendations Yet</h3>
              <p className="text-xs text-white/50 max-w-sm mx-auto">
                Update your Career Profile with your skills and target roles to unlock personalized match scores.
              </p>
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="px-4 py-2 rounded-full bg-[#50E3C2] text-black font-bold text-xs"
              >
                Set Up Career Profile
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedOpportunities.map(({ opportunity, score, matchReasons }) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  isSaved={savedOppIds.has(opportunity.id)}
                  onSelect={handleOpenDetail}
                  onToggleSave={handleToggleSave}
                  matchScore={score}
                  matchReasons={matchReasons}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: APPLICATIONS */}
      {activeTab === 'APPLICATIONS' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Application Status Tracker</h3>
              <p className="text-xs text-white/40">
                Track all submitted applications and direct employer updates.
              </p>
            </div>
            <button
              onClick={loadApplications}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {isLoading ? (
            <div className="p-16 text-center">
              <div className="w-8 h-8 rounded-full border-2 border-[#50E3C2] border-t-transparent animate-spin mx-auto" />
            </div>
          ) : applications.length === 0 ? (
            <div className="p-12 rounded-2xl bg-white/5 border border-white/10 text-center space-y-3">
              <Send className="w-10 h-10 text-white/20 mx-auto" />
              <h3 className="text-sm font-bold text-white">No Applications Submitted</h3>
              <p className="text-xs text-white/50 max-w-sm mx-auto">
                Explore the discovery feed and submit direct applications with your verified student profile.
              </p>
              <button
                onClick={() => setActiveTab('DISCOVER')}
                className="px-4 py-2 rounded-full bg-[#50E3C2] text-black font-bold text-xs"
              >
                Browse Roles
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="p-5 rounded-2xl bg-[#12141D] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white/60">{app.organizationName}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        {app.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white">{app.opportunityTitle}</h4>

                    <div className="flex items-center gap-4 text-xs text-white/40">
                      <span>Submitted: {new Date(app.appliedAt).toLocaleDateString()}</span>
                      {app.resumeFileName && <span>Resume: {app.resumeFileName}</span>}
                    </div>

                    {app.employerNotes && (
                      <div className="mt-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80">
                        <span className="font-semibold text-[#50E3C2]">Employer Note: </span>
                        {app.employerNotes}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {app.status !== ApplicationStatus.WITHDRAWN &&
                      app.status !== ApplicationStatus.REJECTED && (
                        <button
                          onClick={() => handleWithdrawApp(app.id)}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold transition-colors"
                        >
                          Withdraw
                        </button>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: SAVED */}
      {activeTab === 'SAVED' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-sm font-bold text-white">Bookmarked Opportunities</h3>
            <p className="text-xs text-white/40">Keep track of upcoming deadlines and roles to apply for.</p>
          </div>

          {savedOpportunities.length === 0 ? (
            <div className="p-12 rounded-2xl bg-white/5 border border-white/10 text-center space-y-3">
              <Bookmark className="w-10 h-10 text-white/20 mx-auto" />
              <h3 className="text-sm font-bold text-white">No Saved Roles</h3>
              <p className="text-xs text-white/50 max-w-sm mx-auto">
                Bookmark interesting opportunities from the Discovery feed to access them later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedOpportunities.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  isSaved={true}
                  onSelect={handleOpenDetail}
                  onToggleSave={handleToggleSave}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODALS */}
      {selectedOpportunity && (
        <OpportunityDetailModal
          opportunity={selectedOpportunity}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          isSaved={savedOppIds.has(selectedOpportunity.id)}
          onToggleSave={handleToggleSave}
          onOpenReport={handleOpenReport}
          onTriggerCareerAI={handleTriggerAI}
          onApplicationSubmitted={() => {
            loadApplications();
          }}
        />
      )}

      <PostOpportunityModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSuccess={() => {
          setIsPostModalOpen(false);
          loadOpportunities();
        }}
      />

      <CareerAIModal
        isOpen={isCareerAIModalOpen}
        onClose={() => setIsCareerAIModalOpen(false)}
        initialAction={aiModalAction}
        targetOpportunity={aiTargetOpportunity}
      />

      <ReportOpportunityModal
        opportunity={reportTargetOpportunity}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      <CareerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSaved={() => {
          if (activeTab === 'RECOMMENDED') loadRecommendations();
        }}
      />
    </div>
  );
}

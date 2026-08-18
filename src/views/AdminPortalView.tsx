/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  Shield,
  Building,
  Building2,
  Briefcase,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  History,
  RefreshCw,
  ExternalLink,
  MapPin,
  GitMerge,
  MessageSquare,
  ShieldCheck,
  ShieldAlert,
  FileText,
  Lock,
  DollarSign,
  BedDouble,
  Eye,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import {
  Institution,
  AuditLogEntry,
  UserRole,
  InstitutionStatus,
  CampusSubmission,
  AccommodationListing,
} from '../types/index.js';

export function AdminPortalView() {
  const { user } = useAuth();
  const [overview, setOverview] = useState<any>(null);
  const [pendingInstitutions, setPendingInstitutions] = useState<Institution[]>([]);
  const [pendingCampuses, setPendingCampuses] = useState<CampusSubmission[]>([]);
  const [pendingAccommodation, setPendingAccommodation] = useState<AccommodationListing[]>([]);
  const [pendingVerifications, setPendingVerifications] = useState<AccommodationListing[]>([]);
  const [accommodationReports, setAccommodationReports] = useState<any[]>([]);
  const [pendingOpportunities, setPendingOpportunities] = useState<any[]>([]);
  const [pendingEmployers, setPendingEmployers] = useState<any[]>([]);
  const [opportunityReports, setOpportunityReports] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'OPPORTUNITIES' | 'EMPLOYERS' | 'ACCOMMODATION' | 'VERIFICATIONS' | 'REPORTS' | 'INSTITUTIONS' | 'CAMPUSES'
  >('OPPORTUNITIES');

  const isAdmin =
    user?.role === UserRole.ADMIN ||
    user?.role === UserRole.SUPER_ADMIN ||
    user?.role === UserRole.MODERATOR ||
    user?.role === UserRole.INSTITUTION_ADMIN;

  useEffect(() => {
    loadAdminData();
  }, []);

  async function loadAdminData() {
    try {
      const [
        overviewData,
        pendingInstData,
        campusData,
        logsData,
        pendingAccData,
        pendingVerifData,
        reportsData,
        pendingOppData,
        pendingEmpData,
        oppReportsData,
      ] = await Promise.all([
        api.getAdminOverview().catch(() => ({ overview: null })),
        api.getPendingInstitutions().catch(() => ({ pending: [] })),
        api.getPendingCampuses().catch(() => ({ pending: [] })),
        api.getAuditLogs(25).catch(() => ({ logs: [] })),
        api.getPendingAccommodation().catch(() => ({ pending: [] })),
        api.getPendingAccommodationVerifications().catch(() => ({ verifications: [] })),
        api.getAccommodationReports().catch(() => ({ reports: [] })),
        api.getPendingOpportunities().catch(() => ({ pending: [] })),
        api.getPendingEmployerVerifications().catch(() => ({ verifications: [] })),
        api.getOpportunityReports().catch(() => ({ reports: [] })),
      ]);

      setOverview(overviewData.overview);
      setPendingInstitutions(pendingInstData.pending || []);
      setPendingCampuses(campusData.pending || []);
      setAuditLogs(logsData.logs || []);
      setPendingAccommodation(pendingAccData.pending || []);
      setPendingVerifications(pendingVerifData.verifications || []);
      setAccommodationReports(reportsData.reports || []);
      setPendingOpportunities(pendingOppData.pending || []);
      setPendingEmployers(pendingEmpData.verifications || []);
      setOpportunityReports(oppReportsData.reports || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  }

  async function handleReviewOpportunity(oppId: string, action: 'APPROVE' | 'REJECT') {
    try {
      setIsProcessing(oppId);
      await api.reviewOpportunity({
        opportunityId: oppId,
        action,
        moderatorNotes: reviewNotes[oppId] || undefined,
      });
      await loadAdminData();
    } catch (err) {
      console.error('Opportunity review failed:', err);
    } finally {
      setIsProcessing(null);
    }
  }

  async function handleVerifyEmployer(orgId: string, decision: 'VERIFY' | 'REJECT') {
    try {
      setIsProcessing(orgId);
      await api.verifyEmployer({
        organizationId: orgId,
        decision,
        notes: reviewNotes[orgId] || undefined,
      });
      await loadAdminData();
    } catch (err) {
      console.error('Employer verification failed:', err);
    } finally {
      setIsProcessing(null);
    }
  }

  async function handleActionOpportunityReport(reportId: string, action: 'DISMISS' | 'WARN_EMPLOYER' | 'TAKEDOWN_OPPORTUNITY') {
    try {
      setIsProcessing(reportId);
      await api.actionOpportunityReport(reportId, action, reviewNotes[reportId] || undefined);
      await loadAdminData();
    } catch (err) {
      console.error('Action opportunity report failed:', err);
    } finally {
      setIsProcessing(null);
    }
  }

  async function handleReviewInstitution(instId: string, newStatus: InstitutionStatus, targetMergeId?: string) {
    if (!user) return;
    try {
      setIsProcessing(instId);
      await api.reviewInstitution({
        institutionId: instId,
        newStatus,
        reviewerUserId: user.id,
        reviewerEmail: user.email,
        reviewerNotes: reviewNotes[instId] || `Marked status as ${newStatus} in admin portal.`,
        targetMergeId,
      });
      await loadAdminData();
    } catch (err) {
      console.error('Institution review failed:', err);
    } finally {
      setIsProcessing(null);
    }
  }

  async function handleReviewCampus(submissionId: string, action: 'APPROVE' | 'REJECT') {
    try {
      setIsProcessing(submissionId);
      await api.reviewCampus(submissionId, action);
      await loadAdminData();
    } catch (err) {
      console.error('Campus review failed:', err);
    } finally {
      setIsProcessing(null);
    }
  }

  async function handleReviewAccommodation(propertyId: string, action: 'APPROVE' | 'REJECT') {
    try {
      setIsProcessing(propertyId);
      await api.reviewAccommodation({
        propertyId,
        action,
        moderatorNotes: reviewNotes[propertyId] || `Moderator set status to ${action}`,
      });
      await loadAdminData();
    } catch (err) {
      console.error('Accommodation review failed:', err);
    } finally {
      setIsProcessing(null);
    }
  }

  async function handleVerifyAccommodation(propertyId: string, decision: 'VERIFY' | 'REJECT') {
    try {
      setIsProcessing(propertyId);
      await api.verifyAccommodation({
        propertyId,
        decision,
        rejectionReason: reviewNotes[propertyId] || undefined,
      });
      await loadAdminData();
    } catch (err) {
      console.error('Accommodation verification failed:', err);
    } finally {
      setIsProcessing(null);
    }
  }

  async function handleActionReport(reportId: string, action: 'DISMISS' | 'WARN_OWNER' | 'TAKEDOWN_LISTING') {
    try {
      setIsProcessing(reportId);
      await api.actionAccommodationReport(
        reportId,
        action,
        reviewNotes[reportId] || `Moderator action: ${action}`
      );
      await loadAdminData();
    } catch (err) {
      console.error('Actioning report failed:', err);
    } finally {
      setIsProcessing(null);
    }
  }

  if (!isAdmin) {
    return (
      <div className="p-8 rounded-3xl bg-[#12141D] border border-white/10 text-center space-y-4 max-w-lg mx-auto mt-12">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Restricted Access (RBAC Required)</h2>
        <p className="text-xs text-white/50 leading-relaxed">
          The Admin Moderation Queue is restricted to verified campus moderators and platform administrators. Switch roles in the user profile menu to test this portal.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#12141D] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Shield className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">Campus Moderation & Governance Queue</h2>
          </div>
          <p className="text-xs text-white/40">
            Review accommodation listings, verify property deeds and ID, inspect scam reports, and audit institutional integrity.
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-[#12141D] border border-white/5">
          <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Pending Listings</span>
          <p className="text-xl font-bold text-amber-400 mt-1">{pendingAccommodation.length}</p>
          <span className="text-[10px] text-white/40 font-mono">Housing Queue</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#12141D] border border-white/5">
          <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Deed Verifications</span>
          <p className="text-xl font-bold text-[#50E3C2] mt-1">{pendingVerifications.length}</p>
          <span className="text-[10px] text-emerald-400 font-mono">Trust Vault</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#12141D] border border-white/5">
          <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Flagged Reports</span>
          <p className="text-xl font-bold text-rose-400 mt-1">{accommodationReports.length}</p>
          <span className="text-[10px] text-rose-400/80 font-mono">Scam & Abuse</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#12141D] border border-white/5">
          <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Institutions</span>
          <p className="text-xl font-bold text-white mt-1">{pendingInstitutions.length}</p>
          <span className="text-[10px] text-white/40 font-mono">Pending Approval</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#12141D] border border-white/5">
          <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Audit Trail</span>
          <p className="text-xl font-bold text-white mt-1">{auditLogs.length}</p>
          <span className="text-[10px] text-white/40 font-mono">Recent Actions</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('OPPORTUNITIES')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'OPPORTUNITIES'
              ? 'bg-[#50E3C2] text-[#0A0B10]'
              : 'bg-white/5 text-white/60 hover:text-white'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Opportunities Queue ({pendingOpportunities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('EMPLOYERS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'EMPLOYERS'
              ? 'bg-[#50E3C2] text-[#0A0B10]'
              : 'bg-white/5 text-white/60 hover:text-white'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Employer Verifications ({pendingEmployers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ACCOMMODATION')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'ACCOMMODATION'
              ? 'bg-[#50E3C2] text-[#0A0B10]'
              : 'bg-white/5 text-white/60 hover:text-white'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Housing Listings ({pendingAccommodation.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('VERIFICATIONS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'VERIFICATIONS'
              ? 'bg-[#50E3C2] text-[#0A0B10]'
              : 'bg-white/5 text-white/60 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Property Deeds ({pendingVerifications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('REPORTS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'REPORTS'
              ? 'bg-[#50E3C2] text-[#0A0B10]'
              : 'bg-white/5 text-white/60 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Reports & Safety ({accommodationReports.length + opportunityReports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('INSTITUTIONS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'INSTITUTIONS'
              ? 'bg-[#50E3C2] text-[#0A0B10]'
              : 'bg-white/5 text-white/60 hover:text-white'
          }`}
        >
          Institutions ({pendingInstitutions.length})
        </button>

        <button
          onClick={() => setActiveTab('CAMPUSES')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'CAMPUSES'
              ? 'bg-[#50E3C2] text-[#0A0B10]'
              : 'bg-white/5 text-white/60 hover:text-white'
          }`}
        >
          Campuses ({pendingCampuses.length})
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Submissions Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* TAB: OPPORTUNITIES */}
          {activeTab === 'OPPORTUNITIES' && (
            <div className="p-6 rounded-2xl bg-[#12141D] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#50E3C2]" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">
                    Pending Opportunity Listings ({pendingOpportunities.length})
                  </h3>
                </div>
              </div>

              {pendingOpportunities.length === 0 ? (
                <div className="p-8 rounded-xl bg-white/5 border border-white/5 text-center text-xs text-white/40 space-y-1">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto opacity-40" />
                  <p>All submitted opportunities have been reviewed. Queue is clear!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingOpportunities.map((opp) => (
                    <div key={opp.id} className="p-5 rounded-xl bg-white/5 border border-white/5 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/60 text-[#50E3C2]">
                              {opp.type}
                            </span>
                            <span className="text-xs text-white/60">{opp.organizationName}</span>
                          </div>
                          <h4 className="text-sm font-bold text-white mt-1">{opp.title}</h4>
                          <p className="text-xs text-white/50">{opp.location} • {opp.salaryCurrency} {opp.salaryMin ? opp.salaryMin.toLocaleString() : 'N/A'}</p>
                        </div>
                      </div>

                      <p className="text-xs text-white/70 bg-black/30 p-3 rounded-lg border border-white/5 line-clamp-3">
                        {opp.description}
                      </p>

                      <div className="space-y-2 pt-2 border-t border-white/5">
                        <input
                          type="text"
                          placeholder="Moderator notes..."
                          value={reviewNotes[opp.id] || ''}
                          onChange={(e) => setReviewNotes({ ...reviewNotes, [opp.id]: e.target.value })}
                          className="w-full bg-[#0A0B10] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#50E3C2]"
                        />

                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleReviewOpportunity(opp.id, 'REJECT')}
                            disabled={isProcessing === opp.id}
                            className="px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold rounded-lg"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleReviewOpportunity(opp.id, 'APPROVE')}
                            disabled={isProcessing === opp.id}
                            className="px-4 py-1.5 bg-[#50E3C2] hover:bg-[#38cbb0] text-black text-xs font-bold rounded-lg"
                          >
                            Approve & Publish
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: EMPLOYER VERIFICATIONS */}
          {activeTab === 'EMPLOYERS' && (
            <div className="p-6 rounded-2xl bg-[#12141D] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#50E3C2]" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">
                    Employer Identity & Tax Verification Queue ({pendingEmployers.length})
                  </h3>
                </div>
              </div>

              {pendingEmployers.length === 0 ? (
                <div className="p-8 rounded-xl bg-white/5 border border-white/5 text-center text-xs text-white/40 space-y-1">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto opacity-40" />
                  <p>All employer verification requests have been processed.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingEmployers.map((org) => (
                    <div key={org.id} className="p-5 rounded-xl bg-white/5 border border-white/5 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-bold text-white">{org.name}</h4>
                          <p className="text-xs text-white/60">{org.industry} • {org.headquarters} • {org.website}</p>
                          <p className="text-[11px] text-white/40 mt-1">Tax ID: {org.taxId || 'Pending'} • Reg No: {org.registrationNumber || 'Pending'}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                        <button
                          onClick={() => handleVerifyEmployer(org.id, 'REJECT')}
                          disabled={isProcessing === org.id}
                          className="px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold rounded-lg"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleVerifyEmployer(org.id, 'VERIFY')}
                          disabled={isProcessing === org.id}
                          className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg"
                        >
                          Grant Verified Badge
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {/* TAB: ACCOMMODATION LISTINGS */}
          {activeTab === 'ACCOMMODATION' && (
            <div className="p-6 rounded-2xl bg-[#12141D] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#50E3C2]" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">
                    Housing Listings Awaiting Moderation ({pendingAccommodation.length})
                  </h3>
                </div>
              </div>

              {pendingAccommodation.length === 0 ? (
                <div className="p-8 rounded-xl bg-white/5 border border-white/5 text-center text-xs text-white/40 space-y-1">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto opacity-40" />
                  <p>All accommodation listings have been reviewed and published.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingAccommodation.map((prop) => (
                    <div key={prop.id} className="p-5 rounded-xl bg-white/5 border border-white/5 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-black/60 text-[#50E3C2] border border-white/10">
                              {prop.propertyType.replace('_', ' ')}
                            </span>
                            <span className="text-[10px] text-white/50">{prop.city}, {prop.country}</span>
                          </div>
                          <h4 className="text-sm font-bold text-white">{prop.title}</h4>
                          <p className="text-xs text-white/60">
                            {prop.address} • <strong className="text-white">{prop.currency} {prop.price.toLocaleString()}/mo</strong> • {prop.availableUnits} of {prop.totalUnits} units
                          </p>
                        </div>

                        <div className="text-right text-[11px] text-white/40">
                          <div>Owner: <span className="text-white font-medium">{prop.ownerName}</span></div>
                          <div>Campus: {prop.primaryCampusName || 'Main'}</div>
                        </div>
                      </div>

                      <p className="text-xs text-white/70 bg-black/30 p-3 rounded-lg border border-white/5">
                        {prop.description}
                      </p>

                      <div className="space-y-2 pt-2 border-t border-white/5">
                        <input
                          type="text"
                          placeholder="Moderator feedback / notes..."
                          value={reviewNotes[prop.id] || ''}
                          onChange={(e) => setReviewNotes({ ...reviewNotes, [prop.id]: e.target.value })}
                          className="w-full bg-[#0A0B10] border border-white/10 rounded-lg p-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#50E3C2]"
                        />

                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleReviewAccommodation(prop.id, 'REJECT')}
                            disabled={isProcessing === prop.id}
                            className="px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                          <button
                            onClick={() => handleReviewAccommodation(prop.id, 'APPROVE')}
                            disabled={isProcessing === prop.id}
                            className="px-4 py-1.5 bg-[#50E3C2] hover:bg-[#38cbb0] text-black text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve & Publish</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: VERIFICATIONS (DEEDS / ID) */}
          {activeTab === 'VERIFICATIONS' && (
            <div className="p-6 rounded-2xl bg-[#12141D] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#50E3C2]" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">
                    Property Ownership & Deed Verifications ({pendingVerifications.length})
                  </h3>
                </div>
              </div>

              {pendingVerifications.length === 0 ? (
                <div className="p-8 rounded-xl bg-white/5 border border-white/5 text-center text-xs text-white/40">
                  No property verification requests pending staff audit.
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingVerifications.map((prop) => (
                    <div key={prop.id} className="p-5 rounded-xl bg-white/5 border border-white/5 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-white">{prop.title}</h4>
                          <p className="text-xs text-white/60">{prop.address}, {prop.city}</p>
                          <p className="text-[11px] text-[#50E3C2]">Owner: {prop.ownerName} ({prop.ownerEmail})</p>
                        </div>
                      </div>

                      {/* Private Documents Vault Box */}
                      <div className="p-3 bg-black/40 border border-[#50E3C2]/20 rounded-xl space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#50E3C2]">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Submitted Verification Documents (Restricted to Staff)</span>
                        </div>

                        {prop.verificationDocuments && prop.verificationDocuments.length > 0 ? (
                          <div className="space-y-1.5">
                            {prop.verificationDocuments.map((doc: any, i: number) => (
                              <div key={i} className="flex items-center justify-between text-xs text-white/80 p-2 rounded-lg bg-white/5">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-3.5 h-3.5 text-[#50E3C2]" />
                                  <span className="font-semibold">{doc.fileName}</span>
                                  <span className="text-[10px] text-white/40 font-mono uppercase">({doc.documentType})</span>
                                </div>
                                <span className="text-[10px] text-emerald-400 font-mono">Encrypted Drive</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-white/40">No attached files found.</div>
                        )}
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                        <button
                          onClick={() => handleVerifyAccommodation(prop.id, 'REJECT')}
                          disabled={isProcessing === prop.id}
                          className="px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold rounded-lg flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject Verification</span>
                        </button>
                        <button
                          onClick={() => handleVerifyAccommodation(prop.id, 'VERIFY')}
                          disabled={isProcessing === prop.id}
                          className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg flex items-center gap-1"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Grant Verified Badge</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: REPORTS & ABUSE */}
          {activeTab === 'REPORTS' && (
            <div className="p-6 rounded-2xl bg-[#12141D] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">
                    Flagged Reports & Scam Tickets ({accommodationReports.length})
                  </h3>
                </div>
              </div>

              {accommodationReports.length === 0 ? (
                <div className="p-8 rounded-xl bg-white/5 border border-white/5 text-center text-xs text-white/40">
                  No active accommodation abuse reports.
                </div>
              ) : (
                <div className="space-y-4">
                  {accommodationReports.map((rep) => (
                    <div key={rep.id} className="p-5 rounded-xl bg-white/5 border border-white/5 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            {rep.reason}
                          </span>
                          <p className="text-xs text-white/50 mt-1">Property ID: {rep.propertyId}</p>
                        </div>
                        <span className="text-[10px] text-white/40 font-mono">
                          {new Date(rep.createdDate).toLocaleString()}
                        </span>
                      </div>

                      <div className="p-3 bg-black/40 rounded-lg text-xs text-white/80 border border-white/5">
                        "{rep.details}"
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                        <button
                          onClick={() => handleActionReport(rep.id, 'DISMISS')}
                          disabled={isProcessing === rep.id}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/70 text-xs rounded-lg"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => handleActionReport(rep.id, 'WARN_OWNER')}
                          disabled={isProcessing === rep.id}
                          className="px-3.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold rounded-lg"
                        >
                          Warn Owner
                        </button>
                        <button
                          onClick={() => handleActionReport(rep.id, 'TAKEDOWN_LISTING')}
                          disabled={isProcessing === rep.id}
                          className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg"
                        >
                          Takedown Listing
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: INSTITUTIONS */}
          {activeTab === 'INSTITUTIONS' && (
            <div className="p-6 rounded-2xl bg-[#12141D] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#50E3C2]" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">
                    Pending Institution Submissions ({pendingInstitutions.length})
                  </h3>
                </div>
              </div>

              {pendingInstitutions.length === 0 ? (
                <div className="p-6 rounded-xl bg-white/5 border border-white/5 text-center text-xs text-white/40">
                  All submitted institutions have been moderated. Queue is clear!
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingInstitutions.map((inst) => (
                    <div key={inst.id} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-white">{inst.name}</h4>
                            <span className="text-[9px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-1.5 py-0.2 rounded font-mono">
                              {inst.countryCode}
                            </span>
                          </div>
                          <p className="text-[11px] text-white/40 mt-0.5">
                            Type: {inst.type} • Campuses: {inst.campuses?.length || 1}
                          </p>
                        </div>

                        {inst.website && (
                          <a
                            href={inst.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/40 hover:text-white"
                            title="Open official website"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-white/5">
                        <button
                          onClick={() => handleReviewInstitution(inst.id, InstitutionStatus.REJECTED)}
                          disabled={isProcessing === inst.id}
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-semibold rounded-lg flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                        <button
                          onClick={() => handleReviewInstitution(inst.id, InstitutionStatus.APPROVED)}
                          disabled={isProcessing === inst.id}
                          className="px-3.5 py-1.5 bg-[#50E3C2] hover:bg-[#40d0b0] text-black text-xs font-bold rounded-lg flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Approve Institution</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: CAMPUSES */}
          {activeTab === 'CAMPUSES' && (
            <div className="p-6 rounded-2xl bg-[#12141D] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#50E3C2]" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">
                    Pending Branch Campuses ({pendingCampuses.length})
                  </h3>
                </div>
              </div>

              {pendingCampuses.length === 0 ? (
                <div className="p-6 rounded-xl bg-white/5 border border-white/5 text-center text-xs text-white/40">
                  No branch campus submissions awaiting moderation.
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingCampuses.map((camp) => (
                    <div key={camp.id} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-white">{camp.campusName}</h4>
                          <p className="text-[11px] text-[#50E3C2] mt-0.5">
                            City: {camp.city} ({camp.countryCode}) • ID: {camp.institutionId}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                        <button
                          onClick={() => handleReviewCampus(camp.id, 'REJECT')}
                          disabled={isProcessing === camp.id}
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-semibold rounded-lg flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                        <button
                          onClick={() => handleReviewCampus(camp.id, 'APPROVE')}
                          disabled={isProcessing === camp.id}
                          className="px-3.5 py-1.5 bg-[#50E3C2] hover:bg-[#40d0b0] text-black text-xs font-bold rounded-lg flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Approve Campus</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Audit Log Trail (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-[#12141D] border border-white/5 space-y-4">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#50E3C2]" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">
                Live Audit Trail
              </h3>
            </div>

            <div className="space-y-2.5 max-h-[540px] overflow-y-auto pr-1 custom-scrollbar">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#50E3C2] text-[10px]">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-white/30 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-white/80 text-[11px]">{log.details}</p>
                  <div className="text-[9px] text-white/30 font-mono">
                    User: {log.userEmail || 'System'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

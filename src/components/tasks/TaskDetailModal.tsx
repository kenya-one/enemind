/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  MapPin,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  FileText,
  ExternalLink,
  MessageSquare,
  Users,
  Star,
  Download,
  Upload,
  RefreshCw,
  Sparkles,
  Layers,
  ChevronRight,
  HardDrive,
  Lock,
} from 'lucide-react';
import {
  Task,
  TaskStatus,
  TaskApplication,
  TaskApplicationStatus,
  TaskSubmission,
  TaskPaymentStatus,
  UserRole,
} from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';
import { useCurrency } from '../../context/CurrencyContext.js';
import { api } from '../../services/api.js';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenApply: (task: Task) => void;
  onOpenSubmitDeliverable: (task: Task) => void;
  onOpenDispute: (task: Task) => void;
  onOpenReview: (task: Task) => void;
  onOpenReport: (task: Task) => void;
  onOpenPayment: (task: Task, application: TaskApplication) => void;
  onTaskUpdated: () => void;
}

export function TaskDetailModal({
  task,
  isOpen,
  onClose,
  onOpenApply,
  onOpenSubmitDeliverable,
  onOpenDispute,
  onOpenReview,
  onOpenReport,
  onOpenPayment,
  onTaskUpdated,
}: TaskDetailModalProps) {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();

  const [applications, setApplications] = useState<TaskApplication[]>([]);
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'APPLICATIONS' | 'DELIVERABLES' | 'REVIEWS'>('OVERVIEW');
  const [revisionReason, setRevisionReason] = useState('');
  const [isRequestingRevision, setIsRequestingRevision] = useState(false);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const isPoster = user && task && user.id === task.posterId;
  const isAssignedWorker = user && task && user.id === task.assignedWorkerId;
  const isAdmin = user && (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN || user.role === UserRole.MODERATOR);

  useEffect(() => {
    if (isOpen && task) {
      loadTaskData();
    }
  }, [isOpen, task?.id]);

  async function loadTaskData() {
    if (!task) return;
    setIsLoading(true);
    setActionError(null);

    try {
      const promises: Promise<any>[] = [
        api.getTaskReviews(task.id).catch(() => ({ reviews: [] })),
      ];

      // If poster, assigned worker, or admin, fetch applications and submissions
      if (user) {
        promises.push(api.getTaskApplications(task.id).catch(() => ({ applications: [] })));
        if (isPoster || isAssignedWorker || isAdmin) {
          promises.push(api.getTaskSubmissions(task.id).catch(() => ({ submissions: [] })));
        }
      }

      const [reviewsRes, appsRes, subsRes] = await Promise.all(promises);
      setReviews(reviewsRes?.reviews || []);
      setApplications(appsRes?.applications || []);
      setSubmissions(subsRes?.submissions || []);
    } catch (err: any) {
      console.error('Error loading task details:', err);
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen || !task) return null;

  const myApplication = user ? applications.find((a) => a.workerId === user.id) : undefined;

  async function handleApproveTask() {
    if (!task) return;
    if (!window.confirm('Are you sure you want to approve this work and complete the task? Protected funds will be released to the worker.')) {
      return;
    }

    setIsProcessingAction(true);
    setActionError(null);

    try {
      await api.approveAndCompleteTask(task.id);
      onTaskUpdated();
      loadTaskData();
    } catch (err: any) {
      setActionError(err.message || 'Failed to approve task completion');
    } finally {
      setIsProcessingAction(false);
    }
  }

  async function handleRequestRevision() {
    if (!task || !revisionReason.trim()) return;
    setIsProcessingAction(true);
    setActionError(null);

    try {
      await api.requestTaskRevision(task.id, revisionReason.trim());
      setIsRequestingRevision(false);
      setRevisionReason('');
      onTaskUpdated();
      loadTaskData();
    } catch (err: any) {
      setActionError(err.message || 'Failed to request revision');
    } finally {
      setIsProcessingAction(false);
    }
  }

  // Calculate platform fee preview
  const budgetVal = task.budgetMin;
  const workerFee = (budgetVal * (task.platformFeeWorkerPercent || 10)) / 100;
  const netEarnings = Math.max(0, budgetVal - workerFee);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-950/60 shrink-0">
          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold text-blue-400 bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-800/40 uppercase tracking-wider">
                {task.category.replace(/_/g, ' ')}
              </span>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/40 uppercase tracking-wider">
                {task.status.replace(/_/g, ' ')}
              </span>
              <span className="text-[11px] font-medium text-slate-300 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700/60">
                {task.remoteType.replace(/_/g, ' ')}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              {task.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Protected Payment Banner */}
        <div className="px-6 py-2.5 bg-gradient-to-r from-emerald-950/50 via-slate-900 to-blue-950/40 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong className="text-emerald-300 font-semibold">Payment Protection:</strong>{' '}
              {task.paymentStatus === TaskPaymentStatus.FUNDED
                ? 'Task budget is funded and held according to Enermind marketplace payment terms.'
                : task.paymentStatus === TaskPaymentStatus.RELEASED
                ? 'Earnings released to worker ledger.'
                : 'Payment is authorized via PesaPal upon task assignment.'}
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">PesaPal Verified</span>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-800 bg-slate-950/40 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'OVERVIEW'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview & Specifications
          </button>

          {(isPoster || isAdmin || (applications && applications.length > 0)) && (
            <button
              onClick={() => setActiveTab('APPLICATIONS')}
              className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'APPLICATIONS'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Applications</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                {applications.length}
              </span>
            </button>
          )}

          {(isPoster || isAssignedWorker || isAdmin) && (
            <button
              onClick={() => setActiveTab('DELIVERABLES')}
              className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'DELIVERABLES'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Deliverables & Revisions</span>
              {submissions.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-900/80 text-blue-300">
                  {submissions.length}
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => setActiveTab('REVIEWS')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'REVIEWS'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Reviews</span>
            {reviews.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-900/80 text-amber-300">
                {reviews.length}
              </span>
            )}
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {actionError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{actionError}</span>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
              {/* Top Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-medium">Budget / Rate</div>
                  <div className="text-lg font-bold text-emerald-400 mt-0.5">
                    {formatPrice(task.budgetMin, task.currency)}
                    {task.budgetMax && task.budgetMax > task.budgetMin && ` - ${formatPrice(task.budgetMax, task.currency)}`}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {task.budgetType === 'HOURLY' ? 'Hourly' : 'Fixed Price'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-medium">Deadline</div>
                  <div className="text-sm font-bold text-slate-200 mt-0.5">
                    {new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {task.estimatedDuration || 'Standard delivery'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-medium">Proposals</div>
                  <div className="text-lg font-bold text-blue-400 mt-0.5">
                    {task.proposalsCount || 0}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {task.viewsCount || 0} views • {task.savesCount || 0} saves
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-medium">Poster Location</div>
                  <div className="text-sm font-bold text-slate-200 mt-0.5 truncate">
                    {task.city}, {task.country}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {task.campusName || 'Main Campus'}
                  </div>
                </div>
              </div>

              {/* Poster Info Card */}
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {task.posterAvatar ? (
                    <img
                      src={task.posterAvatar}
                      alt={task.posterName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-200">
                      {task.posterName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-100 text-sm">
                      <span>{task.posterName}</span>
                      {task.posterVerified && (
                        <ShieldCheck className="w-4 h-4 text-blue-400" title="Verified Campus Poster" />
                      )}
                    </div>
                    <div className="text-xs text-slate-400">
                      {task.institutionName || 'University Member'}
                    </div>
                  </div>
                </div>

                {task.assignedWorkerName && (
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400 font-medium">Assigned Worker</div>
                    <div className="text-xs font-bold text-emerald-400 flex items-center justify-end gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{task.assignedWorkerName}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Task Description */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider text-xs">
                  Description & Context
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
                  {task.description}
                </p>
              </div>

              {/* Requirements & Deliverables Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Requirements */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Requirements
                  </h3>
                  <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-2">
                    {task.requirements && task.requirements.length > 0 ? (
                      task.requirements.map((req, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                          <span>{req}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500">Standard task requirements apply.</p>
                    )}
                  </div>
                </div>

                {/* Deliverables */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Expected Deliverables
                  </h3>
                  <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-2">
                    {task.deliverables && task.deliverables.length > 0 ? (
                      task.deliverables.map((del, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{del}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500">Deliverables as outlined in description.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Skills Tags */}
              {task.skills && task.skills.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {task.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Platform Fee & Net Earnings Transparency */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between font-semibold text-slate-300">
                  <span>Marketplace Transparency & Fee Breakdown</span>
                  <span className="text-slate-400 font-mono text-[11px]">Enermind Ledger</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-400 pt-1">
                  <div>
                    Poster Protected Budget: <strong className="text-slate-200">{formatPrice(budgetVal, task.currency)}</strong>
                  </div>
                  <div>
                    Platform Worker Fee ({task.platformFeeWorkerPercent || 10}%): <strong className="text-slate-200">{formatPrice(workerFee, task.currency)}</strong>
                  </div>
                  <div>
                    Estimated Net Worker Earnings: <strong className="text-emerald-400">{formatPrice(netEarnings, task.currency)}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: APPLICATIONS */}
          {activeTab === 'APPLICATIONS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-200">
                  {applications.length} {applications.length === 1 ? 'Proposal' : 'Proposals'} Submitted
                </h3>
                {isPoster && task.status === TaskStatus.APPLICATIONS_OPEN && (
                  <span className="text-xs text-slate-400">
                    Accept a proposal to fund the protected payment via PesaPal.
                  </span>
                )}
              </div>

              {applications.length === 0 ? (
                <div className="text-center py-12 p-6 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
                  <Users className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-sm font-medium text-slate-400">No applications submitted yet.</p>
                  <p className="text-xs text-slate-500">
                    Be the first student freelancer to submit a tailored proposal!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.map((app) => {
                    const isAccepted = app.status === TaskApplicationStatus.ACCEPTED;
                    return (
                      <div
                        key={app.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isAccepted
                            ? 'bg-emerald-950/20 border-emerald-500/40'
                            : 'bg-slate-950/60 border-slate-800'
                        } space-y-3`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {app.workerAvatar ? (
                              <img
                                src={app.workerAvatar}
                                alt={app.workerName}
                                className="w-10 h-10 rounded-full object-cover border border-slate-700"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-200">
                                {app.workerName.charAt(0)}
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-100 text-sm">{app.workerName}</span>
                                {app.workerRating && (
                                  <span className="flex items-center gap-0.5 text-xs text-amber-400 font-bold">
                                    <Star className="w-3 h-3 fill-amber-400" />
                                    {app.workerRating}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-400">
                                {app.estimatedDuration} • {app.workerCompletedTasks || 0} tasks completed
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-base font-extrabold text-emerald-400">
                              {formatPrice(app.bidAmount, app.currency)}
                            </div>
                            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                              {app.status}
                            </span>
                          </div>
                        </div>

                        {/* Proposal Message */}
                        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                          {app.proposal}
                        </p>

                        {/* Relevant Skills */}
                        {app.relevantSkills && app.relevantSkills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {app.relevantSkills.map((sk, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] font-medium text-slate-300 bg-slate-800 px-2 py-0.5 rounded"
                              >
                                {sk}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Poster Action: Accept & Fund */}
                        {isPoster && task.status === TaskStatus.APPLICATIONS_OPEN && app.status === TaskApplicationStatus.SUBMITTED && (
                          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end gap-2">
                            <button
                              onClick={() => onOpenPayment(task, app)}
                              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                              <span>Accept & Fund ({formatPrice(app.bidAmount, app.currency)})</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DELIVERABLES & REVISIONS */}
          {activeTab === 'DELIVERABLES' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-200">
                  Deliverable Submissions & History ({submissions.length})
                </h3>

                {isAssignedWorker &&
                  (task.status === TaskStatus.IN_PROGRESS || task.status === TaskStatus.REVISION_REQUESTED) && (
                    <button
                      onClick={() => onOpenSubmitDeliverable(task)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Submit Deliverable</span>
                    </button>
                  )}
              </div>

              {submissions.length === 0 ? (
                <div className="text-center py-12 p-6 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
                  <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-sm font-medium text-slate-400">No deliverables uploaded yet.</p>
                  <p className="text-xs text-slate-500">
                    {isAssignedWorker
                      ? 'Upload your project files or link your Google Drive Private Vault deliverable once finished.'
                      : 'The assigned worker will submit the deliverables here before the deadline.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800/40">
                            Revision #{sub.revisionNumber}
                          </span>
                          <span className="text-xs text-slate-400">
                            by {sub.workerName} • {new Date(sub.submittedAt).toLocaleString()}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            sub.status === 'APPROVED'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : sub.status === 'REVISION_REQUESTED'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {sub.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      {/* Message */}
                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-lg border border-slate-800">
                        {sub.message}
                      </p>

                      {/* Revision Reason if requested */}
                      {sub.revisionReason && (
                        <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/40 text-xs text-amber-300 space-y-1">
                          <span className="font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Poster Requested Changes:
                          </span>
                          <p>{sub.revisionReason}</p>
                        </div>
                      )}

                      {/* Attached Files & Drive Files */}
                      {sub.files && sub.files.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[11px] font-semibold text-slate-400">Attached Deliverable Files:</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {sub.files.map((f, idx) => (
                              <div
                                key={idx}
                                className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between gap-2 text-xs"
                              >
                                <div className="flex items-center gap-2 truncate">
                                  {f.isGoogleDrive ? (
                                    <HardDrive className="w-4 h-4 text-blue-400 shrink-0" title="Google Drive File" />
                                  ) : (
                                    <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                                  )}
                                  <span className="truncate text-slate-200 font-medium">{f.name}</span>
                                </div>
                                {f.url && (
                                  <a
                                    href={f.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-400 hover:text-blue-300 p-1 shrink-0"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* External Links */}
                      {sub.links && sub.links.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <span className="text-[11px] font-semibold text-slate-400">External Links:</span>
                          <div className="space-y-1">
                            {sub.links.map((link, idx) => (
                              <a
                                key={idx}
                                href={link}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1.5 text-xs text-blue-400 hover:underline truncate"
                              >
                                <ExternalLink className="w-3 h-3 shrink-0" />
                                <span className="truncate">{link}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Poster Approval & Revision Controls */}
                  {isPoster && (task.status === TaskStatus.SUBMITTED || task.status === TaskStatus.REVISION_REQUESTED) && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">Poster Review Actions</span>
                        <span className="text-xs text-slate-400">
                          Revisions: {task.revisionCount} / {task.maxRevisions}
                        </span>
                      </div>

                      {!isRequestingRevision ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={handleApproveTask}
                            disabled={isProcessingAction}
                            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Approve & Release Funds</span>
                          </button>

                          {task.revisionCount < task.maxRevisions && (
                            <button
                              onClick={() => setIsRequestingRevision(true)}
                              disabled={isProcessingAction}
                              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>Request Revision</span>
                            </button>
                          )}

                          <button
                            onClick={() => onOpenDispute(task)}
                            className="px-3 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-medium border border-rose-800/40 transition-colors ml-auto"
                          >
                            Open Dispute
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3 pt-2">
                          <textarea
                            value={revisionReason}
                            onChange={(e) => setRevisionReason(e.target.value)}
                            placeholder="Detail clearly what changes or adjustments are required..."
                            rows={3}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setIsRequestingRevision(false)}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleRequestRevision}
                              disabled={!revisionReason.trim() || isProcessingAction}
                              className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold disabled:opacity-50"
                            >
                              Submit Revision Request
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: REVIEWS */}
          {activeTab === 'REVIEWS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-200">
                  Task Reviews & Feedback ({reviews.length})
                </h3>

                {task.status === TaskStatus.COMPLETED &&
                  (isPoster || isAssignedWorker) &&
                  !reviews.some((r) => r.reviewerId === user?.id) && (
                    <button
                      onClick={() => onOpenReview(task)}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      <Star className="w-3.5 h-3.5 fill-white" />
                      <span>Write Review</span>
                    </button>
                  )}
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-12 p-6 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
                  <Star className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-sm font-medium text-slate-400">No reviews yet.</p>
                  <p className="text-xs text-slate-500">
                    Reviews can be submitted once the task is completed and verified.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-200 text-xs">{rev.reviewerName}</span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => onOpenReport(task)}
            className="text-xs text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Report Task</span>
          </button>

          <div className="flex items-center gap-2">
            {/* If Worker and Task is Open */}
            {task.status === TaskStatus.APPLICATIONS_OPEN && !isPoster && (
              myApplication ? (
                <div className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-3 py-2 rounded-lg border border-emerald-800/60 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Proposal Submitted ({formatPrice(myApplication.bidAmount, myApplication.currency)})</span>
                </div>
              ) : (
                <button
                  onClick={() => onOpenApply(task)}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-colors"
                >
                  Apply for this Task
                </button>
              )
            )}

            {/* If Assigned Worker and In Progress */}
            {isAssignedWorker &&
              (task.status === TaskStatus.IN_PROGRESS || task.status === TaskStatus.REVISION_REQUESTED) && (
                <button
                  onClick={() => onOpenSubmitDeliverable(task)}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4" />
                  <span>Submit Deliverable</span>
                </button>
              )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

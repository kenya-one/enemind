/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Wallet,
  DollarSign,
  ArrowDownToLine,
  Clock,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Layers,
  Star,
  Settings,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Phone,
  Building,
} from 'lucide-react';
import {
  LedgerEntry,
  Withdrawal,
  WorkerProfile,
  TaskApplication,
  Task,
} from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';
import { useCurrency } from '../../context/CurrencyContext.js';
import { api } from '../../services/api.js';

interface WorkerDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTask?: (taskId: string) => void;
}

export function WorkerDashboardModal({ isOpen, onClose, onSelectTask }: WorkerDashboardModalProps) {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();

  const [activeTab, setActiveTab] = useState<'EARNINGS' | 'APPLICATIONS' | 'PROFILE'>('EARNINGS');
  const [earnings, setEarnings] = useState<{
    availableEarnings: number;
    pendingEarnings: number;
    completedEarnings: number;
    totalEarned: number;
    totalWithdrawn: number;
    currency: string;
    ledger: LedgerEntry[];
  }>({
    availableEarnings: 0,
    pendingEarnings: 0,
    completedEarnings: 0,
    totalEarned: 0,
    totalWithdrawn: 0,
    currency: 'USD',
    ledger: [],
  });

  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [applications, setApplications] = useState<TaskApplication[]>([]);
  const [profile, setProfile] = useState<WorkerProfile | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Withdrawal form modal state
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [destinationType, setDestinationType] = useState<'MPESA' | 'AIRTEL_MONEY' | 'BANK_TRANSFER'>('MPESA');
  const [destinationReference, setDestinationReference] = useState('');
  const [recipientName, setRecipientName] = useState(user?.displayName || '');
  const [isProcessingWithdrawal, setIsProcessingWithdrawal] = useState(false);

  // Profile Form state
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState<number>(15);
  const [profileSkills, setProfileSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [portfolioItems, setPortfolioItems] = useState<{ title: string; url: string; description?: string }[]>([]);
  const [newPortTitle, setNewPortTitle] = useState('');
  const [newPortUrl, setNewPortUrl] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      loadDashboardData();
    }
  }, [isOpen, user?.id]);

  async function loadDashboardData() {
    setIsLoading(true);
    setError(null);

    try {
      const [earningsRes, withRes, appsRes, profRes] = await Promise.all([
        api.getWorkerEarnings().catch(() => ({
          availableEarnings: 0,
          pendingEarnings: 0,
          completedEarnings: 0,
          totalEarned: 0,
          totalWithdrawn: 0,
          currency: 'USD',
          ledger: [],
        })),
        api.getWorkerWithdrawals().catch(() => ({ withdrawals: [] })),
        api.getUserApplications().catch(() => ({ applications: [] })),
        api.getWorkerProfile().catch(() => ({ profile: null })),
      ]);

      setEarnings(earningsRes);
      setWithdrawals(withRes.withdrawals || []);
      setApplications(appsRes.applications || []);

      if (profRes.profile) {
        setProfile(profRes.profile);
        setHeadline(profRes.profile.headline || '');
        setBio(profRes.profile.bio || '');
        setHourlyRate(profRes.profile.hourlyRate || 15);
        setProfileSkills(profRes.profile.skills || []);
        setPortfolioItems(profRes.profile.portfolio || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load worker dashboard.');
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) return null;

  async function handleRequestWithdrawal(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (withdrawAmount <= 0) {
      setError('Withdrawal amount must be greater than 0.');
      return;
    }
    if (withdrawAmount > earnings.availableEarnings) {
      setError('Withdrawal amount exceeds your available earnings balance.');
      return;
    }
    if (!destinationReference.trim()) {
      setError('Please provide a valid phone number or bank account reference.');
      return;
    }

    setIsProcessingWithdrawal(true);

    try {
      const res = await api.requestWorkerWithdrawal({
        amount: Number(withdrawAmount),
        currency: earnings.currency,
        destinationType,
        destinationReference: destinationReference.trim(),
        recipientName: recipientName.trim(),
      });

      if (res.success) {
        setSuccessMessage('Withdrawal payout request submitted successfully.');
        setIsWithdrawModalOpen(false);
        setWithdrawAmount(0);
        setDestinationReference('');
        loadDashboardData();
      } else {
        setError('Withdrawal request failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Withdrawal request failed.');
    } finally {
      setIsProcessingWithdrawal(false);
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setIsSavingProfile(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await api.updateWorkerProfile({
        headline,
        bio,
        hourlyRate: Number(hourlyRate),
        skills: profileSkills,
        portfolio: portfolioItems,
      });

      if (res.success) {
        setProfile(res.profile);
        setSuccessMessage('Freelancer profile updated successfully.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setIsSavingProfile(false);
    }
  }

  function addProfileSkill() {
    if (newSkill.trim() && !profileSkills.includes(newSkill.trim())) {
      setProfileSkills([...profileSkills, newSkill.trim()]);
      setNewSkill('');
    }
  }

  function removeProfileSkill(skillToRemove: string) {
    setProfileSkills(profileSkills.filter((s) => s !== skillToRemove));
  }

  function addPortfolioItem() {
    if (newPortTitle.trim() && newPortUrl.trim()) {
      setPortfolioItems([
        ...portfolioItems,
        {
          title: newPortTitle.trim(),
          url: newPortUrl.trim(),
        },
      ]);
      setNewPortTitle('');
      setNewPortUrl('');
    }
  }

  function removePortfolioItem(idx: number) {
    setPortfolioItems(portfolioItems.filter((_, i) => i !== idx));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-950/60 shrink-0">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-400" />
              <span>Student Freelancer & Worker Hub</span>
            </h2>
            <p className="text-xs text-slate-400">
              Track earnings, manage protected payouts via PesaPal, and showcase your campus portfolio.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-800 bg-slate-950/40 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('EARNINGS')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'EARNINGS'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Earnings & Ledger</span>
          </button>

          <button
            onClick={() => setActiveTab('APPLICATIONS')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'APPLICATIONS'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>My Proposals & Tasks</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
              {applications.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('PROFILE')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'PROFILE'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Worker Profile & Skills</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: EARNINGS & LEDGER */}
          {activeTab === 'EARNINGS' && (
            <div className="space-y-6">
              {/* Earnings Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                  <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                    Available Earnings
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-400">
                    {formatPrice(earnings.availableEarnings, earnings.currency)}
                  </div>
                  <div className="text-[10px] text-slate-400">Ready for instant payout</div>
                </div>

                <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-1">
                  <div className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">
                    Pending In Escrow / Held
                  </div>
                  <div className="text-2xl font-extrabold text-blue-400">
                    {formatPrice(earnings.pendingEarnings, earnings.currency)}
                  </div>
                  <div className="text-[10px] text-slate-400">In-progress active tasks</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Total Lifetime Earned
                  </div>
                  <div className="text-2xl font-extrabold text-slate-100">
                    {formatPrice(earnings.totalEarned, earnings.currency)}
                  </div>
                  <div className="text-[10px] text-slate-400">Gross completed earnings</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Total Withdrawn
                  </div>
                  <div className="text-2xl font-extrabold text-slate-300">
                    {formatPrice(earnings.totalWithdrawn, earnings.currency)}
                  </div>
                  <div className="text-[10px] text-slate-400">Paid out via PesaPal</div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-200">
                    Withdraw Available Balance
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Payout directly to M-Pesa, Airtel Money, or local African bank account.
                  </p>
                </div>

                <button
                  onClick={() => setIsWithdrawModalOpen(true)}
                  disabled={earnings.availableEarnings <= 0}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ArrowDownToLine className="w-4 h-4" />
                  <span>Request Payout</span>
                </button>
              </div>

              {/* Ledger Table */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Internal Accounting Ledger History</span>
                  <span className="text-[11px] font-normal text-slate-500 lowercase">
                    {earnings.ledger.length} entries recorded
                  </span>
                </h3>

                {earnings.ledger.length === 0 ? (
                  <div className="text-center py-10 p-6 rounded-xl bg-slate-950/40 border border-slate-800 space-y-1">
                    <p className="text-xs font-medium text-slate-400">No ledger entries recorded yet.</p>
                    <p className="text-[11px] text-slate-500">
                      When you get assigned to tasks, protected earnings will show up here.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 text-[11px]">
                        <tr>
                          <th className="p-3">Date</th>
                          <th className="p-3">Description</th>
                          <th className="p-3">Type</th>
                          <th className="p-3 text-right">Amount</th>
                          <th className="p-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 bg-slate-950/30">
                        {earnings.ledger.map((entry) => (
                          <tr key={entry.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="p-3 text-slate-400 whitespace-nowrap">
                              {new Date(entry.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-3 font-medium text-slate-200">
                              {entry.description}
                            </td>
                            <td className="p-3">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                                {entry.type}
                              </span>
                            </td>
                            <td className="p-3 text-right font-mono font-bold">
                              <span
                                className={
                                  entry.type === 'EARNING_RELEASED' || entry.type === 'REFUND'
                                    ? 'text-emerald-400'
                                    : 'text-slate-300'
                                }
                              >
                                {entry.type === 'WITHDRAWAL_PAID' || entry.type === 'PLATFORM_FEE' ? '-' : '+'}
                                {formatPrice(entry.amount, entry.currency)}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  entry.status === 'AVAILABLE'
                                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                    : entry.status === 'HELD'
                                    ? 'bg-blue-950 text-blue-400 border border-blue-800'
                                    : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {entry.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Withdrawals History */}
              {withdrawals.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Recent Payout Requests
                  </h3>
                  <div className="space-y-2">
                    {withdrawals.map((w) => (
                      <div
                        key={w.id}
                        className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-semibold text-slate-200">
                            {formatPrice(w.amount, w.currency)} to {w.destinationType} ({w.destinationReference})
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {new Date(w.requestedAt).toLocaleString()}
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            w.status === 'COMPLETED'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : w.status === 'REJECTED'
                              ? 'bg-rose-950 text-rose-400 border border-rose-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {w.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: APPLICATIONS & PROPOSALS */}
          {activeTab === 'APPLICATIONS' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                My Submitted Proposals & Work
              </h3>

              {applications.length === 0 ? (
                <div className="text-center py-12 p-6 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
                  <Briefcase className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-sm font-medium text-slate-400">No proposals submitted yet.</p>
                  <p className="text-xs text-slate-500">
                    Browse open student gigs in the marketplace and submit your first proposal!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xs font-bold text-slate-200">
                            Task ID: {app.taskId}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Submitted on {new Date(app.createdAt).toLocaleDateString()} • {app.estimatedDuration}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-bold text-emerald-400">
                            {formatPrice(app.bidAmount, app.currency)}
                          </div>
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              app.status === 'ACCEPTED'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : app.status === 'REJECTED'
                                ? 'bg-rose-950 text-rose-400 border border-rose-800'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {app.status}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 bg-slate-900/80 p-3 rounded-lg border border-slate-800 leading-relaxed">
                        {app.proposal}
                      </p>

                      {onSelectTask && (
                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => onSelectTask(app.taskId)}
                            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                          >
                            <span>View Task Details</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WORKER PROFILE */}
          {activeTab === 'PROFILE' && (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Freelancer Profile & Portfolio
                </h3>
                <span className="text-xs text-slate-500">Public campus profile</span>
              </div>

              {/* Headline */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Professional Headline
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g., Computer Science Student & Fullstack UI Designer"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  About & Background
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Summarize your technical skills, campus involvement, previous projects, and reliability..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Hourly Rate */}
              <div className="w-48">
                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Standard Hourly Rate ($)
                </label>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                  min={1}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Skills Tags */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Key Skills & Competencies
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {profileSkills.map((sk) => (
                    <span
                      key={sk}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5"
                    >
                      <span>{sk}</span>
                      <button
                        type="button"
                        onClick={() => removeProfileSkill(sk)}
                        className="text-slate-500 hover:text-rose-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addProfileSkill())}
                    placeholder="Add a skill..."
                    className="w-56 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addProfileSkill}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                  >
                    + Add Skill
                  </button>
                </div>
              </div>

              {/* Portfolio Links */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Portfolio Works / Samples
                </label>
                <div className="space-y-2">
                  {portfolioItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="truncate">
                        <div className="font-semibold text-slate-200">{item.title}</div>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 hover:underline truncate block text-[11px]"
                        >
                          {item.url}
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={() => removePortfolioItem(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={newPortTitle}
                        onChange={(e) => setNewPortTitle(e.target.value)}
                        placeholder="Project title (e.g. Campus Mobile App)"
                        className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="url"
                        value={newPortUrl}
                        onChange={(e) => setNewPortUrl(e.target.value)}
                        placeholder="Project URL (e.g. GitHub, Figma, Behance)"
                        className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={addPortfolioItem}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Portfolio Link</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition-colors disabled:opacity-50"
                >
                  {isSavingProfile ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>PesaPal ledger integration active</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Mini Payout Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ArrowDownToLine className="w-4 h-4 text-emerald-400" />
                <span>Request Payout PesaPal</span>
              </h3>
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRequestWithdrawal} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Payout Method
                </label>
                <select
                  value={destinationType}
                  onChange={(e: any) => setDestinationType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                >
                  <option value="MPESA">M-Pesa (Kenya / East Africa)</option>
                  <option value="AIRTEL_MONEY">Airtel Money</option>
                  <option value="BANK_TRANSFER">Direct Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Amount ({earnings.currency})
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(parseFloat(e.target.value) || 0)}
                  max={earnings.availableEarnings}
                  min={1}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Available: {formatPrice(earnings.availableEarnings, earnings.currency)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {destinationType === 'BANK_TRANSFER' ? 'Account Number & Bank Name' : 'Mobile Number'}
                </label>
                <input
                  type="text"
                  value={destinationReference}
                  onChange={(e) => setDestinationReference(e.target.value)}
                  placeholder={destinationType === 'BANK_TRANSFER' ? 'e.g. 0123456789 - Equity Bank' : '+254 7...'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessingWithdrawal}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold disabled:opacity-50"
                >
                  {isProcessingWithdrawal ? 'Processing...' : 'Confirm Payout Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

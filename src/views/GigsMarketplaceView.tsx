/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Plus,
  Wallet,
  Sparkles,
  Search,
  Filter,
  SlidersHorizontal,
  Bookmark,
  Briefcase,
  Layers,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Clock,
  DollarSign,
  User,
  MessageCircle,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useCurrency } from '../context/CurrencyContext.js';
import { api } from '../services/api.js';
import {
  Task,
  TaskCategory,
  TaskApplication,
  RemoteType,
  BudgetType,
  MarketplaceListing,
} from '../types/index.js';

// Task Components & Modals
import { TaskCard } from '../components/tasks/TaskCard.js';
import { TaskDetailModal } from '../components/tasks/TaskDetailModal.js';
import { PostTaskModal } from '../components/tasks/PostTaskModal.js';
import { ApplyTaskModal } from '../components/tasks/ApplyTaskModal.js';
import { SubmitDeliverableModal } from '../components/tasks/SubmitDeliverableModal.js';
import { WorkerDashboardModal } from '../components/tasks/WorkerDashboardModal.js';
import { TaskDisputeModal } from '../components/tasks/TaskDisputeModal.js';
import { TaskReviewModal } from '../components/tasks/TaskReviewModal.js';
import { TaskReportModal } from '../components/tasks/TaskReportModal.js';
import { TaskPaymentModal } from '../components/tasks/TaskPaymentModal.js';
import { TaskAIModal } from '../components/tasks/TaskAIModal.js';

export function GigsMarketplaceView() {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();

  // Navigation tabs
  const [mainTab, setMainTab] = useState<'TASKS' | 'MY_POSTED' | 'SAVED' | 'MARKETPLACE'>('TASKS');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedRemote, setSelectedRemote] = useState<string>('ALL');
  const [selectedBudgetType, setSelectedBudgetType] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('NEWEST');
  const [showFilters, setShowFilters] = useState(false);

  // Data states
  const [tasks, setTasks] = useState<Task[]>([]);
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [savedTaskIds, setSavedTaskIds] = useState<string[]>([]);
  const [marketplace, setMarketplace] = useState<MarketplaceListing[]>([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isDeliverableModalOpen, setIsDeliverableModalOpen] = useState(false);
  const [isWorkerDashboardOpen, setIsWorkerDashboardOpen] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAIAdvisorOpen, setIsAIAdvisorOpen] = useState(false);

  const [paymentTask, setPaymentTask] = useState<Task | null>(null);
  const [paymentApplication, setPaymentApplication] = useState<TaskApplication | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Load initial tasks & saved IDs
  useEffect(() => {
    loadTasks();
    if (user) {
      loadSavedTasks();
      loadMyPostedTasks();
    }
  }, [selectedCategory, selectedRemote, selectedBudgetType, sortBy, mainTab]);

  async function loadTasks() {
    setIsLoading(true);
    try {
      if (mainTab === 'MARKETPLACE') {
        const mktData = await api.getMarketplace();
        setMarketplace(mktData.items || []);
      } else {
        const res = await api.searchTasks({
          query: searchQuery.trim() || undefined,
          category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
          remoteType: selectedRemote !== 'ALL' ? selectedRemote : undefined,
          budgetType: selectedBudgetType !== 'ALL' ? selectedBudgetType : undefined,
          sortBy,
          limit: 30,
        });

        setTasks(res.tasks || []);
        setTotalTasks(res.total || 0);
      }
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadSavedTasks() {
    try {
      const res = await api.getUserSavedTaskIds();
      setSavedTaskIds(res.savedIds || []);
    } catch (err) {
      console.error('Failed to load saved task IDs:', err);
    }
  }

  async function loadMyPostedTasks() {
    if (!user) return;
    try {
      const res = await api.searchTasks({
        posterId: user.id,
        limit: 50,
      });
      setMyTasks(res.tasks || []);
    } catch (err) {
      console.error('Failed to load user posted tasks:', err);
    }
  }

  async function handleToggleSave(taskId: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!user) {
      alert('Please log in to bookmark tasks.');
      return;
    }

    try {
      const res = await api.toggleSaveTask(taskId);
      if (res.isSaved) {
        setSavedTaskIds((prev) => [...prev, taskId]);
      } else {
        setSavedTaskIds((prev) => prev.filter((id) => id !== taskId));
      }
    } catch (err) {
      console.error('Failed to toggle save:', err);
    }
  }

  function handleOpenTaskDetail(task: Task) {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  }

  function handleOpenApply(task: Task, e?: React.MouseEvent) {
    if (e) e.stopPropagation();
    setSelectedTask(task);
    setIsApplyModalOpen(true);
  }

  function handleOpenSubmitDeliverable(task: Task) {
    setSelectedTask(task);
    setIsDeliverableModalOpen(true);
  }

  function handleOpenDispute(task: Task) {
    setSelectedTask(task);
    setIsDisputeModalOpen(true);
  }

  function handleOpenReview(task: Task) {
    setSelectedTask(task);
    setIsReviewModalOpen(true);
  }

  function handleOpenReport(task: Task) {
    setSelectedTask(task);
    setIsReportModalOpen(true);
  }

  function handleOpenPayment(task: Task, app: TaskApplication) {
    setPaymentTask(task);
    setPaymentApplication(app);
    setIsPaymentModalOpen(true);
  }

  const savedTasksList = tasks.filter((t) => savedTaskIds.includes(t.id));

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner & Action Hub */}
      <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Student Economy: Tasks, Gigs & Services
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Campus peer freelancing & micro-projects. Connect with student experts with PesaPal protected payments and academic integrity compliance.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsAIAdvisorOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span>AI Advisor</span>
          </button>

          <button
            onClick={() => setIsWorkerDashboardOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span>Worker Hub & Balance</span>
          </button>

          <button
            onClick={() => setIsPostModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-900/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Post a Task</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 gap-4 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setMainTab('TASKS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              mainTab === 'TASKS'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Find Tasks & Gigs</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
              {totalTasks}
            </span>
          </button>

          {user && (
            <button
              onClick={() => setMainTab('MY_POSTED')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                mainTab === 'MY_POSTED'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>My Posted Tasks</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                {myTasks.length}
              </span>
            </button>
          )}

          {user && (
            <button
              onClick={() => setMainTab('SAVED')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                mainTab === 'SAVED'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved Bookmarks</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                {savedTaskIds.length}
              </span>
            </button>
          )}

          <button
            onClick={() => setMainTab('MARKETPLACE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              mainTab === 'MARKETPLACE'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Campus Gear & Books</span>
          </button>
        </div>

        {/* Protection guarantee chip */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Payments protected by Enermind Escrow Terms</span>
        </div>
      </div>

      {/* SEARCH & CATEGORY CHIPS (For TASKS Tab) */}
      {mainTab === 'TASKS' && (
        <div className="space-y-4">
          {/* Search Bar + Filters Toggle */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadTasks()}
                placeholder="Search by keywords, tasks, skills (e.g., Figma, Python, Proofreading, Video Editing)..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <button
              onClick={() => loadTasks()}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              Search
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                showFilters
                  ? 'bg-slate-800 text-white border-slate-700'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          {/* Advanced Filters Expandable Drawer */}
          {showFilters && (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Work Mode</label>
                <select
                  value={selectedRemote}
                  onChange={(e) => setSelectedRemote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                >
                  <option value="ALL">All Work Modes</option>
                  <option value="REMOTE">Fully Remote</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="ON_SITE">On-Campus / In-Person</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Budget Structure</label>
                <select
                  value={selectedBudgetType}
                  onChange={(e) => setSelectedBudgetType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                >
                  <option value="ALL">All Budget Types</option>
                  <option value="FIXED">Fixed Price Project</option>
                  <option value="HOURLY">Hourly Rate</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Sort Order</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                >
                  <option value="NEWEST">Newest First</option>
                  <option value="BUDGET_HIGH">Highest Budget</option>
                  <option value="BUDGET_LOW">Lowest Budget</option>
                  <option value="DEADLINE">Closest Deadline</option>
                  <option value="PROPOSALS">Most Popular</option>
                </select>
              </div>
            </div>
          )}

          {/* Quick Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'ALL', label: 'All Tasks' },
              { id: TaskCategory.CAMPUS_TASK, label: 'Campus Tasks' },
              { id: TaskCategory.TECH_DEV, label: 'Tech & Code' },
              { id: TaskCategory.DESIGN_CREATIVE, label: 'Design & UI' },
              { id: TaskCategory.WRITING_TRANSLATION, label: 'Writing & Translation' },
              { id: TaskCategory.TUTORING_RESEARCH, label: 'Tutoring & Research' },
              { id: TaskCategory.MARKETING_SOCIAL, label: 'Marketing & Social' },
              { id: TaskCategory.VIDEO_AUDIO, label: 'Video & Audio' },
              { id: TaskCategory.ADMINISTRATIVE_VIRTUAL, label: 'Virtual Assistant' },
              { id: TaskCategory.EVENTS_LOGISTICS, label: 'Events & Logistics' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all font-medium cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-slate-200 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CONTENT SECTIONS */}

      {/* TAB 1: ALL TASKS */}
      {mainTab === 'TASKS' && (
        <div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 rounded-xl bg-slate-900/60 border border-slate-800 animate-pulse"
                />
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-16 p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
              <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">No tasks found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No active tasks match your search filters. Try adjusting the category or search keywords, or post the first task!
              </p>
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold mt-2 cursor-pointer inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Post a Task</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isSaved={savedTaskIds.includes(task.id)}
                  onSelect={handleOpenTaskDetail}
                  onToggleSave={handleToggleSave}
                  onApply={handleOpenApply}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY POSTED TASKS */}
      {mainTab === 'MY_POSTED' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200">
              Tasks You Have Published ({myTasks.length})
            </h3>
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post Another Task</span>
            </button>
          </div>

          {myTasks.length === 0 ? (
            <div className="text-center py-16 p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
              <Layers className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">You haven't posted any tasks yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Need help with research, UI design, tutoring, coding, or campus logistics? Post a task to hire a qualified student peer!
              </p>
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold mt-2 cursor-pointer inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First Task</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isSaved={savedTaskIds.includes(task.id)}
                  onSelect={handleOpenTaskDetail}
                  onToggleSave={handleToggleSave}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SAVED BOOKMARKS */}
      {mainTab === 'SAVED' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-200">
            Bookmarked Tasks ({savedTasksList.length})
          </h3>

          {savedTasksList.length === 0 ? (
            <div className="text-center py-16 p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
              <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">No saved tasks yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Click the bookmark icon on any task card to save it here for quick reference later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedTasksList.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isSaved={true}
                  onSelect={handleOpenTaskDetail}
                  onToggleSave={handleToggleSave}
                  onApply={handleOpenApply}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: CAMPUS MARKETPLACE (GEAR & BOOKS) */}
      {mainTab === 'MARKETPLACE' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-200">
                Campus Marketplace (Buy & Sell Gear)
              </h3>
              <p className="text-xs text-slate-400">
                Textbooks, laptops, scientific calculators, dorm essentials, and lab gear from fellow students.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketplace.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg"
              >
                <div className="h-44 bg-slate-950">
                  <img
                    src={item.photos[0]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {item.condition.replace(/_/g, ' ')}
                      </span>
                      <span className="text-sm font-extrabold text-emerald-400">
                        {formatPrice(item.price, item.currency)}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mt-2">{item.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">{item.sellerDisplayName}</span>
                    <a
                      href={`https://wa.me/${item.sellerContact.replace('+', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Contact Seller</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ALL MODALS */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onOpenApply={(t) => handleOpenApply(t)}
        onOpenSubmitDeliverable={(t) => handleOpenSubmitDeliverable(t)}
        onOpenDispute={(t) => handleOpenDispute(t)}
        onOpenReview={(t) => handleOpenReview(t)}
        onOpenReport={(t) => handleOpenReport(t)}
        onOpenPayment={(t, app) => handleOpenPayment(t, app)}
        onTaskUpdated={() => {
          loadTasks();
          loadMyPostedTasks();
        }}
      />

      <PostTaskModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onTaskCreated={() => {
          loadTasks();
          loadMyPostedTasks();
        }}
      />

      <ApplyTaskModal
        task={selectedTask}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onApplicationSubmitted={() => {
          loadTasks();
        }}
      />

      <SubmitDeliverableModal
        task={selectedTask}
        isOpen={isDeliverableModalOpen}
        onClose={() => setIsDeliverableModalOpen(false)}
        onDeliverableSubmitted={() => {
          loadTasks();
        }}
      />

      <WorkerDashboardModal
        isOpen={isWorkerDashboardOpen}
        onClose={() => setIsWorkerDashboardOpen(false)}
        onSelectTask={(taskId) => {
          setIsWorkerDashboardOpen(false);
          api.getTaskById(taskId).then((res) => {
            if (res.task) handleOpenTaskDetail(res.task);
          });
        }}
      />

      <TaskDisputeModal
        task={selectedTask}
        isOpen={isDisputeModalOpen}
        onClose={() => setIsDisputeModalOpen(false)}
        onDisputeOpened={() => {
          loadTasks();
        }}
      />

      <TaskReviewModal
        task={selectedTask}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onReviewSubmitted={() => {
          loadTasks();
        }}
      />

      <TaskReportModal
        task={selectedTask}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      <TaskPaymentModal
        task={paymentTask}
        application={paymentApplication}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentComplete={() => {
          loadTasks();
          loadMyPostedTasks();
        }}
      />

      <TaskAIModal
        isOpen={isAIAdvisorOpen}
        onClose={() => setIsAIAdvisorOpen(false)}
      />
    </div>
  );
}

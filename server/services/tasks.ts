/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Task,
  TaskCategory,
  TaskBudgetType,
  TaskStatus,
  TaskApplication,
  TaskApplicationStatus,
  TaskPaymentStatus,
  TaskSubmission,
  TaskDispute,
  TaskReport,
  LedgerEntry,
  LedgerEntryType,
  LedgerEntryStatus,
  Withdrawal,
  WithdrawalStatus,
  TaskReview,
  WorkerProfile,
  PlatformFeeConfig,
  RemoteType,
  UserRole,
  KYCStatus,
} from '../../src/types/index.js';
import { adminService } from './admin.js';
import { currencyService } from './currency.js';

export const PROHIBITED_KEYWORDS = [
  'do my exam',
  'take my exam',
  'write my exam',
  'cheat on exam',
  'solve my exam',
  'take test for me',
  'write my test',
  'graded quiz answer',
  'do my quiz for me',
  'plagiarism',
  'hack password',
  'steal account',
  'credit card fraud',
  'money laundering',
  'fake id generator',
  'ddos attack',
  'malware creator',
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-event-photographer-uon',
    posterId: 'usr-student-union-rep',
    posterName: 'UoN Student Union Media',
    posterEmail: 'media@studentunion.uonbi.ac.ke',
    posterRole: UserRole.COMMUNITY_ADMIN,
    posterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    posterVerified: true,
    title: 'Campus Tech Summit Event Photographer & Editor',
    description: 'Looking for a skilled student photographer to cover our 2-day Annual Tech Summit on Main Campus. Includes keynote coverage, workshop candids, and delivering 40 high-res edited photos within 48 hours.',
    category: TaskCategory.PHOTOGRAPHY,
    skills: ['Photography', 'Lightroom', 'Event Coverage', 'Photo Editing'],
    country: 'KE',
    city: 'Nairobi',
    campusId: 'camp-uon-main',
    campusName: 'Main Campus',
    institutionId: 'inst-uon-ke',
    institutionName: 'University of Nairobi',
    remoteType: RemoteType.ON_SITE,
    budgetType: TaskBudgetType.FIXED,
    budgetMin: 80,
    budgetMax: 100,
    currency: 'USD',
    originalAmount: 90,
    originalCurrency: 'USD',
    deadline: new Date(Date.now() + 10 * 86400000).toISOString(),
    estimatedDuration: '2 days on-site + 1 day editing',
    requirements: [
      'Must bring own DSLR / Mirrorless camera and appropriate lenses (e.g. 24-70mm or 50mm prime)',
      'Available on campus both summit days (9am - 4pm)',
      'Experience in indoor event lighting and fast turnarounds',
    ],
    deliverables: [
      'Folder of at least 40 graded color-corrected high-resolution JPEG photos',
      '5 highlight edits optimized for Instagram and LinkedIn social posts within 12 hours',
    ],
    status: TaskStatus.APPLICATIONS_OPEN,
    visibility: 'PUBLIC',
    verificationStatus: 'VERIFIED',
    paymentStatus: TaskPaymentStatus.UNFUNDED,
    platformFeeWorkerPercent: 10,
    platformFeePosterPercent: 3,
    proposalsCount: 4,
    viewsCount: 185,
    savesCount: 28,
    revisionCount: 0,
    maxRevisions: 2,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    publishedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    expiresAt: new Date(Date.now() + 10 * 86400000).toISOString(),
  },
  {
    id: 'task-python-data-scraping',
    posterId: 'usr-research-lab-lead',
    posterName: 'Campus AI Research Group',
    posterEmail: 'research.ai@strathmore.edu',
    posterRole: UserRole.ORGANIZATION_ADMIN,
    posterAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    posterVerified: true,
    title: 'Python Web Scraping & Clean Dataset Builder (Public Agricultural Price Data)',
    description: 'We need a clean Python pipeline to scrape public weekly wholesale produce prices from regional ministry portals and export cleaned CSV datasets with timestamps and product taxonomy.',
    category: TaskCategory.DATA_COLLECTION,
    skills: ['Python', 'BeautifulSoup', 'Pandas', 'Data Cleaning', 'CSV'],
    country: 'KE',
    city: 'Nairobi',
    campusId: 'camp-strath-main',
    campusName: 'Madaraka Campus',
    institutionId: 'inst-strath-ke',
    institutionName: 'Strathmore University',
    remoteType: RemoteType.REMOTE,
    budgetType: TaskBudgetType.FIXED,
    budgetMin: 120,
    budgetMax: 150,
    currency: 'USD',
    originalAmount: 135,
    originalCurrency: 'USD',
    deadline: new Date(Date.now() + 14 * 86400000).toISOString(),
    estimatedDuration: '4-6 days',
    requirements: [
      'Proficiency with Python, BeautifulSoup/Scrapy, and Pandas',
      'Clean, well-documented code with README and error handling',
      'Legitimate public data extraction only (adhering to robots.txt)',
    ],
    deliverables: [
      'Complete Python script (.py or Jupyter Notebook)',
      'Sample verified CSV dataset of past 6 months data',
      'Documentation explaining how to schedule automated weekly runs',
    ],
    status: TaskStatus.APPLICATIONS_OPEN,
    visibility: 'PUBLIC',
    verificationStatus: 'VERIFIED',
    paymentStatus: TaskPaymentStatus.UNFUNDED,
    platformFeeWorkerPercent: 10,
    platformFeePosterPercent: 3,
    proposalsCount: 6,
    viewsCount: 310,
    savesCount: 45,
    revisionCount: 0,
    maxRevisions: 3,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    publishedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    expiresAt: new Date(Date.now() + 14 * 86400000).toISOString(),
  },
  {
    id: 'task-calculus-peer-tutoring',
    posterId: 'usr-freshman-eng',
    posterName: 'Brian Odhiambo',
    posterEmail: 'bodhiambo@students.uonbi.ac.ke',
    posterRole: UserRole.STUDENT,
    posterAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    posterVerified: false,
    title: '1-on-1 Peer Tutoring: Multivariable Calculus & Differential Equations',
    description: 'First year engineering student seeking 4 dedicated tutoring sessions (1.5 hrs each) focusing on partial derivatives, multiple integrals, and first-order ODEs before midterms.',
    category: TaskCategory.TUTORING,
    skills: ['Calculus', 'Mathematics', 'Engineering Mathematics', 'Tutoring'],
    country: 'KE',
    city: 'Nairobi',
    campusId: 'camp-uon-main',
    campusName: 'Main Campus',
    institutionId: 'inst-uon-ke',
    institutionName: 'University of Nairobi',
    remoteType: RemoteType.HYBRID,
    budgetType: TaskBudgetType.HOURLY,
    budgetMin: 15,
    budgetMax: 20,
    currency: 'USD',
    originalAmount: 18,
    originalCurrency: 'USD',
    deadline: new Date(Date.now() + 7 * 86400000).toISOString(),
    estimatedDuration: '6 hours total across 2 weeks',
    requirements: [
      'Must have scored A/A- in Engineering Mathematics I & II or equivalent',
      'Patient tutor capable of breaking down complex theorems and step-by-step proofs',
      'Must adhere to Enermind Academic Integrity terms: tutoring and conceptual assistance only (no exam solutions)',
    ],
    deliverables: [
      'Four 1.5-hour structured tutoring sessions in person (campus library) or via Google Meet',
      'Step-by-step worked practice problem sets tailored to syllabus',
    ],
    status: TaskStatus.APPLICATIONS_OPEN,
    visibility: 'CAMPUS_ONLY',
    verificationStatus: 'VERIFIED',
    paymentStatus: TaskPaymentStatus.UNFUNDED,
    platformFeeWorkerPercent: 10,
    platformFeePosterPercent: 3,
    proposalsCount: 3,
    viewsCount: 140,
    savesCount: 12,
    revisionCount: 0,
    maxRevisions: 1,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
  },
  {
    id: 'task-brand-identity-robotics',
    posterId: 'usr-robotics-club',
    posterName: 'Campus Robotics & Maker Society',
    posterEmail: 'robotics@ku.ac.ke',
    posterRole: UserRole.COMMUNITY_ADMIN,
    posterAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    posterVerified: true,
    title: 'Brand Identity Design: Vector Logo, Color Palette & Merchandise Kit',
    description: 'Our collegiate robotics club is participating in the Pan-African Rover Challenge. We need a modern, energetic visual identity including vector logo, color guidelines, badge icons, and hoodie/t-shirt print mockups.',
    category: TaskCategory.GRAPHIC_DESIGN,
    skills: ['Figma', 'Adobe Illustrator', 'Vector Art', 'Branding', 'Typography'],
    country: 'KE',
    city: 'Nairobi',
    campusId: 'camp-ku-main',
    campusName: 'Main Campus',
    institutionId: 'inst-ku-ke',
    institutionName: 'Kenyatta University',
    remoteType: RemoteType.REMOTE,
    budgetType: TaskBudgetType.FIXED,
    budgetMin: 75,
    budgetMax: 110,
    currency: 'USD',
    originalAmount: 95,
    originalCurrency: 'USD',
    deadline: new Date(Date.now() + 12 * 86400000).toISOString(),
    estimatedDuration: '5-7 days',
    requirements: [
      'Portfolio showcasing vector branding and logo design projects',
      'Supply all final vectors in SVG, AI, EPS, and high-res transparent PNGs',
    ],
    deliverables: [
      'Primary logo & icon mark in light, dark, and monochrome vector versions',
      'Brand guideline PDF (fonts, color hex/CMYK codes, spacing rules)',
      'Apparel mockups (T-shirt front & back, hoodie, laptop stickers)',
    ],
    status: TaskStatus.APPLICATIONS_OPEN,
    visibility: 'PUBLIC',
    verificationStatus: 'VERIFIED',
    paymentStatus: TaskPaymentStatus.UNFUNDED,
    platformFeeWorkerPercent: 10,
    platformFeePosterPercent: 3,
    proposalsCount: 8,
    viewsCount: 420,
    savesCount: 65,
    revisionCount: 0,
    maxRevisions: 3,
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    publishedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    expiresAt: new Date(Date.now() + 12 * 86400000).toISOString(),
  },
];

class TasksService {
  private tasks: Map<string, Task> = new Map();
  private applications: Map<string, TaskApplication> = new Map();
  private submissions: Map<string, TaskSubmission[]> = new Map();
  private disputes: Map<string, TaskDispute> = new Map();
  private reports: Map<string, TaskReport> = new Map();
  private ledger: LedgerEntry[] = [];
  private withdrawals: Map<string, Withdrawal> = new Map();
  private reviews: Map<string, TaskReview[]> = new Map();
  private workerProfiles: Map<string, WorkerProfile> = new Map();
  private savedTasks: Map<string, Set<string>> = new Map(); // userId -> Set<taskId>

  private platformFeeConfig: PlatformFeeConfig = {
    workerFeePercent: 10, // 10% worker earnings fee
    posterFeePercent: 0, // 0% poster fee
    minimumFeeUSD: 0.5,
    maximumFeeUSD: 50.0,
  };

  constructor() {
    INITIAL_TASKS.forEach((t) => this.tasks.set(t.id, t));

    // Seed worker profile for demo user
    this.workerProfiles.set('usr-demo-student', {
      userId: 'usr-demo-student',
      displayName: 'Enermind Student Freelancer',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      headline: 'Full-Stack Developer & Quantitative Research Assistant',
      bio: '3rd Year Computer Science student proficient in Python, TypeScript, React, and Data Visualization. Top rated peer tutor.',
      skills: ['Python', 'TypeScript', 'React', 'Figma', 'Data Analysis', 'Calculus', 'Tutoring'],
      hourlyRate: 15,
      currency: 'USD',
      countryCode: 'KE',
      institutionName: 'University of Nairobi',
      campusName: 'Main Campus',
      completedTasksCount: 8,
      completionRate: 100,
      ratingAverage: 4.9,
      totalReviewsCount: 7,
      portfolio: [
        { title: 'Campus Roommate Matcher', link: 'https://github.com/enermind/sample-project', description: 'React & Node.js application for student housing' },
        { title: 'Produce Price Tracker', link: 'https://github.com/enermind/data-tracker', description: 'Automated scraping and statistical dashboard' },
      ],
      languages: ['English', 'Swahili'],
      availability: 'PART_TIME',
      kycStatus: KYCStatus.VERIFIED,
    });
  }

  // --- Platform Fee Config ---
  getPlatformFeeConfig(): PlatformFeeConfig {
    return { ...this.platformFeeConfig };
  }

  updatePlatformFeeConfig(updates: Partial<PlatformFeeConfig>, adminUserId: string): PlatformFeeConfig {
    this.platformFeeConfig = { ...this.platformFeeConfig, ...updates };
    adminService.logAction({
      actorUserId: adminUserId,
      actorEmail: 'admin@enermind.org',
      actorRole: UserRole.SUPER_ADMIN,
      action: 'UPDATE_PLATFORM_FEE_CONFIG',
      targetType: 'PLATFORM_FEE',
      targetId: 'global',
      details: `Updated platform fee config: ${JSON.stringify(updates)}`,
    });
    return { ...this.platformFeeConfig };
  }

  calculateFees(budgetAmount: number, currency: string = 'USD') {
    const workerFee = (budgetAmount * this.platformFeeConfig.workerFeePercent) / 100;
    const posterFee = (budgetAmount * this.platformFeeConfig.posterFeePercent) / 100;
    const netWorkerEarnings = Math.max(0, budgetAmount - workerFee);
    const totalPosterCost = budgetAmount + posterFee;

    return {
      budgetAmount,
      currency,
      workerFeePercent: this.platformFeeConfig.workerFeePercent,
      workerFeeAmount: Number(workerFee.toFixed(2)),
      posterFeePercent: this.platformFeeConfig.posterFeePercent,
      posterFeeAmount: Number(posterFee.toFixed(2)),
      netWorkerEarnings: Number(netWorkerEarnings.toFixed(2)),
      totalPosterCost: Number(totalPosterCost.toFixed(2)),
    };
  }

  // --- Prohibited Content Checker ---
  validateAcademicIntegrity(title: string, description: string): { isClean: boolean; flaggedKeywords: string[] } {
    const text = `${title} ${description}`.toLowerCase();
    const flaggedKeywords: string[] = [];

    for (const kw of PROHIBITED_KEYWORDS) {
      if (text.includes(kw)) {
        flaggedKeywords.push(kw);
      }
    }

    return {
      isClean: flaggedKeywords.length === 0,
      flaggedKeywords,
    };
  }

  // --- Tasks Discovery & Search ---
  searchTasks(params: {
    query?: string;
    category?: TaskCategory | string;
    skill?: string;
    country?: string;
    city?: string;
    campusId?: string;
    remoteType?: RemoteType | string;
    budgetType?: TaskBudgetType | string;
    minBudget?: number;
    maxBudget?: number;
    currency?: string;
    sortBy?: 'recommended' | 'newest' | 'budget_high' | 'budget_low' | 'deadline_soon';
    posterId?: string;
    assignedWorkerId?: string;
    status?: TaskStatus | string;
    page?: number;
    limit?: number;
  }): { tasks: Task[]; total: number; page: number; totalPages: number } {
    let list = Array.from(this.tasks.values());

    // Status filter: by default public searches only return published/applications_open/in_progress
    if (params.status) {
      list = list.filter((t) => t.status === params.status);
    } else if (!params.posterId && !params.assignedWorkerId) {
      list = list.filter((t) =>
        [TaskStatus.APPLICATIONS_OPEN, TaskStatus.PUBLISHED, TaskStatus.IN_PROGRESS].includes(t.status)
      );
    }

    if (params.posterId) {
      list = list.filter((t) => t.posterId === params.posterId);
    }

    if (params.assignedWorkerId) {
      list = list.filter((t) => t.assignedWorkerId === params.assignedWorkerId);
    }

    if (params.category && params.category !== 'ALL') {
      list = list.filter((t) => t.category === params.category);
    }

    if (params.remoteType && params.remoteType !== 'ALL') {
      list = list.filter((t) => t.remoteType === params.remoteType);
    }

    if (params.budgetType && params.budgetType !== 'ALL') {
      list = list.filter((t) => t.budgetType === params.budgetType);
    }

    if (params.country) {
      list = list.filter((t) => t.country.toUpperCase() === params.country?.toUpperCase());
    }

    if (params.city) {
      list = list.filter((t) => t.city.toLowerCase().includes(params.city!.toLowerCase()));
    }

    if (params.campusId) {
      list = list.filter((t) => t.campusId === params.campusId);
    }

    if (params.skill) {
      const qSkill = params.skill.toLowerCase();
      list = list.filter((t) => t.skills.some((s) => s.toLowerCase().includes(qSkill)));
    }

    if (params.minBudget) {
      list = list.filter((t) => (t.budgetMax || t.budgetMin) >= params.minBudget!);
    }

    if (params.maxBudget) {
      list = list.filter((t) => t.budgetMin <= params.maxBudget!);
    }

    if (params.query) {
      const q = params.query.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.city.toLowerCase().includes(q) ||
          (t.campusName && t.campusName.toLowerCase().includes(q)) ||
          t.skills.some((s) => s.toLowerCase().includes(q)) ||
          t.requirements.some((r) => r.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (params.sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (params.sortBy === 'budget_high') {
      list.sort((a, b) => (b.budgetMax || b.budgetMin) - (a.budgetMax || a.budgetMin));
    } else if (params.sortBy === 'budget_low') {
      list.sort((a, b) => a.budgetMin - b.budgetMin);
    } else if (params.sortBy === 'deadline_soon') {
      list.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    } else {
      // Default: Recommended (Proposals + Saves + Recency)
      list.sort((a, b) => {
        const scoreA = (a.savesCount * 2) + a.proposalsCount + (new Date(a.createdAt).getTime() / 1e10);
        const scoreB = (b.savesCount * 2) + b.proposalsCount + (new Date(b.createdAt).getTime() / 1e10);
        return scoreB - scoreA;
      });
    }

    const total = list.length;
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, Math.min(params.limit || 20, 100));
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = list.slice((page - 1) * limit, page * limit);

    return {
      tasks: paginated,
      total,
      page,
      totalPages,
    };
  }

  getTaskById(taskId: string, viewerUserId?: string): Task | null {
    const task = this.tasks.get(taskId);
    if (!task) return null;

    // Increment view count if viewed by someone else
    if (viewerUserId && viewerUserId !== task.posterId) {
      task.viewsCount += 1;
      this.tasks.set(taskId, task);
    }

    return task;
  }

  // --- Task Creation & Authoring ---
  createTask(
    data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'savesCount' | 'proposalsCount' | 'revisionCount' | 'paymentStatus' | 'platformFeeWorkerPercent' | 'platformFeePosterPercent'>,
    authorUserId: string,
    authorRole: UserRole | string
  ): { success: boolean; task?: Task; error?: string; flagged?: boolean } {
    // Prohibited content check
    const check = this.validateAcademicIntegrity(data.title, data.description);
    if (!check.isClean) {
      return {
        success: false,
        error: `Academic Integrity Violation: Tasks asking to solve exams, tests, or graded quizzes are strictly prohibited on Enermind. Flagged terms: ${check.flaggedKeywords.join(', ')}`,
        flagged: true,
      };
    }

    const taskId = `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const task: Task = {
      ...data,
      id: taskId,
      posterId: authorUserId,
      posterRole: authorRole,
      status: data.status || TaskStatus.APPLICATIONS_OPEN,
      paymentStatus: TaskPaymentStatus.UNFUNDED,
      platformFeeWorkerPercent: this.platformFeeConfig.workerFeePercent,
      platformFeePosterPercent: this.platformFeeConfig.posterFeePercent,
      proposalsCount: 0,
      viewsCount: 1,
      savesCount: 0,
      revisionCount: 0,
      maxRevisions: data.maxRevisions || 2,
      createdAt: now,
      updatedAt: now,
      publishedAt: now,
    };

    this.tasks.set(taskId, task);

    adminService.logAction({
      actorUserId: authorUserId,
      actorEmail: task.posterEmail || 'poster@enermind.org',
      actorRole: typeof authorRole === 'string' ? (authorRole as UserRole) : UserRole.STUDENT,
      action: 'TASK_CREATED',
      targetType: 'TASK',
      targetId: taskId,
      details: `Created task "${task.title}" in category ${task.category} with budget ${task.currency} ${task.budgetMin}`,
    });

    return { success: true, task };
  }

  updateTask(
    taskId: string,
    updates: Partial<Task>,
    requesterUserId: string,
    requesterRole?: UserRole
  ): { success: boolean; task?: Task; error?: string } {
    const task = this.tasks.get(taskId);
    if (!task) return { success: false, error: 'Task not found' };

    // Authorization check
    const isOwner = task.posterId === requesterUserId;
    const isAdmin = requesterRole === UserRole.ADMIN || requesterRole === UserRole.SUPER_ADMIN || requesterRole === UserRole.MODERATOR;

    if (!isOwner && !isAdmin) {
      return { success: false, error: 'Unauthorized: You do not have permission to modify this task.' };
    }

    if (updates.title || updates.description) {
      const check = this.validateAcademicIntegrity(updates.title || task.title, updates.description || task.description);
      if (!check.isClean) {
        return {
          success: false,
          error: `Academic Integrity Violation: Prohibited keywords detected (${check.flaggedKeywords.join(', ')}).`,
        };
      }
    }

    const updated: Task = {
      ...task,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.tasks.set(taskId, updated);

    adminService.logAction({
      actorUserId: requesterUserId,
      actorEmail: task.posterEmail || 'poster@enermind.org',
      actorRole: requesterRole || UserRole.STUDENT,
      action: 'TASK_UPDATED',
      targetType: 'TASK',
      targetId: taskId,
      details: `Updated task details for "${task.title}".`,
    });

    return { success: true, task: updated };
  }

  // --- Task Applications & Proposals ---
  submitApplication(
    params: {
      taskId: string;
      workerId: string;
      workerName: string;
      workerEmail?: string;
      workerAvatar?: string;
      workerRole?: UserRole | string;
      proposal: string;
      bidAmount: number;
      currency: string;
      estimatedDuration: string;
      relevantSkills: string[];
      portfolioLinks?: string[];
    }
  ): { success: boolean; application?: TaskApplication; error?: string } {
    const task = this.tasks.get(params.taskId);
    if (!task) return { success: false, error: 'Task not found' };

    if (task.status !== TaskStatus.APPLICATIONS_OPEN && task.status !== TaskStatus.PUBLISHED) {
      return { success: false, error: 'This task is no longer accepting applications.' };
    }

    if (task.posterId === params.workerId) {
      return { success: false, error: 'You cannot submit an application to your own task.' };
    }

    // Check for existing application
    const existing = Array.from(this.applications.values()).find(
      (a) => a.taskId === params.taskId && a.workerId === params.workerId && a.status !== TaskApplicationStatus.WITHDRAWN
    );
    if (existing) {
      return { success: false, error: 'You have already submitted a proposal for this task.' };
    }

    const workerProfile = this.workerProfiles.get(params.workerId);

    const appId = `app-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const application: TaskApplication = {
      id: appId,
      taskId: params.taskId,
      taskTitle: task.title,
      workerId: params.workerId,
      workerName: params.workerName,
      workerEmail: params.workerEmail,
      workerAvatar: params.workerAvatar,
      workerRole: params.workerRole,
      workerRating: workerProfile?.ratingAverage || 5.0,
      workerCompletedTasks: workerProfile?.completedTasksCount || 0,
      workerSkills: workerProfile?.skills || params.relevantSkills,
      proposal: params.proposal,
      bidAmount: params.bidAmount,
      currency: params.currency,
      estimatedDuration: params.estimatedDuration,
      relevantSkills: params.relevantSkills,
      portfolioLinks: params.portfolioLinks || [],
      status: TaskApplicationStatus.SUBMITTED,
      createdAt: now,
      updatedAt: now,
    };

    this.applications.set(appId, application);

    // Update task proposals count
    task.proposalsCount = (task.proposalsCount || 0) + 1;
    this.tasks.set(task.id, task);

    adminService.logAction({
      actorUserId: params.workerId,
      actorEmail: params.workerEmail || 'worker@enermind.org',
      actorRole: UserRole.STUDENT,
      action: 'TASK_APPLICATION_SUBMITTED',
      targetType: 'TASK',
      targetId: params.taskId,
      details: `Worker ${params.workerName} submitted a proposal for task "${task.title}" with bid ${params.currency} ${params.bidAmount}.`,
    });

    return { success: true, application };
  }

  getTaskApplications(
    taskId: string,
    requesterUserId: string,
    requesterRole?: UserRole
  ): { applications: TaskApplication[]; error?: string } {
    const task = this.tasks.get(taskId);
    if (!task) return { applications: [], error: 'Task not found' };

    const isOwner = task.posterId === requesterUserId;
    const isAdmin = requesterRole === UserRole.ADMIN || requesterRole === UserRole.SUPER_ADMIN || requesterRole === UserRole.MODERATOR;

    const all = Array.from(this.applications.values()).filter((a) => a.taskId === taskId);

    // If poster or admin, return all applications
    if (isOwner || isAdmin) {
      return { applications: all };
    }

    // If student worker, ONLY return their own application (never expose competitors' proposals)
    const myApp = all.filter((a) => a.workerId === requesterUserId);
    return { applications: myApp };
  }

  getUserApplications(userId: string): TaskApplication[] {
    return Array.from(this.applications.values()).filter((a) => a.workerId === userId);
  }

  // --- Task Assignment & PesaPal Protected Funding Lifecycle ---
  assignWorkerAndFundTask(params: {
    taskId: string;
    applicationId: string;
    posterUserId: string;
    paymentReference?: string;
    orderId?: string;
  }): { success: boolean; task?: Task; error?: string } {
    const task = this.tasks.get(params.taskId);
    if (!task) return { success: false, error: 'Task not found' };

    if (task.posterId !== params.posterUserId) {
      return { success: false, error: 'Unauthorized: Only the task poster can assign a worker.' };
    }

    const application = this.applications.get(params.applicationId);
    if (!application || application.taskId !== params.taskId) {
      return { success: false, error: 'Application not found for this task.' };
    }

    const now = new Date().toISOString();

    // Update application status
    application.status = TaskApplicationStatus.ACCEPTED;
    application.updatedAt = now;
    this.applications.set(application.id, application);

    // Reject other applications
    Array.from(this.applications.values())
      .filter((a) => a.taskId === params.taskId && a.id !== params.applicationId)
      .forEach((other) => {
        other.status = TaskApplicationStatus.REJECTED;
        other.updatedAt = now;
        this.applications.set(other.id, other);
      });

    // Update task
    task.assignedWorkerId = application.workerId;
    task.assignedWorkerName = application.workerName;
    task.assignedWorkerAvatar = application.workerAvatar;
    task.assignedWorkerBid = application.bidAmount;
    task.status = TaskStatus.IN_PROGRESS;
    task.paymentStatus = TaskPaymentStatus.FUNDED;
    task.orderId = params.orderId;
    task.updatedAt = now;
    this.tasks.set(task.id, task);

    // Record pending worker earnings in internal ledger
    const feeCalculation = this.calculateFees(application.bidAmount, application.currency);
    const ledgerEntry: LedgerEntry = {
      id: `led-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: application.workerId,
      taskId: task.id,
      taskTitle: task.title,
      type: LedgerEntryType.TASK_PAYMENT,
      amount: feeCalculation.netWorkerEarnings,
      currency: application.currency,
      status: LedgerEntryStatus.HELD,
      reference: `Task Assignment #${task.id} (PesaPal Protected Payment)`,
      createdAt: now,
    };
    this.ledger.unshift(ledgerEntry);

    adminService.logAction({
      actorUserId: params.posterUserId,
      actorEmail: task.posterEmail || 'poster@enermind.org',
      actorRole: UserRole.STUDENT,
      action: 'TASK_ASSIGNED',
      targetType: 'TASK',
      targetId: task.id,
      details: `Assigned task "${task.title}" to worker ${application.workerName} with funded protected payment of ${application.currency} ${application.bidAmount}.`,
    });

    return { success: true, task };
  }

  // --- Task Deliverable Submissions ---
  submitDeliverable(params: {
    taskId: string;
    workerUserId: string;
    workerName: string;
    message: string;
    files?: Array<{ fileId?: string; name: string; sizeBytes?: number; url?: string; driveFileId?: string; isGoogleDrive?: boolean }>;
    links?: string[];
  }): { success: boolean; submission?: TaskSubmission; error?: string } {
    const task = this.tasks.get(params.taskId);
    if (!task) return { success: false, error: 'Task not found' };

    if (task.assignedWorkerId !== params.workerUserId) {
      return { success: false, error: 'Unauthorized: You are not the assigned worker for this task.' };
    }

    if (task.status !== TaskStatus.IN_PROGRESS && task.status !== TaskStatus.REVISION_REQUESTED) {
      return { success: false, error: `Cannot submit deliverables when task is in status ${task.status}.` };
    }

    const now = new Date().toISOString();
    const existingSubmissions = this.submissions.get(params.taskId) || [];
    const revisionNumber = existingSubmissions.length + 1;

    const submission: TaskSubmission = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      taskId: params.taskId,
      workerId: params.workerUserId,
      workerName: params.workerName,
      message: params.message,
      files: params.files || [],
      links: params.links || [],
      revisionNumber,
      status: 'SUBMITTED',
      submittedAt: now,
      updatedAt: now,
    };

    existingSubmissions.unshift(submission);
    this.submissions.set(params.taskId, existingSubmissions);

    // Update task status
    task.status = TaskStatus.SUBMITTED;
    task.updatedAt = now;
    this.tasks.set(task.id, task);

    adminService.logAction({
      actorUserId: params.workerUserId,
      actorEmail: 'worker@enermind.org',
      actorRole: UserRole.STUDENT,
      action: 'SUBMISSION_CREATED',
      targetType: 'TASK',
      targetId: task.id,
      details: `Worker ${params.workerName} submitted deliverable for task "${task.title}" (Revision #${revisionNumber}).`,
    });

    return { success: true, submission };
  }

  getTaskSubmissions(taskId: string, requesterUserId: string, requesterRole?: UserRole): { submissions: TaskSubmission[]; error?: string } {
    const task = this.tasks.get(taskId);
    if (!task) return { submissions: [], error: 'Task not found' };

    // Deliverable security: ONLY poster, assigned worker, and admin/moderators can view deliverables
    const isOwner = task.posterId === requesterUserId;
    const isWorker = task.assignedWorkerId === requesterUserId;
    const isAdmin = requesterRole === UserRole.ADMIN || requesterRole === UserRole.SUPER_ADMIN || requesterRole === UserRole.MODERATOR;

    if (!isOwner && !isWorker && !isAdmin) {
      return { submissions: [], error: 'Security: Task deliverables are private and can only be accessed by the assigned parties.' };
    }

    return { submissions: this.submissions.get(taskId) || [] };
  }

  // --- Revisions & Approvals ---
  requestRevision(params: {
    taskId: string;
    posterUserId: string;
    reason: string;
  }): { success: boolean; task?: Task; error?: string } {
    const task = this.tasks.get(params.taskId);
    if (!task) return { success: false, error: 'Task not found' };

    if (task.posterId !== params.posterUserId) {
      return { success: false, error: 'Unauthorized: Only the poster can request revisions.' };
    }

    if (task.status !== TaskStatus.SUBMITTED) {
      return { success: false, error: 'Can only request revisions for submitted tasks.' };
    }

    if (task.revisionCount >= task.maxRevisions) {
      return { success: false, error: `Maximum revisions limit (${task.maxRevisions}) reached for this task. Please approve or open a dispute.` };
    }

    const now = new Date().toISOString();
    task.revisionCount += 1;
    task.status = TaskStatus.REVISION_REQUESTED;
    task.updatedAt = now;
    this.tasks.set(task.id, task);

    // Update latest submission
    const subs = this.submissions.get(params.taskId) || [];
    if (subs.length > 0) {
      subs[0].status = 'REVISION_REQUESTED';
      subs[0].revisionReason = params.reason;
      subs[0].updatedAt = now;
      this.submissions.set(params.taskId, subs);
    }

    adminService.logAction({
      actorUserId: params.posterUserId,
      actorEmail: task.posterEmail || 'poster@enermind.org',
      actorRole: UserRole.STUDENT,
      action: 'REVISION_REQUESTED',
      targetType: 'TASK',
      targetId: task.id,
      details: `Poster requested revision #${task.revisionCount} on task "${task.title}": ${params.reason}`,
    });

    return { success: true, task };
  }

  approveAndCompleteTask(params: {
    taskId: string;
    posterUserId: string;
  }): { success: boolean; task?: Task; error?: string } {
    const task = this.tasks.get(params.taskId);
    if (!task) return { success: false, error: 'Task not found' };

    if (task.posterId !== params.posterUserId) {
      return { success: false, error: 'Unauthorized: Only the task poster can approve completion.' };
    }

    const now = new Date().toISOString();
    task.status = TaskStatus.COMPLETED;
    task.paymentStatus = TaskPaymentStatus.RELEASED;
    task.updatedAt = now;
    this.tasks.set(task.id, task);

    // Update submissions
    const subs = this.submissions.get(params.taskId) || [];
    if (subs.length > 0) {
      subs[0].status = 'APPROVED';
      subs[0].updatedAt = now;
      this.submissions.set(params.taskId, subs);
    }

    // Release worker earnings in ledger: transition HELD -> AVAILABLE
    const heldEntry = this.ledger.find(
      (l) => l.taskId === task.id && l.userId === task.assignedWorkerId && l.status === LedgerEntryStatus.HELD
    );

    if (heldEntry) {
      heldEntry.status = LedgerEntryStatus.AVAILABLE;
    } else if (task.assignedWorkerId && task.assignedWorkerBid) {
      const fees = this.calculateFees(task.assignedWorkerBid, task.currency);
      this.ledger.unshift({
        id: `led-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        userId: task.assignedWorkerId,
        taskId: task.id,
        taskTitle: task.title,
        type: LedgerEntryType.TASK_PAYMENT,
        amount: fees.netWorkerEarnings,
        currency: task.currency,
        status: LedgerEntryStatus.AVAILABLE,
        reference: `Task Completed #${task.id} (Earnings Available for Payout)`,
        createdAt: now,
      });
    }

    // Update worker profile statistics
    if (task.assignedWorkerId) {
      const profile = this.workerProfiles.get(task.assignedWorkerId);
      if (profile) {
        profile.completedTasksCount += 1;
        this.workerProfiles.set(task.assignedWorkerId, profile);
      }
    }

    adminService.logAction({
      actorUserId: params.posterUserId,
      actorEmail: task.posterEmail || 'poster@enermind.org',
      actorRole: UserRole.STUDENT,
      action: 'TASK_COMPLETED',
      targetType: 'TASK',
      targetId: task.id,
      details: `Task "${task.title}" approved and completed. Worker earnings released to ledger.`,
    });

    return { success: true, task };
  }

  // --- Task Disputes ---
  openDispute(params: {
    taskId: string;
    openedBy: string;
    openedByName: string;
    openedByRole: 'POSTER' | 'WORKER';
    reason: string;
    description: string;
    evidence?: string[];
  }): { success: boolean; dispute?: TaskDispute; error?: string } {
    const task = this.tasks.get(params.taskId);
    if (!task) return { success: false, error: 'Task not found' };

    const isParty = task.posterId === params.openedBy || task.assignedWorkerId === params.openedBy;
    if (!isParty) {
      return { success: false, error: 'Only involved task participants can raise a dispute.' };
    }

    const disputeId = `disp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const dispute: TaskDispute = {
      id: disputeId,
      taskId: params.taskId,
      taskTitle: task.title,
      openedBy: params.openedBy,
      openedByName: params.openedByName,
      openedByRole: params.openedByRole,
      reason: params.reason,
      description: params.description,
      evidence: params.evidence || [],
      status: 'OPEN',
      createdAt: now,
    };

    this.disputes.set(disputeId, dispute);

    // Update task status to DISPUTED
    task.status = TaskStatus.DISPUTED;
    task.updatedAt = now;
    this.tasks.set(task.id, task);

    adminService.logAction({
      actorUserId: params.openedBy,
      actorEmail: 'dispute@enermind.org',
      actorRole: UserRole.STUDENT,
      action: 'DISPUTE_OPENED',
      targetType: 'DISPUTE',
      targetId: disputeId,
      details: `${params.openedByRole} opened dispute on task "${task.title}": ${params.reason}`,
    });

    return { success: true, dispute };
  }

  resolveDispute(params: {
    disputeId: string;
    decision: 'RESOLVED_POSTER' | 'RESOLVED_WORKER' | 'PARTIAL' | 'CANCELLED';
    resolutionNotes: string;
    adminUserId: string;
  }): { success: boolean; dispute?: TaskDispute; error?: string } {
    const dispute = this.disputes.get(params.disputeId);
    if (!dispute) return { success: false, error: 'Dispute not found' };

    const task = this.tasks.get(dispute.taskId);
    const now = new Date().toISOString();

    dispute.status = params.decision;
    dispute.resolution = params.resolutionNotes;
    dispute.resolvedBy = params.adminUserId;
    dispute.resolvedAt = now;
    this.disputes.set(dispute.id, dispute);

    if (task) {
      if (params.decision === 'RESOLVED_POSTER') {
        task.status = TaskStatus.CANCELLED;
        task.paymentStatus = TaskPaymentStatus.REFUNDED;
      } else if (params.decision === 'RESOLVED_WORKER') {
        task.status = TaskStatus.COMPLETED;
        task.paymentStatus = TaskPaymentStatus.RELEASED;
      } else {
        task.status = TaskStatus.COMPLETED;
      }
      task.updatedAt = now;
      this.tasks.set(task.id, task);
    }

    adminService.logAction({
      actorUserId: params.adminUserId,
      actorEmail: 'admin@enermind.org',
      actorRole: UserRole.SUPER_ADMIN,
      action: 'DISPUTE_RESOLVED',
      targetType: 'DISPUTE',
      targetId: dispute.id,
      details: `Resolved dispute ${dispute.id} with decision ${params.decision}: ${params.resolutionNotes}`,
    });

    return { success: true, dispute };
  }

  getDisputes(status?: string): TaskDispute[] {
    const list = Array.from(this.disputes.values());
    return status ? list.filter((d) => d.status === status) : list;
  }

  // --- Task Reports & Moderation ---
  reportTask(params: {
    taskId: string;
    reportedByUserId: string;
    reportedByUserEmail?: string;
    reason: TaskReport['reason'];
    details: string;
  }): { success: boolean; report?: TaskReport; error?: string } {
    const task = this.tasks.get(params.taskId);
    if (!task) return { success: false, error: 'Task not found' };

    const reportId = `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const report: TaskReport = {
      id: reportId,
      taskId: params.taskId,
      taskTitle: task.title,
      reportedByUserId: params.reportedByUserId,
      reportedByUserEmail: params.reportedByUserEmail,
      reason: params.reason,
      details: params.details,
      status: 'PENDING',
      createdAt: now,
    };

    this.reports.set(reportId, report);

    adminService.logAction({
      actorUserId: params.reportedByUserId,
      actorEmail: params.reportedByUserEmail || 'reporter@enermind.org',
      actorRole: UserRole.STUDENT,
      action: 'TASK_REPORTED',
      targetType: 'TASK',
      targetId: params.taskId,
      details: `User reported task "${task.title}" for ${params.reason}: ${params.details}`,
    });

    return { success: true, report };
  }

  getReports(status?: string): TaskReport[] {
    const list = Array.from(this.reports.values());
    return status ? list.filter((r) => r.status === status) : list;
  }

  actionTaskReport(params: {
    reportId: string;
    action: 'DISMISS' | 'SUSPEND_TASK' | 'RESTORE_TASK';
    moderatorNotes?: string;
    adminUserId: string;
  }): { success: boolean; error?: string } {
    const report = this.reports.get(params.reportId);
    if (!report) return { success: false, error: 'Report not found' };

    report.status = params.action === 'DISMISS' ? 'DISMISSED' : 'ACTIONED';
    report.moderatorNotes = params.moderatorNotes;
    this.reports.set(report.id, report);

    const task = this.tasks.get(report.taskId);
    if (task) {
      if (params.action === 'SUSPEND_TASK') {
        task.status = TaskStatus.SUSPENDED;
        task.updatedAt = new Date().toISOString();
        this.tasks.set(task.id, task);
      } else if (params.action === 'RESTORE_TASK') {
        task.status = TaskStatus.APPLICATIONS_OPEN;
        task.updatedAt = new Date().toISOString();
        this.tasks.set(task.id, task);
      }
    }

    adminService.logAction({
      actorUserId: params.adminUserId,
      actorEmail: 'admin@enermind.org',
      actorRole: UserRole.SUPER_ADMIN,
      action: `REPORT_${params.action}`,
      targetType: 'REPORT',
      targetId: report.id,
      details: `Actioned report ${report.id} on task ${report.taskId}: ${params.action}`,
    });

    return { success: true };
  }

  // --- Saved Tasks ---
  toggleSaveTask(userId: string, taskId: string): { isSaved: boolean } {
    if (!this.savedTasks.has(userId)) {
      this.savedTasks.set(userId, new Set());
    }
    const userSaves = this.savedTasks.get(userId)!;
    const task = this.tasks.get(taskId);

    if (userSaves.has(taskId)) {
      userSaves.delete(taskId);
      if (task && task.savesCount > 0) task.savesCount -= 1;
      return { isSaved: false };
    } else {
      userSaves.add(taskId);
      if (task) task.savesCount += 1;
      return { isSaved: true };
    }
  }

  getUserSavedTaskIds(userId: string): string[] {
    return Array.from(this.savedTasks.get(userId) || []);
  }

  // --- Worker Ledger & Earnings Dashboard ---
  getWorkerEarningsSummary(userId: string): {
    availableEarnings: number;
    pendingEarnings: number;
    completedEarnings: number;
    totalEarned: number;
    totalWithdrawn: number;
    currency: string;
    ledger: LedgerEntry[];
  } {
    const userEntries = this.ledger.filter((l) => l.userId === userId);

    let available = 0;
    let pending = 0;
    let completed = 0;
    let withdrawn = 0;

    userEntries.forEach((entry) => {
      if (entry.type === LedgerEntryType.TASK_PAYMENT) {
        if (entry.status === LedgerEntryStatus.AVAILABLE) {
          available += entry.amount;
          completed += entry.amount;
        } else if (entry.status === LedgerEntryStatus.HELD || entry.status === LedgerEntryStatus.PENDING) {
          pending += entry.amount;
        }
      } else if (entry.type === LedgerEntryType.WITHDRAWAL) {
        if (entry.status === LedgerEntryStatus.COMPLETED || entry.status === LedgerEntryStatus.PENDING) {
          withdrawn += entry.amount;
          available = Math.max(0, available - entry.amount);
        }
      }
    });

    return {
      availableEarnings: Number(available.toFixed(2)),
      pendingEarnings: Number(pending.toFixed(2)),
      completedEarnings: Number(completed.toFixed(2)),
      totalEarned: Number(completed.toFixed(2)),
      totalWithdrawn: Number(withdrawn.toFixed(2)),
      currency: 'USD',
      ledger: userEntries,
    };
  }

  // --- Withdrawals Architecture ---
  requestWithdrawal(params: {
    userId: string;
    userEmail?: string;
    userName?: string;
    amount: number;
    currency: string;
    destinationType: 'MPESA' | 'AIRTEL_MONEY' | 'BANK_TRANSFER';
    destinationReference: string;
    recipientName: string;
  }): { success: boolean; withdrawal?: Withdrawal; error?: string } {
    const earnings = this.getWorkerEarningsSummary(params.userId);

    if (params.amount <= 0) {
      return { success: false, error: 'Withdrawal amount must be greater than zero.' };
    }

    if (params.amount > earnings.availableEarnings) {
      return {
        success: false,
        error: `Insufficient available earnings. You have ${earnings.currency} ${earnings.availableEarnings} available.`,
      };
    }

    const feeAmount = 0.5; // Nominal processing fee
    const netAmount = Math.max(0, params.amount - feeAmount);

    const withdrawalId = `wdr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const withdrawal: Withdrawal = {
      id: withdrawalId,
      userId: params.userId,
      userEmail: params.userEmail,
      userName: params.userName,
      amount: params.amount,
      currency: params.currency,
      feeAmount,
      netAmount,
      provider: 'PESAPAL',
      destinationType: params.destinationType,
      destinationReference: params.destinationReference,
      recipientName: params.recipientName,
      status: WithdrawalStatus.REQUESTED,
      createdAt: now,
    };

    this.withdrawals.set(withdrawalId, withdrawal);

    // Record withdrawal in ledger
    this.ledger.unshift({
      id: `led-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: params.userId,
      type: LedgerEntryType.WITHDRAWAL,
      amount: params.amount,
      currency: params.currency,
      status: LedgerEntryStatus.PENDING,
      reference: `Withdrawal Request #${withdrawalId} (${params.destinationType} to ${params.destinationReference})`,
      createdAt: now,
    });

    adminService.logAction({
      actorUserId: params.userId,
      actorEmail: params.userEmail || 'worker@enermind.org',
      actorRole: UserRole.STUDENT,
      action: 'WITHDRAWAL_REQUESTED',
      targetType: 'WITHDRAWAL',
      targetId: withdrawalId,
      details: `User requested withdrawal of ${params.currency} ${params.amount} via ${params.destinationType}.`,
    });

    return { success: true, withdrawal };
  }

  getUserWithdrawals(userId: string): Withdrawal[] {
    return Array.from(this.withdrawals.values()).filter((w) => w.userId === userId);
  }

  getAllWithdrawals(): Withdrawal[] {
    return Array.from(this.withdrawals.values());
  }

  processWithdrawal(params: {
    withdrawalId: string;
    action: 'APPROVE' | 'REJECT';
    rejectionReason?: string;
    adminUserId: string;
  }): { success: boolean; withdrawal?: Withdrawal; error?: string } {
    const withdrawal = this.withdrawals.get(params.withdrawalId);
    if (!withdrawal) return { success: false, error: 'Withdrawal not found' };

    const now = new Date().toISOString();
    withdrawal.status = params.action === 'APPROVE' ? WithdrawalStatus.COMPLETED : WithdrawalStatus.FAILED;
    if (params.rejectionReason) withdrawal.rejectionReason = params.rejectionReason;
    withdrawal.processedAt = now;
    this.withdrawals.set(withdrawal.id, withdrawal);

    // Update corresponding ledger entry
    const entry = this.ledger.find((l) => l.reference.includes(withdrawal.id));
    if (entry) {
      entry.status = params.action === 'APPROVE' ? LedgerEntryStatus.COMPLETED : LedgerEntryStatus.REVERSED;
    }

    adminService.logAction({
      actorUserId: params.adminUserId,
      actorEmail: 'admin@enermind.org',
      actorRole: UserRole.SUPER_ADMIN,
      action: `WITHDRAWAL_${params.action}`,
      targetType: 'WITHDRAWAL',
      targetId: withdrawal.id,
      details: `Processed withdrawal ${withdrawal.id} with status ${withdrawal.status}`,
    });

    return { success: true, withdrawal };
  }

  // --- Task Reviews & Reputation ---
  submitReview(params: {
    taskId: string;
    reviewerId: string;
    reviewerName: string;
    reviewerAvatar?: string;
    rating: number;
    comment: string;
  }): { success: boolean; review?: TaskReview; error?: string } {
    const task = this.tasks.get(params.taskId);
    if (!task) return { success: false, error: 'Task not found' };

    if (task.status !== TaskStatus.COMPLETED) {
      return { success: false, error: 'Reviews can only be submitted for completed tasks.' };
    }

    const isPoster = task.posterId === params.reviewerId;
    const isWorker = task.assignedWorkerId === params.reviewerId;

    if (!isPoster && !isWorker) {
      return { success: false, error: 'Only participants in this completed task can submit a review.' };
    }

    const revieweeId = isPoster ? task.assignedWorkerId! : task.posterId;
    const revieweeName = isPoster ? task.assignedWorkerName! : task.posterName;
    const revieweeRole = isPoster ? 'WORKER' : 'POSTER';

    const existingReviews = this.reviews.get(params.taskId) || [];
    const alreadyReviewed = existingReviews.some((r) => r.reviewerId === params.reviewerId);
    if (alreadyReviewed) {
      return { success: false, error: 'You have already reviewed this task.' };
    }

    const review: TaskReview = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      taskId: params.taskId,
      reviewerId: params.reviewerId,
      reviewerName: params.reviewerName,
      reviewerAvatar: params.reviewerAvatar,
      revieweeId,
      revieweeName,
      revieweeRole,
      rating: Math.max(1, Math.min(5, params.rating)),
      comment: params.comment,
      createdAt: new Date().toISOString(),
      status: 'APPROVED',
    };

    existingReviews.push(review);
    this.reviews.set(params.taskId, existingReviews);

    // Update reviewee profile rating average
    if (revieweeRole === 'WORKER') {
      const profile = this.workerProfiles.get(revieweeId);
      if (profile) {
        const totalReviews = profile.totalReviewsCount + 1;
        const newAvg = ((profile.ratingAverage * profile.totalReviewsCount) + review.rating) / totalReviews;
        profile.ratingAverage = Number(newAvg.toFixed(1));
        profile.totalReviewsCount = totalReviews;
        this.workerProfiles.set(revieweeId, profile);
      }
    }

    return { success: true, review };
  }

  getTaskReviews(taskId: string): TaskReview[] {
    return this.reviews.get(taskId) || [];
  }

  getWorkerProfile(userId: string): WorkerProfile | null {
    return this.workerProfiles.get(userId) || null;
  }

  upsertWorkerProfile(userId: string, data: Partial<WorkerProfile>): WorkerProfile {
    const existing = this.workerProfiles.get(userId) || {
      userId,
      displayName: 'Student Freelancer',
      skills: [],
      currency: 'USD',
      countryCode: 'KE',
      completedTasksCount: 0,
      completionRate: 100,
      ratingAverage: 5.0,
      totalReviewsCount: 0,
      portfolio: [],
      languages: ['English'],
      availability: 'PART_TIME',
      kycStatus: KYCStatus.NOT_REQUIRED,
    };

    const updated: WorkerProfile = {
      ...existing,
      ...data,
      userId,
    };

    this.workerProfiles.set(userId, updated);
    return updated;
  }
}

export const tasksService = new TasksService();

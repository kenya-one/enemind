/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AccommodationListing,
  CampusEvent,
  CommunityCategory,
  CommunityGroup,
  EnermindOrder,
  GigListing,
  MarketplaceListing,
  OpportunityListing,
  OpportunityType,
  OrderStatus,
  PaymentProvider,
} from '../../src/types/index.js';
import { currencyService } from './currency.js';
import { pesapalService } from './pesapal.js';

import { accommodationService } from './accommodation.js';

export const INITIAL_OPPORTUNITIES: any[] = [
  {
    id: 'opp-google-swe-intern',
    organizationId: 'org-google',
    organizationName: 'Google',
    organization: 'Google',
    title: 'Google Software Engineering Summer Internship 2026',
    description: 'Join Google engineers working on core infrastructure, Gemini AI applications, Android ecosystem, and cloud services. Open to enrolled university students.',
    type: OpportunityType.INTERNSHIP,
    industry: 'Technology / Software',
    location: 'Nairobi / London / Mountain View / Remote',
    country: 'United States',
    countryCode: 'US',
    city: 'Mountain View',
    remoteType: 'REMOTE',
    isRemote: true,
    salaryMin: 6500,
    salaryMax: 8500,
    salaryCurrency: 'USD',
    salaryPeriod: 'MONTHLY',
    isSalaryDisclosed: true,
    applicationDeadline: new Date('2026-10-31').toISOString(),
    deadlineDate: new Date('2026-10-31').toISOString(),
    stipendOrSalary: 'Competitive Monthly Stipend + Relocation Assistance',
    requirements: ['Currently enrolled in a Bachelor or Master program in CS or related technical discipline', 'Proficiency in Python, Java, C++, or TypeScript', 'Strong grasp of data structures and algorithms'],
    responsibilities: ['Develop scalable software components', 'Participate in architectural reviews'],
    skills: ['Python', 'TypeScript', 'Data Structures', 'Git'],
    targetCourses: ['Computer Science', 'Software Engineering', 'Information Technology'],
    targetYearLevels: ['Year 2', 'Year 3'],
    status: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    applicationMethod: 'EXTERNAL_URL',
    applicationUrl: 'https://careers.google.com/students',
    isExternalLink: true,
    promotionTier: 'FEATURED',
    viewsCount: 1420,
    savesCount: 310,
    applicationsCount: 89,
    createdBy: 'usr-google-campus-recruiter',
    postedByUserId: 'usr-google-campus-recruiter',
    isVerified: true,
    createdAt: new Date('2025-01-05').toISOString(),
    updatedAt: new Date('2025-01-05').toISOString(),
    createdDate: new Date('2025-01-05').toISOString(),
  },
  {
    id: 'opp-rhodes-scholarship-2026',
    organizationId: 'org-rhodes',
    organizationName: 'The Rhodes Trust',
    organization: 'The Rhodes Trust',
    title: 'Rhodes Global Postgraduate Scholarship at Oxford',
    description: 'The world’s premier postgraduate scholarship supporting outstanding young leaders to pursue fully funded Master’s or DPhil degrees at Oxford.',
    type: OpportunityType.SCHOLARSHIP,
    industry: 'Higher Education / Research',
    location: 'University of Oxford, United Kingdom',
    country: 'United Kingdom',
    countryCode: 'GB',
    city: 'Oxford',
    remoteType: 'ON_SITE',
    isRemote: false,
    salaryMin: 19092,
    salaryMax: 19092,
    salaryCurrency: 'GBP',
    salaryPeriod: 'ANNUAL',
    isSalaryDisclosed: true,
    applicationDeadline: new Date('2026-08-01').toISOString(),
    deadlineDate: new Date('2026-08-01').toISOString(),
    stipendOrSalary: '100% University & College Tuition Fees + £19,092 Annual Living Stipend',
    requirements: ['Exceptional academic achievement (First Class Honours or equivalent)', 'Demonstrated leadership & commitment to positive impact', 'Age 18-25'],
    responsibilities: ['Engage in world-class postgraduate studies', 'Participate in Rhodes Scholar leadership retreats'],
    skills: ['Academic Research', 'Leadership', 'Critical Analysis'],
    targetYearLevels: ['Final Year / Senior', 'Graduated'],
    status: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    applicationMethod: 'EXTERNAL_URL',
    applicationUrl: 'https://www.rhodeshouse.ox.ac.uk/scholarships/the-rhodes-scholarship/',
    isExternalLink: true,
    promotionTier: 'PROMOTED',
    viewsCount: 980,
    savesCount: 240,
    applicationsCount: 42,
    createdBy: 'usr-rhodes-rep',
    postedByUserId: 'usr-rhodes-rep',
    isVerified: true,
    createdAt: new Date('2025-01-08').toISOString(),
    updatedAt: new Date('2025-01-08').toISOString(),
    createdDate: new Date('2025-01-08').toISOString(),
  },
];

export const INITIAL_GIGS: GigListing[] = [
  {
    id: 'gig-python-tutoring',
    title: 'Need 1-on-1 Tutoring in Data Structures (Python & Graphs)',
    description: 'Looking for a 3rd/4th year CS student to help me revise binary search trees, dynamic programming, and Dijkstra algorithms for upcoming midterms.',
    category: 'TUTORING',
    budgetAmount: 30,
    currency: 'USD',
    institutionId: 'inst-uon-ke',
    campusId: 'camp-uon-main',
    postedByUserId: 'usr-student-2',
    posterDisplayName: 'Alex Kamau',
    status: 'OPEN',
    proposalsCount: 3,
    createdDate: new Date('2025-01-20').toISOString(),
  },
  {
    id: 'gig-club-poster-design',
    title: 'Graphic Design for Campus Hackathon Poster & Badges',
    description: 'Need vibrant, high-resolution social media flyers and printable A2 poster designs for the upcoming Annual Tech Hackathon.',
    category: 'GRAPHIC_DESIGN',
    budgetAmount: 45,
    currency: 'USD',
    institutionId: 'inst-uon-ke',
    campusId: 'camp-uon-main',
    postedByUserId: 'usr-student-3',
    posterDisplayName: 'Tech Club Executive',
    status: 'OPEN',
    proposalsCount: 5,
    createdDate: new Date('2025-01-22').toISOString(),
  },
];

export const INITIAL_MARKETPLACE: MarketplaceListing[] = [
  {
    id: 'mkt-scientific-calculator',
    title: 'Casio fx-991EX ClassWiz Advanced Scientific Calculator',
    description: 'Original Casio scientific calculator in excellent condition. Perfect for Engineering, Physics, and Advanced Calculus exams.',
    category: 'STATIONERY',
    price: 22,
    currency: 'USD',
    condition: 'LIKE_NEW',
    photos: ['https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80'],
    institutionId: 'inst-uon-ke',
    campusId: 'camp-uon-main',
    sellerId: 'usr-student-4',
    sellerDisplayName: 'Sarah Mwangi',
    sellerContact: '+254700112233',
    isSold: false,
    createdDate: new Date('2025-01-18').toISOString(),
  },
];

export const INITIAL_COMMUNITIES: CommunityGroup[] = [
  {
    id: 'comm-uon-cs-year3',
    name: 'UoN BSc Computer Science Class of 2026',
    institutionId: 'inst-uon-ke',
    campusId: 'camp-uon-main',
    institutionName: 'University of Nairobi',
    campusName: 'Main Campus (Nairobi CBD)',
    courseName: 'BSc Computer Science',
    yearLevel: 'Year 3',
    category: CommunityCategory.COURSE,
    description: 'Official student peer group for lecture reminders, past papers, project group discussions, and exam revision.',
    joinUrl: 'https://chat.whatsapp.com/invite/enermind-uon-cs3-official',
    platform: 'WHATSAPP',
    submittedByUserId: 'usr-enermind-lead',
    isOfficial: true,
    isVerified: true,
    memberCountEstimate: 145,
    createdDate: new Date('2025-01-01').toISOString(),
  },
  {
    id: 'comm-oxford-ai-society',
    name: 'Oxford University AI & Machine Learning Society',
    institutionId: 'inst-oxford-gb',
    campusId: 'camp-oxford-main',
    institutionName: 'University of Oxford',
    campusName: 'Central Campus',
    category: CommunityCategory.ACADEMIC,
    description: 'Discussion group for AI research papers, speaker sessions with DeepMind/OpenAI researchers, and hackathons.',
    joinUrl: 'https://chat.whatsapp.com/invite/oxford-ai-soc-global',
    platform: 'WHATSAPP',
    submittedByUserId: 'usr-oxford-rep',
    isOfficial: false,
    isVerified: true,
    memberCountEstimate: 380,
    createdDate: new Date('2025-01-05').toISOString(),
  },
];

export const INITIAL_EVENTS: CampusEvent[] = [
  {
    id: 'evt-global-campus-hackathon',
    title: 'Enermind Global Student AI & Innovation Hackathon 2026',
    description: '48-hour global virtual hackathon for university students building campus utilities, Gemini AI tools, and fintech solutions.',
    institutionId: 'inst-uon-ke',
    category: 'HACKATHON',
    startDate: new Date('2026-09-12T09:00:00Z').toISOString(),
    endDate: new Date('2026-09-14T18:00:00Z').toISOString(),
    location: 'Virtual / Google Meet + Main Campus Innovation Hub',
    isVirtual: true,
    organizerName: 'Enermind Global Student Guild',
    registrationUrl: 'https://enermind.org/hackathon-2026',
    createdDate: new Date('2025-01-10').toISOString(),
  },
  {
    id: 'evt-exam-deadline-sem1',
    title: 'University Semester 1 Examinations Commencement',
    description: 'Official examination dates across all faculties. Please verify student ID and examination clearance slips in your Student Portal.',
    institutionId: 'inst-uon-ke',
    category: 'ACADEMIC_DEADLINE',
    startDate: new Date('2026-11-20T08:00:00Z').toISOString(),
    endDate: new Date('2026-12-05T17:00:00Z').toISOString(),
    location: 'Main Campus Examination Halls',
    isVirtual: false,
    organizerName: 'Academic Registrar',
    createdDate: new Date('2025-01-15').toISOString(),
  },
];

class OrderAndListingService {
  private orders: Map<string, EnermindOrder> = new Map();
  private accommodation: Map<string, AccommodationListing> = new Map();
  private opportunities: Map<string, OpportunityListing> = new Map();
  private gigs: Map<string, GigListing> = new Map();
  private marketplace: Map<string, MarketplaceListing> = new Map();
  private communities: Map<string, CommunityGroup> = new Map();
  private events: Map<string, CampusEvent> = new Map();

  constructor() {
    INITIAL_OPPORTUNITIES.forEach((o) => this.opportunities.set(o.id, o));
    INITIAL_GIGS.forEach((g) => this.gigs.set(g.id, g));
    INITIAL_MARKETPLACE.forEach((m) => this.marketplace.set(m.id, m));
    INITIAL_COMMUNITIES.forEach((c) => this.communities.set(c.id, c));
    INITIAL_EVENTS.forEach((e) => this.events.set(e.id, e));
  }

  // Listings getters
  getAccommodation(institutionId?: string) {
    const list = accommodationService.getProperties();
    return institutionId ? list.filter((a) => a.institutionIds.includes(institutionId)) : list;
  }

  getOpportunities(type?: OpportunityType) {
    const list = Array.from(this.opportunities.values());
    return type ? list.filter((o) => o.type === type) : list;
  }

  getGigs() {
    return Array.from(this.gigs.values());
  }

  getMarketplace() {
    return Array.from(this.marketplace.values());
  }

  getCommunities(institutionId?: string, category?: CommunityCategory) {
    let list = Array.from(this.communities.values());
    if (institutionId) list = list.filter((c) => c.institutionId === institutionId);
    if (category) list = list.filter((c) => c.category === category);
    return list;
  }

  submitCommunity(group: Omit<CommunityGroup, 'id' | 'createdDate' | 'isVerified'>): CommunityGroup {
    const newGroup: CommunityGroup = {
      ...group,
      id: `comm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      isVerified: false,
      createdDate: new Date().toISOString(),
    };
    this.communities.set(newGroup.id, newGroup);
    return newGroup;
  }

  getEvents(institutionId?: string) {
    const list = Array.from(this.events.values());
    return institutionId ? list.filter((e) => e.institutionId === institutionId) : list;
  }

  // Universal Orders Management
  createOrder(params: {
    userId: string;
    userEmail: string;
    productId: string;
    productTitle: string;
    productType: EnermindOrder['productType'];
    amount: number;
    currency: string;
    displayCurrency: string;
    paymentProvider: PaymentProvider;
  }): EnermindOrder {
    const id = `ord-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const conversion = currencyService.convert(params.amount, params.currency, params.displayCurrency);

    const order: EnermindOrder = {
      id,
      userId: params.userId,
      userEmail: params.userEmail,
      productId: params.productId,
      productTitle: params.productTitle,
      productType: params.productType,
      originalAmount: params.amount,
      originalCurrency: params.currency,
      displayAmount: conversion.targetAmount,
      displayCurrency: conversion.targetCurrency,
      exchangeRate: conversion.rate,
      paymentProvider: params.paymentProvider,
      merchantReference: `ENR-${id}`,
      status: OrderStatus.CREATED,
      createdDate: new Date().toISOString(),
    };

    this.orders.set(order.id, order);
    return order;
  }

  getOrderById(id: string): EnermindOrder | undefined {
    return this.orders.get(id);
  }

  getUserOrders(userId: string): EnermindOrder[] {
    return Array.from(this.orders.values()).filter((o) => o.userId === userId);
  }

  getAllOrders(): EnermindOrder[] {
    return Array.from(this.orders.values());
  }

  updateOrderStatus(orderId: string, status: OrderStatus, pesapalTrackingId?: string): EnermindOrder | null {
    const order = this.orders.get(orderId);
    if (!order) return null;

    order.status = status;
    if (pesapalTrackingId) order.pesapalTrackingId = pesapalTrackingId;
    if (status === OrderStatus.PAID) {
      order.paidDate = new Date().toISOString();
    } else if (status === OrderStatus.REFUNDED) {
      order.refundedDate = new Date().toISOString();
    }

    this.orders.set(orderId, order);
    return order;
  }
}

export const orderAndListingService = new OrderAndListingService();

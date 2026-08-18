/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AcademicResourceType,
  AcademicSubmissionRequest,
  AccommodationListing,
  AuditLogEntry,
  CampusEvent,
  CampusSubmission,
  CommunityCategory,
  CommunityGroup,
  CountryInfo,
  CurrencyRate,
  DriveConnectionStatus,
  DriveStorageQuota,
  DuplicateCheckResult,
  EnermindDriveWorkspace,
  EnermindFile,
  EnermindOrder,
  GigListing,
  Institution,
  InstitutionStatus,
  LedgerEntry,
  MarketplaceListing,
  OpportunityListing,
  OpportunityType,
  PlatformFeeConfig,
  PrivateVaultFolder,
  SecurityTestResult,
  ServiceConfigStatus,
  SheetCategory,
  SheetProduct,
  Task,
  TaskApplication,
  TaskCategory,
  TaskDispute,
  TaskReport,
  TaskReview,
  TaskSubmission,
  UserProfile,
  UserRole,
  VaultCategory,
  Withdrawal,
  WorkerProfile,
} from '../types/index.js';

export const api = {
  // Config & Health
  async getConfigStatus(): Promise<{ platform: string; environment: string; services: ServiceConfigStatus[] }> {
    const res = await fetch('/api/config/status');
    if (!res.ok) throw new Error('Failed to fetch config status');
    return res.json();
  },

  // Auth & Profile
  async getSession(): Promise<{ user: UserProfile | null }> {
    const res = await fetch('/api/auth/session');
    if (!res.ok) throw new Error('Failed to fetch user session');
    return res.json();
  },

  async getGoogleAuthUrl(): Promise<{ url: string; isConfigured: boolean; redirectUri: string; message: string }> {
    const res = await fetch('/api/auth/google/url');
    if (!res.ok) throw new Error('Failed to get Google OAuth URL');
    return res.json();
  },

  async verifyGoogleToken(token: string): Promise<{ success: boolean; user: UserProfile }> {
    const res = await fetch('/api/auth/verify-google-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Token verification failed');
    }
    return res.json();
  },

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<{ success: boolean; user: UserProfile }> {
    const res = await fetch('/api/auth/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, updates }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update profile');
    }
    return res.json();
  },

  async login(identifier: string, password?: string): Promise<{ success: boolean; user: UserProfile }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to sign in');
    }
    return res.json();
  },

  async signup(data: {
    email: string;
    displayName: string;
    institutionId?: string;
    institutionName?: string;
    campusId?: string;
    campusName?: string;
    courseName?: string;
    role?: UserRole;
    countryCode?: string;
    password?: string;
  }): Promise<{ success: boolean; user: UserProfile }> {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create account');
    }
    return res.json();
  },

  async getDemoAccounts(): Promise<{ accounts: UserProfile[] }> {
    const res = await fetch('/api/auth/demo-accounts');
    if (!res.ok) throw new Error('Failed to fetch demo accounts');
    return res.json();
  },

  async switchUser(userId: string): Promise<{ success: boolean; user: UserProfile }> {
    const res = await fetch('/api/auth/switch-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to switch user');
    }
    return res.json();
  },

  async logout(): Promise<{ success: boolean }> {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to log out');
    return res.json();
  },

  // Countries & Institutions
  async getCountries(): Promise<{ countries: CountryInfo[] }> {
    const res = await fetch('/api/countries');
    if (!res.ok) throw new Error('Failed to fetch countries');
    return res.json();
  },

  async getInstitutions(countryCode?: string, status?: InstitutionStatus): Promise<{ institutions: Institution[] }> {
    const params = new URLSearchParams();
    if (countryCode) params.set('countryCode', countryCode);
    if (status) params.set('status', status);
    const res = await fetch(`/api/institutions?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch institutions');
    return res.json();
  },

  async searchInstitutions(query: string, countryCode?: string): Promise<{ results: Institution[] }> {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (countryCode) params.set('countryCode', countryCode);
    const res = await fetch(`/api/institutions/search?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to search institutions');
    return res.json();
  },

  async checkInstitutionDuplicates(name: string, countryCode: string): Promise<DuplicateCheckResult> {
    const params = new URLSearchParams({ name, countryCode });
    const res = await fetch(`/api/institutions/check-duplicates?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to check duplicate institutions');
    return res.json();
  },

  async proposeInstitution(data: {
    countryCode: string;
    name: string;
    shortName?: string;
    type?: any;
    website?: string;
    city?: string;
    submissionNotes?: string;
    submittedByUserId?: string;
    campusName?: string;
  }): Promise<{ success: boolean; institution: Institution; duplicates?: DuplicateCheckResult; message: string }> {
    const res = await fetch('/api/institutions/propose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to propose institution');
    }
    return res.json();
  },

  async submitCampus(data: {
    institutionId: string;
    campusName: string;
    city: string;
    countryCode: string;
    address?: string;
    website?: string;
    description?: string;
    submittedByUserId?: string;
  }): Promise<{ success: boolean; submission: CampusSubmission }> {
    const res = await fetch('/api/institutions/campuses/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit campus');
    }
    return res.json();
  },

  // Currency
  async getCurrencyRates(): Promise<{ baseCurrency: string; rates: CurrencyRate[]; timestamp: string }> {
    const res = await fetch('/api/currency/rates');
    if (!res.ok) throw new Error('Failed to fetch currency rates');
    return res.json();
  },

  async convertCurrency(amount: number, fromCurrency: string, toCurrency: string) {
    const res = await fetch('/api/currency/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, fromCurrency, toCurrency }),
    });
    if (!res.ok) throw new Error('Currency conversion failed');
    return res.json();
  },

  // Gemini AI
  async askGemini(params: {
    category: string;
    prompt: string;
    userContext?: any;
    hasPrivateVaultAuthorization?: boolean;
  }): Promise<{ response: string; category: string; suggestedActions?: string[]; isConfigured: boolean }> {
    const res = await fetch('/api/gemini/assist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Gemini API call failed');
    return res.json();
  },

  async explainPaper(params: { paperTitle: string; questionText: string; courseName?: string }) {
    const res = await fetch('/api/gemini/explain-paper', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Paper explainer failed');
    return res.json();
  },

  // Google Sheets & Drive
  async getSheetProducts(category?: SheetCategory): Promise<{ products: SheetProduct[] }> {
    const url = category ? `/api/sheet-store/products?category=${encodeURIComponent(category)}` : '/api/sheet-store/products';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch sheet products');
    return res.json();
  },

  async getTemplateStructure(id: string) {
    const res = await fetch(`/api/sheet-store/template-structure/${id}`);
    if (!res.ok) throw new Error('Failed to fetch template structure');
    return res.json();
  },

  async getPrivateVaultCategories(): Promise<{ categories: PrivateVaultFolder[] }> {
    const res = await fetch('/api/workspace/private-vault/categories');
    if (!res.ok) throw new Error('Failed to fetch private vault categories');
    return res.json();
  },

  // Google Drive & Workspace
  async getDriveStatus(): Promise<{
    status: DriveConnectionStatus;
    quota: DriveStorageQuota;
    workspace: EnermindDriveWorkspace;
    userConnected: boolean;
  }> {
    const res = await fetch('/api/workspace/drive/status');
    if (!res.ok) throw new Error('Failed to fetch Drive status');
    return res.json();
  },

  async connectDrive(): Promise<{ success: boolean; status: string; message: string }> {
    const res = await fetch('/api/workspace/drive/connect', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to connect Google Drive');
    return res.json();
  },

  async disconnectDrive(): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/workspace/drive/disconnect', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to disconnect Google Drive');
    return res.json();
  },

  async getUserFiles(filters?: {
    userId?: string;
    resourceType?: string;
    category?: string;
    courseCode?: string;
    unitCode?: string;
    examType?: string;
    q?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ files: EnermindFile[]; total: number; categoriesCount: Record<string, number> }> {
    const params = new URLSearchParams();
    if (filters?.userId) params.set('userId', filters.userId);
    if (filters?.resourceType) params.set('resourceType', filters.resourceType);
    if (filters?.category) params.set('category', filters.category);
    if (filters?.courseCode) params.set('courseCode', filters.courseCode);
    if (filters?.unitCode) params.set('unitCode', filters.unitCode);
    if (filters?.examType) params.set('examType', filters.examType);
    if (filters?.q) params.set('q', filters.q);
    if (filters?.limit) params.set('limit', String(filters.limit));
    if (filters?.offset) params.set('offset', String(filters.offset));

    const res = await fetch(`/api/workspace/files?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch workspace files');
    return res.json();
  },

  async getFileById(id: string): Promise<{ file: EnermindFile }> {
    const res = await fetch(`/api/workspace/files/${encodeURIComponent(id)}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to fetch file');
    }
    return res.json();
  },

  async uploadFile(fileData: {
    name: string;
    mimeType: string;
    sizeBytes: number;
    category: VaultCategory | string;
    resourceType: 'PRIVATE_VAULT' | AcademicResourceType | 'SPREADSHEET' | 'RECEIPT' | 'OTHER';
    institutionId?: string;
    institutionName?: string;
    campusId?: string;
    campusName?: string;
    courseId?: string;
    courseCode?: string;
    courseName?: string;
    unitCode?: string;
    unitName?: string;
    topic?: string;
    yearLevel?: string;
    academicYear?: number | string;
    semester?: string;
    examType?: 'MAIN' | 'SPECIAL' | 'CAT' | 'SUPPLEMENTARY' | 'RETAKE' | 'MIDTERM' | 'FINAL';
    sampleQuestion?: string;
    tags?: string[];
  }): Promise<{ success: boolean; file: EnermindFile; message: string }> {
    const res = await fetch('/api/workspace/files/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fileData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'File upload failed');
    }
    return res.json();
  },

  async renameFile(id: string, newName: string): Promise<{ success: boolean; file: EnermindFile }> {
    const res = await fetch(`/api/workspace/files/${encodeURIComponent(id)}/rename`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newName }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to rename file');
    }
    return res.json();
  },

  async moveFile(id: string, newCategory: VaultCategory | string): Promise<{ success: boolean; file: EnermindFile }> {
    const res = await fetch(`/api/workspace/files/${encodeURIComponent(id)}/move`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newCategory }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to move file');
    }
    return res.json();
  },

  async deleteFile(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`/api/workspace/files/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete file');
    }
    return res.json();
  },

  async submitAcademicResource(req: AcademicSubmissionRequest): Promise<{ success: boolean; file: EnermindFile; message: string }> {
    const res = await fetch('/api/workspace/academic/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Resource submission failed');
    }
    return res.json();
  },

  async getPublicAcademicCatalog(filters?: {
    institutionId?: string;
    courseCode?: string;
    resourceType?: string;
    academicYear?: number | string;
    q?: string;
  }): Promise<{ catalog: EnermindFile[] }> {
    const params = new URLSearchParams();
    if (filters?.institutionId) params.set('institutionId', filters.institutionId);
    if (filters?.courseCode) params.set('courseCode', filters.courseCode);
    if (filters?.resourceType) params.set('resourceType', filters.resourceType);
    if (filters?.academicYear) params.set('academicYear', String(filters.academicYear));
    if (filters?.q) params.set('q', filters.q);

    const res = await fetch(`/api/workspace/academic/public?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch public academic catalog');
    return res.json();
  },

  async processDocumentAi(params: {
    fileId: string;
    userExplicitConsent: boolean;
    action: 'SUMMARIZE_NOTES' | 'EXPLAIN_PAST_PAPER' | 'GENERATE_QUIZ' | 'SEMANTIC_SEARCH';
    questionQuery?: string;
    targetLength?: 'BRIEF' | 'DETAILED' | 'EXAM_PREP';
  }) {
    const res = await fetch('/api/workspace/document-ai/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'AI document processing failed');
    }
    return res.json();
  },

  async getSecurityTestMatrix(): Promise<{
    timestamp: string;
    totalTests: number;
    passedTests: number;
    results: SecurityTestResult[];
  }> {
    const res = await fetch('/api/security/test-matrix');
    if (!res.ok) throw new Error('Failed to run security test matrix');
    return res.json();
  },

  // Accommodation & Housing Marketplace
  async getAccommodation(institutionId?: string): Promise<{ listings: AccommodationListing[] }> {
    const url = institutionId ? `/api/accommodation?institutionId=${encodeURIComponent(institutionId)}` : '/api/accommodation';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch accommodation listings');
    return res.json();
  },

  async searchAccommodation(params: any = {}): Promise<{
    listings: AccommodationListing[];
    properties: AccommodationListing[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.set(key, String(val));
      }
    });
    const res = await fetch(`/api/accommodation?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to search accommodation');
    return res.json();
  },

  async getPropertyById(id: string): Promise<{ property: AccommodationListing }> {
    const res = await fetch(`/api/accommodation/properties/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Failed to fetch property details');
    return res.json();
  },

  async getRecommendedAccommodation(params: { countryCode?: string; institutionId?: string; campusId?: string } = {}): Promise<{
    recommendations: AccommodationListing[];
  }> {
    const query = new URLSearchParams();
    if (params.countryCode) query.set('countryCode', params.countryCode);
    if (params.institutionId) query.set('institutionId', params.institutionId);
    if (params.campusId) query.set('campusId', params.campusId);
    const res = await fetch(`/api/accommodation/recommended?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch recommended accommodation');
    return res.json();
  },

  async createProperty(data: any): Promise<{ success: boolean; property: AccommodationListing; duplicateCheck: any }> {
    const res = await fetch('/api/accommodation/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create property listing');
    }
    return res.json();
  },

  async updateProperty(id: string, updates: any): Promise<{ success: boolean; property: AccommodationListing }> {
    const res = await fetch(`/api/accommodation/properties/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update property');
    }
    return res.json();
  },

  async updatePropertyAvailability(id: string, totalUnits: number, availableUnits: number): Promise<{ success: boolean; property: AccommodationListing }> {
    const res = await fetch(`/api/accommodation/properties/${encodeURIComponent(id)}/availability`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ totalUnits, availableUnits }),
    });
    if (!res.ok) throw new Error('Failed to update availability');
    return res.json();
  },

  async updatePropertyStatus(id: string, action: 'PAUSE' | 'RESUME' | 'MARK_FULL' | 'ARCHIVE'): Promise<{ success: boolean; property: AccommodationListing }> {
    const res = await fetch(`/api/accommodation/properties/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    if (!res.ok) throw new Error('Failed to change property status');
    return res.json();
  },

  async renewPropertyListing(id: string): Promise<{ success: boolean; property: AccommodationListing }> {
    const res = await fetch(`/api/accommodation/properties/${encodeURIComponent(id)}/renew`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to renew listing');
    return res.json();
  },

  async submitPropertyVerification(id: string, documents: any[]): Promise<{ success: boolean; property: AccommodationListing }> {
    const res = await fetch(`/api/accommodation/properties/${encodeURIComponent(id)}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documents }),
    });
    if (!res.ok) throw new Error('Failed to submit verification');
    return res.json();
  },

  async getOwnerProperties(ownerId?: string): Promise<{ properties: AccommodationListing[] }> {
    const url = ownerId ? `/api/accommodation/owner/properties?ownerId=${encodeURIComponent(ownerId)}` : '/api/accommodation/owner/properties';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch owner properties');
    return res.json();
  },

  async createPropertyInquiry(data: any): Promise<{ success: boolean; inquiry: any }> {
    const res = await fetch('/api/accommodation/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to send inquiry');
    return res.json();
  },

  async getStudentInquiries(studentId?: string): Promise<{ inquiries: any[] }> {
    const url = studentId ? `/api/accommodation/inquiries/student?studentId=${encodeURIComponent(studentId)}` : '/api/accommodation/inquiries/student';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch student inquiries');
    return res.json();
  },

  async getOwnerInquiries(ownerId?: string): Promise<{ inquiries: any[] }> {
    const url = ownerId ? `/api/accommodation/inquiries/owner?ownerId=${encodeURIComponent(ownerId)}` : '/api/accommodation/inquiries/owner';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch owner inquiries');
    return res.json();
  },

  async respondToPropertyInquiry(inquiryId: string, responseMessage: string): Promise<{ success: boolean; inquiry: any }> {
    const res = await fetch(`/api/accommodation/inquiries/${encodeURIComponent(inquiryId)}/respond`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ responseMessage }),
    });
    if (!res.ok) throw new Error('Failed to respond to inquiry');
    return res.json();
  },

  async toggleSaveProperty(propertyId: string): Promise<{ isSaved: boolean; message: string }> {
    const res = await fetch('/api/accommodation/saved', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId }),
    });
    if (!res.ok) throw new Error('Failed to update saved property');
    return res.json();
  },

  async getSavedProperties(currency?: string): Promise<{ saved: AccommodationListing[] }> {
    const url = currency ? `/api/accommodation/saved?currency=${encodeURIComponent(currency)}` : '/api/accommodation/saved';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch saved properties');
    return res.json();
  },

  async compareProperties(propertyIds: string[], currency?: string): Promise<{ comparison: AccommodationListing[] }> {
    const res = await fetch('/api/accommodation/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyIds, currency }),
    });
    if (!res.ok) throw new Error('Failed to compare properties');
    return res.json();
  },

  async submitPropertyReview(data: any): Promise<{ success: boolean; review: any }> {
    const res = await fetch('/api/accommodation/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit review');
    return res.json();
  },

  async getPropertyReviews(propertyId: string): Promise<{ reviews: any[] }> {
    const res = await fetch(`/api/accommodation/reviews/${encodeURIComponent(propertyId)}`);
    if (!res.ok) throw new Error('Failed to fetch property reviews');
    return res.json();
  },

  async reportProperty(data: any): Promise<{ success: boolean; report: any }> {
    const res = await fetch('/api/accommodation/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit report');
    return res.json();
  },

  async askAccommodationAI(query: string, currency?: string): Promise<{
    answer: string;
    recommendedPropertyIds: string[];
    suggestedFilters?: any;
  }> {
    const res = await fetch('/api/accommodation/ai-assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, currency }),
    });
    if (!res.ok) throw new Error('Failed to query Accommodation AI');
    return res.json();
  },

  // Opportunities, Gigs, Marketplace & Careers (Phase 7)

  async searchOpportunities(params: any = {}): Promise<{
    opportunities: OpportunityListing[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        if (Array.isArray(val)) {
          val.forEach((item) => query.append(key, String(item)));
        } else {
          query.set(key, String(val));
        }
      }
    });
    const res = await fetch(`/api/opportunities/search?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to search opportunities');
    return res.json();
  },

  async getOpportunities(type?: OpportunityType, currency?: string): Promise<{ listings: OpportunityListing[]; total?: number }> {
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (currency) params.set('currency', currency);
    const res = await fetch(`/api/opportunities?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch opportunities');
    return res.json();
  },

  async getOpportunityById(id: string): Promise<{ opportunity: OpportunityListing }> {
    const res = await fetch(`/api/opportunities/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Failed to fetch opportunity details');
    return res.json();
  },

  async getRecommendedOpportunities(): Promise<{ recommendations: Array<{ opportunity: OpportunityListing; score: number; matchReasons: string[] }> }> {
    const res = await fetch('/api/opportunities/recommendations');
    if (!res.ok) throw new Error('Failed to fetch recommendations');
    return res.json();
  },

  async getSkillsCatalog(): Promise<{ skills: Array<{ id: string; name: string; category: string }> }> {
    const res = await fetch('/api/opportunities/skills');
    if (!res.ok) throw new Error('Failed to fetch skills catalog');
    return res.json();
  },

  async getOrganizations(): Promise<{ organizations: any[] }> {
    const res = await fetch('/api/opportunities/organizations');
    if (!res.ok) throw new Error('Failed to fetch organizations');
    return res.json();
  },

  async createOpportunity(data: any): Promise<{ success: boolean; opportunity: OpportunityListing }> {
    const res = await fetch('/api/opportunities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to post opportunity');
    }
    return res.json();
  },

  async updateOpportunity(id: string, updates: any): Promise<{ success: boolean; opportunity: OpportunityListing }> {
    const res = await fetch(`/api/opportunities/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update opportunity');
    }
    return res.json();
  },

  async updateOpportunityStatus(id: string, action: 'PAUSE' | 'RESUME' | 'CLOSE' | 'ARCHIVE'): Promise<{ success: boolean; opportunity: OpportunityListing }> {
    const res = await fetch(`/api/opportunities/${encodeURIComponent(id)}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    if (!res.ok) throw new Error('Failed to change opportunity status');
    return res.json();
  },

  async applyToOpportunity(opportunityId: string, payload: any): Promise<{ success: boolean; application: any }> {
    const res = await fetch(`/api/opportunities/${encodeURIComponent(opportunityId)}/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit application');
    }
    return res.json();
  },

  async getStudentApplications(): Promise<{ applications: any[] }> {
    const res = await fetch('/api/opportunities/applications/student');
    if (!res.ok) throw new Error('Failed to fetch student applications');
    return res.json();
  },

  async getEmployerApplications(): Promise<{ applications: any[] }> {
    const res = await fetch('/api/opportunities/applications/employer');
    if (!res.ok) throw new Error('Failed to fetch employer applications');
    return res.json();
  },

  async updateApplicationStatus(applicationId: string, status: string, employerNotes?: string): Promise<{ success: boolean; application: any }> {
    const res = await fetch(`/api/opportunities/applications/${encodeURIComponent(applicationId)}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, employerNotes }),
    });
    if (!res.ok) throw new Error('Failed to update application status');
    return res.json();
  },

  async withdrawApplication(applicationId: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/opportunities/applications/${encodeURIComponent(applicationId)}/withdraw`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to withdraw application');
    return res.json();
  },

  async getSavedOpportunities(): Promise<{ saved: OpportunityListing[] }> {
    const res = await fetch('/api/opportunities/saved/my-list');
    if (!res.ok) throw new Error('Failed to fetch saved opportunities');
    return res.json();
  },

  async toggleSaveOpportunity(opportunityId: string): Promise<{ isSaved: boolean; count: number }> {
    const res = await fetch(`/api/opportunities/${encodeURIComponent(opportunityId)}/save-toggle`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to toggle save');
    return res.json();
  },

  async getCareerProfile(): Promise<{ profile: any }> {
    const res = await fetch('/api/opportunities/career-profile/me');
    if (!res.ok) throw new Error('Failed to fetch career profile');
    return res.json();
  },

  async saveCareerProfile(profileData: any): Promise<{ success: boolean; profile: any }> {
    const res = await fetch('/api/opportunities/career-profile/me', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    if (!res.ok) throw new Error('Failed to save career profile');
    return res.json();
  },

  async reportOpportunity(opportunityId: string, data: { reason: string; details: string; reporterEmail?: string }): Promise<{ success: boolean; report: any }> {
    const res = await fetch(`/api/opportunities/${encodeURIComponent(opportunityId)}/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit report');
    }
    return res.json();
  },

  async askOpportunityAI(query: string): Promise<{ answer: string; recommendedOpportunityIds: string[] }> {
    const res = await fetch('/api/opportunities/ai-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) throw new Error('Failed to search opportunities with AI');
    return res.json();
  },

  async runCareerAITool(params: { action: string; opportunityId?: string; customPrompt?: string }): Promise<{ result: string; actionItems: string[] }> {
    const res = await fetch('/api/opportunities/ai-career-tool', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to run career AI tool');
    return res.json();
  },

  // Admin Opportunities Moderation
  async getPendingOpportunities(): Promise<{ pending: OpportunityListing[] }> {
    const res = await fetch('/api/admin/opportunities/pending');
    if (!res.ok) throw new Error('Failed to fetch pending opportunities');
    return res.json();
  },

  async reviewOpportunity(params: { opportunityId: string; action: string; moderatorNotes?: string }) {
    const res = await fetch('/api/admin/opportunities/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to review opportunity');
    return res.json();
  },

  async getPendingEmployerVerifications(): Promise<{ verifications: any[] }> {
    const res = await fetch('/api/admin/employers/verifications');
    if (!res.ok) throw new Error('Failed to fetch employer verifications');
    return res.json();
  },

  async verifyEmployer(params: { organizationId: string; decision: string; notes?: string }) {
    const res = await fetch('/api/admin/employers/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to verify employer');
    return res.json();
  },

  async getOpportunityReports(status?: string): Promise<{ reports: any[] }> {
    const url = status ? `/api/admin/opportunities/reports?status=${encodeURIComponent(status)}` : '/api/admin/opportunities/reports';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch opportunity reports');
    return res.json();
  },

  async actionOpportunityReport(reportId: string, action: string, moderatorNotes?: string) {
    const res = await fetch(`/api/admin/opportunities/reports/${encodeURIComponent(reportId)}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, moderatorNotes }),
    });
    if (!res.ok) throw new Error('Failed to action opportunity report');
    return res.json();
  },

  async getGigs(): Promise<{ gigs: GigListing[] }> {
    const res = await fetch('/api/gigs');
    if (!res.ok) throw new Error('Failed to fetch gigs');
    return res.json();
  },

  async getMarketplace(): Promise<{ items: MarketplaceListing[] }> {
    const res = await fetch('/api/marketplace');
    if (!res.ok) throw new Error('Failed to fetch marketplace items');
    return res.json();
  },

  async getCommunities(institutionId?: string, category?: CommunityCategory): Promise<{ communities: CommunityGroup[] }> {
    const params = new URLSearchParams();
    if (institutionId) params.set('institutionId', institutionId);
    if (category) params.set('category', category);
    const res = await fetch(`/api/communities?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch communities');
    return res.json();
  },

  async submitCommunity(group: any): Promise<{ success: boolean; community: CommunityGroup }> {
    const res = await fetch('/api/communities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(group),
    });
    if (!res.ok) throw new Error('Failed to submit community');
    return res.json();
  },

  async getEvents(institutionId?: string): Promise<{ events: CampusEvent[] }> {
    const url = institutionId ? `/api/events?institutionId=${encodeURIComponent(institutionId)}` : '/api/events';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch campus events');
    return res.json();
  },

  // Orders & PesaPal
  async createOrder(params: any): Promise<{ success: boolean; order: EnermindOrder }> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to create order');
    return res.json();
  },

  async submitPesaPalOrder(orderId: string): Promise<{ success: boolean; redirectUrl?: string; isConfigured?: boolean; error?: string }> {
    const res = await fetch('/api/pesapal/submit-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    });
    if (!res.ok) throw new Error('Failed to submit order to PesaPal');
    return res.json();
  },

  // Admin
  async getAdminOverview() {
    const res = await fetch('/api/admin/overview');
    if (!res.ok) throw new Error('Failed to fetch admin overview');
    return res.json();
  },

  async getPendingInstitutions(): Promise<{ pending: Institution[] }> {
    const res = await fetch('/api/admin/institutions/pending');
    if (!res.ok) throw new Error('Failed to fetch pending institutions');
    return res.json();
  },

  async reviewInstitution(params: {
    institutionId: string;
    newStatus: InstitutionStatus;
    reviewerUserId?: string;
    reviewerEmail?: string;
    reviewerNotes?: string;
    targetMergeId?: string;
  }) {
    const res = await fetch('/api/admin/institutions/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to review institution');
    return res.json();
  },

  async getPendingCampuses(): Promise<{ pending: CampusSubmission[] }> {
    const res = await fetch('/api/admin/campuses/pending');
    if (!res.ok) throw new Error('Failed to fetch pending campuses');
    return res.json();
  },

  async reviewCampus(submissionId: string, action: 'APPROVE' | 'REJECT') {
    const res = await fetch('/api/admin/campuses/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submissionId, action }),
    });
    if (!res.ok) throw new Error('Failed to review campus submission');
    return res.json();
  },

  async getPendingAccommodation(): Promise<{ pending: AccommodationListing[] }> {
    const res = await fetch('/api/admin/accommodation/pending');
    if (!res.ok) throw new Error('Failed to fetch pending accommodation');
    return res.json();
  },

  async reviewAccommodation(params: { propertyId: string; action: 'APPROVE' | 'REJECT'; moderatorNotes?: string }) {
    const res = await fetch('/api/admin/accommodation/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to review property');
    return res.json();
  },

  async getPendingAccommodationVerifications(): Promise<{ verifications: AccommodationListing[] }> {
    const res = await fetch('/api/admin/accommodation/verifications');
    if (!res.ok) throw new Error('Failed to fetch pending verifications');
    return res.json();
  },

  async verifyAccommodation(params: { propertyId: string; decision: 'VERIFY' | 'REJECT'; rejectionReason?: string }) {
    const res = await fetch('/api/admin/accommodation/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to process verification');
    return res.json();
  },

  async getAccommodationReports(status?: string): Promise<{ reports: any[] }> {
    const url = status ? `/api/admin/accommodation/reports?status=${encodeURIComponent(status)}` : '/api/admin/accommodation/reports';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch accommodation reports');
    return res.json();
  },

  async actionAccommodationReport(reportId: string, action: 'DISMISS' | 'WARN_OWNER' | 'TAKEDOWN_LISTING', moderatorNotes?: string) {
    const res = await fetch(`/api/admin/accommodation/reports/${encodeURIComponent(reportId)}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, moderatorNotes }),
    });
    if (!res.ok) throw new Error('Failed to action accommodation report');
    return res.json();
  },

  async getAuditLogs(limit?: number): Promise<{ logs: AuditLogEntry[] }> {
    const url = limit ? `/api/admin/audit-logs?limit=${limit}` : '/api/admin/audit-logs';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    return res.json();
  },

  // ==========================================
  // PHASE 8: STUDENT ECONOMY (TASKS & GIGS)
  // ==========================================

  async searchTasks(params: {
    query?: string;
    category?: TaskCategory | string;
    skill?: string;
    country?: string;
    city?: string;
    campusId?: string;
    remoteType?: string;
    budgetType?: string;
    minBudget?: number;
    maxBudget?: number;
    currency?: string;
    sortBy?: string;
    posterId?: string;
    assignedWorkerId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ tasks: Task[]; total: number; page: number; totalPages: number }> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, String(val));
      }
    });
    const res = await fetch(`/api/tasks?${searchParams.toString()}`);
    if (!res.ok) throw new Error('Failed to search tasks');
    return res.json();
  },

  async getTaskFeeConfig(): Promise<PlatformFeeConfig> {
    const res = await fetch('/api/tasks/fee-config');
    if (!res.ok) throw new Error('Failed to fetch fee configuration');
    return res.json();
  },

  async getTaskById(id: string): Promise<{ task: Task }> {
    const res = await fetch(`/api/tasks/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Failed to fetch task');
    return res.json();
  },

  async createTask(data: any): Promise<{ success: boolean; task: Task; error?: string; flagged?: boolean }> {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to create task');
    return result;
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<{ success: boolean; task: Task }> {
    const res = await fetch(`/api/tasks/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update task');
    return result;
  },

  async toggleSaveTask(id: string): Promise<{ isSaved: boolean }> {
    const res = await fetch(`/api/tasks/${encodeURIComponent(id)}/save`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to toggle save task');
    return res.json();
  },

  async getUserSavedTaskIds(): Promise<{ savedIds: string[] }> {
    const res = await fetch('/api/tasks/saved/ids');
    if (!res.ok) throw new Error('Failed to fetch saved task ids');
    return res.json();
  },

  async getTaskApplications(taskId: string): Promise<{ applications: TaskApplication[] }> {
    const res = await fetch(`/api/tasks/${encodeURIComponent(taskId)}/applications`);
    if (!res.ok) throw new Error('Failed to fetch task applications');
    return res.json();
  },

  async submitTaskApplication(taskId: string, data: any): Promise<{ success: boolean; application: TaskApplication }> {
    const res = await fetch(`/api/tasks/${encodeURIComponent(taskId)}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to submit application');
    return result;
  },

  async getUserApplications(): Promise<{ applications: TaskApplication[] }> {
    const res = await fetch('/api/tasks/user/applications');
    if (!res.ok) throw new Error('Failed to fetch user applications');
    return res.json();
  },

  async assignWorkerAndFund(taskId: string, applicationId: string, orderId?: string, paymentReference?: string): Promise<{ success: boolean; task: Task }> {
    const res = await fetch(`/api/tasks/${encodeURIComponent(taskId)}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId, orderId, paymentReference }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to assign worker and fund task');
    return result;
  },

  async getTaskSubmissions(taskId: string): Promise<{ submissions: TaskSubmission[] }> {
    const res = await fetch(`/api/tasks/${encodeURIComponent(taskId)}/submissions`);
    if (!res.ok) throw new Error('Failed to fetch deliverables');
    return res.json();
  },

  async submitTaskDeliverable(taskId: string, data: any): Promise<{ success: boolean; submission: TaskSubmission }> {
    const res = await fetch(`/api/tasks/${encodeURIComponent(taskId)}/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to submit deliverable');
    return result;
  },

  async requestTaskRevision(taskId: string, reason: string): Promise<{ success: boolean; task: Task }> {
    const res = await fetch(`/api/tasks/${encodeURIComponent(taskId)}/revisions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to request revision');
    return result;
  },

  async approveAndCompleteTask(taskId: string): Promise<{ success: boolean; task: Task }> {
    const res = await fetch(`/api/tasks/${encodeURIComponent(taskId)}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to complete task');
    return result;
  },

  async openTaskDispute(taskId: string, data: { reason: string; description: string; evidence?: string[]; openedByRole?: 'POSTER' | 'WORKER' }): Promise<{ success: boolean; dispute: TaskDispute }> {
    const res = await fetch(`/api/tasks/${encodeURIComponent(taskId)}/disputes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to open dispute');
    return result;
  },

  async getTaskReviews(taskId: string): Promise<{ reviews: TaskReview[] }> {
    const res = await fetch(`/api/tasks/${encodeURIComponent(taskId)}/reviews`);
    if (!res.ok) throw new Error('Failed to fetch reviews');
    return res.json();
  },

  async submitTaskReview(taskId: string, data: { rating: number; comment: string }): Promise<{ success: boolean; review: TaskReview }> {
    const res = await fetch(`/api/tasks/${encodeURIComponent(taskId)}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to submit review');
    return result;
  },

  async reportTask(taskId: string, data: { reason: string; details: string }): Promise<{ success: boolean; report: TaskReport }> {
    const res = await fetch(`/api/tasks/${encodeURIComponent(taskId)}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to report task');
    return result;
  },

  async getWorkerEarnings(): Promise<{
    availableEarnings: number;
    pendingEarnings: number;
    completedEarnings: number;
    totalEarned: number;
    totalWithdrawn: number;
    currency: string;
    ledger: LedgerEntry[];
  }> {
    const res = await fetch('/api/tasks/worker/earnings');
    if (!res.ok) throw new Error('Failed to fetch worker earnings');
    return res.json();
  },

  async getWorkerWithdrawals(): Promise<{ withdrawals: Withdrawal[] }> {
    const res = await fetch('/api/tasks/worker/withdrawals');
    if (!res.ok) throw new Error('Failed to fetch withdrawals');
    return res.json();
  },

  async requestWorkerWithdrawal(data: {
    amount: number;
    currency: string;
    destinationType: 'MPESA' | 'AIRTEL_MONEY' | 'BANK_TRANSFER';
    destinationReference: string;
    recipientName?: string;
  }): Promise<{ success: boolean; withdrawal: Withdrawal }> {
    const res = await fetch('/api/tasks/worker/withdrawals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to request withdrawal');
    return result;
  },

  async getWorkerProfile(userId?: string): Promise<{ profile: WorkerProfile | null }> {
    const url = userId ? `/api/tasks/worker/profile?userId=${encodeURIComponent(userId)}` : '/api/tasks/worker/profile';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch worker profile');
    return res.json();
  },

  async updateWorkerProfile(data: Partial<WorkerProfile>): Promise<{ success: boolean; profile: WorkerProfile }> {
    const res = await fetch('/api/tasks/worker/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update worker profile');
    return result;
  },

  async assistTaskAI(params: {
    action: 'DRAFT_TASK' | 'DRAFT_PROPOSAL' | 'EXPLAIN_TASK' | 'SUGGEST_MILESTONES' | 'CHECK_INTEGRITY';
    taskContext?: any;
    workerContext?: any;
    customPrompt?: string;
  }): Promise<{
    result: string;
    suggestedData?: any;
    actionItems: string[];
    isClean?: boolean;
  }> {
    const res = await fetch('/api/tasks/ai/assist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to invoke Task Economy AI');
    return res.json();
  },

  // Admin Task Economy
  async getAdminTaskDisputes(status?: string): Promise<{ disputes: TaskDispute[] }> {
    const url = status ? `/api/admin/tasks/disputes?status=${encodeURIComponent(status)}` : '/api/admin/tasks/disputes';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch disputes');
    return res.json();
  },

  async resolveAdminTaskDispute(id: string, data: { decision: string; resolutionNotes: string }): Promise<{ success: boolean; dispute: TaskDispute }> {
    const res = await fetch(`/api/admin/tasks/disputes/${encodeURIComponent(id)}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to resolve dispute');
    return result;
  },

  async getAdminTaskReports(status?: string): Promise<{ reports: TaskReport[] }> {
    const url = status ? `/api/admin/tasks/reports?status=${encodeURIComponent(status)}` : '/api/admin/tasks/reports';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch reports');
    return res.json();
  },

  async actionAdminTaskReport(id: string, data: { action: string; moderatorNotes?: string }): Promise<{ success: boolean }> {
    const res = await fetch(`/api/admin/tasks/reports/${encodeURIComponent(id)}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to action report');
    return result;
  },

  async getAdminWithdrawals(): Promise<{ withdrawals: Withdrawal[] }> {
    const res = await fetch('/api/admin/tasks/withdrawals');
    if (!res.ok) throw new Error('Failed to fetch withdrawals');
    return res.json();
  },

  async processAdminWithdrawal(id: string, data: { action: 'APPROVE' | 'REJECT'; rejectionReason?: string }): Promise<{ success: boolean; withdrawal: Withdrawal }> {
    const res = await fetch(`/api/admin/tasks/withdrawals/${encodeURIComponent(id)}/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to process withdrawal');
    return result;
  },

  async updateAdminFeeConfig(data: Partial<PlatformFeeConfig>): Promise<{ success: boolean; config: PlatformFeeConfig }> {
    const res = await fetch('/api/admin/tasks/fee-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update fee configuration');
    return result;
  },

  // ==========================================
  // PHASE 10: CAMPUS EVENTS & CALENDAR
  // ==========================================

  async getCampusEvents(params: any = {}): Promise<{
    events: CampusEvent[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.set(key, String(val));
      }
    });
    const res = await fetch(`/api/campus/events?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch campus events');
    return res.json();
  },

  async getCampusEventById(id: string): Promise<{ event: CampusEvent }> {
    const res = await fetch(`/api/campus/events/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Failed to fetch event details');
    return res.json();
  },

  async createCampusEvent(data: any): Promise<{ success: boolean; event: CampusEvent; message: string }> {
    const res = await fetch('/api/campus/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to publish event');
    return result;
  },

  async updateCampusEvent(id: string, updates: any): Promise<{ success: boolean; event: CampusEvent }> {
    const res = await fetch(`/api/campus/events/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update event');
    return result;
  },

  async updateCampusEventStatus(
    id: string,
    data: { action: 'CANCEL' | 'POSTPONE'; note?: string; newStartDateTime?: string; newEndDateTime?: string }
  ): Promise<{ success: boolean; event: CampusEvent }> {
    const res = await fetch(`/api/campus/events/${encodeURIComponent(id)}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to modify event status');
    return result;
  },

  async registerForCampusEvent(id: string, notes?: string): Promise<{
    success: boolean;
    registration: EventRegistration;
    isWaitlisted: boolean;
    message: string;
  }> {
    const res = await fetch(`/api/campus/events/${encodeURIComponent(id)}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Registration failed');
    return result;
  },

  async cancelCampusEventRegistration(id: string): Promise<{ success: boolean; message: string; promotedUser?: string }> {
    const res = await fetch(`/api/campus/events/${encodeURIComponent(id)}/cancel-registration`, {
      method: 'POST',
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to cancel registration');
    return result;
  },

  async getCampusEventAttendees(id: string): Promise<{ attendees: EventRegistration[] }> {
    const res = await fetch(`/api/campus/events/${encodeURIComponent(id)}/attendees`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to load attendees');
    }
    return res.json();
  },

  async toggleSaveCampusEvent(id: string, reminderMinutes = 60): Promise<{ isSaved: boolean; message: string }> {
    const res = await fetch(`/api/campus/events/${encodeURIComponent(id)}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reminderMinutes }),
    });
    if (!res.ok) throw new Error('Failed to toggle save');
    return res.json();
  },

  async getSavedCampusEvents(): Promise<{ savedEvents: Array<CampusEvent & { savedReminderMinutes?: number }> }> {
    const res = await fetch('/api/campus/saved-events');
    if (!res.ok) throw new Error('Failed to fetch saved events');
    return res.json();
  },

  async getMyCampusRegistrations(): Promise<{ registrations: EventRegistration[] }> {
    const res = await fetch('/api/campus/registrations');
    if (!res.ok) throw new Error('Failed to fetch registrations');
    return res.json();
  },

  // Academic Deadlines
  async getAcademicDeadlines(params: any = {}): Promise<{ deadlines: AcademicDeadline[] }> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.set(key, String(val));
      }
    });
    const res = await fetch(`/api/campus/deadlines?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch deadlines');
    return res.json();
  },

  async createAcademicDeadline(data: any): Promise<{ success: boolean; deadline: AcademicDeadline }> {
    const res = await fetch('/api/campus/deadlines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to add deadline');
    return result;
  },

  // Personal Deadlines
  async getPersonalDeadlines(): Promise<{ personalDeadlines: PersonalDeadline[] }> {
    const res = await fetch('/api/campus/personal-deadlines');
    if (!res.ok) throw new Error('Failed to fetch personal deadlines');
    return res.json();
  },

  async createPersonalDeadline(data: any): Promise<{ success: boolean; personalDeadline: PersonalDeadline }> {
    const res = await fetch('/api/campus/personal-deadlines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to add personal deadline');
    return result;
  },

  async togglePersonalDeadline(id: string): Promise<{ success: boolean; personalDeadline: PersonalDeadline }> {
    const res = await fetch(`/api/campus/personal-deadlines/${encodeURIComponent(id)}/toggle`, {
      method: 'POST',
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to toggle deadline');
    return result;
  },

  async deletePersonalDeadline(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/campus/personal-deadlines/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // Exams Timetable
  async getExamsTimetable(params: any = {}): Promise<{ exams: ExamEvent[] }> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.set(key, String(val));
      }
    });
    const res = await fetch(`/api/campus/exams?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch exams timetable');
    return res.json();
  },

  async createExamSchedule(data: any): Promise<{ success: boolean; exam: ExamEvent }> {
    const res = await fetch('/api/campus/exams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to schedule exam');
    return result;
  },

  // Announcements
  async getCampusAnnouncements(institutionId?: string, campusId?: string): Promise<{ announcements: CampusAnnouncement[] }> {
    const query = new URLSearchParams();
    if (institutionId) query.set('institutionId', institutionId);
    if (campusId) query.set('campusId', campusId);
    const res = await fetch(`/api/campus/announcements?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch announcements');
    return res.json();
  },

  async createCampusAnnouncement(data: any): Promise<{ success: boolean; announcement: CampusAnnouncement }> {
    const res = await fetch('/api/campus/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to post announcement');
    return result;
  },

  // Clubs & Societies
  async getCampusClubs(params: any = {}): Promise<{ clubs: Club[] }> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.set(key, String(val));
      }
    });
    const res = await fetch(`/api/campus/clubs?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch clubs');
    return res.json();
  },

  async createCampusClub(data: any): Promise<{ success: boolean; club: Club }> {
    const res = await fetch('/api/campus/clubs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to propose club');
    return result;
  },

  async toggleFollowCampusClub(id: string): Promise<{ isFollowed: boolean; followersCount: number }> {
    const res = await fetch(`/api/campus/clubs/${encodeURIComponent(id)}/follow`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to follow/unfollow club');
    return res.json();
  },

  // Campus Locations
  async getCampusLocations(institutionId?: string, campusId?: string): Promise<{ locations: CampusLocation[] }> {
    const query = new URLSearchParams();
    if (institutionId) query.set('institutionId', institutionId);
    if (campusId) query.set('campusId', campusId);
    const res = await fetch(`/api/campus/locations?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch locations');
    return res.json();
  },

  // Combined My Calendar Feed
  async getMyCampusFeed(institutionId?: string, campusId?: string): Promise<{
    events: CampusEvent[];
    registrations: EventRegistration[];
    savedEvents: Array<CampusEvent & { savedReminderMinutes?: number }>;
    personalDeadlines: PersonalDeadline[];
    academicDeadlines: AcademicDeadline[];
    exams: ExamEvent[];
    stats: {
      registeredEventsCount: number;
      savedEventsCount: number;
      pendingDeadlinesCount: number;
      scheduledExamsCount: number;
    };
  }> {
    const query = new URLSearchParams();
    if (institutionId) query.set('institutionId', institutionId);
    if (campusId) query.set('campusId', campusId);
    const res = await fetch(`/api/campus/my-feed?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch campus feed');
    return res.json();
  },

  // Event Reporting
  async reportCampusEvent(id: string, data: { reason: string; details: string }): Promise<{ success: boolean; report: EventReport }> {
    const res = await fetch(`/api/campus/events/${encodeURIComponent(id)}/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to submit report');
    return result;
  },

  // Google Drive Event Dossier Export
  async exportEventToDrive(id: string): Promise<{ success: boolean; fileId: string; fileName: string; path: string }> {
    const res = await fetch(`/api/campus/events/${encodeURIComponent(id)}/export-drive`, {
      method: 'POST',
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to export to Google Drive');
    return result;
  },

  // Google Calendar URL Generator
  async getCampusGoogleCalendarUrl(data: {
    title: string;
    description?: string;
    location?: string;
    startDateTime: string;
    endDateTime?: string;
    timezone?: string;
  }): Promise<{ googleCalendarUrl: string }> {
    const res = await fetch('/api/campus/calendar-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to generate Google Calendar link');
    return res.json();
  },

  // Campus Calendar AI Planner
  async assistCampusCalendarAI(params: {
    action: 'PLAN_MY_WEEK' | 'WEEKLY_SUMMARY' | 'EVENT_QA' | 'STUDY_PLAN_EXAM';
    query?: string;
  }): Promise<{
    summary: string;
    suggestedSchedule?: Array<{ day: string; time: string; activity: string; type: string; itemTitle: string }>;
    actionItems: string[];
    groundedItemIds: string[];
  }> {
    const res = await fetch('/api/campus/ai/advisor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to invoke Campus AI advisor');
    return res.json();
  },

  // Admin Campus Moderation
  async getAdminCampusReports(status?: string): Promise<{ reports: EventReport[] }> {
    const url = status ? `/api/admin/campus/reports?status=${encodeURIComponent(status)}` : '/api/admin/campus/reports';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch campus reports');
    return res.json();
  },

  async moderateAdminCampusEvent(id: string, data: { action: string; moderatorNotes?: string }): Promise<{ success: boolean; event: CampusEvent }> {
    const res = await fetch(`/api/admin/campus/events/${encodeURIComponent(id)}/moderate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Moderation action failed');
    return result;
  },
};

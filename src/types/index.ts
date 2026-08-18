/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum AuthState {
  LOADING_AUTH = 'LOADING_AUTH',
  NOT_AUTHENTICATED = 'NOT_AUTHENTICATED',
  AUTHENTICATED_NEEDS_ONBOARDING = 'AUTHENTICATED_NEEDS_ONBOARDING',
  AUTHENTICATED_ONBOARDED = 'AUTHENTICATED_ONBOARDED',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
}

export enum UserRole {
  STUDENT = 'STUDENT',
  COMMUNITY_ADMIN = 'COMMUNITY_ADMIN',
  SELLER = 'SELLER',
  EMPLOYER = 'EMPLOYER',
  RECRUITER = 'RECRUITER',
  ORGANIZATION_ADMIN = 'ORGANIZATION_ADMIN',
  PROPERTY_OWNER = 'PROPERTY_OWNER',
  PROPERTY_MANAGER = 'PROPERTY_MANAGER',
  AGENT = 'AGENT',
  INSTITUTION_ADMIN = 'INSTITUTION_ADMIN',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum PropertyType {
  HOSTEL = 'HOSTEL',
  DORMITORY = 'DORMITORY',
  STUDENT_RESIDENCE = 'STUDENT_RESIDENCE',
  APARTMENT = 'APARTMENT',
  HOUSE = 'HOUSE',
  BEDSITTER = 'BEDSITTER',
  STUDIO = 'STUDIO',
  ROOM = 'ROOM',
  SHARED_ROOM = 'SHARED_ROOM',
  BED_SPACE = 'BED_SPACE',
  SHORT_TERM = 'SHORT_TERM',
  OTHER = 'OTHER',
}

export enum RoomType {
  SINGLE_ROOM = 'SINGLE_ROOM',
  SHARED_ROOM = 'SHARED_ROOM',
  STUDIO = 'STUDIO',
  BEDSITTER = 'BEDSITTER',
  ONE_BEDROOM = 'ONE_BEDROOM',
  TWO_BEDROOM = 'TWO_BEDROOM',
  THREE_BEDROOM_PLUS = 'THREE_BEDROOM_PLUS',
  HOSTEL_BED = 'HOSTEL_BED',
  ENSUITE_ROOM = 'ENSUITE_ROOM',
  OTHER = 'OTHER',
}

export enum BillingPeriod {
  PER_MONTH = 'PER_MONTH',
  PER_SEMESTER = 'PER_SEMESTER',
  PER_ACADEMIC_YEAR = 'PER_ACADEMIC_YEAR',
  PER_WEEK = 'PER_WEEK',
  PER_DAY = 'PER_DAY',
}

export enum ListingStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  PUBLISHED = 'PUBLISHED',
  PAUSED = 'PAUSED',
  FULL = 'FULL',
  EXPIRED = 'EXPIRED',
  REJECTED = 'REJECTED',
  ARCHIVED = 'ARCHIVED',
}

export enum VerificationStatus {
  UNVERIFIED = 'UNVERIFIED',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export enum PromotionTier {
  NORMAL = 'NORMAL',
  FEATURED = 'FEATURED',
  PROMOTED = 'PROMOTED',
}

export enum GenderPreference {
  ANY = 'ANY',
  MIXED = 'MIXED',
  CO_ED = 'CO_ED',
  FEMALE_ONLY = 'FEMALE_ONLY',
  MALE_ONLY = 'MALE_ONLY',
}

export enum InquiryStatus {
  NEW = 'NEW',
  READ = 'READ',
  RESPONDED = 'RESPONDED',
  CLOSED = 'CLOSED',
  SPAM = 'SPAM',
}

export enum ReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  FLAGGED = 'FLAGGED',
}

export enum ReportReason {
  SCAM = 'SCAM',
  SUSPECTED_SCAM = 'SCAM',
  WRONG_INFORMATION = 'WRONG_INFORMATION',
  INCORRECT_LOCATION = 'WRONG_INFORMATION',
  FAKE_PROPERTY = 'FAKE_PROPERTY',
  INCORRECT_PRICE = 'INCORRECT_PRICE',
  UNAVAILABLE_OR_FULL = 'FAKE_PROPERTY',
  INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
  INAPPROPRIATE_PHOTOS = 'INAPPROPRIATE_CONTENT',
  DUPLICATE_LISTING = 'DUPLICATE_LISTING',
  OTHER = 'OTHER',
}

export const PropertyReportReason = ReportReason;
export type PropertyReportReason = ReportReason;

export enum ReportStatus {
  PENDING = 'PENDING',
  INVESTIGATING = 'INVESTIGATING',
  DISMISSED = 'DISMISSED',
  ACTIONED = 'ACTIONED',
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  SUSPENDED = 'SUSPENDED',
  ONBOARDING_REQUIRED = 'ONBOARDING_REQUIRED',
}

export enum InstitutionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REQUEST_CHANGES = 'REQUEST_CHANGES',
  MERGE_DUPLICATE = 'MERGE_DUPLICATE',
  MERGED = 'MERGED',
}

export enum InstitutionType {
  UNIVERSITY = 'UNIVERSITY',
  COLLEGE = 'COLLEGE',
  TECHNICAL_INSTITUTION = 'TECHNICAL_INSTITUTION',
  VOCATIONAL_INSTITUTION = 'VOCATIONAL_INSTITUTION',
  ONLINE_INSTITUTION = 'ONLINE_INSTITUTION',
  OTHER = 'OTHER',
}

export enum OrderStatus {
  CREATED = 'CREATED',
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentProvider {
  PESAPAL = 'PESAPAL',
  STRIPE = 'STRIPE',
  GOOGLE_PAY = 'GOOGLE_PAY',
}

export enum AICategory {
  ACADEMIC = 'ACADEMIC',
  CAREER = 'CAREER',
  CAMPUS = 'CAMPUS',
  ACCOMMODATION = 'ACCOMMODATION',
  SHEET = 'SHEET',
  PERSONAL = 'PERSONAL',
}

export enum SheetCategory {
  STUDENT = 'STUDENT',
  BUSINESS = 'BUSINESS',
  PROPERTY = 'PROPERTY',
  AGRICULTURE = 'AGRICULTURE',
  PERSONAL = 'PERSONAL',
  AI_CUSTOM = 'AI_CUSTOM',
}

export enum OpportunityType {
  JOB = 'JOB',
  INTERNSHIP = 'INTERNSHIP',
  ATTACHMENT = 'ATTACHMENT',
  APPRENTICESHIP = 'APPRENTICESHIP',
  GRADUATE_PROGRAM = 'GRADUATE_PROGRAM',
  PART_TIME = 'PART_TIME',
  FULL_TIME = 'FULL_TIME',
  CONTRACT = 'CONTRACT',
  FREELANCE = 'FREELANCE',
  REMOTE = 'REMOTE',
  CAMPUS_JOB = 'CAMPUS_JOB',
  VOLUNTEER = 'VOLUNTEER',
  SCHOLARSHIP = 'SCHOLARSHIP',
  COMPETITION = 'COMPETITION',
  RESEARCH = 'RESEARCH',
  OTHER = 'OTHER',
}

export enum RemoteType {
  ON_SITE = 'ON_SITE',
  HYBRID = 'HYBRID',
  REMOTE = 'REMOTE',
}

export enum SalaryPeriod {
  MONTHLY = 'MONTHLY',
  ANNUAL = 'ANNUAL',
  WEEKLY = 'WEEKLY',
  HOURLY = 'HOURLY',
  PROJECT = 'PROJECT',
}

export enum ApplicationMethod {
  EXTERNAL_URL = 'EXTERNAL_URL',
  EMAIL = 'EMAIL',
  ENERMIND = 'ENERMIND',
}

export enum ApplicationStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  SHORTLISTED = 'SHORTLISTED',
  INTERVIEW = 'INTERVIEW',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED',
  WITHDRAWN = 'WITHDRAWN',
}

export enum EmployerVerificationStatus {
  UNVERIFIED = 'UNVERIFIED',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
}

export enum CommunityCategory {
  ACADEMIC = 'ACADEMIC',
  COURSE = 'COURSE',
  CAMPUS = 'CAMPUS',
  ACCOMMODATION = 'ACCOMMODATION',
  JOBS = 'JOBS',
  MARKETPLACE = 'MARKETPLACE',
  SOCIAL = 'SOCIAL',
  OTHER = 'OTHER',
}

export interface CountryInfo {
  code: string; // ISO 2-letter, e.g. "US", "KE", "GB", "CA", "IN", "ZA", "NG", "AU"
  name: string;
  currency: string; // e.g. "USD", "KES", "GBP", "EUR", "INR"
  flagEmoji: string;
  phoneCode: string;
  region: string;
}

export interface YearLevel {
  id: string;
  label: string; // e.g. "Year 1 / Freshman", "Year 2 / Sophomore", "Postgraduate", "PhD"
  order: number;
}

export interface Course {
  id: string;
  departmentId: string;
  code: string; // e.g. "CS101", "ENG202"
  title: string;
  degreeType: 'BACHELOR' | 'MASTER' | 'DIPLOMA' | 'CERTIFICATE' | 'DOCTORATE';
  durationYears: number;
  availableYears: YearLevel[];
}

export interface Department {
  id: string;
  schoolOrFacultyId: string;
  name: string;
  code?: string;
  courses: Course[];
}

export interface CollegeOrFaculty {
  id: string;
  campusId: string;
  name: string;
  departments: Department[];
}

export interface Campus {
  id: string;
  institutionId: string;
  name: string; // e.g. "Main Campus", "North Campus", "City Campus"
  city: string;
  stateOrProvince?: string;
  isMainCampus: boolean;
  collegesOrFaculties: CollegeOrFaculty[];
}

export interface Institution {
  id: string;
  countryCode: string;
  name: string;
  shortName?: string;
  type: InstitutionType;
  website?: string;
  domainPattern?: string; // e.g. "harvard.edu", "uonbi.ac.ke"
  logoUrl?: string;
  status: InstitutionStatus;
  submissionNotes?: string;
  submittedByUserId?: string;
  campuses: Campus[];
  createdDate: string;
  updatedDate: string;
}

export interface CampusSubmission {
  id: string;
  institutionId: string;
  institutionName: string;
  campusName: string;
  city: string;
  countryCode: string;
  address?: string;
  website?: string;
  description?: string;
  submittedByUserId?: string;
  status: InstitutionStatus;
  createdDate: string;
}

export interface DuplicateCheckResult {
  hasPotentialDuplicates: boolean;
  matches: Array<{
    id: string;
    name: string;
    countryCode: string;
    similarityScore: number;
    campusesCount: number;
  }>;
}

export interface UserProfile {
  id: string;
  googleId?: string;
  googleSubjectId?: string; // Stable external Google subject identifier
  email: string;
  displayName: string;
  photoUrl?: string;
  avatarUrl?: string;
  countryCode: string;
  preferredCurrency: string;
  institutionId?: string;
  institutionName?: string;
  campusId?: string;
  campusName?: string;
  collegeId?: string;
  collegeName?: string;
  departmentId?: string;
  departmentName?: string;
  courseId?: string;
  courseName?: string;
  yearLevelId?: string;
  yearLevelLabel?: string;
  role: UserRole;
  accountStatus: AccountStatus;
  skills?: string[];
  phoneNumber?: string;
  onboardingStatus?: 'PENDING' | 'COMPLETED';
  googleDriveConnected: boolean;
  googleSheetsConnected: boolean;
  googleCalendarConnected: boolean;
  onboardingCompleted: boolean;
  createdDate: string;
  updatedDate: string;
}

export interface CurrencyRate {
  code: string;
  name: string;
  symbol: string;
  rateToUSD: number; // Base currency = USD
  flag: string;
  country?: string;
  lastUpdated: string;
}

export interface EnermindOrder {
  id: string;
  userId: string;
  userEmail: string;
  productId: string;
  productTitle: string;
  productType: 'SHEET_TEMPLATE' | 'AI_PRO_SUBSCRIPTION' | 'MARKETPLACE_ITEM' | 'GIG_PAYMENT' | 'PREMIUM_LISTING';
  originalAmount: number;
  originalCurrency: string;
  displayAmount: number;
  displayCurrency: string;
  exchangeRate: number;
  paymentProvider: PaymentProvider;
  pesapalTrackingId?: string;
  merchantReference: string;
  status: OrderStatus;
  createdDate: string;
  paidDate?: string;
  refundedDate?: string;
}

export interface SheetProduct {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: SheetCategory;
  price: number;
  currency: string;
  isFree: boolean;
  features: string[];
  tabCount: number;
  previewImageUrl?: string;
  templateSpreadsheetId?: string;
  version: string;
  author: string;
  downloadsCount: number;
  rating: number;
  createdDate: string;
  updatedDate: string;
}

export interface PropertyUnit {
  id: string;
  propertyId: string;
  name?: string;
  building?: string;
  floor?: string;
  unitNumber: string;
  roomType: RoomType;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  currency?: string;
  price?: number;
  priceOverride?: number;
  depositOverride?: number;
  isAvailable: boolean;
}

export interface PropertyVerificationDocument {
  id: string;
  propertyId: string;
  ownerId: string;
  documentType: 'OWNERSHIP_DEED' | 'TITLE_DEED' | 'MANAGEMENT_AUTHORIZATION' | 'BUSINESS_REGISTRATION' | 'UTILITY_BILL' | 'NATIONAL_ID_PASSPORT' | 'OTHER';
  fileName: string;
  fileSizeBytes: number;
  mimeType?: string;
  driveFileId?: string;
  driveWebViewLink?: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  rejectionReason?: string;
  uploadedAt: string;
}

export interface PropertyInquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  ownerId: string;
  ownerName?: string;
  message: string;
  moveInDate?: string;
  durationMonths?: number;
  status: InquiryStatus;
  responseMessage?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavedProperty {
  id: string;
  userId: string;
  propertyId: string;
  createdAt: string;
}

export interface PropertyReview {
  id: string;
  propertyId: string;
  userId: string;
  userName: string;
  userRole?: string;
  rating: number; // 1 to 5
  comment: string;
  status: ReviewStatus;
  createdAt: string;
}

export interface PropertyReport {
  id: string;
  propertyId: string;
  propertyTitle: string;
  reportedByUserId: string;
  reporterEmail?: string;
  reason: ReportReason;
  details: string;
  status: ReportStatus;
  moderatorNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Property {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerEmail?: string;
  ownerPhone?: string;
  ownerWhatsApp?: string;
  ownerRole?: UserRole;
  managerId?: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  roomType: RoomType;
  country: string;
  city: string;
  address: string;
  postalCode?: string;
  isApproximateLocation: boolean;
  latitude?: number;
  longitude?: number;
  institutionIds: string[];
  campusIds: string[];
  primaryInstitutionName?: string;
  primaryCampusName?: string;
  distanceFromCampusKm?: number | null;
  currency: string; // Original currency (e.g. KES, USD, GBP, EUR)
  price: number; // Original price
  pricePerMonth?: number; // Compatibility field
  billingPeriod: BillingPeriod;
  deposit?: number;
  availabilityStatus: 'AVAILABLE_NOW' | 'AVAILABLE_FROM_DATE' | 'FULLY_OCCUPIED' | 'TEMPORARILY_UNAVAILABLE';
  availableFromDate?: string;
  totalUnits: number;
  occupiedUnits: number;
  availableUnits: number;
  units?: PropertyUnit[];
  amenities: string[];
  accessibilityFeatures: string[];
  genderPreference: GenderPreference;
  isFurnished: boolean;
  utilitiesIncluded: boolean;
  rules: string[];
  photos: string[];
  googleDriveListingFolderId?: string;
  verificationStatus: VerificationStatus;
  verificationDocuments?: PropertyVerificationDocument[];
  verificationBadge: boolean;
  isVerified?: boolean;
  isPromoted?: boolean;
  listingStatus: ListingStatus;
  promotionTier: PromotionTier;
  contactPreferences: {
    enermindMessages: boolean;
    email: boolean;
    phone: boolean;
    whatsapp: boolean;
    whatsappGroupUrl?: string;
  };
  savedCount: number;
  viewsCount: number;
  inquiriesCount: number;
  rating: number;
  reviewsCount: number;
  publishedAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Backward compatibility alias for AccommodationListing
export type AccommodationListing = Property;

export interface PropertySearchParams {
  q?: string;
  countryCode?: string;
  institutionId?: string;
  campusId?: string;
  propertyType?: PropertyType | 'ALL';
  roomType?: RoomType | 'ALL';
  minPrice?: number;
  maxPrice?: number;
  currency?: string;
  maxDistanceKm?: number;
  genderPreference?: GenderPreference | 'ALL';
  isFurnished?: boolean;
  utilitiesIncluded?: boolean;
  amenities?: string[];
  accessibilityFeatures?: string[];
  availabilityOnly?: boolean;
  isVerifiedOnly?: boolean;
  promotionTier?: PromotionTier | 'ALL';
  sortBy?: 'RECOMMENDED' | 'CLOSEST' | 'PRICE_LOW_HIGH' | 'PRICE_HIGH_LOW' | 'NEWEST' | 'RATING';
  page?: number;
  limit?: number;
}

export interface PropertyComparisonItem {
  property: Property;
  convertedPriceDisplay: string;
  originalPriceDisplay: string;
  distanceDisplay: string;
  keyAmenities: string[];
  missingAmenities: string[];
}

export interface Organization {
  id: string;
  name: string;
  logo?: string;
  description: string;
  website?: string;
  industry: string;
  country: string;
  countryCode: string;
  city: string;
  verificationStatus: EmployerVerificationStatus;
  verificationDocuments?: Array<{
    name: string;
    driveFileId?: string;
    url?: string;
    uploadedAt: string;
  }>;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: 'EMPLOYER' | 'RECRUITER' | 'ORGANIZATION_ADMIN';
  addedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  aliases?: string[];
}

export interface Opportunity {
  id: string;
  organizationId: string;
  organizationName: string;
  organizationLogo?: string;
  organizationWebsite?: string;
  createdBy: string;
  title: string;
  description: string;
  type: OpportunityType;
  industry: string;
  location: string;
  country: string;
  countryCode: string;
  city: string;
  region?: string;
  address?: string;
  remoteType: RemoteType;
  remoteCountries?: string[]; // e.g. ['Worldwide'], ['Kenya'], ['United Kingdom'], ['Canada'], ['East Africa']
  employmentType?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryPeriod?: SalaryPeriod;
  isSalaryDisclosed: boolean;
  applicationDeadline: string; // ISO format
  startDate?: string;
  duration?: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  courseRequirements?: string[];
  educationRequirements?: string[];
  experienceRequirements?: string;
  institutionIds?: string[];
  campusIds?: string[];
  status: ListingStatus;
  verificationStatus: EmployerVerificationStatus;
  applicationMethod: ApplicationMethod;
  applicationUrl?: string;
  applicationEmail?: string;
  promotionTier: PromotionTier;
  isPromoted?: boolean;
  viewsCount: number;
  savesCount: number;
  applicationsCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  expiresAt?: string;

  // Backward-compatibility computed helpers for legacy cards
  organization?: string;
  isRemote?: boolean;
  deadlineDate?: string;
  stipendOrSalary?: string;
  isVerified?: boolean;
  isExternalLink?: boolean;
  postedByUserId?: string;
  createdDate?: string;
  targetCourses?: string[];
  targetYearLevels?: string[];
}

// Backward-compatibility alias
export type OpportunityListing = Opportunity;

export interface OpportunityApplication {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  organizationName: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  status: ApplicationStatus;
  resumeFileId?: string;
  resumeFileName?: string;
  resumeDriveLink?: string;
  coverLetter?: string;
  answers?: Record<string, string>;
  employerNotes?: string;
  appliedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  grade?: string;
}

export interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

export interface ProjectEntry {
  id: string;
  title: string;
  description: string;
  url?: string;
  skillsUsed?: string[];
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
}

export interface CareerProfile {
  userId: string;
  headline?: string;
  bio?: string;
  education: EducationEntry[];
  skills: string[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  languages: string[];
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  preferredRoles?: OpportunityType[];
  preferredLocations?: string[];
  remotePreference?: 'REMOTE_ONLY' | 'HYBRID' | 'ANY';
  isPublic: boolean;
  updatedAt: string;
}

export interface SavedOpportunity {
  id: string;
  userId: string;
  opportunityId: string;
  createdAt: string;
}

export interface OpportunityReport {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  organizationName: string;
  reportedByUserId: string;
  reporterEmail?: string;
  reason: 'SCAM' | 'FAKE_EMPLOYER' | 'INCORRECT_INFORMATION' | 'FRAUDULENT_PAYMENT_REQUEST' | 'INAPPROPRIATE_CONTENT' | 'FAKE_APPLICATION_LINK' | 'OTHER';
  details: string;
  status: ReportStatus;
  moderatorNotes?: string;
  createdAt: string;
  actionedAt?: string;
}

export interface OpportunitySearchParams {
  q?: string;
  type?: OpportunityType | 'ALL';
  industry?: string;
  countryCode?: string;
  city?: string;
  remoteType?: RemoteType | 'ALL';
  minSalary?: number;
  maxSalary?: number;
  currency?: string;
  skills?: string[];
  course?: string;
  institutionId?: string;
  campusId?: string;
  experience?: string;
  isVerifiedOnly?: boolean;
  campusRelevanceOnly?: boolean;
  activeOnly?: boolean;
  sortBy?: 'RECOMMENDED' | 'NEWEST' | 'DEADLINE' | 'SALARY_HIGH_LOW' | 'CLOSEST' | 'RELEVANCE';
  page?: number;
  limit?: number;
}

export interface OpportunityRecommendation {
  opportunity: Opportunity;
  score: number;
  matchReasons: string[];
}

export interface GigListing {
  id: string;
  title: string;
  description: string;
  category: 'TUTORING' | 'GRAPHIC_DESIGN' | 'CODING' | 'WRITING' | 'PHOTOGRAPHY' | 'MOVING' | 'RESEARCH' | 'EVENT_HELP' | 'OTHER';
  budgetAmount: number;
  currency: string;
  institutionId?: string;
  campusId?: string;
  postedByUserId: string;
  posterDisplayName: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  proposalsCount: number;
  createdDate: string;
}

export interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  category: 'TEXTBOOKS' | 'ELECTRONICS' | 'FURNITURE' | 'LAB_EQUIPMENT' | 'STATIONERY' | 'CLOTHING' | 'OTHER';
  price: number;
  currency: string;
  condition: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR';
  photos: string[];
  institutionId: string;
  campusId: string;
  sellerId: string;
  sellerDisplayName: string;
  sellerContact: string;
  isSold: boolean;
  createdDate: string;
}

export interface CommunityGroup {
  id: string;
  name: string;
  institutionId: string;
  campusId?: string;
  institutionName: string;
  campusName?: string;
  courseName?: string;
  yearLevel?: string;
  category: CommunityCategory;
  description: string;
  joinUrl: string;
  platform: 'WHATSAPP' | 'TELEGRAM' | 'DISCORD' | 'SLACK';
  submittedByUserId: string;
  isOfficial: boolean;
  isVerified: boolean;
  memberCountEstimate?: number;
  createdDate: string;
}

export type CampusEventType =
  | 'PUBLIC_CAMPUS_EVENT'
  | 'ACADEMIC_DEADLINE'
  | 'EXAM'
  | 'REGISTRATION'
  | 'ORIENTATION'
  | 'GRADUATION'
  | 'CAREER_EVENT'
  | 'WORKSHOP'
  | 'SEMINAR'
  | 'CONFERENCE'
  | 'CLUB_EVENT'
  | 'SPORT_EVENT'
  | 'SOCIAL_EVENT'
  | 'SCHOLARSHIP_DEADLINE'
  | 'APPLICATION_DEADLINE'
  | 'OTHER';

export type CampusEventCategory =
  | 'ACADEMIC'
  | 'CAREER'
  | 'TECH_HACKATHON'
  | 'WORKSHOP'
  | 'SPORTS'
  | 'ARTS_CULTURE'
  | 'STUDENT_GOVERNMENT'
  | 'CLUB_SOCIETY'
  | 'VOLUNTEERING'
  | 'SOCIAL'
  | 'HEALTH_WELLNESS'
  | 'RELIGIOUS'
  | 'ACADEMIC_DEADLINE'
  | 'CAREER_FAIR'
  | 'HACKATHON'
  | 'STUDENT_UNION'
  | 'OTHER';

export type EventVisibility =
  | 'GLOBAL'
  | 'COUNTRY'
  | 'INSTITUTION'
  | 'CAMPUS'
  | 'COURSE'
  | 'DEPARTMENT'
  | 'GROUP'
  | 'PRIVATE';

export type EventStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'PUBLISHED'
  | 'CANCELLED'
  | 'POSTPONED'
  | 'COMPLETED'
  | 'EXPIRED'
  | 'SUSPENDED';

export type EventVerificationStatus =
  | 'UNVERIFIED'
  | 'COMMUNITY_SUBMITTED'
  | 'CLUB_VERIFIED'
  | 'DEPARTMENT_VERIFIED'
  | 'OFFICIAL_INSTITUTION'
  | 'ADMIN_VERIFIED';

export interface CampusEvent {
  id: string;
  createdBy: string;
  creatorRole?: string;
  creatorName?: string;
  creatorEmail?: string;
  organizationId?: string;
  clubId?: string;
  clubName?: string;
  institutionId: string;
  institutionName?: string;
  campusId?: string;
  campusName?: string;
  departmentId?: string;
  departmentName?: string;
  courseId?: string;
  courseCode?: string;
  courseName?: string;
  title: string;
  description: string;
  type: CampusEventType;
  category: CampusEventCategory;
  startDateTime: string;
  endDateTime: string;
  timezone: string;
  location: string;
  locationType: 'PHYSICAL' | 'ONLINE' | 'HYBRID';
  venueName?: string;
  building?: string;
  room?: string;
  mapCoordinates?: { lat: number; lng: number };
  onlineUrl?: string;
  organizerName: string;
  organizerContact?: string;
  organizerEmail?: string;
  organizerRole?: string;
  organizerLogoUrl?: string;
  coverImageUrl?: string;
  capacity?: number;
  registeredCount: number;
  waitlistCount?: number;
  registrationRequired: boolean;
  registrationDeadline?: string;
  registrationUrl?: string;
  requiresApproval?: boolean;
  targetAudience?: string[];
  visibility: EventVisibility;
  status: EventStatus;
  verificationStatus: EventVerificationStatus;
  isOfficial: boolean;
  isSponsored?: boolean;
  isPromoted?: boolean;
  tags?: string[];
  materials?: Array<{ name: string; driveFileId?: string; url?: string }>;
  viewsCount?: number;
  savesCount?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  expiresAt?: string;
  rejectionReason?: string;
  postponedNote?: string;

  // Backward-compatibility aliases
  startDate?: string;
  endDate?: string;
  isVirtual?: boolean;
  meetingOrStreamUrl?: string;
  createdDate?: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  eventStartDateTime: string;
  userId: string;
  userName: string;
  userEmail: string;
  userInstitutionName?: string;
  status: 'REGISTERED' | 'WAITLISTED' | 'CANCELLED' | 'ATTENDED';
  registeredAt: string;
  cancelledAt?: string;
  notes?: string;
}

export interface SavedEvent {
  id: string;
  userId: string;
  eventId: string;
  createdAt: string;
  reminderOffsetMinutes?: number;
  notes?: string;
}

export type AcademicDeadlineType =
  | 'REGISTRATION'
  | 'COURSE_ADD_DROP'
  | 'TUITION'
  | 'ASSIGNMENT'
  | 'PROJECT'
  | 'EXAM'
  | 'APPLICATION'
  | 'SCHOLARSHIP'
  | 'GRADUATION'
  | 'OTHER';

export type DeadlineSource =
  | 'UNIVERSITY'
  | 'DEPARTMENT'
  | 'LECTURER'
  | 'STUDENT_ORGANIZATION'
  | 'USER_CREATED'
  | 'ADMIN';

export type DeadlinePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface AcademicDeadline {
  id: string;
  institutionId: string;
  institutionName?: string;
  campusId?: string;
  campusName?: string;
  departmentId?: string;
  departmentName?: string;
  courseId?: string;
  courseCode?: string;
  courseName?: string;
  title: string;
  description: string;
  deadline: string;
  timezone: string;
  type: AcademicDeadlineType;
  source: DeadlineSource;
  sourceDisplayName?: string;
  isOfficial: boolean;
  priority: DeadlinePriority;
  actionUrl?: string;
  materialsUrl?: string;
  status: 'ACTIVE' | 'EXTENDED' | 'PASSED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface PersonalDeadline {
  id: string;
  userId: string;
  title: string;
  description?: string;
  dueDateTime: string;
  timezone: string;
  category: 'ASSIGNMENT' | 'STUDY' | 'EXAM_PREP' | 'APPLICATION' | 'PROJECT' | 'PERSONAL' | 'FINANCE' | 'OTHER';
  priority: DeadlinePriority;
  completed: boolean;
  completedAt?: string;
  courseCode?: string;
  reminderMinutes?: number;
  createdAt: string;
  updatedAt: string;
}

export type ExamType =
  | 'CAT'
  | 'MIDTERM'
  | 'FINAL'
  | 'PRACTICAL'
  | 'ORAL'
  | 'SPECIAL'
  | 'SUPPLEMENTARY'
  | 'RETAKE'
  | 'OTHER';

export interface ExamEvent {
  id: string;
  institutionId: string;
  institutionName?: string;
  campusId?: string;
  campusName?: string;
  departmentId?: string;
  departmentName?: string;
  courseId?: string;
  courseCode: string;
  courseName: string;
  academicYear?: string;
  semester?: string;
  examType: ExamType;
  dateTime: string;
  endDateTime: string;
  timezone: string;
  venue: string;
  room: string;
  building?: string;
  seatNumber?: string;
  durationMinutes: number;
  instructions?: string[];
  examinerName?: string;
  source: DeadlineSource;
  isOfficial: boolean;
  status: 'SCHEDULED' | 'RESCHEDULED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

export interface CampusAnnouncement {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  institutionId: string;
  institutionName?: string;
  campusId?: string;
  campusName?: string;
  departmentId?: string;
  title: string;
  content: string;
  priority: 'NORMAL' | 'IMPORTANT' | 'URGENT';
  isOfficial: boolean;
  source: string;
  actionUrl?: string;
  actionLabel?: string;
  publishedAt: string;
  expiresAt?: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'EXPIRED';
}

export type ClubCategory =
  | 'TECHNOLOGY'
  | 'BUSINESS_ENTREPRENEURSHIP'
  | 'SPORTS_FITNESS'
  | 'MUSIC_ARTS'
  | 'ACADEMIC_DEBATE'
  | 'SOCIAL_COMMUNITY'
  | 'LEADERSHIP_GOVERNANCE'
  | 'ENVIRONMENTAL'
  | 'RELIGIOUS'
  | 'OTHER';

export interface Club {
  id: string;
  institutionId: string;
  institutionName?: string;
  campusId?: string;
  campusName?: string;
  name: string;
  acronym?: string;
  description: string;
  category: ClubCategory;
  logoUrl?: string;
  coverImageUrl?: string;
  leaderName: string;
  leaderContact?: string;
  leaderEmail?: string;
  membershipFee?: number;
  currency?: string;
  registrationUrl?: string;
  socialLinks?: {
    website?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    whatsappGroup?: string;
  };
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  isOfficial: boolean;
  followersCount: number;
  membersCount: number;
  eventsCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type CampusLocationCategory =
  | 'LIBRARY'
  | 'AUDITORIUM'
  | 'LECTURE_HALL'
  | 'LABORATORY'
  | 'STUDENT_CENTER'
  | 'SPORTS_FACILITY'
  | 'CAFETERIA'
  | 'ADMINISTRATION'
  | 'HOSTEL_RESIDENCE'
  | 'HEALTH_CLINIC'
  | 'OUTDOOR_GROUNDS'
  | 'OTHER';

export interface CampusLocation {
  id: string;
  institutionId: string;
  campusId: string;
  campusName: string;
  name: string;
  building: string;
  room?: string;
  floor?: string;
  category: CampusLocationCategory;
  coordinates?: { lat: number; lng: number };
  capacity?: number;
  description?: string;
  facilities?: string[];
}

export interface EventReport {
  id: string;
  eventId: string;
  eventTitle: string;
  reportedByUserId: string;
  reportedByUserEmail?: string;
  reason: 'SPAM' | 'FAKE_EVENT' | 'MISLEADING_INFO' | 'HARASSMENT' | 'INAPPROPRIATE_CONTENT' | 'SCAM' | 'COPYRIGHT' | 'OTHER';
  details: string;
  status: 'PENDING' | 'INVESTIGATING' | 'DISMISSED' | 'ACTIONED';
  moderatorNotes?: string;
  createdAt: string;
  actionedAt?: string;
}

export type DriveConnectionStatus = 'NOT_CONNECTED' | 'CONNECTING' | 'CONNECTED' | 'REAUTH_REQUIRED' | 'ERROR' | 'DISCONNECTED';

export type VaultCategory = 
  | 'IDENTITY'
  | 'ACADEMIC'
  | 'CERTIFICATES'
  | 'CV_CAREER'
  | 'EMPLOYMENT'
  | 'FINANCE'
  | 'PROPERTY'
  | 'LEGAL'
  | 'PERSONAL'
  | 'OTHER';

export type AcademicResourceType = 
  | 'NOTE'
  | 'PAST_PAPER'
  | 'ASSIGNMENT'
  | 'PROJECT'
  | 'RESEARCH'
  | 'OTHER';

export type AcademicSubmissionStatus = 
  | 'PRIVATE'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED';

export interface PrivateVaultFolder {
  id: string;
  name: string;
  path: string;
  category: VaultCategory;
  description: string;
  driveFolderId?: string;
  fileCount: number;
}

export interface DriveStorageQuota {
  limitBytes?: number;
  usageBytes: number;
  usageInDriveBytes?: number;
  usageInDriveTrashBytes?: number;
  isUnlimited?: boolean;
  formattedLimit?: string;
  formattedUsage?: string;
  percentUsed?: number;
}

export interface EnermindDriveWorkspace {
  rootFolderId: string;
  rootFolderName: string;
  academicFolderId: string;
  privateVaultFolderId: string;
  sheetsFolderId: string;
  opportunitiesFolderId: string;
  receiptsFolderId: string;
  exportsFolderId: string;
  academicSubfolders: {
    notesId: string;
    pastPapersId: string;
    assignmentsId: string;
    projectsId: string;
    researchId: string;
    otherId: string;
  };
  vaultCategoryFolders: Record<string, string>;
  isInitialized: boolean;
  lastSyncedAt: string;
}

export interface EnermindFile {
  id: string;
  ownerUserId: string;
  ownerEmail?: string;
  driveFileId: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  category: VaultCategory | string;
  resourceType: 'PRIVATE_VAULT' | AcademicResourceType | 'SPREADSHEET' | 'RECEIPT' | 'OTHER';
  visibility: 'PRIVATE' | 'SHARED_WITH_ENERMIND';
  submissionStatus?: AcademicSubmissionStatus;
  folderDriveId?: string;
  folderPath?: string;
  webViewLink?: string;
  webContentLink?: string;
  iconLink?: string;
  thumbnailLink?: string;
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
  downloadCount?: number;
  tags?: string[];
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  moderationNotes?: string;
}

export interface AcademicSubmissionRequest {
  fileId: string;
  resourceType: AcademicResourceType;
  title: string;
  institutionId: string;
  institutionName: string;
  campusId?: string;
  campusName?: string;
  courseId?: string;
  courseCode?: string;
  courseName?: string;
  unitCode?: string;
  unitName?: string;
  yearLevel?: string;
  academicYear?: number | string;
  semester?: string;
  examType?: string;
  notesOrDescription?: string;
}

export interface SecurityTestResult {
  testId: string;
  title: string;
  passed: boolean;
  details: string;
  evaluatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorUserId: string;
  actorEmail: string;
  actorRole: UserRole;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  ipAddress?: string;
}

export enum TaskCategory {
  MICROTASK = 'MICROTASK',
  FREELANCE = 'FREELANCE',
  CAMPUS_TASK = 'CAMPUS_TASK',
  TECH_DEV = 'TECH_DEV',
  DESIGN_CREATIVE = 'DESIGN_CREATIVE',
  WRITING_TRANSLATION = 'WRITING_TRANSLATION',
  TUTORING_RESEARCH = 'TUTORING_RESEARCH',
  MARKETING_SOCIAL = 'MARKETING_SOCIAL',
  VIDEO_AUDIO = 'VIDEO_AUDIO',
  ADMINISTRATIVE_VIRTUAL = 'ADMINISTRATIVE_VIRTUAL',
  EVENTS_LOGISTICS = 'EVENTS_LOGISTICS',
  DESIGN = 'DESIGN',
  WRITING = 'WRITING',
  DATA_ENTRY = 'DATA_ENTRY',
  DATA_COLLECTION = 'DATA_COLLECTION',
  RESEARCH = 'RESEARCH',
  PROGRAMMING = 'PROGRAMMING',
  WEB_DEVELOPMENT = 'WEB_DEVELOPMENT',
  GRAPHIC_DESIGN = 'GRAPHIC_DESIGN',
  VIDEO_EDITING = 'VIDEO_EDITING',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  MARKETING = 'MARKETING',
  TRANSLATION = 'TRANSLATION',
  TUTORING = 'TUTORING',
  PHOTOGRAPHY = 'PHOTOGRAPHY',
  TECHNICAL = 'TECHNICAL',
  ENGINEERING = 'ENGINEERING',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  OTHER = 'OTHER',
}

export enum TaskBudgetType {
  FIXED = 'FIXED',
  HOURLY = 'HOURLY',
  NEGOTIABLE = 'NEGOTIABLE',
}

export const BudgetType = TaskBudgetType;
export type BudgetType = TaskBudgetType;

export enum TaskStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  PUBLISHED = 'PUBLISHED',
  APPLICATIONS_OPEN = 'APPLICATIONS_OPEN',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  SUBMITTED = 'SUBMITTED',
  REVISION_REQUESTED = 'REVISION_REQUESTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DISPUTED = 'DISPUTED',
  EXPIRED = 'EXPIRED',
  SUSPENDED = 'SUSPENDED',
}

export enum TaskApplicationStatus {
  SUBMITTED = 'SUBMITTED',
  SHORTLISTED = 'SHORTLISTED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
  CANCELLED = 'CANCELLED',
}

export enum TaskPaymentStatus {
  UNFUNDED = 'UNFUNDED',
  FUNDED = 'FUNDED',
  RELEASED = 'RELEASED',
  REFUNDED = 'REFUNDED',
}

export enum LedgerEntryType {
  TASK_PAYMENT = 'TASK_PAYMENT',
  PLATFORM_FEE = 'PLATFORM_FEE',
  REFUND = 'REFUND',
  ADJUSTMENT = 'ADJUSTMENT',
  WITHDRAWAL = 'WITHDRAWAL',
  WITHDRAWAL_FEE = 'WITHDRAWAL_FEE',
}

export enum LedgerEntryStatus {
  PENDING = 'PENDING',
  AVAILABLE = 'AVAILABLE',
  HELD = 'HELD',
  REVERSED = 'REVERSED',
  COMPLETED = 'COMPLETED',
}

export enum WithdrawalStatus {
  REQUESTED = 'REQUESTED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum KYCStatus {
  NOT_REQUIRED = 'NOT_REQUIRED',
  REQUIRED = 'REQUIRED',
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export interface Task {
  id: string;
  posterId: string;
  posterName: string;
  posterEmail?: string;
  posterRole: UserRole | string;
  posterAvatar?: string;
  posterVerified: boolean;
  title: string;
  description: string;
  category: TaskCategory;
  skills: string[];
  country: string;
  city: string;
  campusId?: string;
  campusName?: string;
  institutionId?: string;
  institutionName?: string;
  remoteType: RemoteType;
  budgetType: TaskBudgetType;
  budgetMin: number;
  budgetMax?: number;
  currency: string;
  originalAmount: number;
  originalCurrency: string;
  deadline: string;
  estimatedDuration?: string;
  requirements: string[];
  deliverables: string[];
  status: TaskStatus;
  visibility: 'PUBLIC' | 'CAMPUS_ONLY' | 'PRIVATE';
  verificationStatus: 'UNVERIFIED' | 'VERIFIED' | 'FLAGGED';
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  assignedWorkerAvatar?: string;
  assignedWorkerBid?: number;
  paymentStatus: TaskPaymentStatus;
  orderId?: string;
  platformFeeWorkerPercent: number;
  platformFeePosterPercent: number;
  proposalsCount: number;
  viewsCount: number;
  savesCount: number;
  revisionCount: number;
  maxRevisions: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  expiresAt?: string;
}

export interface TaskApplication {
  id: string;
  taskId: string;
  taskTitle?: string;
  workerId: string;
  workerName: string;
  workerEmail?: string;
  workerAvatar?: string;
  workerRole?: UserRole | string;
  workerRating?: number;
  workerCompletedTasks?: number;
  workerSkills?: string[];
  proposal: string;
  bidAmount: number;
  currency: string;
  estimatedDuration: string;
  relevantSkills: string[];
  portfolioLinks?: string[];
  status: TaskApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TaskSubmissionFile {
  fileId?: string;
  name: string;
  sizeBytes?: number;
  url?: string;
  driveFileId?: string;
  isGoogleDrive?: boolean;
}

export interface TaskSubmission {
  id: string;
  taskId: string;
  workerId: string;
  workerName: string;
  message: string;
  files?: TaskSubmissionFile[];
  links?: string[];
  revisionNumber: number;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'REVISION_REQUESTED' | 'APPROVED' | 'REJECTED' | 'DISPUTED';
  revisionReason?: string;
  submittedAt: string;
  updatedAt: string;
}

export interface TaskDispute {
  id: string;
  taskId: string;
  taskTitle?: string;
  openedBy: string;
  openedByName: string;
  openedByRole: 'POSTER' | 'WORKER';
  reason: string;
  description: string;
  evidence?: string[];
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED_POSTER' | 'RESOLVED_WORKER' | 'PARTIAL' | 'CANCELLED';
  resolution?: string;
  resolvedBy?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface TaskReport {
  id: string;
  taskId: string;
  taskTitle?: string;
  reportedByUserId: string;
  reportedByUserEmail?: string;
  reason: 'SCAM' | 'ILLEGAL' | 'FRAUD' | 'SPAM' | 'MISLEADING' | 'INAPPROPRIATE' | 'ACADEMIC_CHEATING' | 'OTHER';
  details: string;
  status: 'PENDING' | 'INVESTIGATING' | 'DISMISSED' | 'ACTIONED';
  moderatorNotes?: string;
  createdAt: string;
}

export interface LedgerEntry {
  id: string;
  userId: string;
  taskId?: string;
  taskTitle?: string;
  type: LedgerEntryType;
  amount: number;
  currency: string;
  status: LedgerEntryStatus;
  reference: string;
  createdAt: string;
}

export interface Withdrawal {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  amount: number;
  currency: string;
  feeAmount: number;
  netAmount: number;
  provider: 'PESAPAL';
  destinationType: 'MPESA' | 'AIRTEL_MONEY' | 'BANK_TRANSFER';
  destinationReference: string;
  recipientName: string;
  status: WithdrawalStatus;
  rejectionReason?: string;
  createdAt: string;
  processedAt?: string;
}

export interface TaskReview {
  id: string;
  taskId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  revieweeId: string;
  revieweeName: string;
  revieweeRole: 'WORKER' | 'POSTER';
  rating: number;
  comment: string;
  createdAt: string;
  status: 'APPROVED' | 'PENDING' | 'FLAGGED';
}

export interface WorkerProfile {
  userId: string;
  displayName: string;
  photoUrl?: string;
  headline?: string;
  bio?: string;
  skills: string[];
  hourlyRate?: number;
  currency: string;
  countryCode: string;
  institutionName?: string;
  campusName?: string;
  completedTasksCount: number;
  completionRate: number;
  ratingAverage: number;
  totalReviewsCount: number;
  portfolio: Array<{ title: string; link?: string; description?: string }>;
  languages: string[];
  availability: 'FULL_TIME' | 'PART_TIME' | 'WEEKENDS' | 'FLEXIBLE';
  kycStatus: KYCStatus;
}

export interface PlatformFeeConfig {
  workerFeePercent: number; // e.g. 10
  posterFeePercent: number; // e.g. 3
  minimumFeeUSD: number; // e.g. 0.50
  maximumFeeUSD: number; // e.g. 50.00
}

export interface ServiceConfigStatus {
  serviceName: string;
  identifier: 'gemini' | 'google_oauth' | 'google_drive' | 'google_sheets' | 'google_calendar' | 'pesapal' | 'currency';
  isConfigured: boolean;
  requiresSetup: boolean;
  environment: string;
  details: string;
  docsUrl?: string;
}

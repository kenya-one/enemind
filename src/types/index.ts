export type AccountType = 'school' | 'company' | 'dealer' | 'landlord' | 'student';

export type StudentStage = 'cbc_primary' | 'cbc_jss' | 'high_school' | 'campus';

export type PlanTier = 'basic' | 'premium';

export type KycStatus = 'pending' | 'verified' | 'rejected' | 'not_submitted';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  accountType: AccountType;
  studentStage?: StudentStage;
  schoolType?: 'primary' | 'jss' | 'high_school' | 'campus' | 'k12';
  schoolId?: string;
  schoolName?: string;
  parentEmail?: string;
  planTier: PlanTier;
  kycStatus: KycStatus;
  kycDocUrl?: string;
  phone?: string;
  location?: string;
  coordinates?: { lat: number; lng: number };
  driveFolderId: string;
  driveFolderName: string;
  pesapalConfig?: {
    merchantId?: string;
    tillNumber?: string;
    paybill?: string;
    accountNumber?: string;
  };
  financeOfficerEmail?: string;
  youtubeChannelUrl?: string;
  isLiveNow?: boolean;
  liveVideoUrl?: string;
  createdAt: string;
}

export interface SheetEntry {
  sheetName: string;
  rowCount: number;
  lastModified: string;
  syncStatus: 'synced' | 'pending' | 'syncing';
  columns: string[];
  sampleRows: Record<string, any>[];
}

export interface ProductItem {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerType: 'dealer' | 'company';
  sellerTier: PlanTier;
  title: string;
  category: 'Solar & Energy' | 'Electronics' | 'Building Materials' | 'Farm Produce' | 'Fashion' | 'Services' | 'Automotive';
  description: string;
  priceKes: number;
  images: string[];
  youtubeVideoId?: string;
  location: string;
  branchName?: string;
  distanceKm?: number;
  coordinates: { lat: number; lng: number };
  inStock: boolean;
  isLiveSelling?: boolean;
  liveYoutubeUrl?: string;
  rating: number;
  reviewsCount: number;
  // Building materials specific
  unitType?: 'piece' | 'bag (50kg)' | 'ton' | 'truckload' | 'meter' | 'bundle';
  bulkPricing?: { minUnits: number; discountedPriceKes: number }[];
  deliveryAvailable?: boolean;
  deliveryFeePerKmKes?: number;
}

export interface HostelProperty {
  id: string;
  landlordId: string;
  landlordName: string;
  landlordTier: PlanTier;
  isVerified: boolean;
  title: string;
  campusAffiliation?: string;
  propertyType: 'Hostel' | 'Bedsitter' | '1-Bedroom' | '2-Bedroom' | 'Studio';
  address: string;
  location: string;
  coordinates: { lat: number; lng: number };
  distanceToCampusKm?: number;
  images: string[];
  youtubeVideoTourId?: string;
  rentKes: number;
  rentPeriod: 'per month' | 'per semester';
  amenities: string[];
  vacantUnits: number;
  totalUnits: number;
  walkthroughSessions: WalkthroughSession[];
}

export interface WalkthroughSession {
  id: string;
  propertyId: string;
  mode: '1:1_private' | 'group';
  scheduledTime: string;
  capacity?: number;
  bookedCount: number;
  isLiveNow: boolean;
  youtubeLiveUrl?: string;
}

export interface JobPosting {
  id: string;
  posterId: string;
  posterName: string;
  posterType: 'Company' | 'School' | 'Dealer';
  title: string;
  companyName: string;
  category: 'Full-time' | 'Internship' | 'Attachment' | 'Contract' | 'Teaching';
  location: string;
  coordinates?: { lat: number; lng: number };
  salaryRangeKes: string;
  deadline: string;
  description: string;
  requirements: string[];
  contactEmail: string;
  attachmentUrl?: string;
}

export interface StudyMaterial {
  id: string;
  uploaderId: string;
  uploaderName: string;
  uploaderStage: StudentStage | 'school';
  schoolName?: string;
  title: string;
  gradeLevel: 'Grade 1-3' | 'Grade 4-6' | 'Grade 7-9 (JSS)' | 'Form 1-4' | 'Campus (Degree/Diploma)';
  subject: string;
  course?: string;
  campusName?: string;
  isApprovedBySchool?: boolean;
  isPaid: boolean;
  priceKes: number;
  previewUrl: string;
  fullContentPreview: string;
  driveFileUrl: string;
  downloadsCount: number;
  rating: number;
  audioAvailable?: boolean;
  tags: string[];
}

export interface StudentQuiz {
  id: string;
  gradeLevel: 'CBC Primary' | 'CBC JSS' | 'High School';
  subject: string;
  title: string;
  competencyArea: string;
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface SchoolNotice {
  id: string;
  schoolId: string;
  schoolName: string;
  title: string;
  date: string;
  targetAudience: 'All' | 'Parents' | 'Students' | 'Grade 7' | 'Form 4';
  content: string;
  isHighPriority?: boolean;
}

export interface StudentMarkRow {
  studentId: string;
  studentName: string;
  gradeClass: string;
  subject: string;
  term: 'Term 1' | 'Term 2' | 'Term 3';
  assessmentType: 'CBC Competency' | 'Midterm Exam' | 'Endterm Exam' | 'Project';
  cbcRating?: 'Exceeding Expectation' | 'Meeting Expectation' | 'Approaching Expectation' | 'Below Expectation';
  numericScore?: number;
  maxScore?: number;
  teacherRemarks: string;
  date: string;
}

export interface CustomTracker {
  id: string;
  trackerName: string;
  description: string;
  sheetName: string;
  columns: string[];
  records: {
    id: string;
    studentName: string;
    grade: string;
    parentPhone: string;
    status: Record<string, boolean | string>;
    lastUpdated: string;
  }[];
}

export interface StudyGroup {
  id: string;
  name: string;
  campusOrSchool: string;
  courseOrGrade: string;
  memberCount: number;
  isSupervised: boolean;
  supervisorName?: string;
  description: string;
  tags: string[];
  messages: {
    id: string;
    senderName: string;
    senderAvatar: string;
    text: string;
    timestamp: string;
    attachmentTitle?: string;
  }[];
}

export interface MentorProfile {
  id: string;
  name: string;
  avatarUrl: string;
  title: string;
  institution: string;
  expertise: string[];
  hourlyRateKes: number;
  isFreeInitial: boolean;
  rating: number;
  sessionsCompleted: number;
  bio: string;
}

export interface EFootballTournament {
  id: string;
  title: string;
  sponsorName: string;
  entryFeeKes: number;
  prizePoolKes: number;
  platform: 'Mobile (Android/iOS)' | 'PlayStation 5 / 4' | 'PC';
  maxParticipants: number;
  currentParticipants: number;
  startDate: string;
  status: 'Registration Open' | 'Bracket In Progress' | 'Finals' | 'Completed';
  bracket: {
    round: string;
    matchId: string;
    player1: { username: string; score?: number; screenshotUrl?: string };
    player2: { username: string; score?: number; screenshotUrl?: string };
    winner?: string;
    status: 'pending' | 'disputed' | 'confirmed';
  }[];
}

export interface OrderRecord {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  sellerId: string;
  sellerName: string;
  itemTitle: string;
  quantity: number;
  totalPriceKes: number;
  status: 'pending_payment' | 'paid_escrow' | 'shipped' | 'delivered' | 'buyer_confirmed' | 'seller_confirmed' | 'completed';
  paymentMethod: 'Pesapal' | 'M-Pesa STK Push' | 'Card';
  pesapalTrackingId: string;
  deliveryAddress: string;
  timestamp: string;
  notes?: string;
}

export interface LeadSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: 'Dashboard' | 'Automation' | 'Website' | 'Other';
  budgetKes?: string;
  description: string;
  submittedAt: string;
  status: 'New' | 'In Contact' | 'Proposal Sent' | 'Converted';
}

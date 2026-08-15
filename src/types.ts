export interface CertifiedDoc {
  id: string;
  name: string;
  type: 'title_deed' | 'county_permit' | 'nca_certificate' | 'kra_pin' | 'tenancy_agreement' | 'landlord_id';
  issuer: string;
  referenceNumber: string;
  issuedDate: string;
  status: 'verified' | 'pending' | 'certified';
  documentUrl?: string;
  verificationBadge: string;
  summary: string;
}

export interface LandlordReview {
  id: string;
  tenantName: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  rentalTitle: string;
}

export interface LandlordProfile {
  id: string;
  name: string;
  handle: string;
  agencyName: string;
  avatarUrl: string;
  coverImageUrl?: string;
  isVerified: boolean;
  rating: number;
  totalListings: number;
  totalReviews?: number;
  licenseNumber?: string;
  officeLocation?: string;
  operatingHours?: string;
  phone: string;
  whatsapp: string;
  email?: string;
  bio: string;
  responseRate: string;
  memberSince: string;
  specialties?: string[];
  reviews?: LandlordReview[];
}

export interface CommentItem {
  id: string;
  user: {
    name: string;
    avatar: string;
    isVerified?: boolean;
  };
  text: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  replies?: CommentItem[];
}

export interface CampusInfo {
  university: string; // e.g. "USIU-Africa", "Kenyatta University (KU)", "University of Nairobi (UoN)", "Strathmore University", "JKUAT Juja", "Daystar University", "Mount Kenya University (MKU)"
  campusBranch: string; // e.g. "Main Campus", "Chiromo", "Parklands", "Madaraka", "Roysambu/USIU Road", "Juja Gate C"
  distanceToGate: string; // e.g. "300m to Gate A (4 min walk)"
  walkingMinutes: number;
  roommateMatchingAvailable?: boolean;
  studentPerks?: string[]; // e.g. ["Free Safaricom Fibre", "Semester Billing Available", "Biometric Gate"]
  securityLevel?: string; // e.g. "24/7 Security Guard + CCTV"
  suitableFor?: string; // e.g. "USIU & PAC University Students"
}

export interface RentalListing {
  id: string;
  title: string;
  subtitle: string;
  estate: string;
  county: string;
  address: string;
  priceKes: number;
  pricePeriod: 'month' | 'day';
  serviceChargeIncluded: boolean;
  serviceChargeKes?: number;
  bedrooms: number; // 0 = bedsitter/studio
  bathrooms: number;
  sqFt: number;
  category: 'bedsitter' | '1br' | '2br' | '3br' | 'luxury' | 'commercial';
  listingMode?: 'general' | 'campus' | 'both';
  campusInfo?: CampusInfo;
  mediaType: 'video' | 'image_carousel';
  mediaUrls: string[];
  thumbnailUrl: string;
  videoUrl?: string;
  audioTrack: {
    title: string;
    artist: string;
  };
  landlord: LandlordProfile;
  amenities: {
    icon: string;
    label: string;
  }[];
  description: string;
  depositTerms: string;
  waterSupply: string;
  electricityType: 'Prepaid Token (KPLC)' | 'Postpaid' | 'Solar Included';
  garbageFeeKes: number;
  parkingSpots: number;
  petPolicy: 'Allowed' | 'Cats Only' | 'Not Allowed' | 'On Approval';
  availableFrom: string;
  certifiedDocuments: CertifiedDoc[];
  stats: {
    likes: number;
    commentsCount: number;
    shares: number;
    views: number;
    bookmarks: number;
  };
  initialComments: CommentItem[];
  nearbyLandmarks: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isLoggedIn: boolean;
  preferredMode?: 'general' | 'campus';
  preferredUniversity?: string;
  likedListingIds: string[];
  savedListingIds: string[];
  followedLandlordIds: string[];
  bookedTours: {
    id: string;
    listingId: string;
    listingTitle: string;
    date: string;
    time: string;
    status: 'Confirmed' | 'Pending';
    notes?: string;
  }[];
}

export interface FilterState {
  mode: 'general' | 'campus' | 'enerhub';
  category: string;
  county: string;
  maxPrice: number;
  bedrooms: string;
  verifiedOnly: boolean;
  searchQuery: string;
  selectedUniversity?: string;
  campusHousingType?: string;
  roommatesOnly?: boolean;
}

// EnerHub Specific Types
export type EnerHubTab = 'notes' | 'past_papers' | 'projects' | 'attachments' | 'movies' | 'music' | 'enemind_ai';

export interface StudyNote {
  id: string;
  title: string;
  courseCode: string;
  discipline: 'cs_it' | 'business' | 'engineering' | 'health' | 'law' | 'education' | 'kcse';
  disciplineName: string;
  university: string;
  semester: string;
  pages: number;
  fileSizeMb: number;
  downloadCount: number;
  rating: number;
  author: string;
  summary: string;
  topics: string[];
  sampleContent: string;
  fileFormat: 'PDF' | 'DOCX' | 'PPTX';
}

export interface PastPaper {
  id: string;
  title: string;
  courseCode: string;
  discipline: 'cs_it' | 'business' | 'engineering' | 'health' | 'law' | 'education' | 'kasneb_knec';
  university: string;
  year: number;
  semester: string;
  durationHours: number;
  hasMarkingScheme: boolean;
  downloadCount: number;
  difficulty: 'Standard' | 'Challenging' | 'Comprehensive';
  sampleQuestions: string[];
  workedSolutionsSummary: string;
}

export interface ProjectIdea {
  id: string;
  title: string;
  field: 'ai_ml' | 'fintech' | 'iot_hardware' | 'health_tech' | 'agritech' | 'proptech' | 'mobile_web';
  fieldName: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Final Year Capstone';
  targetCourses: string[];
  problemStatement: string;
  proposedSolution: string;
  techStack: string[];
  architectureOverview: string;
  milestones: { step: number; title: string; desc: string }[];
  vivaDefenseTips: string[];
  githubDemoUrl?: string;
}

export interface IndustrialAttachment {
  id: string;
  title: string;
  company: string;
  logoUrl: string;
  location: string;
  eligibleDisciplines: string[];
  stipend: string;
  deadline: string;
  durationMonths: number;
  status: 'Open' | 'Urgent' | 'Closing Soon';
  requirements: string[];
  duties: string[];
  applicationEmail: string;
  applicationUrl: string;
  howToApply: string;
  tipsForSuccess: string;
}

export interface EntertainmentMovie {
  id: string;
  title: string;
  category: 'kenyan' | 'blockbuster' | 'tech_doc' | 'series' | 'anime';
  year: number;
  duration: string;
  rating: string;
  genres: string[];
  posterUrl: string;
  backdropUrl: string;
  synopsis: string;
  director: string;
  trailerYoutubeId: string;
  streamProviders: { name: string; icon: string; url: string }[];
  downloadAvailable: boolean;
}

export interface EntertainmentMusic {
  id: string;
  title: string;
  artist: string;
  genre: 'gengetone_arbantone' | 'afrobeats' | 'lofi_study' | 'gospel' | 'hiphop';
  genreName: string;
  duration: string;
  coverUrl: string;
  audioUrl: string;
  bpm: number;
  lyricsSnippet: string;
  mood: string;
}

export interface EnerMindChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: {
    label: string;
    targetTab: EnerHubTab;
    filterQuery?: string;
    itemId?: string;
  }[];
}

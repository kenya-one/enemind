import {
  ProductItem,
  HostelProperty,
  JobPosting,
  StudyMaterial,
  StudentQuiz,
  SchoolNotice,
  StudentMarkRow,
  CustomTracker,
  StudyGroup,
  MentorProfile,
  EFootballTournament,
  OrderRecord,
  UserProfile,
  SheetEntry
} from '../types';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user_school_1',
    name: 'Alliance High School Admin',
    email: 'admin@alliancehigh.ac.ke',
    avatarUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=150&auto=format&fit=crop&q=80',
    accountType: 'school',
    schoolType: 'high_school',
    schoolName: 'Alliance High School',
    planTier: 'premium',
    kycStatus: 'verified',
    phone: '+254 722 000 111',
    location: 'Kikuyu, Kiambu County',
    coordinates: { lat: -1.2464, lng: 36.6669 },
    driveFolderId: 'folder_alliance_enemind_data',
    driveFolderName: 'Alliance High – Enemind Data',
    financeOfficerEmail: 'bursar@alliancehigh.ac.ke',
    pesapalConfig: {
      paybill: '522522',
      accountNumber: 'ALLIANCE-FEES',
      tillNumber: '789012'
    },
    youtubeChannelUrl: 'https://youtube.com/@alliancehighschoolke',
    createdAt: '2025-01-10'
  },
  {
    id: 'user_school_2',
    name: 'Riara Springs Academy (CBC Primary & JSS)',
    email: 'principal@riarasprings.ac.ke',
    avatarUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80',
    accountType: 'school',
    schoolType: 'k12',
    schoolName: 'Riara Springs Academy',
    planTier: 'premium',
    kycStatus: 'verified',
    phone: '+254 711 234 567',
    location: 'Imara Daima, Nairobi',
    coordinates: { lat: -1.3328, lng: 36.8791 },
    driveFolderId: 'folder_riara_enemind_data',
    driveFolderName: 'Riara Springs – Enemind Data',
    financeOfficerEmail: 'accounts@riarasprings.ac.ke',
    pesapalConfig: {
      paybill: '888222',
      accountNumber: 'RIARA-CBC',
      tillNumber: '345678'
    },
    createdAt: '2025-02-01'
  },
  {
    id: 'user_company_1',
    name: 'SunKing Solar Kenya',
    email: 'info@sunkingsolar.co.ke',
    avatarUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=150&auto=format&fit=crop&q=80',
    accountType: 'company',
    planTier: 'premium',
    kycStatus: 'verified',
    phone: '+254 700 888 999',
    location: 'Enterprise Road, Industrial Area, Nairobi',
    coordinates: { lat: -1.3098, lng: 36.8523 },
    driveFolderId: 'folder_sunking_enemind_data',
    driveFolderName: 'SunKing Solar – Enemind Data',
    pesapalConfig: {
      tillNumber: '674321',
      paybill: '909090',
      accountNumber: 'SunkingWeb'
    },
    youtubeChannelUrl: 'https://youtube.com/@sunkingkenya',
    isLiveNow: true,
    liveVideoUrl: 'https://www.youtube.com/watch?v=live_solar_demo_kenya',
    createdAt: '2025-01-15'
  },
  {
    id: 'user_dealer_1',
    name: 'Bamburi & Blue Triangle Building Materials',
    email: 'orders@bamburihardware.co.ke',
    avatarUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=150&auto=format&fit=crop&q=80',
    accountType: 'dealer',
    planTier: 'premium',
    kycStatus: 'verified',
    phone: '+254 720 334 455',
    location: 'Eastern Bypass, Ruiru / Kamakis',
    coordinates: { lat: -1.1685, lng: 36.9622 },
    driveFolderId: 'folder_bamburi_ruiru_enemind_data',
    driveFolderName: 'Bamburi Kamakis – Enemind Data',
    pesapalConfig: {
      tillNumber: '556677'
    },
    youtubeChannelUrl: 'https://youtube.com/@bamburihardwareke',
    createdAt: '2025-01-20'
  },
  {
    id: 'user_dealer_2',
    name: 'Mama Mboga Fresh Greens (Westlands Kiosk 14)',
    email: 'mamamboga.westlands@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=150&auto=format&fit=crop&q=80',
    accountType: 'dealer',
    planTier: 'basic',
    kycStatus: 'verified',
    phone: '+254 712 998 877',
    location: 'Westlands Market, Woodvale Grove, Nairobi',
    coordinates: { lat: -1.2655, lng: 36.8045 },
    driveFolderId: 'folder_mamamboga_enemind_data',
    driveFolderName: 'Mama Mboga Westlands – Enemind Data',
    createdAt: '2025-02-10'
  },
  {
    id: 'user_landlord_1',
    name: 'Juja Student Havens & Heights',
    email: 'stay@jujahavens.co.ke',
    avatarUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=150&auto=format&fit=crop&q=80',
    accountType: 'landlord',
    planTier: 'premium',
    kycStatus: 'verified',
    phone: '+254 722 778 899',
    location: 'Gate C, JKUAT Main Campus, Juja',
    coordinates: { lat: -1.0998, lng: 37.0144 },
    driveFolderId: 'folder_jujahavens_enemind_data',
    driveFolderName: 'Juja Havens – Enemind Data',
    pesapalConfig: {
      tillNumber: '990011',
      paybill: '400200',
      accountNumber: 'JUJA-HOSTEL'
    },
    youtubeChannelUrl: 'https://youtube.com/@jujahavensrentals',
    isLiveNow: true,
    liveVideoUrl: 'https://www.youtube.com/watch?v=live_juja_hostel_tour',
    createdAt: '2025-01-05'
  },
  {
    id: 'user_student_campus',
    name: 'Brian Mwangi (Campus Creator)',
    email: 'brian.mwangi@students.uonbi.ac.ke',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    accountType: 'student',
    studentStage: 'campus',
    schoolName: 'University of Nairobi (Chiromo Campus)',
    planTier: 'basic',
    kycStatus: 'verified',
    phone: '+254 743 112 233',
    location: 'Riverside / Chiromo, Nairobi',
    coordinates: { lat: -1.2721, lng: 36.8062 },
    driveFolderId: 'folder_brian_campus_enemind_data',
    driveFolderName: 'Brian Mwangi – Enemind Data',
    pesapalConfig: {
      tillNumber: '112233'
    },
    createdAt: '2025-02-14'
  },
  {
    id: 'user_student_cbc',
    name: 'Zawadi Achieng (CBC JSS Grade 8)',
    email: 'parent.achieng@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    accountType: 'student',
    studentStage: 'cbc_jss',
    schoolName: 'Riara Springs Academy',
    parentEmail: 'parent.achieng@gmail.com',
    planTier: 'basic',
    kycStatus: 'verified',
    location: 'Imara Daima, Nairobi',
    coordinates: { lat: -1.3328, lng: 36.8791 },
    driveFolderId: 'folder_zawadi_enemind_data',
    driveFolderName: 'Zawadi Achieng – Enemind Data',
    createdAt: '2025-02-15'
  }
];

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'prod_solar_home_pro',
    sellerId: 'user_company_1',
    sellerName: 'SunKing Solar Kenya',
    sellerType: 'company',
    sellerTier: 'premium',
    title: 'SunKing Home 500X Multi-Room Solar System + 32" Digital TV',
    category: 'Solar & Energy',
    description: 'Complete off-grid home solar kit with 50W panel, 4 ultra-bright ceiling lamps, USB fast charging ports, torch, radio, and 32-inch energy efficient HD TV. 2-year warranty with free countrywide delivery.',
    priceKes: 34999,
    images: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558441719-8b449c6ff670?w=800&auto=format&fit=crop&q=80'
    ],
    youtubeVideoId: 'SunkingSolarDemo2025',
    location: 'Industrial Area, Enterprise Road, Nairobi',
    coordinates: { lat: -1.3098, lng: 36.8523 },
    distanceKm: 3.2,
    inStock: true,
    isLiveSelling: true,
    liveYoutubeUrl: 'https://www.youtube.com/watch?v=live_solar_demo_kenya',
    rating: 4.9,
    reviewsCount: 142,
    deliveryAvailable: true
  },
  {
    id: 'prod_bamburi_cement',
    sellerId: 'user_dealer_1',
    sellerName: 'Bamburi & Blue Triangle Building Materials',
    sellerType: 'dealer',
    sellerTier: 'premium',
    title: 'Bamburi Nguvu 32.5R Cement (50kg Bag) — Bulk Site Delivery',
    category: 'Building Materials',
    description: 'High quality genuine Bamburi Nguvu cement ideal for standard residential masonry, plastering, structural concrete, and foundations. Minimum order 20 bags for free Ruiru/Thika corridor delivery.',
    priceKes: 720,
    unitType: 'bag (50kg)',
    bulkPricing: [
      { minUnits: 50, discountedPriceKes: 695 },
      { minUnits: 150, discountedPriceKes: 675 },
      { minUnits: 500, discountedPriceKes: 650 }
    ],
    images: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80'
    ],
    location: 'Eastern Bypass, Kamakis, Ruiru',
    coordinates: { lat: -1.1685, lng: 36.9622 },
    distanceKm: 8.4,
    inStock: true,
    rating: 4.8,
    reviewsCount: 88,
    deliveryAvailable: true,
    deliveryFeePerKmKes: 50
  },
  {
    id: 'prod_mabati_iron_sheets',
    sellerId: 'user_dealer_1',
    sellerName: 'Bamburi & Blue Triangle Building Materials',
    sellerType: 'dealer',
    sellerTier: 'premium',
    title: 'Box Profile Gauge 30 Roofing Mabati (Charcoal & Tile Red, 3M)',
    category: 'Building Materials',
    description: 'Durable anti-fade pre-painted corrugated box profile iron sheets. Guaranteed 15-year weather coating against rust and UV rays. Cut to custom lengths on request.',
    priceKes: 880,
    unitType: 'piece',
    bulkPricing: [
      { minUnits: 30, discountedPriceKes: 840 },
      { minUnits: 100, discountedPriceKes: 810 }
    ],
    images: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80'
    ],
    location: 'Eastern Bypass, Kamakis, Ruiru',
    coordinates: { lat: -1.1685, lng: 36.9622 },
    distanceKm: 8.4,
    inStock: true,
    rating: 4.7,
    reviewsCount: 43,
    deliveryAvailable: true
  },
  {
    id: 'prod_fresh_sukuma_spinach',
    sellerId: 'user_dealer_2',
    sellerName: 'Mama Mboga Fresh Greens (Westlands Kiosk 14)',
    sellerType: 'dealer',
    sellerTier: 'basic',
    title: 'Fresh Sukuma Wiki, Managu, Spinach & Sweet Potatoes Combo Basket',
    category: 'Farm Produce',
    description: 'Farm-fresh organic greens harvested daily from Limuru farms. Washed, sliced or whole, packed cleanly for quick kitchen cooking. Local doorstep delivery in Westlands / Parklands.',
    priceKes: 250,
    unitType: 'bundle',
    images: [
      'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80'
    ],
    location: 'Westlands Market, Nairobi',
    coordinates: { lat: -1.2655, lng: 36.8045 },
    distanceKm: 1.8,
    inStock: true,
    rating: 5.0,
    reviewsCount: 64,
    deliveryAvailable: true
  },
  {
    id: 'prod_lithium_inverter_5kw',
    sellerId: 'user_company_1',
    sellerName: 'SunKing Solar Kenya',
    sellerType: 'company',
    sellerTier: 'premium',
    title: '5.12kWh LiFePO4 Lithium Solar Battery + 5kW Hybrid Inverter Kit',
    category: 'Solar & Energy',
    description: 'Heavy duty smart home & business backup solution. Powers refrigerators, borehole pumps, lighting, computers, and water heaters seamlessly during power outages. Smart mobile app monitoring included.',
    priceKes: 185000,
    images: [
      'https://images.unsplash.com/photo-1558441719-8b449c6ff670?w=800&auto=format&fit=crop&q=80'
    ],
    location: 'Industrial Area, Nairobi',
    coordinates: { lat: -1.3098, lng: 36.8523 },
    distanceKm: 3.2,
    inStock: true,
    rating: 4.95,
    reviewsCount: 29,
    deliveryAvailable: true
  }
];

export const INITIAL_HOSTELS: HostelProperty[] = [
  {
    id: 'hostel_juja_havens',
    landlordId: 'user_landlord_1',
    landlordName: 'Juja Student Havens & Heights',
    landlordTier: 'premium',
    isVerified: true,
    title: 'Juja Havens Executive Modern Bedsitters & 1-Bedrooms',
    campusAffiliation: 'JKUAT Main Campus (5 min walk to Gate C)',
    propertyType: 'Bedsitter',
    address: 'Near Joyland Supermarket, Gate C, Juja',
    location: 'Juja, Kiambu County',
    coordinates: { lat: -1.0998, lng: 37.0144 },
    distanceToCampusKm: 0.4,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80'
    ],
    youtubeVideoTourId: 'JujaHavensVirtualTour2025',
    rentKes: 9500,
    rentPeriod: 'per month',
    amenities: [
      'High-Speed Wi-Fi (Included)',
      'Constant 24/7 Borehole Water',
      'CCTV & Biometric Gate Access',
      'Token Electricity Meter per Unit',
      'Balcony with Scenic View',
      'Rooftop Study & Laundry Area'
    ],
    vacantUnits: 4,
    totalUnits: 36,
    walkthroughSessions: [
      {
        id: 'session_juja_live_1',
        propertyId: 'hostel_juja_havens',
        mode: 'group',
        scheduledTime: 'Today at 4:30 PM EAT',
        capacity: 25,
        bookedCount: 18,
        isLiveNow: true,
        youtubeLiveUrl: 'https://www.youtube.com/watch?v=live_juja_hostel_tour'
      },
      {
        id: 'session_juja_1on1_2',
        propertyId: 'hostel_juja_havens',
        mode: '1:1_private',
        scheduledTime: 'Tomorrow at 11:00 AM EAT',
        capacity: 1,
        bookedCount: 0,
        isLiveNow: false
      }
    ]
  },
  {
    id: 'hostel_kahawa_sukari',
    landlordId: 'user_landlord_1',
    landlordName: 'Juja Student Havens & Heights',
    landlordTier: 'premium',
    isVerified: true,
    title: 'Kahawa Sukari Heights Luxury 1-Bedroom & Studios',
    campusAffiliation: 'Kenyatta University (KU Main Campus, 8 min shuttle)',
    propertyType: '1-Bedroom',
    address: 'Kahawa Sukari 4th South Avenue',
    location: 'Kahawa Sukari, Nairobi / Kiambu Border',
    coordinates: { lat: -1.1895, lng: 36.9312 },
    distanceToCampusKm: 1.2,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80'
    ],
    youtubeVideoTourId: 'KahawaSukariHeightsTour',
    rentKes: 14500,
    rentPeriod: 'per month',
    amenities: [
      'Dedicated Study Desk & Fitted Wardrobes',
      'Solar Hot Water System',
      'Perimeter Electric Fence + Guard 24/7',
      'Gym Access Discount for Residents',
      'Fiber Internet Ready'
    ],
    vacantUnits: 2,
    totalUnits: 20,
    walkthroughSessions: [
      {
        id: 'session_kahawa_1',
        propertyId: 'hostel_kahawa_sukari',
        mode: 'group',
        scheduledTime: 'Saturday at 2:00 PM EAT',
        capacity: 15,
        bookedCount: 6,
        isLiveNow: false
      }
    ]
  }
];

export const INITIAL_JOBS: JobPosting[] = [
  {
    id: 'job_sunking_tech_lead',
    posterId: 'user_company_1',
    posterName: 'SunKing Solar Kenya',
    posterType: 'Company',
    title: 'Solar Field Installation Technician & Quality Inspector',
    companyName: 'SunKing Solar Kenya Ltd',
    category: 'Full-time',
    location: 'Nairobi & Central Region Hubs',
    coordinates: { lat: -1.3098, lng: 36.8523 },
    salaryRangeKes: 'KES 45,000 - 65,000 / month',
    deadline: '2026-09-15',
    description: 'Responsible for leading solar micro-grid installations, warranty repairs, customer technical support, and battery diagnostics across residential and agri-business client sites.',
    requirements: [
      'Diploma or Degree in Electrical/Solar Engineering or T1/T2 EPRA Solar License',
      'Minimum 1 year hands-on experience in off-grid or hybrid solar setups',
      'Valid driving/riding license preferred',
      'Fluent in English and Swahili'
    ],
    contactEmail: 'careers@sunkingsolar.co.ke'
  },
  {
    id: 'job_alliance_stem_intern',
    posterId: 'user_school_1',
    posterName: 'Alliance High School',
    posterType: 'School',
    title: 'Computer Science & Robotics Laboratory Assistant (Internship)',
    companyName: 'Alliance High School STEM Hub',
    category: 'Internship',
    location: 'Kikuyu, Kiambu',
    coordinates: { lat: -1.2464, lng: 36.6669 },
    salaryRangeKes: 'KES 25,000 stipend + Housing on campus',
    deadline: '2026-09-01',
    description: 'Assist in guiding high school robotics club, Raspberry Pi projects, coding competitions, and network maintenance for the school computer labs.',
    requirements: [
      'Continuing campus student or recent graduate in CS, IT, or Mechatronics',
      'Proficiency in Python, Scratch, and basic electronics',
      'Passion for mentoring young innovators'
    ],
    contactEmail: 'admin@alliancehigh.ac.ke'
  },
  {
    id: 'job_attachment_civil',
    posterId: 'user_dealer_1',
    posterName: 'Bamburi Building Materials',
    posterType: 'Dealer',
    title: 'Industrial Attachment: Building Materials Testing & Store Inventory',
    companyName: 'Bamburi Kamakis Supply Depot',
    category: 'Attachment',
    location: 'Ruiru, Kiambu',
    coordinates: { lat: -1.1685, lng: 36.9622 },
    salaryRangeKes: 'KES 15,000 / month facilitation allowance',
    deadline: '2026-08-31',
    description: 'Great opportunity for engineering/quantity survey students to gain hands-on knowledge in cement batching, steel grading, logistics dispatch, and site delivery operations.',
    requirements: [
      'Letter of attachment from a recognized TVET, Polytechnic, or University',
      'Basic knowledge of building supplies and inventory recording'
    ],
    contactEmail: 'orders@bamburihardware.co.ke'
  }
];

export const INITIAL_STUDY_MATERIALS: StudyMaterial[] = [
  {
    id: 'mat_campus_calc4',
    uploaderId: 'user_student_campus',
    uploaderName: 'Brian Mwangi (UoN Engineering Year 3)',
    uploaderStage: 'campus',
    schoolName: 'University of Nairobi',
    title: 'Comprehensive Calculus IV & Differential Equations Summary Notes + Solved Past Exams (2021-2024)',
    gradeLevel: 'Campus (Degree/Diploma)',
    subject: 'Engineering Mathematics / Pure Mathematics',
    course: 'BSc Electrical & Mechanical Engineering',
    campusName: 'University of Nairobi (Chiromo & Main Campus)',
    isPaid: true,
    priceKes: 150,
    previewUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
    fullContentPreview: 'Covers Laplace Transforms, Fourier Series, Boundary Value Problems, PDEs with step-by-step worked university past paper questions and formulas cheat sheet.',
    driveFileUrl: 'https://drive.google.com/file/d/enemind_sample_calculus4_notes/view',
    downloadsCount: 384,
    rating: 4.9,
    audioAvailable: true,
    tags: ['Math', 'Calculus', 'Engineering', 'Pastpapers', 'UoN']
  },
  {
    id: 'mat_kcse_chem_pp1',
    uploaderId: 'user_school_1',
    uploaderName: 'Alliance High School Science Dept',
    uploaderStage: 'school',
    schoolName: 'Alliance High School',
    title: 'KCSE Chemistry Paper 1 & 2 Prediction Mastery Booklet with Marking Schemes & Practical Tips',
    gradeLevel: 'Form 1-4',
    subject: 'Chemistry',
    isApprovedBySchool: true,
    isPaid: true,
    priceKes: 200,
    previewUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
    fullContentPreview: 'Comprehensive revision booklet compiled by senior KCSE national examiners at Alliance High School. High-yield organic chemistry charts, qualitative analysis flowcharts, and mole concept drills.',
    driveFileUrl: 'https://drive.google.com/file/d/enemind_alliance_chem_revision/view',
    downloadsCount: 1250,
    rating: 5.0,
    tags: ['KCSE', 'Chemistry', 'Alliance High', 'Marking Scheme', 'Form 4']
  },
  {
    id: 'mat_cbc_jss_integrated_science',
    uploaderId: 'user_school_2',
    uploaderName: 'Riara Springs Academy Teachers',
    uploaderStage: 'school',
    schoolName: 'Riara Springs Academy',
    title: 'CBC Grade 8 Integrated Science Strand Summary & Competency Assessment Worksheets',
    gradeLevel: 'Grade 7-9 (JSS)',
    subject: 'Integrated Science',
    isApprovedBySchool: true,
    isPaid: false,
    priceKes: 0,
    previewUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
    fullContentPreview: 'Curated curriculum strands: Reproduction in Plants and Animals, Heat Transfer, Basic Chemical Reactions, and Community Health practical tasks aligned with KICD standards.',
    driveFileUrl: 'https://drive.google.com/file/d/enemind_riara_grade8_science/view',
    downloadsCount: 890,
    rating: 4.85,
    tags: ['CBC', 'JSS', 'Grade 8', 'Integrated Science', 'KICD Approved']
  }
];

export const INITIAL_QUIZZES: StudentQuiz[] = [
  {
    id: 'quiz_cbc_primary_env',
    gradeLevel: 'CBC Primary',
    subject: 'Environmental Activities & Agriculture',
    title: 'Clean Energy & Water Conservation in Kenya',
    competencyArea: 'Critical Thinking & Problem Solving',
    questions: [
      {
        question: 'Which of the following is a clean and renewable source of energy widely used in Kenyan rural homes?',
        options: ['Diesel Generator', 'Solar Panel System', 'Kerosene Lamp', 'Charcoal Stove'],
        correctIndex: 1,
        explanation: 'Solar panels capture energy from sunlight without polluting the air or producing smoke, making it renewable and healthy.'
      },
      {
        question: 'Why is mulch placed around soil at the base of growing crops like maize and vegetables?',
        options: ['To attract harmful insects', 'To retain moisture and stop weed growth', 'To make the soil colder', 'To increase salt in the soil'],
        correctIndex: 1,
        explanation: 'Mulching covers the soil with organic matter to prevent water evaporation and keep weeds from competing with plants.'
      },
      {
        question: 'What is the most sustainable way to harvest water during the Kenyan rainy season?',
        options: ['Allowing rooftop runoff into storage tanks', 'Draining water into roads', 'Boiling river water immediately', 'Using single-use plastic bottles'],
        correctIndex: 0,
        explanation: 'Rooftop rainwater harvesting captures clean water directly into tanks for home and school use.'
      }
    ]
  },
  {
    id: 'quiz_jss_pretech',
    gradeLevel: 'CBC JSS',
    subject: 'Pre-Technical Studies',
    title: 'Safety, Workshop Tools & Electrical Circuits',
    competencyArea: 'Technological Literacy',
    questions: [
      {
        question: 'What is the main function of a fuse or circuit breaker in a home electrical installation?',
        options: ['To generate extra voltage', 'To protect electrical appliances by breaking current overload', 'To change direct current to alternating current', 'To cool the cables'],
        correctIndex: 1,
        explanation: 'A fuse blows or breaker trips when current exceeds safe limits, protecting wiring and preventing fires.'
      },
      {
        question: 'Which measuring tool is most accurate for measuring the external diameter of a round steel rebar?',
        options: ['Measuring Tape', 'Vernier Caliper', 'School Plastic Ruler', 'Plumb Line'],
        correctIndex: 1,
        explanation: 'Vernier calipers measure internal and external diameters with precision up to 0.02 mm.'
      }
    ]
  }
];

export const INITIAL_SCHOOL_MARKS: StudentMarkRow[] = [
  {
    studentId: 'ADM-8901',
    studentName: 'Zawadi Achieng',
    gradeClass: 'Grade 8 Blue',
    subject: 'Integrated Science',
    term: 'Term 1',
    assessmentType: 'CBC Competency',
    cbcRating: 'Exceeding Expectation',
    teacherRemarks: 'Demonstrates exceptional mastery in experimental setup and environmental science projects.',
    date: '2026-03-28'
  },
  {
    studentId: 'ADM-8901',
    studentName: 'Zawadi Achieng',
    gradeClass: 'Grade 8 Blue',
    subject: 'Mathematics',
    term: 'Term 1',
    assessmentType: 'CBC Competency',
    cbcRating: 'Meeting Expectation',
    teacherRemarks: 'Very good grasp of algebraic expressions and geometric measurements. Regular practice encouraged.',
    date: '2026-03-28'
  },
  {
    studentId: 'ADM-8901',
    studentName: 'Zawadi Achieng',
    gradeClass: 'Grade 8 Blue',
    subject: 'Pre-Technical Studies',
    term: 'Term 1',
    assessmentType: 'CBC Competency',
    cbcRating: 'Exceeding Expectation',
    teacherRemarks: 'Skilled in tool identification, blueprint sketching, and electrical circuit assembly.',
    date: '2026-03-28'
  },
  {
    studentId: 'ADM-8902',
    studentName: 'Kevin Kiprop',
    gradeClass: 'Grade 8 Blue',
    subject: 'Integrated Science',
    term: 'Term 1',
    assessmentType: 'CBC Competency',
    cbcRating: 'Meeting Expectation',
    teacherRemarks: 'Good active participation in group discussions and laboratory safety tasks.',
    date: '2026-03-28'
  }
];

export const INITIAL_CUSTOM_TRACKERS: CustomTracker[] = [
  {
    id: 'tracker_term2_trip',
    trackerName: 'Grade 8 Science Field Trip to Olkaria Geothermal Power Plant',
    description: 'Checklist for parent consent forms, transport payment (KES 2,500), and emergency contacts.',
    sheetName: 'Tracker_Term2Trip',
    columns: ['Consent Slip Signed', 'Trip Fee Paid (KES 2500)', 'Medical Form Returned', 'Assigned Bus'],
    records: [
      {
        id: 'rec_1',
        studentName: 'Zawadi Achieng',
        grade: 'Grade 8 Blue',
        parentPhone: '+254 712 998 877',
        status: {
          'Consent Slip Signed': 'Yes',
          'Trip Fee Paid (KES 2500)': 'Paid via M-Pesa (REF: QWE782)',
          'Medical Form Returned': 'Yes',
          'Assigned Bus': 'Bus A'
        },
        lastUpdated: '2026-04-12 10:20 AM'
      },
      {
        id: 'rec_2',
        studentName: 'Kevin Kiprop',
        grade: 'Grade 8 Blue',
        parentPhone: '+254 722 334 455',
        status: {
          'Consent Slip Signed': 'Yes',
          'Trip Fee Paid (KES 2500)': 'Pending',
          'Medical Form Returned': 'Yes',
          'Assigned Bus': 'Bus A'
        },
        lastUpdated: '2026-04-12 09:15 AM'
      }
    ]
  }
];

export const INITIAL_STUDY_GROUPS: StudyGroup[] = [
  {
    id: 'grp_uon_engineering',
    name: 'UoN Chiromo & Main Campus Electrical & Software Engineers',
    campusOrSchool: 'University of Nairobi',
    courseOrGrade: 'Engineering & CS',
    memberCount: 148,
    isSupervised: false,
    description: 'Official peer discussion group for past exam revision, project collaborate, internship shares, and coding help.',
    tags: ['UoN', 'Engineering', 'Coding', 'Pastpapers'],
    messages: [
      {
        id: 'msg_1',
        senderName: 'Brian Mwangi',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        text: 'Uploaded the Calculus IV past exam solution sheet on Enemind! Check the study hub.',
        timestamp: '10:45 AM',
        attachmentTitle: 'Calculus IV Solved Paper 2024.pdf'
      },
      {
        id: 'msg_2',
        senderName: 'Faith Chebet',
        senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        text: 'Asante Brian! Does it cover boundary value Laplace transforms for Question 4?',
        timestamp: '10:48 AM'
      }
    ]
  }
];

export const INITIAL_MENTORS: MentorProfile[] = [
  {
    id: 'mentor_dr_kamau',
    name: 'Eng. Patrick Kamau, PhD',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    title: 'Lead Renewable Energy Systems Engineer',
    institution: 'EPRA & KPLC Consultant',
    expertise: ['Solar Grid Integration', 'Career in Engineering', 'Postgraduate Scholarship Prep'],
    hourlyRateKes: 1000,
    isFreeInitial: true,
    rating: 4.95,
    sessionsCompleted: 87,
    bio: 'Over 12 years experience deploying large-scale commercial solar plants in East Africa. Passionate about mentoring upcoming STEM talent.'
  },
  {
    id: 'mentor_sarah_odero',
    name: 'Sarah Odero',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    title: 'Senior Software Architect & Fintech Advisor',
    institution: 'Safaricom / Pesapal Ecosystem Alumni',
    expertise: ['Tech Careers', 'PWA & Mobile Apps', 'M-Pesa API Architecture'],
    hourlyRateKes: 1200,
    isFreeInitial: true,
    rating: 5.0,
    sessionsCompleted: 114,
    bio: 'Mentoring university students on software craftsmanship, portfolio building, and international remote engineering roles.'
  }
];

export const INITIAL_EFOOTBALL_TOURNAMENT: EFootballTournament = {
  id: 'tourney_enemind_pilot_1',
  title: 'Enemind eFootball Kenya Campus Cup (Pilot Season 1)',
  sponsorName: 'SunKing Solar & Enemind Campus Guild',
  entryFeeKes: 10,
  prizePoolKes: 3000,
  platform: 'Mobile (Android/iOS)',
  maxParticipants: 32,
  currentParticipants: 28,
  startDate: '2026-08-25 18:00 EAT',
  status: 'Registration Open',
  bracket: [
    {
      round: 'Round of 16 - Match 1',
      matchId: 'M1',
      player1: { username: 'Striker_Kevo_254', score: 3, screenshotUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80' },
      player2: { username: 'Juja_GoalMachine', score: 1, screenshotUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80' },
      winner: 'Striker_Kevo_254',
      status: 'confirmed'
    },
    {
      round: 'Round of 16 - Match 2',
      matchId: 'M2',
      player1: { username: 'Nairobi_Sniper99' },
      player2: { username: 'Chiromo_Legend' },
      status: 'pending'
    }
  ]
};

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'ORD-78921-KE',
    buyerId: 'user_student_campus',
    buyerName: 'Brian Mwangi',
    buyerPhone: '+254 743 112 233',
    buyerEmail: 'brian.mwangi@students.uonbi.ac.ke',
    sellerId: 'user_company_1',
    sellerName: 'SunKing Solar Kenya',
    itemTitle: 'SunKing Home 500X Multi-Room Solar System + 32" Digital TV',
    quantity: 1,
    totalPriceKes: 34999,
    status: 'paid_escrow',
    paymentMethod: 'Pesapal',
    pesapalTrackingId: 'PP-TXN-998822-KE',
    deliveryAddress: 'Chiromo Campus Hostel Hall 4, Riverside Drive, Nairobi',
    timestamp: '2026-08-16 14:32 EAT'
  }
];

export const INITIAL_USER_SHEETS: Record<string, SheetEntry[]> = {
  user_company_1: [
    {
      sheetName: 'Catalogue',
      rowCount: 12,
      lastModified: '2026-08-17 08:12 EAT',
      syncStatus: 'synced',
      columns: ['Item_ID', 'Title', 'Category', 'Price_KES', 'In_Stock', 'YouTube_Demo_ID'],
      sampleRows: [
        { Item_ID: 'SOL-500X', Title: 'SunKing Home 500X Solar Kit', Category: 'Solar & Energy', Price_KES: 34999, In_Stock: 'TRUE' },
        { Item_ID: 'BAT-5KWH', Title: 'LiFePO4 5.12kWh Battery Pack', Category: 'Solar & Energy', Price_KES: 185000, In_Stock: 'TRUE' }
      ]
    },
    {
      sheetName: 'Sales',
      rowCount: 48,
      lastModified: '2026-08-17 08:15 EAT',
      syncStatus: 'synced',
      columns: ['Order_ID', 'Customer_Name', 'Customer_Phone', 'Amount_KES', 'Payment_Status', 'Delivery_Location'],
      sampleRows: [
        { Order_ID: 'ORD-78921-KE', Customer_Name: 'Brian Mwangi', Customer_Phone: '+254743112233', Amount_KES: 34999, Payment_Status: 'CONFIRMED' }
      ]
    },
    {
      sheetName: 'Jobs',
      rowCount: 3,
      lastModified: '2026-08-15 17:00 EAT',
      syncStatus: 'synced',
      columns: ['Job_ID', 'Role_Title', 'Type', 'Location', 'Salary_KES', 'Deadline'],
      sampleRows: [
        { Job_ID: 'JOB-SOL-01', Role_Title: 'Solar Field Installation Technician', Type: 'Full-time', Location: 'Nairobi', Salary_KES: '45000-65000', Deadline: '2026-09-15' }
      ]
    },
    {
      sheetName: 'Notices_Policies',
      rowCount: 4,
      lastModified: '2026-08-10 11:30 EAT',
      syncStatus: 'synced',
      columns: ['Policy_Title', 'Effective_Date', 'Summary'],
      sampleRows: [
        { Policy_Title: 'Warranty & Free Replacement Policy', Effective_Date: '2025-01-01', Summary: '24 months coverage on all SunKing batteries and panels' }
      ]
    }
  ],
  user_school_1: [
    {
      sheetName: 'Students',
      rowCount: 1450,
      lastModified: '2026-08-17 07:00 EAT',
      syncStatus: 'synced',
      columns: ['Admin_No', 'Student_Name', 'Class_Form', 'Parent_Email', 'Parent_Phone'],
      sampleRows: [
        { Admin_No: 'ADM-7788', Student_Name: 'David Kariuki', Class_Form: 'Form 4 East', Parent_Email: 'dkariuki.parent@gmail.com', Parent_Phone: '+254722112233' }
      ]
    },
    {
      sheetName: 'Marks',
      rowCount: 8700,
      lastModified: '2026-08-17 07:45 EAT',
      syncStatus: 'synced',
      columns: ['Student_ID', 'Name', 'Subject', 'Term', 'Assessment', 'Rating_or_Score', 'Teacher_Remarks'],
      sampleRows: [
        { Student_ID: 'ADM-7788', Name: 'David Kariuki', Subject: 'Chemistry', Term: 'Term 1', Assessment: 'KCSE Mock Exam', Rating_or_Score: '88/100 (A)', Teacher_Remarks: 'Excellent' }
      ]
    },
    {
      sheetName: 'Notices',
      rowCount: 8,
      lastModified: '2026-08-16 16:00 EAT',
      syncStatus: 'synced',
      columns: ['Notice_ID', 'Title', 'Date', 'Target_Audience', 'Body'],
      sampleRows: [
        { Notice_ID: 'NOT-2026-04', Title: 'Term 2 Academic Visiting Day & Science Fair', Date: '2026-06-14', Target_Audience: 'Parents', Body: 'All parents are invited for open consultation' }
      ]
    },
    {
      sheetName: 'Jobs',
      rowCount: 2,
      lastModified: '2026-08-14 12:00 EAT',
      syncStatus: 'synced',
      columns: ['Job_ID', 'Title', 'Type', 'Department', 'Deadline'],
      sampleRows: [
        { Job_ID: 'SCH-JOB-01', Title: 'Computer Science Lab Assistant (Internship)', Type: 'Internship', Department: 'STEM Hub', Deadline: '2026-09-01' }
      ]
    }
  ],
  user_landlord_1: [
    {
      sheetName: 'Properties',
      rowCount: 3,
      lastModified: '2026-08-17 08:30 EAT',
      syncStatus: 'synced',
      columns: ['Property_ID', 'Property_Name', 'Campus_Near', 'Monthly_Rent_KES', 'Vacant_Units'],
      sampleRows: [
        { Property_ID: 'PROP-JUJA-01', Property_Name: 'Juja Havens Bedsitters', Campus_Near: 'JKUAT Gate C', Monthly_Rent_KES: 9500, Vacant_Units: 4 },
        { Property_ID: 'PROP-KU-02', Property_Name: 'Kahawa Sukari Heights 1BR', Campus_Near: 'Kenyatta Univ', Monthly_Rent_KES: 14500, Vacant_Units: 2 }
      ]
    },
    {
      sheetName: 'Bookings',
      rowCount: 18,
      lastModified: '2026-08-17 08:35 EAT',
      syncStatus: 'synced',
      columns: ['Booking_ID', 'Student_Name', 'Property', 'Unit_Type', 'Deposit_Status', 'Move_In_Date'],
      sampleRows: [
        { Booking_ID: 'BK-9912', Student_Name: 'Faith Muthoni (JKUAT)', Property: 'Juja Havens', Unit_Type: 'Bedsitter Unit 3B', Deposit_Status: 'Paid (Ref: PP-443)', Move_In_Date: '2026-09-01' }
      ]
    },
    {
      sheetName: 'Sessions',
      rowCount: 6,
      lastModified: '2026-08-17 08:40 EAT',
      syncStatus: 'synced',
      columns: ['Session_ID', 'Property_ID', 'Mode', 'Scheduled_Time', 'YouTube_Live_URL', 'Status'],
      sampleRows: [
        { Session_ID: 'SESS-01', Property_ID: 'PROP-JUJA-01', Mode: 'Group', Scheduled_Time: 'Today 4:30 PM', YouTube_Live_URL: 'https://youtube.com/live_sample', Status: 'LIVE_NOW' }
      ]
    }
  ]
};

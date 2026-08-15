export interface SocialVideoItem {
  id: string;
  source: 'tiktok' | 'instagram' | 'facebook' | 'youtube';
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  title: string;
  caption: string;
  views: string;
  likes: string;
  duration: string;
  videoUrl?: string;
  thumbnailUrl: string;
  mediaUrls?: string[];
  audioTrack: {
    title: string;
    artist: string;
  };
  suggestedData: {
    listingMode: 'general' | 'campus';
    estate: string;
    county: string;
    address: string;
    priceKes: number;
    bedrooms: number;
    bathrooms: number;
    sqFt: number;
    category: 'bedsitter' | '1br' | '2br' | '3br' | 'luxury';
    university?: string;
    campusBranch?: string;
    distanceToGate?: string;
    walkingMinutes?: number;
    amenities: string[];
    description: string;
    docRef: string;
  };
}

export const TIKTOK_MOCK_CREATORS = [
  {
    handle: '@joicerentals',
    name: 'Joice Barasa Rentals KE',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    followers: '28.4K',
    likesCount: '412K',
    bio: 'Verified Nairobi & Campus Housing Creator 🇰🇪 Tours & Daily Vacancies'
  },
  {
    handle: '@kenyahousehunt',
    name: 'Kenya House Hunt Official',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    followers: '115.8K',
    likesCount: '1.9M',
    bio: 'Finding dream apartments in Kilimani, Westlands, KU & JKUAT 🏡'
  },
  {
    handle: '@studentcribs_ku',
    name: 'KU & JKUAT Student Cribs',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=200&q=80',
    followers: '42.1K',
    likesCount: '620K',
    bio: 'Affordable Bedsitters & 1BR near KU KM Gate, Juja & Roysambu 🎓'
  },
  {
    handle: '@kilimaniluxury',
    name: 'Kilimani Executive Living',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    followers: '68.3K',
    likesCount: '890K',
    bio: 'High-rise luxury 2BR & 3BR master ensuite apartments with skyline views'
  }
];

export const TIKTOK_VIDEOS: SocialVideoItem[] = [
  {
    id: 'tt-vid-1',
    source: 'tiktok',
    creatorName: 'Joice Barasa Rentals KE',
    creatorHandle: '@joicerentals',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    title: 'The Pearl Executive 2BR Kilimani • Balcony View',
    caption: 'POV: Tour this breathtaking 2BR apartment in Kilimani near Yaya Centre! ✨ Borehole water 24/7, rooftop gym & solar water heating! KSh 60,000/mo #KilimaniRentals #NairobiHomes #HouseHuntKE',
    views: '184.2K',
    likes: '18.4K',
    duration: '0:34',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1080&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1080&q=80'
    ],
    audioTrack: {
      title: 'Suzanna Acoustic Lo-Fi (Nairobi Groove)',
      artist: 'Sauti Sol & Kenyan House Vibes'
    },
    suggestedData: {
      listingMode: 'general',
      estate: 'Kilimani',
      county: 'Nairobi',
      address: 'Kindaruma Road near Yaya Centre, Kilimani',
      priceKes: 60000,
      bedrooms: 2,
      bathrooms: 2,
      sqFt: 1250,
      category: '2br',
      amenities: ['Droplets', 'Zap', 'ShieldCheck', 'ArrowUpCircle', 'Dumbbell', 'Wifi'],
      description: '✨ Auto-synced from TikTok (@joicerentals). Premium 2BR master ensuite apartment with modern gypsum ceilings, high-speed lift, rooftop gym, borehole water and backup generator.',
      docRef: 'NCC/PLN/B22-8812/2024'
    }
  },
  {
    id: 'tt-vid-2',
    source: 'tiktok',
    creatorName: 'KU & JKUAT Student Cribs',
    creatorHandle: '@studentcribs_ku',
    creatorAvatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=200&q=80',
    title: 'Scholar Haven Modern Bedsitter • 4 Min Walk to KU KM Gate',
    caption: 'KU Comrades! 🔥 Ultra modern bedsitter with study desk nook, high-speed Wi-Fi, token meter, instant hot shower and biometric gate access! KSh 9,500/mo #KenyattaUniversity #KUCampus #NairobiStudents',
    views: '240.5K',
    likes: '31.2K',
    duration: '0:26',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1080&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1080&q=80'
    ],
    audioTrack: {
      title: 'Kuna Kuna (Campus Sunset Remix)',
      artist: 'Vic West & Brandy Maina'
    },
    suggestedData: {
      listingMode: 'campus',
      estate: 'Kahawa Sukari / KM',
      county: 'Kiambu',
      address: 'Off Thika Superhighway near KU KM Gate',
      priceKes: 9500,
      bedrooms: 0,
      bathrooms: 1,
      sqFt: 340,
      category: 'bedsitter',
      university: 'Kenyatta University (KU)',
      campusBranch: 'Main Campus (KM Gate)',
      distanceToGate: '300m to KM Gate (4 min walk)',
      walkingMinutes: 4,
      amenities: ['Droplets', 'ShieldCheck', 'Wifi', 'Sun'],
      description: '✨ Auto-synced from TikTok (@studentcribs_ku). Perfect student bedsitter 4 minutes walk to KU KM Gate. Comes with dedicated study desk, high-speed fiber internet, instant hot shower and 24/7 security.',
      docRef: 'STU/CERT/KU-KM/2024-098'
    }
  },
  {
    id: 'tt-vid-3',
    source: 'tiktok',
    creatorName: 'Kilimani Executive Living',
    creatorHandle: '@kilimaniluxury',
    creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    title: 'Skyline Terrace 1BR Westlands • Fully Furnished Option',
    caption: 'Executive 1BR in Westlands with infinity swimming pool, solar water heating & dual lifts! Walk to Sarit Centre & Westgate. KSh 52,000/mo #WestlandsLiving #NairobiApartments',
    views: '96.8K',
    likes: '12.1K',
    duration: '0:42',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1080&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1080&q=80'
    ],
    audioTrack: {
      title: 'Nairobi Urban Pulse (Afro-Chill)',
      artist: 'Matata & Nairobi House'
    },
    suggestedData: {
      listingMode: 'general',
      estate: 'Westlands',
      county: 'Nairobi',
      address: 'Muthithi Road, Westlands, Nairobi',
      priceKes: 52000,
      bedrooms: 1,
      bathrooms: 1,
      sqFt: 850,
      category: '1br',
      amenities: ['Droplets', 'Zap', 'ShieldCheck', 'ArrowUpCircle', 'Waves', 'Wifi'],
      description: '✨ Auto-synced from TikTok (@kilimaniluxury). Gorgeous 1BR with open-concept kitchen, balcony, infinity swimming pool, high speed lift, and walking distance to Westlands commercial center.',
      docRef: 'NCC/PLN/W44-1029/2024'
    }
  },
  {
    id: 'tt-vid-4',
    source: 'tiktok',
    creatorName: 'KU & JKUAT Student Cribs',
    creatorHandle: '@studentcribs_ku',
    creatorAvatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=200&q=80',
    title: 'Juja Premier 1BR Apartment • 500m to JKUAT Gate C',
    caption: 'Spacious 1BR apartment for JKUAT students & techies! High ceiling, private balcony, borehole water, token power. KSh 14,000/mo #JKUATJuja #StudentLifeKE',
    views: '118.9K',
    likes: '15.7K',
    duration: '0:30',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1080&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1080&q=80'
    ],
    audioTrack: {
      title: 'Sishikiki (Gengetone Chill Beats)',
      artist: 'Mejja & Kenyan Vibes'
    },
    suggestedData: {
      listingMode: 'campus',
      estate: 'Juja / Gate C',
      county: 'Kiambu',
      address: 'Gachororo Road near JKUAT Gate C',
      priceKes: 14000,
      bedrooms: 1,
      bathrooms: 1,
      sqFt: 550,
      category: '1br',
      university: 'JKUAT Juja',
      campusBranch: 'Main Campus (Juja)',
      distanceToGate: '500m to Gate C (6 min walk)',
      walkingMinutes: 6,
      amenities: ['Droplets', 'ShieldCheck', 'Wifi', 'Car'],
      description: '✨ Auto-synced from TikTok (@studentcribs_ku). Roomy 1BR apartment near JKUAT Gate C with separate bedroom, tiled bathroom, private balcony, constant water supply and secure biometric gate.',
      docRef: 'STU/CERT/JKUAT-JC/2024-551'
    }
  }
];

export const INSTAGRAM_POSTS: SocialVideoItem[] = [
  {
    id: 'ig-post-1',
    source: 'instagram',
    creatorName: 'Joice Real Estate Nairobi',
    creatorHandle: '@joice_realestate_ke',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    title: 'The Azure Residence 3BR Ensuite Lavington',
    caption: 'Exquisite 3 Bedroom all ensuite apartment in Lavington. High-end finishes, DSQ, swimming pool, kids play area & solar water. KSh 95,000/mo. DM or WhatsApp +254 712 345 678 for private viewing.',
    views: '45.2K',
    likes: '3.4K',
    duration: 'Reel • 0:45',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1080&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1080&q=80'
    ],
    audioTrack: {
      title: 'Midnight in Nairobi (Saxophone Smooth)',
      artist: 'Kenyan Jazz Collective'
    },
    suggestedData: {
      listingMode: 'general',
      estate: 'Lavington',
      county: 'Nairobi',
      address: 'James Gichuru Road, Lavington, Nairobi',
      priceKes: 95000,
      bedrooms: 3,
      bathrooms: 3,
      sqFt: 1850,
      category: '3br',
      amenities: ['Droplets', 'Zap', 'ShieldCheck', 'ArrowUpCircle', 'Waves', 'Dumbbell', 'Car', 'Trees'],
      description: '✨ Auto-synced from Instagram (@joice_realestate_ke). Prestigious 3BR all ensuite home in Lavington featuring spacious lounge, semi-open plan kitchen, servant quarter (DSQ), heated pool and lush gardens.',
      docRef: 'NCC/PLN/L99-4401/2024'
    }
  },
  {
    id: 'ig-post-2',
    source: 'instagram',
    creatorName: 'Campus Living Kenya',
    creatorHandle: '@campusliving_ke',
    creatorAvatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=200&q=80',
    title: 'Strathmore Varsity Suites Studio • Madaraka',
    caption: 'Modern luxury student studio right opposite Strathmore University Gate. Walk to class in 3 minutes! High speed fiber, biometric security & quiet study lounge. KSh 16,500/mo.',
    views: '38.6K',
    likes: '4.8K',
    duration: 'Carousel • 4 Photos',
    thumbnailUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1080&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1080&q=80'
    ],
    audioTrack: {
      title: 'Acoustic Nairobi Chill',
      artist: 'Antigravity Campus Sound'
    },
    suggestedData: {
      listingMode: 'campus',
      estate: 'Madaraka',
      county: 'Nairobi',
      address: 'Ole Sangale Road opposite Strathmore Gate',
      priceKes: 16500,
      bedrooms: 0,
      bathrooms: 1,
      sqFt: 380,
      category: 'bedsitter',
      university: 'Strathmore University',
      campusBranch: 'Madaraka Campus',
      distanceToGate: '150m to Main Gate (2 min walk)',
      walkingMinutes: 2,
      amenities: ['Droplets', 'Zap', 'ShieldCheck', 'Wifi', 'Sun'],
      description: '✨ Auto-synced from Instagram (@campusliving_ke). High-end student studio apartment directly facing Strathmore University. Fast fiber internet, study lounge on ground floor, 24/7 CCTV and borehole.',
      docRef: 'STU/CERT/STRATH-MAD/2024-301'
    }
  }
];

export const FACEBOOK_POSTS: SocialVideoItem[] = [
  {
    id: 'fb-post-1',
    source: 'facebook',
    creatorName: 'Nairobi Rentals & Hostels Hub',
    creatorHandle: 'NairobiRentalsHub',
    creatorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    title: 'Roysambu Executive 1BR near TRM Mall & USIU',
    caption: 'Newly built 1 Bedroom apartment in Roysambu along Lumumba Drive. 5 mins walk to TRM Mall & 7 mins to USIU-Africa. Tiled floors, reliable water supply, CCTV security. Rent: KSh 18,000.',
    views: '29.1K',
    likes: '1.9K',
    duration: 'Video • 0:38',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1080&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1080&q=80'
    ],
    audioTrack: {
      title: 'Thika Road Drive Beats',
      artist: 'Kenya House Hunt Sounds'
    },
    suggestedData: {
      listingMode: 'campus',
      estate: 'Roysambu',
      county: 'Nairobi',
      address: 'Lumumba Drive near TRM Mall, Roysambu',
      priceKes: 18000,
      bedrooms: 1,
      bathrooms: 1,
      sqFt: 520,
      category: '1br',
      university: 'USIU-Africa & PAC University',
      campusBranch: 'USIU Road / Roysambu',
      distanceToGate: '600m to USIU Main Gate (7 min walk)',
      walkingMinutes: 7,
      amenities: ['Droplets', 'ShieldCheck', 'Wifi', 'Car'],
      description: '✨ Auto-synced from Facebook Marketplace. Clean, modern 1BR apartment along Lumumba Drive, Roysambu. Constant water supply, private balcony, token power meter, CCTV and easy access to TRM.',
      docRef: 'NCC/PLN/ROY-3392/2024'
    }
  },
  {
    id: 'fb-post-2',
    source: 'facebook',
    creatorName: 'Kenya Real Estate Marketplace',
    creatorHandle: 'KenyaRealEstateMarket',
    creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    title: 'Kileleshwa Garden Residence 2BR Master Ensuite',
    caption: 'Spacious 2 bedroom apartment in Kileleshwa with perimeter electric fence, high speed elevator, borehole and dedicated parking spot. Rent KSh 55,000 per month.',
    views: '21.5K',
    likes: '1.2K',
    duration: 'Photos • 3 Images',
    thumbnailUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1080&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1080&q=80'
    ],
    audioTrack: {
      title: 'Kileleshwa Morning Breeze',
      artist: 'Nairobi Ambient Sound'
    },
    suggestedData: {
      listingMode: 'general',
      estate: 'Kileleshwa',
      county: 'Nairobi',
      address: 'Gatundu Road, Kileleshwa, Nairobi',
      priceKes: 55000,
      bedrooms: 2,
      bathrooms: 2,
      sqFt: 1300,
      category: '2br',
      amenities: ['Droplets', 'Zap', 'ShieldCheck', 'ArrowUpCircle', 'Car', 'Trees'],
      description: '✨ Auto-synced from Facebook Page. Elegant 2BR master ensuite in Kileleshwa with natural lighting, large windows, wooden floors, high-speed lift, and 24/7 borehole.',
      docRef: 'NCC/PLN/KIL-5510/2024'
    }
  }
];

export const YOUTUBE_CHANNELS = [
  {
    handle: '@KenyaHomesTours',
    name: 'Kenya Homes & Apartment Tours',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    subscribers: '148K subscribers',
    videosCount: '340 videos',
    bio: 'Full 4K Video House Tours & YouTube Shorts in Nairobi, Westlands, Kilimani & Karen 🇰🇪'
  },
  {
    handle: '@CampusCribsKE',
    name: 'Campus Cribs Kenya YouTube',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=200&q=80',
    subscribers: '54.2K subscribers',
    videosCount: '190 videos',
    bio: 'Bedsitters, 1BRs and student studio walkthroughs across KU, UoN, JKUAT & Strathmore 🎓'
  },
  {
    handle: '@NairobiRealtorsTV',
    name: 'Nairobi Realtors TV',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    subscribers: '92.6K subscribers',
    videosCount: '410 videos',
    bio: 'Verified luxury real estate walkthroughs, master ensuites and executive apartments'
  }
];

export const YOUTUBE_VIDEOS: SocialVideoItem[] = [
  {
    id: 'yt-vid-1',
    source: 'youtube',
    creatorName: 'Kenya Homes & Apartment Tours',
    creatorHandle: '@KenyaHomesTours',
    creatorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    title: '4K Walkthrough: Luxury 2BR Apartment in Westlands • Swimming Pool & Balcony',
    caption: 'Full 4K Virtual Tour: Brand new 2BR master ensuite apartment along Rhapta Road, Westlands. Includes swimming pool, gym, fitted open-plan kitchen and 24/7 borehole! KSh 75,000/mo. #YouTubeShorts #WestlandsRentals #HouseHuntKE',
    views: '162.4K',
    likes: '14.8K',
    duration: 'Shorts • 0:45',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1080&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1080&q=80'
    ],
    audioTrack: {
      title: 'Westlands Skyline Lo-Fi (YouTube Audio Library)',
      artist: 'Kenya House Hunt Sounds'
    },
    suggestedData: {
      listingMode: 'general',
      estate: 'Westlands',
      county: 'Nairobi',
      address: 'Rhapta Road, Westlands, Nairobi',
      priceKes: 75000,
      bedrooms: 2,
      bathrooms: 2,
      sqFt: 1400,
      category: '2br',
      amenities: ['Droplets', 'Zap', 'ShieldCheck', 'ArrowUpCircle', 'Dumbbell', 'Wifi', 'Car'],
      description: '✨ Auto-synced from YouTube (@KenyaHomesTours). Spectacular 2BR master ensuite apartment with swimming pool access, heated showers, high-speed elevator, borehole and full backup generator.',
      docRef: 'NCC/PLN/WST-9912/2024'
    }
  },
  {
    id: 'yt-vid-2',
    source: 'youtube',
    creatorName: 'Campus Cribs Kenya YouTube',
    creatorHandle: '@CampusCribsKE',
    creatorAvatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=200&q=80',
    title: 'KU KM Gate Modern Bedsitter Video Tour • Study Desk & Free Fiber',
    caption: 'Comrades! 🎓 Here is a complete video tour of the newly built bedsitters at KM Gate Kenyatta University. Fully tiled, dedicated study desk corner, biometric gate and token electricity! KSh 9,000/mo. #KUHostels #StudentCribsKE',
    views: '210.3K',
    likes: '19.5K',
    duration: 'Shorts • 0:39',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1080&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1080&q=80'
    ],
    audioTrack: {
      title: 'Comrades Vibe Acoustic',
      artist: 'Kenyan College Lo-Fi'
    },
    suggestedData: {
      listingMode: 'campus',
      estate: 'Kahawa Sukari / KM Gate',
      county: 'Nairobi',
      address: 'KM Gate, Kahawa Wendani near Kenyatta University',
      priceKes: 9000,
      bedrooms: 1,
      bathrooms: 1,
      sqFt: 350,
      category: 'bedsitter',
      university: 'Kenyatta University (KU)',
      campusBranch: 'Main Campus (KM Gate)',
      distanceToGate: '350m to KM Gate (4 min walk)',
      walkingMinutes: 4,
      amenities: ['Droplets', 'Zap', 'ShieldCheck', 'Wifi', 'Sun'],
      description: '✨ Auto-synced from YouTube (@CampusCribsKE). Highly demanded KU student bedsitter with fiber WiFi, instant hot shower, water storage tanks, study desk nook and secure biometric gate access.',
      docRef: 'STU/CERT/KU-KM/2024-918'
    }
  },
  {
    id: 'yt-vid-3',
    source: 'youtube',
    creatorName: 'Nairobi Realtors TV',
    creatorHandle: '@NairobiRealtorsTV',
    creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    title: 'Executive 3BR Master Ensuite in Karen • Private Garden & Solar',
    caption: 'Full House Tour: Serene 3 bedroom all-ensuite townhouse in Karen with private landscaped garden, solar heating, DSQ and 24/7 guarded barrier. Rent KSh 120,000/mo. #KarenNairobi #LuxuryLivingKenya',
    views: '88.9K',
    likes: '8.4K',
    duration: 'Video • 1:15',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1080&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1080&q=80'
    ],
    audioTrack: {
      title: 'Karen Luxury Sunset Strings',
      artist: 'Nairobi Symphony Collective'
    },
    suggestedData: {
      listingMode: 'general',
      estate: 'Karen',
      county: 'Nairobi',
      address: 'Mbagathi Ridge, Karen, Nairobi',
      priceKes: 120000,
      bedrooms: 3,
      bathrooms: 3,
      sqFt: 2600,
      category: '3br',
      amenities: ['Droplets', 'Zap', 'ShieldCheck', 'Car', 'Trees', 'Wifi'],
      description: '✨ Auto-synced from YouTube (@NairobiRealtorsTV). Prestigious 3BR all-ensuite home in Karen with mature private garden, solar water heater, servants quarters and round-the-clock patrol security.',
      docRef: 'NCC/PLN/KRN-1204/2024'
    }
  }
];


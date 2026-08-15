import { RentalListing } from '../types';

export const INITIAL_RENTAL_LISTINGS: RentalListing[] = [
  {
    id: 'kenya-hunt-01',
    title: 'Emerald Heights - Luxury 2 Bedroom Master Ensuite',
    subtitle: 'Modern Open-Plan Kitchen with Nairobi Skyline Views',
    estate: 'Kilimani',
    county: 'Nairobi',
    address: 'Denis Pritt Road, near Yaya Centre, Kilimani, Nairobi',
    priceKes: 65000,
    pricePeriod: 'month',
    serviceChargeIncluded: true,
    serviceChargeKes: 5000,
    bedrooms: 2,
    bathrooms: 2,
    sqFt: 1350,
    category: '2br',
    listingMode: 'general',
    mediaType: 'video',
    videoUrl: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1080&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1080&q=80'
    ],
    audioTrack: {
      title: 'Suzanna Acoustic Lo-Fi (Nairobi Groove)',
      artist: 'Sauti Sol & Kenyan House Vibes'
    },
    landlord: {
      id: 'landlord-01',
      name: 'HassConsult Premier Rentals',
      handle: '@HassConsultKenya',
      agencyName: 'HassConsult Real Estate Ltd',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      coverImageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      isVerified: true,
      rating: 4.9,
      totalListings: 48,
      totalReviews: 124,
      licenseNumber: 'EARB/2024/0984',
      officeLocation: 'ABC Place, 3rd Floor, Waiyaki Way, Westlands & Kilimani',
      operatingHours: 'Mon - Sat: 8:00 AM - 6:00 PM',
      phone: '+254 711 892 345',
      whatsapp: '+254711892345',
      email: 'rentals@hassconsult.co.ke',
      bio: 'Licensed EARB real estate firm with 12+ years managing premium high-rise apartments in Kilimani, Kileleshwa & Lavington. All title deeds and tenancy leases 100% verified with fast deposit refund escrow.',
      responseRate: '< 5 mins',
      memberSince: 'Jan 2021',
      specialties: ['Kilimani Luxury', 'Kileleshwa Executive', 'Escrow Protected Deposit']
    },
    amenities: [
      { icon: 'Droplets', label: 'Borehole Water 24/7' },
      { icon: 'Zap', label: 'Full Standby Generator' },
      { icon: 'ShieldCheck', label: '24/7 CCTV & Manned Gate' },
      { icon: 'ArrowUpCircle', label: 'Dual High-Speed Lifts' },
      { icon: 'Car', label: 'Allocated Basement Parking' },
      { icon: 'Waves', label: 'Heated Rooftop Pool' },
      { icon: 'Dumbbell', label: 'Equipped Modern Gym' },
      { icon: 'Wifi', label: 'Safaricom & Zuku Fibre' },
      { icon: 'Sun', label: 'Solar Water Heating' }
    ],
    description: 'Breathtaking 2-bedroom executive apartment located along leafy Denis Pritt Road. Master bedroom is ensuite with Spanish bathroom tiles, walk-in closets, granite kitchen countertops, large glass balcony overlooking the Nairobi Arboretum skyline. High rental yield and calm neighborhood close to QuickMart, Yaya Centre, and French School.',
    depositTerms: '1 Month Rent (KSh 65,000) + 1 Month Refundable Deposit + KSh 3,000 Water Meter Deposit. Total Move-in: KSh 133,000.',
    waterSupply: '24/7 Constant supply from dedicated treated borehole + NCC City Council reserve tanks.',
    electricityType: 'Prepaid Token (KPLC)',
    garbageFeeKes: 500,
    parkingSpots: 2,
    petPolicy: 'Cats Only',
    availableFrom: 'Immediately / 1st of next month',
    certifiedDocuments: [
      {
        id: 'doc-01',
        name: 'Certificate of Lease / Title Deed',
        type: 'title_deed',
        issuer: 'Ministry of Lands & Physical Planning (Ardhi House)',
        referenceNumber: 'IR-29481/NBI/KILIMANI',
        issuedDate: '12 March 2020',
        status: 'certified',
        verificationBadge: 'ArdhiPay & Lands Registry QR Verified',
        summary: 'Free from any encumbrances or court injunctions. Clear 99-year leasehold ownership.'
      },
      {
        id: 'doc-02',
        name: 'County Physical Planning & Occupancy Permit',
        type: 'county_permit',
        issuer: 'Nairobi City County Government (NCC)',
        referenceNumber: 'NCC/PLN/B44-9023/2023',
        issuedDate: '18 November 2023',
        status: 'verified',
        verificationBadge: 'Nairobi County Planning Seal',
        summary: 'Certified fit for human habitation with compliant fire safety and structural drainage.'
      },
      {
        id: 'doc-03',
        name: 'NCA Structural Compliance Certificate',
        type: 'nca_certificate',
        issuer: 'National Construction Authority of Kenya',
        referenceNumber: 'NCA/CERT/RES/88340',
        issuedDate: '05 January 2024',
        status: 'certified',
        verificationBadge: 'NCA Official QR Audited',
        summary: 'Inspected and certified by structural engineers for earthquake safety and quality standards.'
      }
    ],
    stats: {
      likes: 3420,
      commentsCount: 184,
      shares: 612,
      views: 28400,
      bookmarks: 890
    },
    initialComments: [
      {
        id: 'c1',
        user: {
          name: 'Kevin Mutua',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
          isVerified: true
        },
        text: 'Is the service charge inclusive of water and gym access or extra? Asking for viewing this Saturday!',
        timestamp: '2h ago',
        likes: 42,
        replies: [
          {
            id: 'r1',
            user: {
              name: 'HassConsult Premier Rentals',
              avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
              isVerified: true
            },
            text: 'Hello Kevin! Yes, the KSh 65k rent includes service charge covering gym, pool, borehole water, security, and garbage! Viewing slots open 9am-5pm daily.',
            timestamp: '1h ago',
            likes: 19
          }
        ]
      },
      {
        id: 'c2',
        user: {
          name: 'Amina Mohamed',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80'
        },
        text: 'The kitchen finishes are top tier! Can deposit be paid in two installments?',
        timestamp: '5h ago',
        likes: 15
      },
      {
        id: 'c3',
        user: {
          name: 'Brian Kipchumba',
          avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80'
        },
        text: 'Denis Pritt is so central, no heavy morning traffic towards CBD or Upperhill. Booking viewing right away.',
        timestamp: '1d ago',
        likes: 28
      }
    ],
    nearbyLandmarks: ['Yaya Centre (4 mins)', 'Coptic Hospital (6 mins)', 'French School Nairobi', 'QuickMart Kilimani']
  },
  {
    id: 'kenya-hunt-02',
    title: 'Ruaka Skyline - Modern Spacious 1 Bedroom',
    subtitle: 'High Finish Balcony Unit with Lift & Rooftop Chill Spot',
    estate: 'Ruaka',
    county: 'Kiambu / Nairobi Metro',
    address: 'Limuru Road near Two Rivers Mall & Northern Bypass, Ruaka',
    priceKes: 26000,
    pricePeriod: 'month',
    serviceChargeIncluded: true,
    serviceChargeKes: 2000,
    bedrooms: 1,
    bathrooms: 1,
    sqFt: 680,
    category: '1br',
    listingMode: 'general',
    mediaType: 'video',
    videoUrl: 'https://media.w3.org/2010/05/video/movie_300.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1080&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1502005229762-ee1b2b8ab00f?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1080&q=80'
    ],
    audioTrack: {
      title: 'Ruaka Sunset Vibe (Gengetone Chill Instrumental)',
      artist: 'Nairobi Metro Sounds'
    },
    landlord: {
      id: 'landlord-02',
      name: 'Ruaka Prime Property Management',
      handle: '@RuakaHavenKe',
      agencyName: 'Ruaka Prime Properties',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      coverImageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      isVerified: true,
      rating: 4.8,
      totalListings: 24,
      totalReviews: 88,
      licenseNumber: 'KMB/EST/2023/1102',
      officeLocation: 'Ruaka Square, 2nd Floor, Limuru Road, Ruaka',
      operatingHours: 'Mon - Sat: 7:30 AM - 6:30 PM',
      phone: '+254 722 411 900',
      whatsapp: '+254722411900',
      email: 'info@ruakaprime.co.ke',
      bio: 'Premier provider of modern executive 1BR, 2BR and Studios in Ruaka, Rosslyn, Ndenderu and Banana corridor. 24/7 borehole maintenance guaranteed.',
      responseRate: '< 3 mins',
      memberSince: 'Mar 2022',
      specialties: ['Ruaka Studios', 'Two Rivers Corridor', 'Instant Token Setup']
    },
    amenities: [
      { icon: 'Droplets', label: 'Borehole Water + NCC' },
      { icon: 'ArrowUpCircle', label: 'Automatic Lift' },
      { icon: 'Zap', label: 'Common Area Generator' },
      { icon: 'ShieldCheck', label: 'Biometric Access & Guard' },
      { icon: 'Car', label: 'Paved Parking Lot' },
      { icon: 'Wifi', label: 'Faiba & Safaricom Ready' },
      { icon: 'Tv', label: 'DSTV & Zuku Connections' }
    ],
    description: 'Chic, sunny 1-bedroom apartment in prime Ruaka. Features tiled floors, granite worktops, fitted cooker point, large French windows bringing in natural lighting, and a serene rooftop terrace with panoramic views of Two Rivers and the green Karura forest canopy. Quick access to Northern Bypass and Westlands via Redhill Road.',
    depositTerms: '1 Month Rent (KSh 26,000) + 1 Month Deposit (KSh 26,000) + Water KSh 2,000. Total KSh 54,000.',
    waterSupply: 'Borehole with booster pumps, metered at KSh 150 per unit.',
    electricityType: 'Prepaid Token (KPLC)',
    garbageFeeKes: 400,
    parkingSpots: 1,
    petPolicy: 'Allowed',
    availableFrom: 'Available Now',
    certifiedDocuments: [
      {
        id: 'doc-04',
        name: 'Kiambu County Approved Building Plan',
        type: 'county_permit',
        issuer: 'Kiambu County Lands & Housing Dept',
        referenceNumber: 'KMB/BLD/RUA-5521/2022',
        issuedDate: '14 August 2022',
        status: 'certified',
        verificationBadge: 'Kiambu County Seal Verified',
        summary: 'Fully approved architectural and structural plans for commercial-residential block.'
      },
      {
        id: 'doc-05',
        name: 'Standard KRA Tenancy Agreement Form',
        type: 'tenancy_agreement',
        issuer: 'Ruaka Prime Properties Legal Dept',
        referenceNumber: 'TA-RPP-2024/991',
        issuedDate: '10 January 2024',
        status: 'verified',
        verificationBadge: 'Advocate Certified',
        summary: 'Clear tenant-friendly clause with 30-day notice and full deposit refund guarantee upon exit.'
      }
    ],
    stats: {
      likes: 5120,
      commentsCount: 310,
      shares: 1420,
      views: 45000,
      bookmarks: 1840
    },
    initialComments: [
      {
        id: 'c4',
        user: {
          name: 'Faith Wanjiku',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
          isVerified: true
        },
        text: 'How far is this from the matatu stage / quickmart Ruaka? Can one walk at night safely?',
        timestamp: '3h ago',
        likes: 38,
        replies: [
          {
            id: 'r2',
            user: {
              name: 'Ruaka Prime Property Management',
              avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
              isVerified: true
            },
            text: 'Just 300 meters from Quickmart Ruaka with tarmac access and active street lighting all the way!',
            timestamp: '2h ago',
            likes: 24
          }
        ]
      },
      {
        id: 'c5',
        user: {
          name: 'Dennis Ochieng',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
        },
        text: 'This is the most reasonable price for a 1BR with lift in Ruaka! Sharing to my housemate.',
        timestamp: '1d ago',
        likes: 54
      }
    ],
    nearbyLandmarks: ['Two Rivers Mall (5 mins)', 'QuickMart Ruaka (3 mins walk)', 'Rosslyn Riviera Mall', 'Northern Bypass']
  },
  {
    id: 'kenya-hunt-03',
    title: 'The Haven Westlands - 3 Bedroom All Ensuite + DSQ',
    subtitle: 'Executive Residence with Heated Pool, Sauna & Squash Court',
    estate: 'Westlands',
    county: 'Nairobi',
    address: 'Rhapta Road, Westlands, Nairobi',
    priceKes: 110000,
    pricePeriod: 'month',
    serviceChargeIncluded: true,
    serviceChargeKes: 10000,
    bedrooms: 3,
    bathrooms: 3,
    sqFt: 2200,
    category: '3br',
    listingMode: 'general',
    mediaType: 'video',
    videoUrl: 'https://raw.githubusercontent.com/mediaelement/mediaelement-files/master/big_buck_bunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1080&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1080&q=80'
    ],
    audioTrack: {
      title: 'Westlands Midnight Lounge (Afro Deep House)',
      artist: 'DJ Nairobi Nights'
    },
    landlord: {
      id: 'landlord-03',
      name: 'Pam Golding Westlands Agency',
      handle: '@PamGoldingNBI',
      agencyName: 'Pam Golding Properties Kenya',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      coverImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      isVerified: true,
      rating: 5.0,
      totalListings: 62,
      totalReviews: 210,
      licenseNumber: 'EARB/2019/0421',
      officeLocation: 'Fortis Tower, 6th Floor, Woodvale Grove, Westlands',
      operatingHours: 'Mon - Fri: 8:00 AM - 5:30 PM, Sat: 9:00 AM - 2:00 PM',
      phone: '+254 733 900 112',
      whatsapp: '+254733900112',
      email: 'westlands@pamgolding.co.ke',
      bio: 'International luxury real estate specialists managing diplomatic residences in Westlands, Riverside Drive, Lavington, and Spring Valley. UN DSS safety compliant.',
      responseRate: '< 10 mins',
      memberSince: 'Feb 2019',
      specialties: ['UN Blue Zone', 'Diplomatic 3BR & DSQ', 'Heated Pool Estates']
    },
    amenities: [
      { icon: 'Waves', label: 'Olympic Heated Pool' },
      { icon: 'Dumbbell', label: 'Equipped Gym & Steam Sauna' },
      { icon: 'Zap', label: 'Full 100% Backup Generator' },
      { icon: 'Droplets', label: 'Treated Borehole System' },
      { icon: 'ShieldCheck', label: 'Video Intercom & Electric Fence' },
      { icon: 'Car', label: '2 Designated Basement Parking' },
      { icon: 'Users', label: 'Clubhouse & Squash Court' },
      { icon: 'Trees', label: 'Landscaped Garden & DSQ' }
    ],
    description: 'Immaculate 3 bedroom master ensuite apartment with self-contained DSQ. Features wooden parquet flooring, European kitchen fittings with dishwasher provisions, expansive lounge opening to an airy terrace with views of Westlands skyline. Safe UN blue zone security certified with 24hr armed patrols.',
    depositTerms: '2 Months Deposit + 1 Month Rent. Advance lease term 1 year minimum.',
    waterSupply: 'Continuous 24/7 borehole + municipal piped system.',
    electricityType: 'Prepaid Token (KPLC)',
    garbageFeeKes: 0,
    parkingSpots: 2,
    petPolicy: 'On Approval',
    availableFrom: '1st of Next Month',
    certifiedDocuments: [
      {
        id: 'doc-06',
        name: 'Ministry of Lands Freehold / Title Deed',
        type: 'title_deed',
        issuer: 'Ministry of Lands Ardhi House',
        referenceNumber: 'LR/209/14820-WESTLANDS',
        issuedDate: '19 Oct 2018',
        status: 'certified',
        verificationBadge: 'Government Verified Seal',
        summary: 'Certified registered title deed under Kenyan Registration of Titles Act.'
      },
      {
        id: 'doc-07',
        name: 'UN Security Clearance Certificate',
        type: 'county_permit',
        issuer: 'UNDSS Security Assessment',
        referenceNumber: 'UNDSS-NBI-ZONE-A/402',
        issuedDate: '01 Feb 2024',
        status: 'certified',
        verificationBadge: 'UN Blue Zone Certified',
        summary: 'Meets highest diplomatic and expatriate residential security requirements.'
      }
    ],
    stats: {
      likes: 4890,
      commentsCount: 220,
      shares: 980,
      views: 39000,
      bookmarks: 1450
    },
    initialComments: [
      {
        id: 'c6',
        user: {
          name: 'Sarah Jenkins',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
          isVerified: true
        },
        text: 'Is the apartment UN security approved? And does the DSQ have its own separate entrance?',
        timestamp: '4h ago',
        likes: 29,
        replies: [
          {
            id: 'r3',
            user: {
              name: 'Pam Golding Westlands Agency',
              avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
              isVerified: true
            },
            text: 'Yes Sarah! 100% UN DSS security approved with reinforced panic rooms, double gate intercom, and self-contained external DSQ entrance.',
            timestamp: '3h ago',
            likes: 18
          }
        ]
      }
    ],
    nearbyLandmarks: ['Sarit Centre (6 mins)', 'Westgate Mall (8 mins)', 'GTC Mall Westlands', 'Aga Khan Hospital']
  },
  {
    id: 'kenya-hunt-04',
    title: 'Roysambu Modern Studio / Bedsitter',
    subtitle: 'Ideal for Young Techies & Students - 2 Mins to TRM Mall',
    estate: 'Roysambu',
    county: 'Nairobi',
    address: 'Near TRM Drive, Roysambu / Thika Superhighway, Nairobi',
    priceKes: 14500,
    pricePeriod: 'month',
    serviceChargeIncluded: true,
    serviceChargeKes: 1000,
    bedrooms: 0,
    bathrooms: 1,
    sqFt: 380,
    category: 'bedsitter',
    listingMode: 'campus',
    campusInfo: {
      university: 'USIU-Africa & PAC University',
      campusBranch: 'Roysambu / USIU Road',
      distanceToGate: '350m to Gate A (4 min walk)',
      walkingMinutes: 4,
      roommateMatchingAvailable: true,
      studentPerks: ['Free Safaricom 50Mbps Fibre', 'Biometric Gate Access (No Curfew)', 'Token Sub-meter per room', 'Quiet study roof terrace'],
      securityLevel: '24/7 Gate Guard + CCTV on all floors',
      suitableFor: 'USIU, PAC & KCA Students'
    },
    mediaType: 'video',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1080&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1080&q=80'
    ],
    audioTrack: {
      title: 'Thika Road Hustle Beat',
      artist: 'Nairobi Metro Wave'
    },
    landlord: {
      id: 'landlord-04',
      name: 'TRM Corridor Rentals',
      handle: '@RoysambuLiving',
      agencyName: 'TRM Apex Real Estate',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      coverImageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
      isVerified: true,
      rating: 4.7,
      totalListings: 35,
      totalReviews: 95,
      licenseNumber: 'NCC/NBI/2022/448',
      officeLocation: 'TRM Mall Office Wing, 1st Floor, Roysambu',
      operatingHours: 'Mon - Sun: 7:00 AM - 8:00 PM',
      phone: '+254 720 334 556',
      whatsapp: '+254720334556',
      email: 'care@trmrentals.ke',
      bio: 'Fast, secure rentals for tech professionals, USIU & KCA students along Thika Superhighway. Instant WiFi connection and guaranteed hot shower maintenance.',
      responseRate: '< 2 mins',
      memberSince: 'Jun 2020',
      specialties: ['Student Studios', 'Remote Work High-Speed Fibre', 'Budget 1BR']
    },
    amenities: [
      { icon: 'Wifi', label: 'High-speed Safaricom Fibre' },
      { icon: 'Droplets', label: '24/7 Clean Borehole Water' },
      { icon: 'ShieldCheck', label: 'CCTV Surveillance & Guard' },
      { icon: 'Zap', label: 'Prepaid Token Power' },
      { icon: 'Sun', label: 'Rooftop Laundry Area' }
    ],
    description: 'Neat, spacious studio unit with dedicated kitchenette shelves, tiled bathroom with instant hot shower, great ventilation, and reliable water. Perfect for remote workers, USIU/KCA students, or anyone working along Thika Road with instant access to TRM Mall & Thika Superhighway.',
    depositTerms: '1 Month Rent (KSh 14,500) + 1 Month Deposit (KSh 14,500) + KSh 1,500 water meter. Total move-in KSh 30,500.',
    waterSupply: 'Treated borehole, flat rate KSh 1,000 monthly.',
    electricityType: 'Prepaid Token (KPLC)',
    garbageFeeKes: 300,
    parkingSpots: 1,
    petPolicy: 'Not Allowed',
    availableFrom: 'Immediate',
    certifiedDocuments: [
      {
        id: 'doc-08',
        name: 'County Business & Tenancy Registration',
        type: 'county_permit',
        issuer: 'Nairobi City County Roysambu Ward',
        referenceNumber: 'NCC/ROY/TEN-2023/88',
        issuedDate: '11 Feb 2023',
        status: 'verified',
        verificationBadge: 'County Inspected',
        summary: 'Certified student & executive residential premise with verified water sanitation.'
      }
    ],
    stats: {
      likes: 6730,
      commentsCount: 480,
      shares: 2100,
      views: 62000,
      bookmarks: 2310
    },
    initialComments: [
      {
        id: 'c7',
        user: {
          name: 'Sharon Chebet',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80'
        },
        text: 'Does it have a reliable instant shower and good wifi signal for work from home?',
        timestamp: '1h ago',
        likes: 31,
        replies: [
          {
            id: 'r4',
            user: {
              name: 'TRM Corridor Rentals',
              avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
              isVerified: true
            },
            text: 'Yes Sharon! Brand new Lorenzetti instant shower with hot water guarantee + Safaricom Home Fibre router ready in the room.',
            timestamp: '45m ago',
            likes: 22
          }
        ]
      }
    ],
    nearbyLandmarks: ['TRM Mall (2 mins walk)', 'Thika Superhighway', 'USIU Africa', 'Garden City Mall']
  },
  {
    id: 'kenya-hunt-05',
    title: 'Nyali Ocean Breeze 4 BR Villa with Private Pool',
    subtitle: 'Beachfront Living in Mombasa - Fully Furnished or Unfurnished',
    estate: 'Nyali',
    county: 'Mombasa',
    address: 'Links Road, near Nyali Beach, Mombasa',
    priceKes: 180000,
    pricePeriod: 'month',
    serviceChargeIncluded: true,
    serviceChargeKes: 15000,
    bedrooms: 4,
    bathrooms: 4,
    sqFt: 3800,
    category: 'luxury',
    listingMode: 'general',
    mediaType: 'video',
    videoUrl: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1080&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1080&q=80'
    ],
    audioTrack: {
      title: 'Mombasa Coastal Sunset (Taarab Chill Mix)',
      artist: 'Coast Soul Kenya'
    },
    landlord: {
      id: 'landlord-05',
      name: 'Coastal Luxe Property Holdings',
      handle: '@NyaliLuxuryLiving',
      agencyName: 'Coast Luxe Properties Ltd',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      coverImageUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      isVerified: true,
      rating: 4.95,
      totalListings: 18,
      totalReviews: 64,
      licenseNumber: 'MSA/EARB/2018/009',
      officeLocation: 'Nyali Cinemax Complex, 2nd Floor, Mombasa',
      operatingHours: 'Mon - Sat: 8:00 AM - 6:00 PM',
      phone: '+254 712 998 001',
      whatsapp: '+254712998001',
      email: 'villas@coastluxe.co.ke',
      bio: 'Exclusive coastal villas, beachfront penthouses, and holiday rentals in Nyali, Shanzu, Diani, and Vipingo Ridge. Clean title deeds guaranteed.',
      responseRate: '< 8 mins',
      memberSince: 'Sep 2018',
      specialties: ['Beachfront Villas', 'Private Pools', 'Furnished Holiday Leases']
    },
    amenities: [
      { icon: 'Waves', label: 'Private Swimming Pool' },
      { icon: 'Trees', label: 'Lush Tropical Garden' },
      { icon: 'Sun', label: 'Solar Water + AC in All Rooms' },
      { icon: 'ShieldCheck', label: '24/7 Security Patrol & Alarm' },
      { icon: 'Car', label: 'Covered Carport (4 Cars)' },
      { icon: 'Zap', label: 'Heavy Duty Silent Generator' }
    ],
    description: 'Paradise on the Kenyan coast! Exquisite 4-bedroom ensuite standalone villa sitting on 0.5 acre manicured lawn with coconut palms, private infinity pool, large verandah catching Indian Ocean sea breeze, air conditioning in all rooms, and separate domestic quarters.',
    depositTerms: '2 Months Deposit + 1 Month Rent. Long lease preference.',
    waterSupply: 'Desalinated fresh borehole + Mombasa Water Bowser reserve (20,000L).',
    electricityType: 'Prepaid Token (KPLC)',
    garbageFeeKes: 0,
    parkingSpots: 4,
    petPolicy: 'Allowed',
    availableFrom: 'Available Now',
    certifiedDocuments: [
      {
        id: 'doc-09',
        name: 'Mombasa County Clean Title Deed',
        type: 'title_deed',
        issuer: 'Ministry of Lands Mombasa Sub-Registry',
        referenceNumber: 'CR/NYALI/SECTION-3/1109',
        issuedDate: '14 May 2017',
        status: 'certified',
        verificationBadge: 'Mombasa Lands Verified',
        summary: 'Freehold coastal residential property verified free of heritage dispute.'
      }
    ],
    stats: {
      likes: 8940,
      commentsCount: 520,
      shares: 3400,
      views: 89000,
      bookmarks: 4100
    },
    initialComments: [
      {
        id: 'c8',
        user: {
          name: 'Captain Hassan',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
          isVerified: true
        },
        text: 'Is this walking distance to Nyali Cinemax and the beach?',
        timestamp: '6h ago',
        likes: 64,
        replies: [
          {
            id: 'r5',
            user: {
              name: 'Coastal Luxe Property Holdings',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
              isVerified: true
            },
            text: 'Just 5 minutes stroll to the white sands of Nyali Beach and 4 minutes to City Mall & Cinemax!',
            timestamp: '5h ago',
            likes: 31
          }
        ]
      }
    ],
    nearbyLandmarks: ['Nyali Beach (5 mins walk)', 'City Mall Nyali', 'Nyali Golf Club', 'Mombasa CBD (15 mins via Bridge)']
  },
  {
    id: 'kenya-hunt-06',
    title: 'Karen Greenwood 3 BR Cottage with DSQ',
    subtitle: 'Serene Half-Acre Gated Compound with Fireplace & Mature Trees',
    estate: 'Karen',
    county: 'Nairobi',
    address: 'Mbagathi Ridge, Karen, Nairobi',
    priceKes: 140000,
    pricePeriod: 'month',
    serviceChargeIncluded: true,
    serviceChargeKes: 8000,
    bedrooms: 3,
    bathrooms: 3,
    sqFt: 2600,
    category: '3br',
    listingMode: 'general',
    mediaType: 'video',
    videoUrl: 'https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/classroom.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1080&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1080&q=80'
    ],
    audioTrack: {
      title: 'Karen Morning Birdsong & Acoustic Strings',
      artist: 'Acoustic Kenya'
    },
    landlord: {
      id: 'landlord-06',
      name: 'Karen Elite Estates',
      handle: '@KarenEliteKe',
      agencyName: 'Karen Elite Property Partners',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      coverImageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      isVerified: true,
      rating: 4.9,
      totalListings: 29,
      totalReviews: 76,
      licenseNumber: 'EARB/2017/0118',
      officeLocation: 'The Hub Karen, Block B, Karen Road, Nairobi',
      operatingHours: 'Mon - Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 3:00 PM',
      phone: '+254 722 888 333',
      whatsapp: '+254722888333',
      email: 'info@karenelite.co.ke',
      bio: 'Trusted family realtors specializing in Karen, Langata, Runda, and Kitisuru serene country cottages and gated family communities with private mature gardens.',
      responseRate: '< 5 mins',
      memberSince: 'Aug 2017',
      specialties: ['Karen Acreage Cottages', 'Wood Fireplaces', 'Gated Family Security']
    },
    amenities: [
      { icon: 'Trees', label: '0.5 Acre Private Garden' },
      { icon: 'Sun', label: 'Cosy Wood Burning Fireplace' },
      { icon: 'Droplets', label: 'Karen Water Company + Borehole' },
      { icon: 'ShieldCheck', label: 'Karen Police Guard & Barrier' },
      { icon: 'Zap', label: 'Automatic Solar Hybrid Power' },
      { icon: 'Car', label: 'Double Garage + Visitors Yard' }
    ],
    description: 'Charming rustic stone cottage tucked inside a tranquil Karen gated community. Features polished cedar floors, vaulted timber ceilings, stone fireplace in the living room, spacious country kitchen with pantry, master bedroom with balcony overlooking the Ngong Hills ridge, and staff quarter.',
    depositTerms: '2 Months Deposit + 1 Month Rent.',
    waterSupply: 'Pure Karen spring borehole + rainwater collection tanks (30,000L).',
    electricityType: 'Prepaid Token (KPLC)',
    garbageFeeKes: 0,
    parkingSpots: 4,
    petPolicy: 'Allowed',
    availableFrom: 'Next Month 1st',
    certifiedDocuments: [
      {
        id: 'doc-10',
        name: 'Karen Registered Title Deed',
        type: 'title_deed',
        issuer: 'Ministry of Lands Ardhi House',
        referenceNumber: 'LR/1020/KAREN-RIDGE-44',
        issuedDate: '22 July 2015',
        status: 'certified',
        verificationBadge: 'Lands Registry Clean Search',
        summary: 'Fully registered freehold parcel with no disputes or encumbrances.'
      }
    ],
    stats: {
      likes: 7210,
      commentsCount: 390,
      shares: 1650,
      views: 54000,
      bookmarks: 2900
    },
    initialComments: [
      {
        id: 'c9',
        user: {
          name: 'Dr. Naomi Muthoni',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
          isVerified: true
        },
        text: 'The fireplace and cedar wood finishes are magical! Are dogs allowed on the compound?',
        timestamp: '8h ago',
        likes: 47,
        replies: [
          {
            id: 'r6',
            user: {
              name: 'Karen Elite Estates',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
              isVerified: true
            },
            text: 'Yes Dr. Naomi! The entire 0.5 acre compound is individually fenced and pet friendly with plenty of running lawn for dogs.',
            timestamp: '7h ago',
            likes: 29
          }
        ]
      }
    ],
    nearbyLandmarks: ['The Hub Karen (7 mins)', 'Watermark Business Park', 'Karen Country Club', 'Hillcrest International School']
  },
  {
    id: 'campus-ku-01',
    title: 'KM Ridge Premier Bedsitter - 5 Min to KU Main Gate',
    subtitle: 'High-Speed Student WiFi, Hot Shower & 24/7 Borehole Water',
    estate: 'Kahawa Sukari / KM',
    county: 'Nairobi / Kiambu Border',
    address: 'KM Footbridge Road, Opposite Kenyatta University Main Campus Gate',
    priceKes: 8500,
    pricePeriod: 'month',
    serviceChargeIncluded: true,
    serviceChargeKes: 500,
    bedrooms: 0,
    bathrooms: 1,
    sqFt: 290,
    category: 'bedsitter',
    listingMode: 'campus',
    campusInfo: {
      university: 'Kenyatta University (KU)',
      campusBranch: 'KU Main Campus (KM / Sukari Gate)',
      distanceToGate: '400m to KM Footbridge (5 min walk)',
      walkingMinutes: 5,
      roommateMatchingAvailable: true,
      studentPerks: ['Free Unlimited Student 40Mbps WiFi', 'Semester Rent Installment Friendly', 'Instant Lorenzetti Hot Shower', 'Quiet Study Rooftop'],
      securityLevel: 'Biometric Access Gate + Resident Caretaker 24/7',
      suitableFor: 'KU Undergrad & Masters Students'
    },
    mediaType: 'image_carousel',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1080&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1080&q=80'
    ],
    audioTrack: {
      title: 'KU KM Campus Chill Lo-Fi',
      artist: 'Sauti Za Chuo Kenya'
    },
    landlord: {
      id: 'landlord-ku-caretaker',
      name: 'Mama Mercy & Mwangi Caretakers',
      handle: '@KUCampusRentals',
      agencyName: 'Kahawa Student Housing Trust',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      coverImageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
      isVerified: true,
      rating: 4.85,
      totalListings: 19,
      totalReviews: 82,
      licenseNumber: 'NCC/KMB/STU-2024/091',
      officeLocation: 'KM Footbridge Commercial Plaza, Ground Floor, Kahawa',
      operatingHours: 'Mon - Sun: 7:00 AM - 9:00 PM',
      phone: '+254 714 552 901',
      whatsapp: '+254714552901',
      email: 'studentcare@kuhousing.ke',
      bio: 'Trusted caretaker housing team for Kenyatta University students since 2018. Transparent water meters, student peace of mind during exams, and zero hidden charges.',
      responseRate: '< 2 mins',
      memberSince: 'Feb 2019',
      specialties: ['KU KM Student Bedsitters', 'Semester Payment Discounts', 'Zero Water Shortages']
    },
    amenities: [
      { icon: 'Wifi', label: 'Free Safaricom 40Mbps WiFi' },
      { icon: 'Droplets', label: '24/7 Treated Borehole' },
      { icon: 'ShieldCheck', label: 'Biometric Access Gate' },
      { icon: 'Zap', label: 'Prepaid Token Sub-meter' },
      { icon: 'Sun', label: 'Rooftop Study Space' }
    ],
    description: 'Bright and airy student bedsitter located along KM road, exactly 5 minutes walk from Kenyatta University Main Gate. Tiled floors, built-in study table corner, kitchen sink with upper shelves, modern bathroom with instant hot shower, and high-speed student WiFi included in rent.',
    depositTerms: '1 Month Rent (KSh 8,500) + 1 Month Deposit (KSh 8,500) + Water Deposit KSh 1,000. HELB & Semester terms accepted on agreement.',
    waterSupply: '24/7 Borehole + City council backup.',
    electricityType: 'Prepaid Token (KPLC)',
    garbageFeeKes: 200,
    parkingSpots: 0,
    petPolicy: 'Not Allowed',
    availableFrom: 'Available Now / Next Semester',
    certifiedDocuments: [
      {
        id: 'doc-ku-01',
        name: 'KU Student Accommodation Safety Seal',
        type: 'county_permit',
        issuer: 'Kiambu / Nairobi Housing Inspectorate',
        referenceNumber: 'STU/CERT/KU-KM/2024-118',
        issuedDate: '10 Jan 2024',
        status: 'certified',
        verificationBadge: 'Student Board Certified',
        summary: 'Inspected and certified compliant with student accommodation safety and fire guidelines.'
      }
    ],
    stats: {
      likes: 5410,
      commentsCount: 290,
      shares: 1120,
      views: 48000,
      bookmarks: 1980
    },
    initialComments: [
      {
        id: 'cku1',
        user: {
          name: 'Emmanuel Omondi (KU 3rd Year)',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
          isVerified: true
        },
        text: 'Lived here during 2nd year! WiFi is genuinely super fast for Zoom lectures and exams. Mama Mercy is the best caretaker.',
        timestamp: '3h ago',
        likes: 58
      }
    ],
    nearbyLandmarks: ['KU Main Gate (5 mins walk)', 'KM Matatu Stage', 'KU Referral Hospital', 'Kahawa Sukari QuickMart']
  },
  {
    id: 'campus-strath-01',
    title: 'Madaraka Scholar Suites 1BR - 3 Min Walk to Strathmore',
    subtitle: 'Executive Student Flat with Dedicated Study Deck & Backup Power',
    estate: 'Madaraka',
    county: 'Nairobi',
    address: 'Ole Sangale Link Road, Madaraka Estate, Nairobi',
    priceKes: 16500,
    pricePeriod: 'month',
    serviceChargeIncluded: true,
    serviceChargeKes: 1500,
    bedrooms: 1,
    bathrooms: 1,
    sqFt: 450,
    category: '1br',
    listingMode: 'campus',
    campusInfo: {
      university: 'Strathmore University',
      campusBranch: 'Madaraka / Ole Sangale Rd',
      distanceToGate: '250m to Strathmore Gate B (3 min walk)',
      walkingMinutes: 3,
      roommateMatchingAvailable: true,
      studentPerks: ['Free 60Mbps Fibre Internet', 'Generator Backup on Exam Nights', 'Walk to Strathmore in 3 mins', 'In-house Laundry Tokens'],
      securityLevel: '24/7 Security Patrol + CCTV & Intercom',
      suitableFor: 'Strathmore, Daystar Valley Rd & Riara Students'
    },
    mediaType: 'image_carousel',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1080&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1502005229762-ee1b2b8ab00f?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1080&q=80'
    ],
    audioTrack: {
      title: 'Madaraka Evening Acoustic Breeze',
      artist: 'Nairobi Soundscapes'
    },
    landlord: {
      id: 'landlord-madaraka-suites',
      name: 'Scholar Estates Madaraka',
      handle: '@StrathLivingKe',
      agencyName: 'Scholar Living Group',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      coverImageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      isVerified: true,
      rating: 4.9,
      totalListings: 14,
      totalReviews: 67,
      licenseNumber: 'NCC/MAD/2023/55',
      officeLocation: 'Madaraka Shopping Centre, 1st Floor, Nairobi',
      operatingHours: 'Mon - Sat: 8:00 AM - 7:00 PM',
      phone: '+254 721 884 102',
      whatsapp: '+254721884102',
      email: 'admin@scholarliving.co.ke',
      bio: 'Premium student suites crafted for Strathmore and Daystar university students. Silent environment, high-speed fibre for coding & research, and 24/7 security.',
      responseRate: '< 3 mins',
      memberSince: 'May 2021',
      specialties: ['Strathmore Walking Distance', 'Coding & Study Friendly', 'Roommate Sublets']
    },
    amenities: [
      { icon: 'Wifi', label: 'Free 60Mbps Fibre' },
      { icon: 'Zap', label: 'Generator Backup' },
      { icon: 'ShieldCheck', label: '24/7 Intercom & Manned Gate' },
      { icon: 'Droplets', label: 'Constant Hot Water & Borehole' },
      { icon: 'Users', label: 'Quiet Study Lounge' }
    ],
    description: 'Executive 1-bedroom student apartment located 250m from Strathmore University Gate B. Features partitioned bedroom for privacy, modern tiled kitchenette, high-speed internet, and backup generator so your study sessions never get interrupted.',
    depositTerms: '1 Month Rent + 1 Month Deposit. Roommate sharing (KSh 8,250 each) welcome.',
    waterSupply: 'Constant council + borehole.',
    electricityType: 'Prepaid Token (KPLC)',
    garbageFeeKes: 300,
    parkingSpots: 1,
    petPolicy: 'Not Allowed',
    availableFrom: 'Immediately',
    certifiedDocuments: [
      {
        id: 'doc-strath-01',
        name: 'Madaraka Tenancy Compliance Certificate',
        type: 'tenancy_agreement',
        issuer: 'Nairobi City County Langata Sub-County',
        referenceNumber: 'NCC/LNG/STU-2024/09',
        issuedDate: '15 Jan 2024',
        status: 'certified',
        verificationBadge: 'Verified Tenancy',
        summary: 'Fully certified multi-tenant residential premise.'
      }
    ],
    stats: {
      likes: 6290,
      commentsCount: 310,
      shares: 1450,
      views: 52000,
      bookmarks: 2400
    },
    initialComments: [
      {
        id: 'cstrath1',
        user: {
          name: 'Ashley Wambui (Strathmore BCom)',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
          isVerified: true
        },
        text: 'The 3 min walk to Strathmore gate is the biggest blessing during 7am morning CATs! Quiet place too.',
        timestamp: '5h ago',
        likes: 41
      }
    ],
    nearbyLandmarks: ['Strathmore University (3 mins walk)', 'Madaraka Shopping Centre', 'Daystar Valley Road (8 mins)', 'T-Mall Langata Rd']
  },
  {
    id: 'campus-uon-01',
    title: 'Museum Hill Student Suites - 4 Min to UoN Chiromo',
    subtitle: 'Chic Modern Studio with Wardrobe, Desk & High-Speed WiFi',
    estate: 'Museum Hill / Riverside',
    county: 'Nairobi',
    address: 'Kipande Road near Museum Hill Roundabout, Nairobi',
    priceKes: 13500,
    pricePeriod: 'month',
    serviceChargeIncluded: true,
    serviceChargeKes: 1000,
    bedrooms: 0,
    bathrooms: 1,
    sqFt: 340,
    category: 'bedsitter',
    listingMode: 'campus',
    campusInfo: {
      university: 'University of Nairobi (UoN)',
      campusBranch: 'Chiromo & Main Campus',
      distanceToGate: '500m to Chiromo Campus Gate (5 min walk)',
      walkingMinutes: 5,
      roommateMatchingAvailable: true,
      studentPerks: ['Free Safaricom 50Mbps Fibre', '24/7 Borehole Water', 'Direct Footpath to Chiromo & Main Campus', 'No Curfew'],
      securityLevel: '24/7 Security Guard + CCTV',
      suitableFor: 'UoN Chiromo, Main Campus & Parklands Law Students'
    },
    mediaType: 'image_carousel',
    thumbnailUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1080&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1080&q=80'
    ],
    audioTrack: {
      title: 'University Way Morning Hustle',
      artist: 'UoN Beats'
    },
    landlord: {
      id: 'landlord-uon-housing',
      name: 'Chiromo Hill Apartments Ltd',
      handle: '@UoNHousingKe',
      agencyName: 'Chiromo Housing Trust',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      coverImageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      isVerified: true,
      rating: 4.8,
      totalListings: 22,
      totalReviews: 94,
      licenseNumber: 'NCC/CHIR/2023/120',
      officeLocation: 'Museum Hill Plaza, Kipande Road, Nairobi',
      operatingHours: 'Mon - Sun: 7:00 AM - 8:00 PM',
      phone: '+254 718 200 441',
      whatsapp: '+254718200441',
      email: 'rentals@chiromohill.ke',
      bio: 'Providing clean, secure and quiet accommodation for University of Nairobi undergraduate and postgraduate medical, science and law students.',
      responseRate: '< 5 mins',
      memberSince: 'Nov 2020',
      specialties: ['UoN Chiromo Hostels', 'Quiet Study Building', 'Instant Token Power']
    },
    amenities: [
      { icon: 'Wifi', label: 'Free Safaricom 50Mbps Fibre' },
      { icon: 'Droplets', label: '24/7 Treated Water Supply' },
      { icon: 'ShieldCheck', label: '24/7 Security Guard + CCTV' },
      { icon: 'Sun', label: 'Instant Hot Shower' },
      { icon: 'Zap', label: 'Prepaid Token Sub-meter' }
    ],
    description: 'Charming, modern studio flat conveniently located along Kipande Road. Quick 5-minute walk to UoN Chiromo Campus and 10 minutes to Main Campus / CBD. Ceramic tiles, kitchenette with ample cupboards, clean bathroom with instant hot water, and quiet student environment.',
    depositTerms: '1 Month Rent (KSh 13,500) + 1 Month Refundable Deposit.',
    waterSupply: '24/7 Treated Borehole + Council reserve tanks.',
    electricityType: 'Prepaid Token (KPLC)',
    garbageFeeKes: 300,
    parkingSpots: 0,
    petPolicy: 'Not Allowed',
    availableFrom: 'Available Now',
    certifiedDocuments: [
      {
        id: 'doc-uon-01',
        name: 'County Health & Safety Certification',
        type: 'county_permit',
        issuer: 'Nairobi City County Public Health',
        referenceNumber: 'NCC/PH/WEST/2024-88',
        issuedDate: '20 Jan 2024',
        status: 'certified',
        verificationBadge: 'Public Health Approved',
        summary: 'Certified clean sanitation, fire safety and safe living conditions.'
      }
    ],
    stats: {
      likes: 4920,
      commentsCount: 230,
      shares: 980,
      views: 39000,
      bookmarks: 1720
    },
    initialComments: [
      {
        id: 'cuon1',
        user: {
          name: 'Dan Mutisya (UoN Chiromo Physics)',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
          isVerified: true
        },
        text: 'Walking distance to the science labs without boarding matatus is amazing. Safe compound with good lighting.',
        timestamp: '1d ago',
        likes: 33
      }
    ],
    nearbyLandmarks: ['UoN Chiromo Campus (5 mins walk)', 'Nairobi National Museum', 'UoN Main Campus (10 mins)', 'Westlands / Museum Hill Roundabout']
  },
  {
    id: 'campus-jkuat-01',
    title: 'Juja Silicon Student 1BR - Gate C Corridor',
    subtitle: 'Tech & Engineering Friendly - Unlimited WiFi & Biometric Entry',
    estate: 'Juja / Gate C',
    county: 'Kiambu',
    address: 'High Point Road, 300m from JKUAT Gate C, Juja',
    priceKes: 9200,
    pricePeriod: 'month',
    serviceChargeIncluded: true,
    serviceChargeKes: 500,
    bedrooms: 1,
    bathrooms: 1,
    sqFt: 360,
    category: '1br',
    listingMode: 'campus',
    campusInfo: {
      university: 'JKUAT Juja',
      campusBranch: 'Juja Main Campus (Gate C & High Point)',
      distanceToGate: '300m to JKUAT Gate C (4 min walk)',
      walkingMinutes: 4,
      roommateMatchingAvailable: true,
      studentPerks: ['Free 50Mbps Fibre for Tech & Coding', '24/7 Borehole Water Guaranteed', 'No Curfew Biometric Gate', 'Affordable student food stalls next door'],
      securityLevel: 'Biometric Scanner + 24/7 CCTV Surveillance',
      suitableFor: 'JKUAT Engineering, Computing & Applied Science Students'
    },
    mediaType: 'image_carousel',
    thumbnailUrl: 'https://images.unsplash.com/photo-1502005229762-ee1b2b8ab00f?auto=format&fit=crop&w=1080&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1502005229762-ee1b2b8ab00f?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1080&q=80'
    ],
    audioTrack: {
      title: 'Juja High Point Tech Beat',
      artist: 'JKUAT Creators'
    },
    landlord: {
      id: 'landlord-jkuat-care',
      name: 'Juja Apex Student Rentals',
      handle: '@JKUATLivingKe',
      agencyName: 'Juja Campus Housing',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      coverImageUrl: 'https://images.unsplash.com/photo-1502005229762-ee1b2b8ab00f?auto=format&fit=crop&w=1200&q=80',
      isVerified: true,
      rating: 4.88,
      totalListings: 18,
      totalReviews: 89,
      licenseNumber: 'KMB/JUJA/2024/31',
      officeLocation: 'Juja City Mall Annex, Ground Floor, Juja',
      operatingHours: 'Mon - Sun: 7:00 AM - 9:00 PM',
      phone: '+254 723 771 990',
      whatsapp: '+254723771990',
      email: 'help@jujarentals.ke',
      bio: 'Specialized student property manager near JKUAT Gates A, B, and C. High internet speeds for computer science assignments, hot showers, and safe compounds.',
      responseRate: '< 2 mins',
      memberSince: 'Jan 2021',
      specialties: ['JKUAT Gate C 1BRs', 'Unlimited Student Fibre', 'Roommate Sharing']
    },
    amenities: [
      { icon: 'Wifi', label: 'Free Unlimited 50Mbps Fibre' },
      { icon: 'Droplets', label: '24/7 Borehole Water' },
      { icon: 'ShieldCheck', label: 'Biometric Access Gate' },
      { icon: 'Zap', label: 'Prepaid Token Power' },
      { icon: 'Sun', label: 'Instant Hot Shower' }
    ],
    description: 'Spacious 1-bedroom flat in the vibrant Gate C student tech zone. Separate living room and bedroom, kitchen with fitted granite counter, high-speed fibre router installed, constant water pressure, and zero curfew biometric entrance.',
    depositTerms: '1 Month Rent (KSh 9,200) + 1 Month Deposit (KSh 9,200).',
    waterSupply: '24/7 Borehole on automatic pressure pump.',
    electricityType: 'Prepaid Token (KPLC)',
    garbageFeeKes: 200,
    parkingSpots: 0,
    petPolicy: 'Not Allowed',
    availableFrom: 'Immediately',
    certifiedDocuments: [
      {
        id: 'doc-jkuat-01',
        name: 'Kiambu County Juja Tenancy Permit',
        type: 'county_permit',
        issuer: 'Kiambu County Juja Sub-County',
        referenceNumber: 'KMB/JUJA/RES-2024-44',
        issuedDate: '12 Feb 2024',
        status: 'certified',
        verificationBadge: 'Verified Property',
        summary: 'Inspected for student safety standards and reliable sanitation.'
      }
    ],
    stats: {
      likes: 7120,
      commentsCount: 380,
      shares: 1890,
      views: 61000,
      bookmarks: 2800
    },
    initialComments: [
      {
        id: 'cjkuat1',
        user: {
          name: 'Kelvin Kariuki (JKUAT Software Eng)',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
          isVerified: true
        },
        text: 'The WiFi latency is 4ms to Safaricom servers, perfect for software dev and hackathons! 4 mins to Gate C.',
        timestamp: '4h ago',
        likes: 67
      }
    ],
    nearbyLandmarks: ['JKUAT Gate C (4 mins walk)', 'Juja City Mall', 'High Point Stage', 'Juja Superhighway Exit']
  },
  {
    id: 'campus-mku-01',
    title: 'Thika Arc Student Studios - 500m to MKU Main Gate',
    subtitle: 'Affordable Bedsitters & Studios for Medical & Degree Students',
    estate: 'Section 9 / Thika Town',
    county: 'Kiambu',
    address: 'Near MKU General Kago Road, Section 9, Thika',
    priceKes: 7500,
    pricePeriod: 'month',
    serviceChargeIncluded: true,
    serviceChargeKes: 500,
    bedrooms: 0,
    bathrooms: 1,
    sqFt: 280,
    category: 'bedsitter',
    listingMode: 'campus',
    campusInfo: {
      university: 'Mount Kenya University (MKU)',
      campusBranch: 'Thika Main Campus / Section 9',
      distanceToGate: '500m to MKU Main Gate (6 min walk)',
      walkingMinutes: 6,
      roommateMatchingAvailable: true,
      studentPerks: ['Free Fast Safaricom WiFi', 'Semester Friendly Rent', 'Instant Hot Water', 'Quiet Medical Study Environment'],
      securityLevel: '24/7 Security Guard + Intercom',
      suitableFor: 'MKU, Thika Medical Training College & Gretsa Students'
    },
    mediaType: 'image_carousel',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1080&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1080&q=80'
    ],
    audioTrack: {
      title: 'Thika Town Sunset Lo-Fi',
      artist: 'MKU Beats'
    },
    landlord: {
      id: 'landlord-mku-care',
      name: 'Thika Student Living Ltd',
      handle: '@MKULivingKe',
      agencyName: 'Thika Metro Student Housing',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      coverImageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
      isVerified: true,
      rating: 4.82,
      totalListings: 15,
      totalReviews: 61,
      licenseNumber: 'KMB/THK/2023/102',
      officeLocation: 'Section 9 Commercial Wing, Thika',
      operatingHours: 'Mon - Sat: 8:00 AM - 7:00 PM',
      phone: '+254 725 330 119',
      whatsapp: '+254725330119',
      email: 'thikarentals@mku.ke',
      bio: 'Dedicated affordable student accommodation in Section 9 and Thika CBD close to MKU Main Campus and Level 5 Hospital.',
      responseRate: '< 5 mins',
      memberSince: 'Mar 2021',
      specialties: ['MKU Student Bedsitters', 'Section 9 Quiet Flats', 'Medical Student Leases']
    },
    amenities: [
      { icon: 'Wifi', label: 'Free Safaricom Student WiFi' },
      { icon: 'Droplets', label: '24/7 Clean Water' },
      { icon: 'ShieldCheck', label: 'Security Guard & Manned Gate' },
      { icon: 'Zap', label: 'Token Sub-meter' },
      { icon: 'Sun', label: 'Instant Hot Shower' }
    ],
    description: 'Clean, secure studio unit located in calm Section 9, a 6-minute stroll to Mount Kenya University Main Gate and General Kago Road. Features tiled flooring, instant hot shower, study desk area, free WiFi, and security guard at the gate.',
    depositTerms: '1 Month Rent (KSh 7,500) + 1 Month Deposit.',
    waterSupply: 'Constant Thika Water & Sewerage + Borehole.',
    electricityType: 'Prepaid Token (KPLC)',
    garbageFeeKes: 200,
    parkingSpots: 0,
    petPolicy: 'Not Allowed',
    availableFrom: 'Available Now',
    certifiedDocuments: [
      {
        id: 'doc-mku-01',
        name: 'Thika Municipal Housing Compliance',
        type: 'county_permit',
        issuer: 'Kiambu County Thika Sub-County',
        referenceNumber: 'KMB/THK/STU-2024-19',
        issuedDate: '18 Jan 2024',
        status: 'certified',
        verificationBadge: 'Verified Housing',
        summary: 'Certified student residential facility.'
      }
    ],
    stats: {
      likes: 4180,
      commentsCount: 190,
      shares: 740,
      views: 32000,
      bookmarks: 1400
    },
    initialComments: [
      {
        id: 'cmku1',
        user: {
          name: 'Gladys Njeri (MKU Nursing)',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
          isVerified: true
        },
        text: 'Very calm for medical revision and no loud clubs nearby. Section 9 is safe for walking after evening lectures.',
        timestamp: '6h ago',
        likes: 29
      }
    ],
    nearbyLandmarks: ['MKU Main Gate (6 mins walk)', 'Thika Level 5 Hospital', 'Ananas Mall Thika', 'General Kago Road']
  },
  {
    id: 'campus-daystar-01',
    title: 'Valley Road Scholar Haven - 4 Mins to Daystar Nairobi',
    subtitle: 'Cozy Modern Studio near Hurlingham & Yaya with 50Mbps Fibre',
    estate: 'Valley Road / Hurlingham',
    county: 'Nairobi',
    address: 'Near Ralph Bunche Road & Valley Road, Nairobi',
    priceKes: 14000,
    pricePeriod: 'month',
    serviceChargeIncluded: true,
    serviceChargeKes: 1000,
    bedrooms: 0,
    bathrooms: 1,
    sqFt: 320,
    category: 'bedsitter',
    listingMode: 'campus',
    campusInfo: {
      university: 'Daystar University',
      campusBranch: 'Valley Road Nairobi Campus',
      distanceToGate: '350m to Daystar Main Gate (4 min walk)',
      walkingMinutes: 4,
      roommateMatchingAvailable: true,
      studentPerks: ['Free 50Mbps High-Speed Fibre', 'Quiet Christian Study Environment', 'Instant Hot Water Lorenzetti', 'Caretaker on-site'],
      securityLevel: '24/7 Security & CCTV',
      suitableFor: 'Daystar University Communication & Business Students'
    },
    mediaType: 'image_carousel',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=1080&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1080&q=80'
    ],
    audioTrack: {
      title: 'Valley Road Sunset Melody',
      artist: 'Daystar Vibes'
    },
    landlord: {
      id: 'landlord-daystar-care',
      name: 'Valley Haven Accommodations',
      handle: '@DaystarHousing',
      agencyName: 'Valley Road Student Living',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      isVerified: true,
      rating: 4.89,
      totalListings: 12,
      totalReviews: 44,
      phone: '+254 722 990 114',
      whatsapp: '+254722990114',
      bio: 'Safe, serene student flats a 4-minute walk from Daystar Valley Road Campus and Nairobi Hospital.',
      responseRate: '< 5 mins',
      memberSince: 'Oct 2021'
    },
    amenities: [
      { icon: 'Wifi', label: 'Free Safaricom 50Mbps Fibre' },
      { icon: 'Droplets', label: '24/7 Treated Water' },
      { icon: 'ShieldCheck', label: '24/7 Security Guard' },
      { icon: 'Zap', label: 'Prepaid Token Sub-meter' },
      { icon: 'Sun', label: 'Instant Hot Shower' }
    ],
    description: 'Serene, secure studio flat a brief 4-minute walk from Daystar University Valley Road. Features tiled flooring, fitted kitchenette, clean bathroom, and complimentary high-speed internet.',
    depositTerms: '1 Month Rent (KSh 14,000) + 1 Month Deposit.',
    waterSupply: 'Constant city council + treated backup borehole.',
    electricityType: 'Prepaid Token (KPLC)',
    garbageFeeKes: 300,
    parkingSpots: 1,
    petPolicy: 'Not Allowed',
    availableFrom: 'Available Now',
    certifiedDocuments: [],
    stats: { likes: 3200, commentsCount: 110, shares: 420, views: 24000, bookmarks: 910 },
    initialComments: [
      {
        id: 'cdaystar1',
        user: { name: 'Joy Wanjiku', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80', isVerified: true },
        text: 'Super convenient for evening classes at Daystar Valley Road!',
        timestamp: '3h ago',
        likes: 21
      }
    ],
    nearbyLandmarks: ['Daystar Valley Road (4 mins walk)', 'Nairobi Hospital', 'Yaya Centre', 'Hurlingham Stage']
  },
  {
    id: 'campus-cuea-01',
    title: 'Bogani Ridge Student Residence - Karen CUEA Corridor',
    subtitle: 'Modern 1BR Flat with Balcony - 5 Min Walk to CUEA Main Gate',
    estate: 'Karen / Bogani East',
    county: 'Nairobi',
    address: 'Bogani East Road near CUEA Gate, Karen, Nairobi',
    priceKes: 15500,
    pricePeriod: 'month',
    serviceChargeIncluded: true,
    serviceChargeKes: 1000,
    bedrooms: 1,
    bathrooms: 1,
    sqFt: 420,
    category: '1br',
    listingMode: 'campus',
    campusInfo: {
      university: 'Catholic University of Eastern Africa (CUEA)',
      campusBranch: 'Karen Main Campus',
      distanceToGate: '400m to CUEA Main Gate (5 min walk)',
      walkingMinutes: 5,
      roommateMatchingAvailable: true,
      studentPerks: ['Free Safaricom Fibre', 'Solar Heated Water', 'Quiet Karen Green Environment', 'Gated Perimeter with Electric Fence'],
      securityLevel: 'Electric Fence + 24/7 Guard',
      suitableFor: 'CUEA Law, Commerce & Arts Students'
    },
    mediaType: 'image_carousel',
    thumbnailUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1080&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1080&q=80'
    ],
    audioTrack: {
      title: 'Karen Breeze Acoustic',
      artist: 'CUEA Melodies'
    },
    landlord: {
      id: 'landlord-cuea-care',
      name: 'Karen Student Estates',
      handle: '@CUEAHousingKe',
      agencyName: 'Bogani Student Living Ltd',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      isVerified: true,
      rating: 4.92,
      totalListings: 14,
      totalReviews: 52,
      phone: '+254 721 889 002',
      whatsapp: '+254721889002',
      bio: 'Trusted student housing in calm, upscale Karen within easy walking distance to Catholic University.',
      responseRate: '< 2 mins',
      memberSince: 'Jul 2020'
    },
    amenities: [
      { icon: 'Wifi', label: 'Free Safaricom High-Speed Fibre' },
      { icon: 'Droplets', label: '24/7 Clean Borehole' },
      { icon: 'ShieldCheck', label: 'Electric Fence & 24/7 Guard' },
      { icon: 'Zap', label: 'Prepaid Token Power' },
      { icon: 'Sun', label: 'Solar Water Heating' }
    ],
    description: 'Spacious 1-bedroom flat located along calm Bogani East Road in Karen, just 5 minutes walk to CUEA Main Campus. Separate living area, built-in closets, granite kitchen countertops, and electric perimeter security.',
    depositTerms: '1 Month Rent (KSh 15,500) + 1 Month Deposit.',
    waterSupply: '24/7 Treated Borehole.',
    electricityType: 'Prepaid Token (KPLC)',
    garbageFeeKes: 300,
    parkingSpots: 1,
    petPolicy: 'Not Allowed',
    availableFrom: 'Available Now',
    certifiedDocuments: [],
    stats: { likes: 4500, commentsCount: 160, shares: 620, views: 36000, bookmarks: 1200 },
    initialComments: [
      {
        id: 'ccuea1',
        user: { name: 'Patrick Kibet', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80', isVerified: true },
        text: 'The compound is very green and peaceful for law exam studies.',
        timestamp: '5h ago',
        likes: 38
      }
    ],
    nearbyLandmarks: ['CUEA Main Gate (5 mins walk)', 'Galleria Mall Karen', 'Bomas of Kenya', 'Bogani East Stage']
  },
  {
    id: 'campus-tuk-01',
    title: 'Haile Selassie Student Lofts - 5 Min Walk to TUK Nairobi',
    subtitle: 'Modern Secure Studios for Engineering & Tech Students',
    estate: 'CBD / Ngara / Haile Selassie',
    county: 'Nairobi',
    address: 'Near Haile Selassie Avenue & Workshop Road, CBD Nairobi',
    priceKes: 11000,
    pricePeriod: 'month',
    serviceChargeIncluded: true,
    serviceChargeKes: 500,
    bedrooms: 0,
    bathrooms: 1,
    sqFt: 290,
    category: 'bedsitter',
    listingMode: 'campus',
    campusInfo: {
      university: 'Technical University of Kenya (TUK)',
      campusBranch: 'Main Campus Haile Selassie',
      distanceToGate: '350m to TUK Main Gate (4 min walk)',
      walkingMinutes: 4,
      roommateMatchingAvailable: true,
      studentPerks: ['Free 40Mbps WiFi', 'Biometric Entry (No Curfew)', 'Instant Hot Shower', 'Walk to CBD and Railways'],
      securityLevel: 'Biometric Access + CCTV Surveillance',
      suitableFor: 'TUK Engineering, Technology & Applied Science Students'
    },
    mediaType: 'image_carousel',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1080&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1080&q=80'
    ],
    audioTrack: {
      title: 'CBD Metro Pulse',
      artist: 'TUK Sound'
    },
    landlord: {
      id: 'landlord-tuk-care',
      name: 'Metro City Student Living',
      handle: '@TUKHousingKe',
      agencyName: 'Central Student Hostels',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
      isVerified: true,
      rating: 4.84,
      totalListings: 20,
      totalReviews: 76,
      phone: '+254 715 440 221',
      whatsapp: '+254715440221',
      bio: 'CBD and Ngara student housing management near Technical University of Kenya with biometric security.',
      responseRate: '< 2 mins',
      memberSince: 'Jan 2021'
    },
    amenities: [
      { icon: 'Wifi', label: 'Free Safaricom 40Mbps WiFi' },
      { icon: 'Droplets', label: '24/7 Borehole Supply' },
      { icon: 'ShieldCheck', label: 'Biometric Gate Access' },
      { icon: 'Zap', label: 'Prepaid Token Power' },
      { icon: 'Sun', label: 'Instant Hot Water' }
    ],
    description: 'Clean, newly tiled student studio with built-in desk area, kitchen counter, instant hot shower, and biometric security 4 minutes walk from Technical University of Kenya main entrance.',
    depositTerms: '1 Month Rent (KSh 11,000) + 1 Month Deposit.',
    waterSupply: 'Treated borehole with automated pressure pump.',
    electricityType: 'Prepaid Token (KPLC)',
    garbageFeeKes: 200,
    parkingSpots: 0,
    petPolicy: 'Not Allowed',
    availableFrom: 'Available Now',
    certifiedDocuments: [],
    stats: { likes: 3890, commentsCount: 140, shares: 510, views: 29000, bookmarks: 1100 },
    initialComments: [
      {
        id: 'ctuk1',
        user: { name: 'Dennis Mwiti', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', isVerified: true },
        text: 'Save so much money not taking matatus to class every day. 4 mins to the workshop.',
        timestamp: '1d ago',
        likes: 42
      }
    ],
    nearbyLandmarks: ['TUK Main Gate (4 mins walk)', 'Haile Selassie Ave', 'Railways Station', 'Nairobi CBD']
  },
  {
    id: 'campus-kca-01',
    title: 'Ruaraka Horizon Student Suites - 3 Mins to KCA University',
    subtitle: 'Affordable Bedsitters & 1BRs along Thika Road Corridor',
    estate: 'Ruaraka / Allsops',
    county: 'Nairobi',
    address: 'Near Allsops & Outering Link, Ruaraka, Nairobi',
    priceKes: 8900,
    pricePeriod: 'month',
    serviceChargeIncluded: true,
    serviceChargeKes: 500,
    bedrooms: 0,
    bathrooms: 1,
    sqFt: 280,
    category: 'bedsitter',
    listingMode: 'campus',
    campusInfo: {
      university: 'KCA University',
      campusBranch: 'Ruaraka Main Campus',
      distanceToGate: '300m to KCA Main Gate (3 min walk)',
      walkingMinutes: 3,
      roommateMatchingAvailable: true,
      studentPerks: ['Free 50Mbps Fibre for Online Classes', 'Borehole Water 24/7', 'Instant Hot Shower', 'Direct Superhighway Footbridge'],
      securityLevel: '24/7 Guard + CCTV Surveillance',
      suitableFor: 'KCA Business, IT & Accountancy Students'
    },
    mediaType: 'image_carousel',
    thumbnailUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1080&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1080&q=80'
    ],
    audioTrack: {
      title: 'Ruaraka Groove',
      artist: 'KCA Beats'
    },
    landlord: {
      id: 'landlord-kca-care',
      name: 'Ruaraka Campus Caretakers',
      handle: '@KCAHousingKe',
      agencyName: 'Horizon Student Properties',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isVerified: true,
      rating: 4.86,
      totalListings: 16,
      totalReviews: 60,
      phone: '+254 719 332 109',
      whatsapp: '+254719332109',
      bio: 'Trusted student bedsitters and 1-bedrooms within a 3-minute stroll to KCA University Ruaraka campus.',
      responseRate: '< 2 mins',
      memberSince: 'Mar 2021'
    },
    amenities: [
      { icon: 'Wifi', label: 'Free Safaricom 50Mbps Fibre' },
      { icon: 'Droplets', label: '24/7 Clean Water' },
      { icon: 'ShieldCheck', label: '24/7 Security Guard & CCTV' },
      { icon: 'Zap', label: 'Prepaid Token Sub-meter' },
      { icon: 'Sun', label: 'Instant Hot Shower' }
    ],
    description: 'Bright and tidy student bedsitter located 300 meters from KCA University Ruaraka Main Gate. Comes with tiled floor, modern kitchenette sink, instant hot shower, and super-fast fibre router.',
    depositTerms: '1 Month Rent (KSh 8,900) + 1 Month Deposit.',
    waterSupply: '24/7 Constant borehole water.',
    electricityType: 'Prepaid Token (KPLC)',
    garbageFeeKes: 200,
    parkingSpots: 0,
    petPolicy: 'Not Allowed',
    availableFrom: 'Available Now',
    certifiedDocuments: [],
    stats: { likes: 4120, commentsCount: 155, shares: 590, views: 31000, bookmarks: 1350 },
    initialComments: [
      {
        id: 'ckca1',
        user: { name: 'Stacy Atieno', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80', isVerified: true },
        text: '3 minutes walk to KCA and no noise from the superhighway.',
        timestamp: '4h ago',
        likes: 27
      }
    ],
    nearbyLandmarks: ['KCA University (3 mins walk)', 'Allsops Stage', 'Garden City Mall (5 mins)', 'Thika Superhighway']
  },
  {
    id: 'campus-moi-01',
    title: 'Kesses Heights Student Suites - Moi University Main Campus',
    subtitle: 'Affordable Bedsitters with WiFi & Borehole at Cheboiywo Gate',
    estate: 'Kesses / Cheboiywo',
    county: 'Uasin Gishu (Eldoret)',
    address: 'Near Cheboiywo Gate, Moi University Main Campus, Kesses, Eldoret',
    priceKes: 5500,
    pricePeriod: 'month',
    serviceChargeIncluded: true,
    serviceChargeKes: 300,
    bedrooms: 0,
    bathrooms: 1,
    sqFt: 260,
    category: 'bedsitter',
    listingMode: 'campus',
    campusInfo: {
      university: 'Moi University',
      campusBranch: 'Kesses Main Campus',
      distanceToGate: '350m to Cheboiywo Gate (4 min walk)',
      walkingMinutes: 4,
      roommateMatchingAvailable: true,
      studentPerks: ['Free Student WiFi', 'Semester Payment Friendly', 'Solar Hot Shower', 'Quiet Revision Environment'],
      securityLevel: '24/7 Manned Gate & Perimeter Wall',
      suitableFor: 'Moi University Undergrad & Postgrad Students'
    },
    mediaType: 'image_carousel',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1080&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1080&q=80'
    ],
    audioTrack: {
      title: 'Eldoret Highlands Chill',
      artist: 'Moi Uni Acoustic'
    },
    landlord: {
      id: 'landlord-moi-care',
      name: 'Kesses Student Housing Trust',
      handle: '@MoiLivingKe',
      agencyName: 'Eldoret Campus Properties',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      isVerified: true,
      rating: 4.88,
      totalListings: 24,
      totalReviews: 88,
      phone: '+254 727 665 099',
      whatsapp: '+254727665099',
      bio: 'Dedicated affordable student accommodation near Moi University Main Campus Kesses and Annex Law School in Eldoret.',
      responseRate: '< 5 mins',
      memberSince: 'Sep 2019'
    },
    amenities: [
      { icon: 'Wifi', label: 'Free Student WiFi' },
      { icon: 'Droplets', label: '24/7 Borehole' },
      { icon: 'ShieldCheck', label: 'Perimeter Wall & Security Guard' },
      { icon: 'Zap', label: 'Token Sub-meter' },
      { icon: 'Sun', label: 'Instant Hot Shower' }
    ],
    description: 'Clean and highly affordable student bedsitter located 4 minutes walk from Moi University Main Campus Cheboiywo Gate. Semester payment plans accepted upon agreement.',
    depositTerms: '1 Month Rent (KSh 5,500) + 1 Month Deposit.',
    waterSupply: '24/7 Treated clean borehole.',
    electricityType: 'Prepaid Token (KPLC)',
    garbageFeeKes: 150,
    parkingSpots: 0,
    petPolicy: 'Not Allowed',
    availableFrom: 'Available Now',
    certifiedDocuments: [],
    stats: { likes: 5200, commentsCount: 210, shares: 810, views: 42000, bookmarks: 1800 },
    initialComments: [
      {
        id: 'cmoi1',
        user: { name: 'Victor Koech', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80', isVerified: true },
        text: 'Best student hostel in Kesses! Quiet compound and reliable hot shower.',
        timestamp: '6h ago',
        likes: 35
      }
    ],
    nearbyLandmarks: ['Moi Uni Cheboiywo Gate (4 mins walk)', 'Kesses Shopping Centre', 'Moi Uni Main Library']
  },
  {
    id: 'campus-mmu-01',
    title: 'Rongai Tech Lofts - 5 Min Walk to Multimedia University (MMU)',
    subtitle: 'Spacious Studio with 50Mbps Fibre & High-Speed Lifts near Maasai Mall',
    estate: 'Ongata Rongai / Magadi Road',
    county: 'Kajiado / Nairobi Border',
    address: 'Magadi Road near Maasai Mall & MMU Gate, Rongai',
    priceKes: 9500,
    pricePeriod: 'month',
    serviceChargeIncluded: true,
    serviceChargeKes: 500,
    bedrooms: 0,
    bathrooms: 1,
    sqFt: 310,
    category: 'bedsitter',
    listingMode: 'campus',
    campusInfo: {
      university: 'Multimedia University of Kenya (MMU)',
      campusBranch: 'Main Campus Magadi Road',
      distanceToGate: '450m to MMU Main Gate (5 min walk)',
      walkingMinutes: 5,
      roommateMatchingAvailable: true,
      studentPerks: ['Free 50Mbps Safaricom Fibre', '24/7 Borehole Water', 'Direct Footpath to MMU Gate', 'No Curfew Biometric Gate'],
      securityLevel: 'Biometric Gate + CCTV Surveillance',
      suitableFor: 'MMU Tech, Media, Film & Engineering Students'
    },
    mediaType: 'image_carousel',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1080&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1080&q=80'
    ],
    audioTrack: {
      title: 'Magadi Road Tech Groove',
      artist: 'MMU Wave'
    },
    landlord: {
      id: 'landlord-mmu-care',
      name: 'Rongai Student Residences',
      handle: '@MMUHousingKe',
      agencyName: 'Magadi Student Living',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      isVerified: true,
      rating: 4.87,
      totalListings: 18,
      totalReviews: 70,
      phone: '+254 728 554 321',
      whatsapp: '+254728554321',
      bio: 'High-speed student studios for media, tech, and engineering students near Multimedia University of Kenya.',
      responseRate: '< 2 mins',
      memberSince: 'Feb 2021'
    },
    amenities: [
      { icon: 'Wifi', label: 'Free Safaricom 50Mbps Fibre' },
      { icon: 'Droplets', label: '24/7 Borehole Water' },
      { icon: 'ShieldCheck', label: 'Biometric Scanner Gate' },
      { icon: 'Zap', label: 'Prepaid Token Power' },
      { icon: 'Sun', label: 'Instant Hot Shower' }
    ],
    description: 'Modern student studio featuring high-speed WiFi, instant hot shower, tiled floors, kitchen shelf, and zero curfew biometric entrance just 5 minutes walk to Multimedia University.',
    depositTerms: '1 Month Rent (KSh 9,500) + 1 Month Deposit.',
    waterSupply: '24/7 Constant borehole water.',
    electricityType: 'Prepaid Token (KPLC)',
    garbageFeeKes: 200,
    parkingSpots: 0,
    petPolicy: 'Not Allowed',
    availableFrom: 'Available Now',
    certifiedDocuments: [],
    stats: { likes: 4700, commentsCount: 180, shares: 690, views: 37000, bookmarks: 1500 },
    initialComments: [
      {
        id: 'cmmu1',
        user: { name: 'Collins Ochieng (MMU Film & Media)', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80', isVerified: true },
        text: 'Fast WiFi uploads for 4K video editing assignments and 5 mins to class!',
        timestamp: '3h ago',
        likes: 49
      }
    ],
    nearbyLandmarks: ['MMU Main Gate (5 mins walk)', 'Maasai Mall Rongai', 'Nairobi National Park View', 'Magadi Road']
  },
  {
    id: 'campus-tum-01',
    title: 'Tudor Creek Marine Student Suites - 4 Mins to TUM Main Gate',
    subtitle: 'Breezy Studio with Free 50Mbps Fibre & 24/7 Water near Tom Mboya Ave',
    estate: 'Tudor / Tom Mboya Ave',
    county: 'Mombasa',
    address: 'Near Tom Mboya Avenue & Tudor Creek, Mombasa Island',
    priceKes: 7800,
    pricePeriod: 'month',
    serviceChargeIncluded: true,
    serviceChargeKes: 500,
    bedrooms: 0,
    bathrooms: 1,
    sqFt: 290,
    category: 'bedsitter',
    listingMode: 'campus',
    campusInfo: {
      university: 'Technical University of Mombasa (TUM)',
      campusBranch: 'Tudor Main Campus',
      distanceToGate: '300m to TUM Main Gate (4 min walk)',
      walkingMinutes: 4,
      roommateMatchingAvailable: true,
      studentPerks: ['Free 50Mbps WiFi for Coding & Engineering', 'Constant Fresh Water (Borehole + Desalinated)', 'Ocean Breeze Natural Cooling', 'Biometric Gate (No Curfew)'],
      securityLevel: 'Biometric Access + 24/7 Guard',
      suitableFor: 'TUM Engineering, Maritime, Applied Science & Business Students'
    },
    mediaType: 'image_carousel',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1080&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1080&q=80'
    ],
    audioTrack: {
      title: 'Mombasa Coastal Wave',
      artist: 'TUM Beats'
    },
    landlord: {
      id: 'landlord-tum-care',
      name: 'Tudor Coast Student Hostels',
      handle: '@TUMHousingKe',
      agencyName: 'Mombasa Marine Student Living',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      isVerified: true,
      rating: 4.88,
      totalListings: 14,
      totalReviews: 55,
      phone: '+254 722 770 190',
      whatsapp: '+254722770190',
      bio: 'Clean, secure student apartments in Tudor within a 4-minute walk to Technical University of Mombasa.',
      responseRate: '< 2 mins',
      memberSince: 'May 2021'
    },
    amenities: [
      { icon: 'Wifi', label: 'Free Safaricom 50Mbps WiFi' },
      { icon: 'Droplets', label: '24/7 Treated Fresh Water' },
      { icon: 'ShieldCheck', label: 'Biometric Manned Gate' },
      { icon: 'Zap', label: 'Token Sub-meter' },
      { icon: 'Sun', label: 'Instant Hot Shower' }
    ],
    description: 'Clean coastal student studio located in calm Tudor along Tom Mboya Avenue, just 4 minutes walk from TUM main gate. Tiled floor, ceiling fan, kitchenette with counter, and zero curfew access.',
    depositTerms: '1 Month Rent (KSh 7,800) + 1 Month Deposit.',
    waterSupply: '24/7 Treated fresh borehole water with storage reservoir.',
    electricityType: 'Prepaid Token (KPLC)',
    garbageFeeKes: 200,
    parkingSpots: 0,
    petPolicy: 'Not Allowed',
    availableFrom: 'Available Now',
    certifiedDocuments: [],
    stats: { likes: 4300, commentsCount: 165, shares: 620, views: 33000, bookmarks: 1290 },
    initialComments: [
      {
        id: 'ctum1',
        user: { name: 'Ali Mohamed (TUM Maritime)', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80', isVerified: true },
        text: 'Best water supply in Tudor and 4 mins to the engineering labs.',
        timestamp: '4h ago',
        likes: 31
      }
    ],
    nearbyLandmarks: ['TUM Main Gate (4 mins walk)', 'Tudor Creek', 'Tom Mboya Ave', 'Buxton Stage']
  },
  {
    id: 'campus-maseno-01',
    title: 'Equator Vista Scholar Suites - 3 Mins to Maseno Siriba Gate',
    subtitle: 'Bright Modern Studio with High-Speed Fibre & Borehole Water',
    estate: 'Siriba / Maseno Town',
    county: 'Kisumu',
    address: 'Near Siriba Campus Main Gate & Equator Line, Maseno, Kisumu',
    priceKes: 5200,
    pricePeriod: 'month',
    serviceChargeIncluded: true,
    serviceChargeKes: 300,
    bedrooms: 0,
    bathrooms: 1,
    sqFt: 280,
    category: 'bedsitter',
    listingMode: 'campus',
    campusInfo: {
      university: 'Maseno University',
      campusBranch: 'Siriba Main Campus',
      distanceToGate: '250m to Siriba Gate (3 min walk)',
      walkingMinutes: 3,
      roommateMatchingAvailable: true,
      studentPerks: ['Free High-Speed Fibre for Exams & E-Learning', 'Reliable Borehole Water 24/7', 'Semester Payment Terms Accepted', 'Serene Revision Compound'],
      securityLevel: '24/7 Guard & Perimeter Fence',
      suitableFor: 'Maseno University IT, Education, Medicine & Arts Students'
    },
    mediaType: 'image_carousel',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1080&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1080&q=80'
    ],
    audioTrack: {
      title: 'Maseno Equator Breeze',
      artist: 'Siriba Acoustic'
    },
    landlord: {
      id: 'landlord-maseno-care',
      name: 'Maseno Student Housing Agency',
      handle: '@MasenoHousingKe',
      agencyName: 'Siriba Student Residences',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      isVerified: true,
      rating: 4.89,
      totalListings: 22,
      totalReviews: 80,
      phone: '+254 721 445 660',
      whatsapp: '+254721445660',
      bio: 'Trusted student hostelling agency along Siriba and College Campus at Maseno University.',
      responseRate: '< 2 mins',
      memberSince: 'Jul 2020'
    },
    amenities: [
      { icon: 'Wifi', label: 'Free Safaricom Student WiFi' },
      { icon: 'Droplets', label: '24/7 Borehole Water' },
      { icon: 'ShieldCheck', label: 'Perimeter Wall & Security Guard' },
      { icon: 'Zap', label: 'Token Sub-meter' },
      { icon: 'Sun', label: 'Instant Hot Shower' }
    ],
    description: 'Neat and peaceful bedsitter located 3 minutes stroll from Maseno University Siriba Campus Gate. Ceramic tiles, private kitchenette, study reading desk, and high-speed Wi-Fi.',
    depositTerms: '1 Month Rent (KSh 5,200) + 1 Month Deposit.',
    waterSupply: '24/7 Clean borehole water.',
    electricityType: 'Prepaid Token (KPLC)',
    garbageFeeKes: 150,
    parkingSpots: 0,
    petPolicy: 'Not Allowed',
    availableFrom: 'Available Now',
    certifiedDocuments: [],
    stats: { likes: 4900, commentsCount: 195, shares: 730, views: 39000, bookmarks: 1600 },
    initialComments: [
      {
        id: 'cmas1',
        user: { name: 'Brian Omondi (Maseno IT)', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80', isVerified: true },
        text: 'WiFi is super fast for coding assignments and it is 3 mins to Siriba hall.',
        timestamp: '5h ago',
        likes: 38
      }
    ],
    nearbyLandmarks: ['Maseno Siriba Gate (3 mins walk)', 'Equator Line Monument', 'Maseno Town Centre', 'Kisumu-Busia Highway']
  },
  {
    id: 'campus-mmust-01',
    title: 'Kefinco Scholar Lofts - 4 Mins to MMUST Kakamega Main Gate',
    subtitle: 'Modern Tiled Bedsitter with Free WiFi, Water & Manned Gate',
    estate: 'Kefinco / Lurambi',
    county: 'Kakamega',
    address: 'Near Kefinco Hub & Webuye Highway, Kakamega Town',
    priceKes: 5800,
    pricePeriod: 'month',
    serviceChargeIncluded: true,
    serviceChargeKes: 300,
    bedrooms: 0,
    bathrooms: 1,
    sqFt: 290,
    category: 'bedsitter',
    listingMode: 'campus',
    campusInfo: {
      university: 'Masinde Muliro University of Science and Technology (MMUST)',
      campusBranch: 'Main Campus Kakamega',
      distanceToGate: '350m to MMUST Main Gate (4 min walk)',
      walkingMinutes: 4,
      roommateMatchingAvailable: true,
      studentPerks: ['Free 50Mbps Fibre', '24/7 Borehole Water', 'Quiet Revision Atmosphere', 'Security Guard on Duty'],
      securityLevel: '24/7 Guard + Perimeter Wall',
      suitableFor: 'MMUST Engineering, Nursing, Science & Education Students'
    },
    mediaType: 'image_carousel',
    thumbnailUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1080&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1080&q=80'
    ],
    audioTrack: {
      title: 'Kakamega Forest Echoes',
      artist: 'MMUST Wave'
    },
    landlord: {
      id: 'landlord-mmust-care',
      name: 'Kefinco Student Residences',
      handle: '@MMUSTLivingKe',
      agencyName: 'Kakamega Campus Properties',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
      isVerified: true,
      rating: 4.86,
      totalListings: 19,
      totalReviews: 64,
      phone: '+254 718 990 231',
      whatsapp: '+254718990231',
      bio: 'Affordable, secure student bedsitters and 1-bedrooms in Kefinco and Sichirai close to MMUST.',
      responseRate: '< 2 mins',
      memberSince: 'Aug 2021'
    },
    amenities: [
      { icon: 'Wifi', label: 'Free Safaricom 50Mbps Fibre' },
      { icon: 'Droplets', label: '24/7 Constant Water' },
      { icon: 'ShieldCheck', label: '24/7 Security Guard' },
      { icon: 'Zap', label: 'Prepaid Token Sub-meter' },
      { icon: 'Sun', label: 'Instant Hot Water Lorenzetti' }
    ],
    description: 'Clean and spacious student bedsitter located in vibrant Kefinco, 4 minutes walk to MMUST main campus entrance. Built-in cupboards, study table space, tiled floors, and perimeter security.',
    depositTerms: '1 Month Rent (KSh 5,800) + 1 Month Deposit.',
    waterSupply: '24/7 Clean borehole + overhead tanks.',
    electricityType: 'Prepaid Token (KPLC)',
    garbageFeeKes: 150,
    parkingSpots: 0,
    petPolicy: 'Not Allowed',
    availableFrom: 'Available Now',
    certifiedDocuments: [],
    stats: { likes: 4600, commentsCount: 175, shares: 680, views: 36000, bookmarks: 1450 },
    initialComments: [
      {
        id: 'cmmu2',
        user: { name: 'Faith Nafula (MMUST Nursing)', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80', isVerified: true },
        text: 'Very safe for walking back from late evening clinical labs.',
        timestamp: '4h ago',
        likes: 34
      }
    ],
    nearbyLandmarks: ['MMUST Main Gate (4 mins walk)', 'Kefinco Centre', 'Lurambi Junction', 'Kakamega Town']
  },
  {
    id: 'campus-dekut-01',
    title: 'Kimathi Tech Highlands Studio - 5 Mins to DeKUT Nyeri Gate',
    subtitle: 'Modern Studio with Fibre & Instant Hot Shower along Nyeri-Mweiga Road',
    estate: 'Kimathi / Skuta',
    county: 'Nyeri',
    address: 'Nyeri-Mweiga Road near DeKUT Main Gate, Nyeri',
    priceKes: 6200,
    pricePeriod: 'month',
    serviceChargeIncluded: true,
    serviceChargeKes: 300,
    bedrooms: 0,
    bathrooms: 1,
    sqFt: 300,
    category: 'bedsitter',
    listingMode: 'campus',
    campusInfo: {
      university: 'Dedan Kimathi University of Technology (DeKUT)',
      campusBranch: 'Main Campus Nyeri',
      distanceToGate: '400m to DeKUT Main Gate (5 min walk)',
      walkingMinutes: 5,
      roommateMatchingAvailable: true,
      studentPerks: ['Free High-Speed Fibre for Software & Engineering', 'Instant Hot Water', 'Mountain View Study Environment', 'Caretaker On-site'],
      securityLevel: '24/7 Security & CCTV',
      suitableFor: 'DeKUT Engineering, Computer Science, Actuarial & Nursing Students'
    },
    mediaType: 'image_carousel',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1080&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1080&q=80'
    ],
    audioTrack: {
      title: 'Mt Kenya Highland Chill',
      artist: 'DeKUT Beats'
    },
    landlord: {
      id: 'landlord-dekut-care',
      name: 'Nyeri Kimathi Student Living',
      handle: '@DeKUTHousingKe',
      agencyName: 'Highland Student Properties',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isVerified: true,
      rating: 4.9,
      totalListings: 16,
      totalReviews: 58,
      phone: '+254 723 881 900',
      whatsapp: '+254723881900',
      bio: 'Trusted student bedsitters and 1-bedrooms along Nyeri-Mweiga road near Dedan Kimathi University.',
      responseRate: '< 2 mins',
      memberSince: 'Nov 2020'
    },
    amenities: [
      { icon: 'Wifi', label: 'Free Safaricom 50Mbps Fibre' },
      { icon: 'Droplets', label: '24/7 Fresh Water' },
      { icon: 'ShieldCheck', label: '24/7 Guard & CCTV' },
      { icon: 'Zap', label: 'Token Sub-meter' },
      { icon: 'Sun', label: 'Instant Hot Shower' }
    ],
    description: 'Tidy, secure bedsitter located 5 minutes walk from Dedan Kimathi University of Technology. Fitted kitchenette, hot shower for cold Nyeri mornings, study workspace, and reliable WiFi.',
    depositTerms: '1 Month Rent (KSh 6,200) + 1 Month Deposit.',
    waterSupply: '24/7 Nyeri Water & Sewerage (NYEWASCO) + backup tanks.',
    electricityType: 'Prepaid Token (KPLC)',
    garbageFeeKes: 200,
    parkingSpots: 0,
    petPolicy: 'Not Allowed',
    availableFrom: 'Available Now',
    certifiedDocuments: [],
    stats: { likes: 4400, commentsCount: 150, shares: 590, views: 34000, bookmarks: 1380 },
    initialComments: [
      {
        id: 'cdek1',
        user: { name: 'Kevin Mwangi (DeKUT Mechatronics)', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', isVerified: true },
        text: 'The hot shower is powerful (crucial for Nyeri mornings) and internet is stable.',
        timestamp: '6h ago',
        likes: 36
      }
    ],
    nearbyLandmarks: ['DeKUT Main Gate (5 mins walk)', 'Science & Technology Park', 'Nyeri-Mweiga Road', 'Skuta Shopping Area']
  },
  {
    id: 'campus-chuka-01',
    title: 'Ndagani Scholar Suites - 3 Mins to Chuka University Main Gate',
    subtitle: 'Affordable Modern Studio with Free WiFi & Solar Shower at Gate B',
    estate: 'Ndagani / Chuka',
    county: 'Tharaka Nithi',
    address: 'Ndagani Student Village near Gate B, Chuka',
    priceKes: 4800,
    pricePeriod: 'month',
    serviceChargeIncluded: true,
    serviceChargeKes: 200,
    bedrooms: 0,
    bathrooms: 1,
    sqFt: 270,
    category: 'bedsitter',
    listingMode: 'campus',
    campusInfo: {
      university: 'Chuka University',
      campusBranch: 'Main Campus Ndagani',
      distanceToGate: '200m to Gate B (3 min walk)',
      walkingMinutes: 3,
      roommateMatchingAvailable: true,
      studentPerks: ['Free Fast Student WiFi', 'Semester Rent Friendly', 'Solar Hot Shower', 'Quiet Study Area'],
      securityLevel: '24/7 Guard + Manned Gate',
      suitableFor: 'Chuka University Science, Arts, Agriculture & Commerce Students'
    },
    mediaType: 'image_carousel',
    thumbnailUrl: 'https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?auto=format&fit=crop&w=1080&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1080&q=80'
    ],
    audioTrack: {
      title: 'Ndagani Sunset Melody',
      artist: 'Chuka Sound'
    },
    landlord: {
      id: 'landlord-chuka-care',
      name: 'Ndagani Student Hostels Trust',
      handle: '@ChukaHousingKe',
      agencyName: 'Chuka Campus Living Ltd',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      isVerified: true,
      rating: 4.88,
      totalListings: 25,
      totalReviews: 92,
      phone: '+254 724 551 092',
      whatsapp: '+254724551092',
      bio: 'Trusted student accommodations in Ndagani village within 3 minutes walk to Chuka University Gate B.',
      responseRate: '< 2 mins',
      memberSince: 'Sep 2019'
    },
    amenities: [
      { icon: 'Wifi', label: 'Free Safaricom Student WiFi' },
      { icon: 'Droplets', label: '24/7 Treated Water' },
      { icon: 'ShieldCheck', label: 'Perimeter Wall & Security Guard' },
      { icon: 'Zap', label: 'Prepaid Token Sub-meter' },
      { icon: 'Sun', label: 'Solar Hot Shower' }
    ],
    description: 'Neat and affordable student bedsitter in Ndagani, only 3 minutes walk to Chuka University Gate B. Features tiled flooring, instant hot water, kitchenette sink, and fast student internet.',
    depositTerms: '1 Month Rent (KSh 4,800) + 1 Month Deposit.',
    waterSupply: '24/7 Constant gravity-fed treated water + storage tanks.',
    electricityType: 'Prepaid Token (KPLC)',
    garbageFeeKes: 100,
    parkingSpots: 0,
    petPolicy: 'Not Allowed',
    availableFrom: 'Available Now',
    certifiedDocuments: [],
    stats: { likes: 5100, commentsCount: 205, shares: 780, views: 41000, bookmarks: 1720 },
    initialComments: [
      {
        id: 'cchu1',
        user: { name: 'Eunice Kendi (Chuka Arts)', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80', isVerified: true },
        text: 'Ndagani Gate B is super convenient and the caretaker is very kind with student maintenance.',
        timestamp: '3h ago',
        likes: 41
      }
    ],
    nearbyLandmarks: ['Chuka Uni Gate B (3 mins walk)', 'Ndagani Student Centre', 'Chuka Town (5 mins matatu)']
  },
  {
    id: 'campus-zetech-01',
    title: 'Technology Park Student Suites - 4 Mins to Zetech Ruiru Campus',
    subtitle: 'Modern Bedsitters with High-Speed Fibre & Borehole Water near Thika Road',
    estate: 'Ruiru / Technology Park',
    county: 'Kiambu',
    address: 'Near Zetech Main Campus & Toll Station, Ruiru',
    priceKes: 6500,
    pricePeriod: 'month',
    serviceChargeIncluded: true,
    serviceChargeKes: 300,
    bedrooms: 0,
    bathrooms: 1,
    sqFt: 280,
    category: 'bedsitter',
    listingMode: 'campus',
    campusInfo: {
      university: 'Zetech University',
      campusBranch: 'Technology Park Main Campus Ruiru',
      distanceToGate: '350m to Zetech Main Gate (4 min walk)',
      walkingMinutes: 4,
      roommateMatchingAvailable: true,
      studentPerks: ['Free 50Mbps Fibre for Tech Students', '24/7 Borehole Water', 'Biometric Entry', 'Footbridge to Superhighway'],
      securityLevel: 'Biometric Access + 24/7 Guard',
      suitableFor: 'Zetech University IT, Media, Engineering & Hospitality Students'
    },
    mediaType: 'image_carousel',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1080&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1080&q=80'
    ],
    audioTrack: {
      title: 'Ruiru Tech Wave',
      artist: 'Zetech Sound'
    },
    landlord: {
      id: 'landlord-zetech-care',
      name: 'Ruiru Tech Student Living',
      handle: '@ZetechHousingKe',
      agencyName: 'Zetech Campus Hostels',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      isVerified: true,
      rating: 4.87,
      totalListings: 18,
      totalReviews: 68,
      phone: '+254 729 441 200',
      whatsapp: '+254729441200',
      bio: 'Modern student accommodations located right next to Zetech University Technology Park Campus in Ruiru.',
      responseRate: '< 2 mins',
      memberSince: 'Feb 2021'
    },
    amenities: [
      { icon: 'Wifi', label: 'Free Safaricom 50Mbps Fibre' },
      { icon: 'Droplets', label: '24/7 Constant Water' },
      { icon: 'ShieldCheck', label: 'Biometric Scanner Gate' },
      { icon: 'Zap', label: 'Token Sub-meter' },
      { icon: 'Sun', label: 'Instant Hot Shower' }
    ],
    description: 'Bright and tidy student bedsitter situated 4 minutes walk from Zetech Technology Park Campus in Ruiru. High-speed fibre, instant hot shower, and biometric access.',
    depositTerms: '1 Month Rent (KSh 6,500) + 1 Month Deposit.',
    waterSupply: '24/7 Borehole with water filtration system.',
    electricityType: 'Prepaid Token (KPLC)',
    garbageFeeKes: 200,
    parkingSpots: 0,
    petPolicy: 'Not Allowed',
    availableFrom: 'Available Now',
    certifiedDocuments: [],
    stats: { likes: 4200, commentsCount: 145, shares: 540, views: 31000, bookmarks: 1250 },
    initialComments: [
      {
        id: 'czet1',
        user: { name: 'Samuel Kimani (Zetech IT)', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80', isVerified: true },
        text: 'Fibre is fast and it takes literally 4 minutes to walk to the computer labs.',
        timestamp: '5h ago',
        likes: 29
      }
    ],
    nearbyLandmarks: ['Zetech Main Gate (4 mins walk)', 'Toll Station Ruiru', 'Thika Superhighway', 'Ruiru Town']
  }
];



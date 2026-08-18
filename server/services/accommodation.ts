/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BillingPeriod,
  GenderPreference,
  InquiryStatus,
  ListingStatus,
  PromotionTier,
  Property,
  PropertyComparisonItem,
  PropertyInquiry,
  PropertyReport,
  PropertyReview,
  PropertySearchParams,
  PropertyType,
  PropertyUnit,
  PropertyVerificationDocument,
  ReportReason,
  ReportStatus,
  ReviewStatus,
  RoomType,
  SavedProperty,
  UserRole,
  VerificationStatus,
} from '../../src/types/index.js';
import { adminService } from './admin.js';
import { currencyService } from './currency.js';
import { pesapalService } from './pesapal.js';

/**
 * Calculates Haversine distance in kilometers between two lat/long points
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-riverside-heights',
    ownerId: 'usr-landlord-ke-1',
    ownerName: 'Riverside Student Housing Ltd',
    ownerEmail: 'landlord.riverside@gmail.com',
    ownerPhone: '+254712345678',
    ownerWhatsApp: '+254712345678',
    ownerRole: UserRole.PROPERTY_OWNER,
    title: 'Riverside Heights Student Residences',
    description: 'Modern, fully-furnished student studio apartments located just 400 meters from Chiromo Science Campus. Features ultra-fast fiber Wi-Fi, 24/7 biometric security, CCTV, silent backup generator, study lounge, and solar water heating.',
    propertyType: PropertyType.STUDENT_RESIDENCE,
    roomType: RoomType.STUDIO,
    country: 'KE',
    city: 'Nairobi',
    address: 'Riverside Drive, Westlands',
    postalCode: '00100',
    isApproximateLocation: false,
    latitude: -1.2685,
    longitude: 36.8042,
    institutionIds: ['inst-uon-ke'],
    campusIds: ['camp-uon-chiromo', 'camp-uon-main'],
    primaryInstitutionName: 'University of Nairobi',
    primaryCampusName: 'Chiromo Science Campus',
    distanceFromCampusKm: 0.4,
    currency: 'USD',
    price: 180,
    pricePerMonth: 180,
    billingPeriod: BillingPeriod.PER_MONTH,
    deposit: 180,
    availabilityStatus: 'AVAILABLE_NOW',
    totalUnits: 24,
    occupiedUnits: 19,
    availableUnits: 5,
    units: [
      {
        id: 'unit-rh-101',
        propertyId: 'prop-riverside-heights',
        building: 'Block A',
        floor: '1st Floor',
        unitNumber: 'A-101',
        roomType: RoomType.STUDIO,
        totalBeds: 1,
        occupiedBeds: 0,
        availableBeds: 1,
        isAvailable: true,
      },
      {
        id: 'unit-rh-204',
        propertyId: 'prop-riverside-heights',
        building: 'Block A',
        floor: '2nd Floor',
        unitNumber: 'A-204',
        roomType: RoomType.STUDIO,
        totalBeds: 1,
        occupiedBeds: 0,
        availableBeds: 1,
        isAvailable: true,
      },
    ],
    amenities: [
      'High Speed Wi-Fi',
      '24/7 Security & CCTV',
      'Solar Water Heating',
      'Backup Generator',
      'Study Lounge',
      'Laundry Facilities',
      'Biometric Access',
      'Borehole Water Backup',
    ],
    accessibilityFeatures: ['Ground Floor Access', 'Ramp Access'],
    genderPreference: GenderPreference.ANY,
    isFurnished: true,
    utilitiesIncluded: true,
    rules: [
      'Quiet study hours after 10:00 PM',
      'No smoking on premises',
      'Visitors allowed until 9:00 PM',
    ],
    photos: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80',
    ],
    verificationStatus: VerificationStatus.VERIFIED,
    verificationBadge: true,
    listingStatus: ListingStatus.PUBLISHED,
    promotionTier: PromotionTier.FEATURED,
    contactPreferences: {
      enermindMessages: true,
      email: true,
      phone: true,
      whatsapp: true,
      whatsappGroupUrl: 'https://chat.whatsapp.com/sample-riverside-residents',
    },
    savedCount: 42,
    viewsCount: 680,
    inquiriesCount: 14,
    rating: 4.8,
    reviewsCount: 12,
    publishedAt: new Date('2025-01-10').toISOString(),
    expiresAt: new Date('2026-12-31').toISOString(),
    createdAt: new Date('2025-01-10').toISOString(),
    updatedAt: new Date('2025-01-10').toISOString(),
  },
  {
    id: 'prop-oxford-stgiles',
    ownerId: 'usr-landlord-uk-1',
    ownerName: 'Oxford Living Spaces Management',
    ownerEmail: 'contact@oxfordlivingspaces.co.uk',
    ownerPhone: '+441865123456',
    ownerWhatsApp: '+441865123456',
    ownerRole: UserRole.PROPERTY_MANAGER,
    title: 'St. Giles Student En-Suite Rooms',
    description: 'Quiet, premium ensuite student accommodation located in the historic center of Oxford. Walking distance to Oxford colleges, libraries, and science area. Includes high-speed broadband, private en-suite bathroom, weekly cleaning of communal areas, and secure bike shed.',
    propertyType: PropertyType.STUDENT_RESIDENCE,
    roomType: RoomType.ENSUITE_ROOM,
    country: 'GB',
    city: 'Oxford',
    address: 'St Giles, Oxford OX1 3LU',
    postalCode: 'OX1 3LU',
    isApproximateLocation: false,
    latitude: 51.7588,
    longitude: -1.2601,
    institutionIds: ['inst-oxford-gb'],
    campusIds: ['camp-oxford-main'],
    primaryInstitutionName: 'University of Oxford',
    primaryCampusName: 'Collegiate Campus',
    distanceFromCampusKm: 0.6,
    currency: 'GBP',
    price: 850,
    pricePerMonth: 850,
    billingPeriod: BillingPeriod.PER_MONTH,
    deposit: 850,
    availabilityStatus: 'AVAILABLE_NOW',
    totalUnits: 12,
    occupiedUnits: 10,
    availableUnits: 2,
    units: [
      {
        id: 'unit-ox-2b',
        propertyId: 'prop-oxford-stgiles',
        building: 'Main Hall',
        floor: '2nd Floor',
        unitNumber: '2B',
        roomType: RoomType.ENSUITE_ROOM,
        totalBeds: 1,
        occupiedBeds: 0,
        availableBeds: 1,
        isAvailable: true,
      },
    ],
    amenities: [
      'Private En-Suite Bathroom',
      'High Speed Broadband',
      'Bike Storage',
      'Weekly Communal Cleaning',
      'Quiet Study Rooms',
      'Central Heating',
      'CCTV Security',
    ],
    accessibilityFeatures: ['Ground Floor Rooms Available'],
    genderPreference: GenderPreference.ANY,
    isFurnished: true,
    utilitiesIncluded: true,
    rules: [
      'Strict quiet hours for academic study',
      'No sub-letting',
      'Non-smoking property',
    ],
    photos: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80',
    ],
    verificationStatus: VerificationStatus.VERIFIED,
    verificationBadge: true,
    listingStatus: ListingStatus.PUBLISHED,
    promotionTier: PromotionTier.PROMOTED,
    contactPreferences: {
      enermindMessages: true,
      email: true,
      phone: true,
      whatsapp: false,
    },
    savedCount: 56,
    viewsCount: 890,
    inquiriesCount: 19,
    rating: 4.9,
    reviewsCount: 8,
    publishedAt: new Date('2025-01-12').toISOString(),
    expiresAt: new Date('2026-12-31').toISOString(),
    createdAt: new Date('2025-01-12').toISOString(),
    updatedAt: new Date('2025-01-12').toISOString(),
  },
  {
    id: 'prop-harvard-cambridge-loft',
    ownerId: 'usr-landlord-us-1',
    ownerName: 'Cambridge Student Properties LLC',
    ownerEmail: 'leasing@cambridgestudentproperties.com',
    ownerPhone: '+16175550192',
    ownerRole: UserRole.PROPERTY_OWNER,
    title: 'Harvard Square Cozy 1-Bedroom Studio',
    description: 'Charming, sunny studio steps away from Harvard Yard and SEAS engineering campus. Complete with kitchenette, hardwood floors, high-speed Wi-Fi, heating included, and on-site laundry.',
    propertyType: PropertyType.APARTMENT,
    roomType: RoomType.ONE_BEDROOM,
    country: 'US',
    city: 'Cambridge',
    address: 'Massachusetts Ave, Cambridge, MA',
    postalCode: '02138',
    isApproximateLocation: false,
    latitude: 42.3736,
    longitude: -71.1189,
    institutionIds: ['inst-harvard-us'],
    campusIds: ['camp-harvard-cambridge'],
    primaryInstitutionName: 'Harvard University',
    primaryCampusName: 'Cambridge Main Campus',
    distanceFromCampusKm: 0.3,
    currency: 'USD',
    price: 1950,
    pricePerMonth: 1950,
    billingPeriod: BillingPeriod.PER_MONTH,
    deposit: 1950,
    availabilityStatus: 'AVAILABLE_NOW',
    totalUnits: 6,
    occupiedUnits: 5,
    availableUnits: 1,
    amenities: [
      'Ultra High Speed Wi-Fi',
      'Heat & Hot Water Included',
      'Hardwood Floors',
      'On-site Laundry',
      'Keyless Smart Lock',
      'Package Delivery Locker',
    ],
    accessibilityFeatures: ['Elevator Building', 'Wide Doorways'],
    genderPreference: GenderPreference.ANY,
    isFurnished: true,
    utilitiesIncluded: true,
    rules: [
      'No pets without prior approval',
      'No smoking',
    ],
    photos: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80',
    ],
    verificationStatus: VerificationStatus.VERIFIED,
    verificationBadge: true,
    listingStatus: ListingStatus.PUBLISHED,
    promotionTier: PromotionTier.FEATURED,
    contactPreferences: {
      enermindMessages: true,
      email: true,
      phone: true,
      whatsapp: false,
    },
    savedCount: 38,
    viewsCount: 520,
    inquiriesCount: 9,
    rating: 4.7,
    reviewsCount: 5,
    publishedAt: new Date('2025-01-15').toISOString(),
    expiresAt: new Date('2026-12-31').toISOString(),
    createdAt: new Date('2025-01-15').toISOString(),
    updatedAt: new Date('2025-01-15').toISOString(),
  },
  {
    id: 'prop-utoronto-bloor-hostel',
    ownerId: 'usr-landlord-ca-1',
    ownerName: 'Toronto Student Co-op Living',
    ownerEmail: 'admin@torontocoop.ca',
    ownerPhone: '+14165558392',
    ownerRole: UserRole.PROPERTY_MANAGER,
    title: 'Bloor West Student Residence & Pods',
    description: 'Affordable, modern student hostel pods and private rooms next to University of Toronto St. George campus. All utilities, breakfast lounge, co-working study pods, and superfast Wi-Fi included.',
    propertyType: PropertyType.HOSTEL,
    roomType: RoomType.SHARED_ROOM,
    country: 'CA',
    city: 'Toronto',
    address: 'Bloor St W, Toronto, ON M5S 1X8',
    postalCode: 'M5S 1X8',
    isApproximateLocation: false,
    latitude: 43.6669,
    longitude: -79.3995,
    institutionIds: ['inst-utoronto-ca'],
    campusIds: ['camp-utoronto-stgeorge'],
    primaryInstitutionName: 'University of Toronto',
    primaryCampusName: 'St. George (Downtown)',
    distanceFromCampusKm: 0.5,
    currency: 'CAD',
    price: 650,
    pricePerMonth: 650,
    billingPeriod: BillingPeriod.PER_MONTH,
    deposit: 300,
    availabilityStatus: 'AVAILABLE_NOW',
    totalUnits: 30,
    occupiedUnits: 26,
    availableUnits: 4,
    amenities: [
      'Gigabit Fiber Wi-Fi',
      'Free Breakfast Bar',
      'Shared Chef Kitchen',
      'Co-working Study Pods',
      '24/7 Concierge & Security',
      'Game Room & Gym',
    ],
    accessibilityFeatures: ['Elevator', 'Wheelchair Accessible Bathrooms'],
    genderPreference: GenderPreference.CO_ED,
    isFurnished: true,
    utilitiesIncluded: true,
    rules: [
      'Quiet study hours in common areas',
      'Respectful community guidelines',
    ],
    photos: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&auto=format&fit=crop&q=80',
    ],
    verificationStatus: VerificationStatus.VERIFIED,
    verificationBadge: true,
    listingStatus: ListingStatus.PUBLISHED,
    promotionTier: PromotionTier.NORMAL,
    contactPreferences: {
      enermindMessages: true,
      email: true,
      phone: true,
      whatsapp: false,
    },
    savedCount: 29,
    viewsCount: 430,
    inquiriesCount: 11,
    rating: 4.6,
    reviewsCount: 7,
    publishedAt: new Date('2025-01-18').toISOString(),
    expiresAt: new Date('2026-12-31').toISOString(),
    createdAt: new Date('2025-01-18').toISOString(),
    updatedAt: new Date('2025-01-18').toISOString(),
  },
  {
    id: 'prop-uct-rondebosch-pension',
    ownerId: 'usr-landlord-za-1',
    ownerName: 'Table Mountain Student Lodges',
    ownerEmail: 'info@uctlodges.co.za',
    ownerPhone: '+27215551234',
    ownerRole: UserRole.PROPERTY_OWNER,
    title: 'Rondebosch Upper Campus Student House',
    description: 'Spacious student rooms with mountain views, 5 minutes walk from UCT Jammie Shuttle stop. Equipped with uncapped fiber, solar power backup during load shedding, swimming pool, and study desks.',
    propertyType: PropertyType.HOUSE,
    roomType: RoomType.SINGLE_ROOM,
    country: 'ZA',
    city: 'Cape Town',
    address: 'Main Road, Rondebosch',
    postalCode: '7700',
    isApproximateLocation: false,
    latitude: -33.9575,
    longitude: 18.4682,
    institutionIds: ['inst-uct-za'],
    campusIds: ['camp-uct-rondebosch'],
    primaryInstitutionName: 'University of Cape Town',
    primaryCampusName: 'Upper Campus Rondebosch',
    distanceFromCampusKm: 0.8,
    currency: 'ZAR',
    price: 5200,
    pricePerMonth: 5200,
    billingPeriod: BillingPeriod.PER_MONTH,
    deposit: 5200,
    availabilityStatus: 'AVAILABLE_NOW',
    totalUnits: 8,
    occupiedUnits: 6,
    availableUnits: 2,
    amenities: [
      'Uncapped Wi-Fi',
      'Solar & Inverter Backup (No Load Shedding)',
      'Garden & Braai Area',
      'Weekly Housekeeper',
      'Electric Fencing & Armed Response',
    ],
    accessibilityFeatures: ['Ground Floor Available'],
    genderPreference: GenderPreference.ANY,
    isFurnished: true,
    utilitiesIncluded: true,
    rules: [
      'Strict security gate locking',
      'Recycling encouraged',
    ],
    photos: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80',
    ],
    verificationStatus: VerificationStatus.VERIFIED,
    verificationBadge: true,
    listingStatus: ListingStatus.PUBLISHED,
    promotionTier: PromotionTier.NORMAL,
    contactPreferences: {
      enermindMessages: true,
      email: true,
      phone: true,
      whatsapp: true,
    },
    savedCount: 22,
    viewsCount: 310,
    inquiriesCount: 6,
    rating: 4.8,
    reviewsCount: 4,
    publishedAt: new Date('2025-01-20').toISOString(),
    expiresAt: new Date('2026-12-31').toISOString(),
    createdAt: new Date('2025-01-20').toISOString(),
    updatedAt: new Date('2025-01-20').toISOString(),
  },
];

export class AccommodationService {
  private properties: Map<string, Property> = new Map();
  private inquiries: Map<string, PropertyInquiry> = new Map();
  private savedProperties: Map<string, SavedProperty> = new Map();
  private reviews: Map<string, PropertyReview> = new Map();
  private reports: Map<string, PropertyReport> = new Map();
  private privateVerificationDocuments: Map<string, PropertyVerificationDocument[]> = new Map();

  constructor() {
    INITIAL_PROPERTIES.forEach((prop) => {
      this.properties.set(prop.id, prop);
    });

    // Seed initial reviews
    const r1: PropertyReview = {
      id: 'rev-rh-1',
      propertyId: 'prop-riverside-heights',
      userId: 'usr-student-rev-1',
      userName: 'Kevin Mwangi',
      userRole: 'UoN 3rd Year CS',
      rating: 5,
      comment: 'Super convenient location to Chiromo campus, quiet for late-night coding sessions, and Wi-Fi speed is rock solid!',
      status: ReviewStatus.APPROVED,
      createdAt: new Date('2025-01-25').toISOString(),
    };
    this.reviews.set(r1.id, r1);

    const r2: PropertyReview = {
      id: 'rev-ox-1',
      propertyId: 'prop-oxford-stgiles',
      userId: 'usr-student-rev-2',
      userName: 'Eleanor Vance',
      userRole: 'Oxford Postgraduate',
      rating: 5,
      comment: 'Clean, warm, and excellent study environment right in the heart of Oxford. Management is responsive.',
      status: ReviewStatus.APPROVED,
      createdAt: new Date('2025-02-01').toISOString(),
    };
    this.reviews.set(r2.id, r2);
  }

  getProperties(): Property[] {
    return Array.from(this.properties.values());
  }

  /**
   * Search accommodation with advanced filters, currency conversion, and explainable sorting
   */
  searchProperties(params: PropertySearchParams, targetCurrency: string = 'USD'): {
    properties: Array<Property & { convertedPriceDisplay: string; originalPriceDisplay: string; distanceDisplay: string }>;
    total: number;
    page: number;
    totalPages: number;
  } {
    let list = Array.from(this.properties.values());

    // Only return published or non-archived properties in public search
    list = list.filter((p) => p.listingStatus === ListingStatus.PUBLISHED);

    // Text search
    if (params.q && params.q.trim()) {
      const q = params.q.toLowerCase().trim();
      list = list.filter((p) => {
        const titleMatch = p.title.toLowerCase().includes(q);
        const descMatch = p.description.toLowerCase().includes(q);
        const cityMatch = p.city.toLowerCase().includes(q);
        const addressMatch = p.address.toLowerCase().includes(q);
        const instMatch = p.primaryInstitutionName?.toLowerCase().includes(q);
        const campusMatch = p.primaryCampusName?.toLowerCase().includes(q);
        const amenityMatch = p.amenities.some((a) => a.toLowerCase().includes(q));
        return titleMatch || descMatch || cityMatch || addressMatch || instMatch || campusMatch || amenityMatch;
      });
    }

    // Country filter
    if (params.countryCode && params.countryCode !== 'ALL') {
      list = list.filter((p) => p.country.toUpperCase() === params.countryCode!.toUpperCase());
    }

    // Institution filter
    if (params.institutionId && params.institutionId !== 'ALL') {
      list = list.filter((p) => p.institutionIds.includes(params.institutionId!));
    }

    // Campus filter
    if (params.campusId && params.campusId !== 'ALL') {
      list = list.filter((p) => p.campusIds.includes(params.campusId!));
    }

    // Property type filter
    if (params.propertyType && params.propertyType !== 'ALL') {
      list = list.filter((p) => p.propertyType === params.propertyType);
    }

    // Room type filter
    if (params.roomType && params.roomType !== 'ALL') {
      list = list.filter((p) => p.roomType === params.roomType);
    }

    // Gender preference
    if (params.genderPreference && params.genderPreference !== 'ALL') {
      list = list.filter(
        (p) => p.genderPreference === GenderPreference.ANY || p.genderPreference === params.genderPreference
      );
    }

    // Furnished
    if (params.isFurnished !== undefined) {
      list = list.filter((p) => p.isFurnished === params.isFurnished);
    }

    // Utilities included
    if (params.utilitiesIncluded !== undefined) {
      list = list.filter((p) => p.utilitiesIncluded === params.utilitiesIncluded);
    }

    // Verified only
    if (params.isVerifiedOnly) {
      list = list.filter((p) => p.verificationBadge && p.verificationStatus === VerificationStatus.VERIFIED);
    }

    // Available beds only
    if (params.availabilityOnly) {
      list = list.filter((p) => p.availableUnits > 0 && p.availabilityStatus === 'AVAILABLE_NOW');
    }

    // Max distance
    if (params.maxDistanceKm !== undefined && params.maxDistanceKm > 0) {
      list = list.filter(
        (p) => p.distanceFromCampusKm !== null && p.distanceFromCampusKm !== undefined && p.distanceFromCampusKm <= params.maxDistanceKm!
      );
    }

    // Amenities match
    if (params.amenities && params.amenities.length > 0) {
      list = list.filter((p) =>
        params.amenities!.every((reqAmenity) =>
          p.amenities.some((a) => a.toLowerCase().includes(reqAmenity.toLowerCase()))
        )
      );
    }

    // Price range filters (converted to USD baseline for normalized comparison)
    if (params.minPrice !== undefined || params.maxPrice !== undefined) {
      list = list.filter((p) => {
        const priceUSD = p.currency === 'USD' ? p.price : currencyService.convert(p.price, p.currency, 'USD').targetAmount;
        if (params.minPrice !== undefined && priceUSD < params.minPrice) return false;
        if (params.maxPrice !== undefined && priceUSD > params.maxPrice) return false;
        return true;
      });
    }

    // Sorting
    const sortBy = params.sortBy || 'RECOMMENDED';
    list.sort((a, b) => {
      // Promoted listings get a slight priority in RECOMMENDED
      if (sortBy === 'RECOMMENDED') {
        const tierScore = { PROMOTED: 3, FEATURED: 2, NORMAL: 1 };
        const tierDiff = (tierScore[b.promotionTier] || 1) - (tierScore[a.promotionTier] || 1);
        if (tierDiff !== 0) return tierDiff;
        // Verified first
        if (a.verificationBadge !== b.verificationBadge) {
          return a.verificationBadge ? -1 : 1;
        }
        // Rating
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === 'CLOSEST') {
        const distA = a.distanceFromCampusKm ?? 9999;
        const distB = b.distanceFromCampusKm ?? 9999;
        return distA - distB;
      }
      if (sortBy === 'PRICE_LOW_HIGH') {
        const priceA = a.currency === targetCurrency ? a.price : currencyService.convert(a.price, a.currency, targetCurrency).targetAmount;
        const priceB = b.currency === targetCurrency ? b.price : currencyService.convert(b.price, b.currency, targetCurrency).targetAmount;
        return priceA - priceB;
      }
      if (sortBy === 'PRICE_HIGH_LOW') {
        const priceA = a.currency === targetCurrency ? a.price : currencyService.convert(a.price, a.currency, targetCurrency).targetAmount;
        const priceB = b.currency === targetCurrency ? b.price : currencyService.convert(b.price, b.currency, targetCurrency).targetAmount;
        return priceB - priceA;
      }
      if (sortBy === 'NEWEST') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'RATING') {
        return (b.rating || 0) - (a.rating || 0);
      }
      return 0;
    });

    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 20);
    const total = list.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = list.slice((page - 1) * limit, page * limit);

    // Format display prices and distances
    const enriched = paginated.map((p) => {
      const converted =
        p.currency === targetCurrency
          ? { targetAmount: p.price, formatted: `${targetCurrency} ${p.price.toLocaleString()}` }
          : { targetAmount: currencyService.convert(p.price, p.currency, targetCurrency).targetAmount, formatted: currencyService.format(currencyService.convert(p.price, p.currency, targetCurrency).targetAmount, targetCurrency) };

      const originalPriceDisplay = `${p.currency} ${p.price.toLocaleString()}`;
      const convertedPriceDisplay = converted.formatted;

      const distanceDisplay =
        p.distanceFromCampusKm !== null && p.distanceFromCampusKm !== undefined
          ? `${p.distanceFromCampusKm < 1 ? `${Math.round(p.distanceFromCampusKm * 1000)}m` : `${p.distanceFromCampusKm} km`} from ${p.primaryCampusName || 'Campus'}`
          : 'Distance unavailable';

      return {
        ...p,
        convertedPriceDisplay,
        originalPriceDisplay,
        distanceDisplay,
      };
    });

    return {
      properties: enriched,
      total,
      page,
      totalPages,
    };
  }

  /**
   * Get single property by ID (Hides private verification docs from students/public)
   */
  getPropertyById(id: string, viewerUserId?: string, isStaffOrAdmin: boolean = false): Property | null {
    const prop = this.properties.get(id);
    if (!prop) return null;

    // Increment view count
    prop.viewsCount = (prop.viewsCount || 0) + 1;

    // If viewer is owner or admin, attach private documents
    const isOwner = viewerUserId && prop.ownerId === viewerUserId;
    if (isOwner || isStaffOrAdmin) {
      const docs = this.privateVerificationDocuments.get(id) || [];
      return {
        ...prop,
        verificationDocuments: docs,
      };
    }

    // Otherwise return clean public model without sensitive verification documents
    const { verificationDocuments, ...cleanProp } = prop;
    return cleanProp as Property;
  }

  /**
   * Duplicate Listing Detector:
   * Checks ownerId, title similarity, address similarity, and proximity (<100m)
   */
  detectDuplicates(candidate: Partial<Property>): {
    hasPotentialDuplicate: boolean;
    duplicateMatches: Array<{ propertyId: string; title: string; score: number; reason: string }>;
  } {
    const matches: Array<{ propertyId: string; title: string; score: number; reason: string }> = [];

    for (const existing of this.properties.values()) {
      // Exclude same id
      if (candidate.id && existing.id === candidate.id) continue;

      let score = 0;
      const reasons: string[] = [];

      // Same Owner
      if (candidate.ownerId && existing.ownerId === candidate.ownerId) {
        score += 0.3;
        reasons.push('Same owner account');
      }

      // Title similarity
      if (candidate.title && existing.title) {
        const normCand = candidate.title.toLowerCase().replace(/[^a-z0-9]/g, '');
        const normExist = existing.title.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (normCand === normExist || normExist.includes(normCand) || normCand.includes(normExist)) {
          score += 0.4;
          reasons.push('Matching or highly similar property title');
        }
      }

      // Address match
      if (candidate.address && existing.address) {
        const normAddrCand = candidate.address.toLowerCase().trim();
        const normAddrExist = existing.address.toLowerCase().trim();
        if (normAddrCand === normAddrExist) {
          score += 0.3;
          reasons.push('Identical street address');
        }
      }

      // Geographic proximity (< 100 meters)
      if (
        candidate.latitude &&
        candidate.longitude &&
        existing.latitude &&
        existing.longitude
      ) {
        const dist = calculateDistanceKm(
          candidate.latitude,
          candidate.longitude,
          existing.latitude,
          existing.longitude
        );
        if (dist < 0.1) {
          score += 0.35;
          reasons.push(`Geographic proximity within ${Math.round(dist * 1000)} meters`);
        }
      }

      if (score >= 0.6) {
        matches.push({
          propertyId: existing.id,
          title: existing.title,
          score: Number(score.toFixed(2)),
          reason: reasons.join('; '),
        });
      }
    }

    return {
      hasPotentialDuplicate: matches.length > 0,
      duplicateMatches: matches,
    };
  }

  /**
   * Create a new Property Listing (Wizard submission)
   */
  createProperty(data: {
    ownerId: string;
    ownerName: string;
    ownerEmail?: string;
    ownerPhone?: string;
    ownerWhatsApp?: string;
    ownerRole?: UserRole;
    title: string;
    description: string;
    propertyType: PropertyType;
    roomType: RoomType;
    country: string;
    city: string;
    address: string;
    postalCode?: string;
    isApproximateLocation?: boolean;
    latitude?: number;
    longitude?: number;
    institutionIds: string[];
    campusIds: string[];
    primaryInstitutionName?: string;
    primaryCampusName?: string;
    distanceFromCampusKm?: number | null;
    currency: string;
    price: number;
    billingPeriod?: BillingPeriod;
    deposit?: number;
    totalUnits: number;
    availableUnits: number;
    amenities: string[];
    accessibilityFeatures?: string[];
    genderPreference?: GenderPreference;
    isFurnished?: boolean;
    utilitiesIncluded?: boolean;
    rules?: string[];
    photos?: string[];
    contactPreferences?: {
      enermindMessages: boolean;
      email: boolean;
      phone: boolean;
      whatsapp: boolean;
      whatsappGroupUrl?: string;
    };
    submitForReview?: boolean;
  }): { property: Property; duplicateWarning?: string } {
    if (!data.title || !data.description || !data.city || !data.country || !data.price) {
      throw new Error('Missing required property fields (Title, Description, City, Country, Price).');
    }

    const id = `prop-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const duplicateCheck = this.detectDuplicates(data);

    // Initial listing status: PENDING_REVIEW if submitted for review, else DRAFT
    const listingStatus = data.submitForReview ? ListingStatus.PENDING_REVIEW : ListingStatus.DRAFT;

    const newProp: Property = {
      id,
      ownerId: data.ownerId,
      ownerName: data.ownerName,
      ownerEmail: data.ownerEmail,
      ownerPhone: data.ownerPhone,
      ownerWhatsApp: data.ownerWhatsApp,
      ownerRole: data.ownerRole || UserRole.PROPERTY_OWNER,
      title: data.title.trim(),
      description: data.description.trim(),
      propertyType: data.propertyType,
      roomType: data.roomType,
      country: data.country.toUpperCase(),
      city: data.city.trim(),
      address: data.address.trim(),
      postalCode: data.postalCode?.trim(),
      isApproximateLocation: Boolean(data.isApproximateLocation),
      latitude: data.latitude,
      longitude: data.longitude,
      institutionIds: data.institutionIds || [],
      campusIds: data.campusIds || [],
      primaryInstitutionName: data.primaryInstitutionName,
      primaryCampusName: data.primaryCampusName,
      distanceFromCampusKm: data.distanceFromCampusKm ?? null,
      currency: data.currency.toUpperCase(),
      price: Number(data.price),
      pricePerMonth: Number(data.price),
      billingPeriod: data.billingPeriod || BillingPeriod.PER_MONTH,
      deposit: data.deposit ? Number(data.deposit) : undefined,
      availabilityStatus: data.availableUnits > 0 ? 'AVAILABLE_NOW' : 'FULLY_OCCUPIED',
      totalUnits: Number(data.totalUnits) || 1,
      occupiedUnits: Math.max(0, (Number(data.totalUnits) || 1) - (Number(data.availableUnits) || 0)),
      availableUnits: Number(data.availableUnits) || 0,
      amenities: data.amenities || [],
      accessibilityFeatures: data.accessibilityFeatures || [],
      genderPreference: data.genderPreference || GenderPreference.ANY,
      isFurnished: Boolean(data.isFurnished),
      utilitiesIncluded: Boolean(data.utilitiesIncluded),
      rules: data.rules || ['Standard residential and study conduct rules apply.'],
      photos: data.photos && data.photos.length > 0 ? data.photos : [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80',
      ],
      verificationStatus: VerificationStatus.UNVERIFIED,
      verificationBadge: false,
      listingStatus,
      promotionTier: PromotionTier.NORMAL,
      contactPreferences: data.contactPreferences || {
        enermindMessages: true,
        email: true,
        phone: true,
        whatsapp: false,
      },
      savedCount: 0,
      viewsCount: 0,
      inquiriesCount: 0,
      rating: 0,
      reviewsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: undefined,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days validity
    };

    this.properties.set(id, newProp);

    adminService.logAction({
      actorUserId: data.ownerId,
      actorEmail: data.ownerEmail || 'landlord@enermind.org',
      actorRole: data.ownerRole || UserRole.PROPERTY_OWNER,
      action: 'PROPERTY_CREATED',
      targetType: 'ACCOMMODATION',
      targetId: id,
      details: `Created listing "${newProp.title}" in ${newProp.city} (${newProp.currency} ${newProp.price}). Status: ${listingStatus}`,
    });

    return {
      property: newProp,
      duplicateWarning: duplicateCheck.hasPotentialDuplicate
        ? `Duplicate warning: matches existing property "${duplicateCheck.duplicateMatches[0].title}"`
        : undefined,
    };
  }

  /**
   * Update an existing property (Strictly checks owner authorization)
   */
  updateProperty(
    propertyId: string,
    editorUserId: string,
    updates: Partial<Property>,
    isStaffOrAdmin: boolean = false
  ): Property {
    const prop = this.properties.get(propertyId);
    if (!prop) {
      throw new Error(`Property ${propertyId} not found.`);
    }

    if (prop.ownerId !== editorUserId && !isStaffOrAdmin) {
      throw new Error('Unauthorized: You can only edit properties you own.');
    }

    // Apply allowed updates
    const updated: Property = {
      ...prop,
      ...updates,
      id: prop.id, // Immutable
      ownerId: prop.ownerId, // Immutable owner
      updatedAt: new Date().toISOString(),
    };

    // Update availability status if units changed
    if (updated.availableUnits !== undefined) {
      updated.availabilityStatus = updated.availableUnits > 0 ? 'AVAILABLE_NOW' : 'FULLY_OCCUPIED';
    }

    this.properties.set(propertyId, updated);

    adminService.logAction({
      actorUserId: editorUserId,
      actorEmail: prop.ownerEmail || 'editor@enermind.org',
      actorRole: isStaffOrAdmin ? UserRole.ADMIN : UserRole.PROPERTY_OWNER,
      action: 'PROPERTY_UPDATED',
      targetType: 'ACCOMMODATION',
      targetId: propertyId,
      details: `Updated property "${updated.title}" attributes.`,
    });

    return updated;
  }

  /**
   * Fast Availability Updater: update units/beds
   */
  updateAvailability(
    propertyId: string,
    ownerUserId: string,
    totalUnits: number,
    availableUnits: number
  ): Property {
    const prop = this.properties.get(propertyId);
    if (!prop) throw new Error('Property not found');
    if (prop.ownerId !== ownerUserId) throw new Error('Unauthorized.');

    prop.totalUnits = Number(totalUnits);
    prop.availableUnits = Number(availableUnits);
    prop.occupiedUnits = Math.max(0, prop.totalUnits - prop.availableUnits);
    prop.availabilityStatus = prop.availableUnits > 0 ? 'AVAILABLE_NOW' : 'FULLY_OCCUPIED';
    prop.updatedAt = new Date().toISOString();

    this.properties.set(propertyId, prop);
    return prop;
  }

  /**
   * Property Status Transitions: PAUSE, RESUME, MARK_FULL, ARCHIVE
   */
  changeListingStatus(
    propertyId: string,
    ownerUserId: string,
    action: 'PAUSE' | 'RESUME' | 'MARK_FULL' | 'ARCHIVE'
  ): Property {
    const prop = this.properties.get(propertyId);
    if (!prop) throw new Error('Property not found');
    if (prop.ownerId !== ownerUserId) throw new Error('Unauthorized.');

    if (action === 'PAUSE') {
      prop.listingStatus = ListingStatus.PAUSED;
    } else if (action === 'RESUME') {
      prop.listingStatus = ListingStatus.PUBLISHED;
    } else if (action === 'MARK_FULL') {
      prop.listingStatus = ListingStatus.FULL;
      prop.availableUnits = 0;
      prop.availabilityStatus = 'FULLY_OCCUPIED';
    } else if (action === 'ARCHIVE') {
      prop.listingStatus = ListingStatus.ARCHIVED;
    }

    prop.updatedAt = new Date().toISOString();
    this.properties.set(propertyId, prop);
    return prop;
  }

  /**
   * Renew listing validity
   */
  renewListing(propertyId: string, ownerUserId: string): Property {
    const prop = this.properties.get(propertyId);
    if (!prop) throw new Error('Property not found');
    if (prop.ownerId !== ownerUserId) throw new Error('Unauthorized.');

    prop.expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();
    if (prop.listingStatus === ListingStatus.EXPIRED) {
      prop.listingStatus = ListingStatus.PUBLISHED;
    }
    prop.updatedAt = new Date().toISOString();
    this.properties.set(propertyId, prop);
    return prop;
  }

  /**
   * Submit Property Verification Documents (Private & Secure)
   */
  submitVerificationDocuments(
    propertyId: string,
    ownerUserId: string,
    documents: Array<{
      documentType: 'OWNERSHIP_DEED' | 'TITLE_DEED' | 'MANAGEMENT_AUTHORIZATION' | 'BUSINESS_REGISTRATION' | 'UTILITY_BILL' | 'NATIONAL_ID_PASSPORT' | 'OTHER';
      fileName: string;
      fileSizeBytes: number;
      mimeType?: string;
      driveFileId?: string;
    }>
  ): { success: boolean; verificationStatus: VerificationStatus } {
    const prop = this.properties.get(propertyId);
    if (!prop) throw new Error('Property not found');
    if (prop.ownerId !== ownerUserId) throw new Error('Unauthorized.');

    const docList: PropertyVerificationDocument[] = documents.map((d) => ({
      id: `ver-doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      propertyId,
      ownerId: ownerUserId,
      documentType: d.documentType,
      fileName: d.fileName,
      fileSizeBytes: d.fileSizeBytes,
      mimeType: d.mimeType || 'application/pdf',
      driveFileId: d.driveFileId,
      status: 'PENDING',
      uploadedAt: new Date().toISOString(),
    }));

    this.privateVerificationDocuments.set(propertyId, docList);

    prop.verificationStatus = VerificationStatus.UNDER_REVIEW;
    prop.updatedAt = new Date().toISOString();
    this.properties.set(propertyId, prop);

    adminService.logAction({
      actorUserId: ownerUserId,
      actorEmail: prop.ownerEmail || 'landlord@enermind.org',
      actorRole: UserRole.PROPERTY_OWNER,
      action: 'PROPERTY_VERIFICATION_SUBMITTED',
      targetType: 'ACCOMMODATION',
      targetId: propertyId,
      details: `Submitted ${docList.length} verification document(s) for property "${prop.title}".`,
    });

    return { success: true, verificationStatus: VerificationStatus.UNDER_REVIEW };
  }

  /**
   * Get all properties for a specific owner/landlord dashboard
   */
  getOwnerProperties(ownerUserId: string): Array<Property & { verificationDocuments?: PropertyVerificationDocument[] }> {
    const list = Array.from(this.properties.values()).filter((p) => p.ownerId === ownerUserId);
    return list.map((p) => {
      const docs = this.privateVerificationDocuments.get(p.id) || [];
      return {
        ...p,
        verificationDocuments: docs,
      };
    });
  }

  /**
   * Inquiry System: Student sends inquiry to Landlord/Manager
   */
  createInquiry(data: {
    propertyId: string;
    studentId: string;
    studentName: string;
    studentEmail: string;
    studentPhone?: string;
    message: string;
    moveInDate?: string;
    durationMonths?: number;
  }): PropertyInquiry {
    const prop = this.properties.get(data.propertyId);
    if (!prop) throw new Error('Property not found');

    const id = `inq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const inquiry: PropertyInquiry = {
      id,
      propertyId: data.propertyId,
      propertyTitle: prop.title,
      studentId: data.studentId,
      studentName: data.studentName,
      studentEmail: data.studentEmail,
      studentPhone: data.studentPhone,
      ownerId: prop.ownerId,
      ownerName: prop.ownerName,
      message: data.message.trim(),
      moveInDate: data.moveInDate,
      durationMonths: data.durationMonths,
      status: InquiryStatus.NEW,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.inquiries.set(id, inquiry);
    prop.inquiriesCount = (prop.inquiriesCount || 0) + 1;
    this.properties.set(prop.id, prop);

    adminService.logAction({
      actorUserId: data.studentId,
      actorEmail: data.studentEmail,
      actorRole: UserRole.STUDENT,
      action: 'INQUIRY_CREATED',
      targetType: 'ACCOMMODATION',
      targetId: data.propertyId,
      details: `Student "${data.studentName}" submitted inquiry for "${prop.title}".`,
    });

    return inquiry;
  }

  /**
   * Owner responds to an inquiry
   */
  respondToInquiry(inquiryId: string, ownerUserId: string, responseMessage: string): PropertyInquiry {
    const inq = this.inquiries.get(inquiryId);
    if (!inq) throw new Error('Inquiry not found');
    if (inq.ownerId !== ownerUserId) throw new Error('Unauthorized to respond to this inquiry.');

    inq.responseMessage = responseMessage.trim();
    inq.respondedAt = new Date().toISOString();
    inq.status = InquiryStatus.RESPONDED;
    inq.updatedAt = new Date().toISOString();

    this.inquiries.set(inquiryId, inq);
    return inq;
  }

  /**
   * Get inquiries for a student
   */
  getStudentInquiries(studentId: string): PropertyInquiry[] {
    return Array.from(this.inquiries.values())
      .filter((i) => i.studentId === studentId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Get inquiries for an owner/manager
   */
  getOwnerInquiries(ownerUserId: string): PropertyInquiry[] {
    return Array.from(this.inquiries.values())
      .filter((i) => i.ownerId === ownerUserId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Save / Bookmark accommodation
   */
  toggleSaveProperty(userId: string, propertyId: string): { isSaved: boolean; totalSaved: number } {
    const key = `${userId}:${propertyId}`;
    const prop = this.properties.get(propertyId);
    if (!prop) throw new Error('Property not found');

    if (this.savedProperties.has(key)) {
      this.savedProperties.delete(key);
      prop.savedCount = Math.max(0, (prop.savedCount || 1) - 1);
      this.properties.set(propertyId, prop);
      return { isSaved: false, totalSaved: prop.savedCount };
    } else {
      this.savedProperties.set(key, {
        id: `save-${Date.now()}`,
        userId,
        propertyId,
        createdAt: new Date().toISOString(),
      });
      prop.savedCount = (prop.savedCount || 0) + 1;
      this.properties.set(propertyId, prop);
      return { isSaved: true, totalSaved: prop.savedCount };
    }
  }

  /**
   * Get all saved properties for a student
   */
  getUserSavedProperties(userId: string, targetCurrency: string = 'USD'): Property[] {
    const propertyIds = Array.from(this.savedProperties.values())
      .filter((s) => s.userId === userId)
      .map((s) => s.propertyId);

    const list: Property[] = [];
    for (const pid of propertyIds) {
      const p = this.properties.get(pid);
      if (p) list.push(p);
    }
    return list;
  }

  /**
   * Compare multiple properties side-by-side
   */
  compareProperties(propertyIds: string[], targetCurrency: string = 'USD'): PropertyComparisonItem[] {
    const selected = propertyIds.slice(0, 4).map((id) => this.properties.get(id)).filter(Boolean) as Property[];
    if (selected.length === 0) return [];

    const allAmenitiesUnion = Array.from(new Set(selected.flatMap((p) => p.amenities)));

    return selected.map((p) => {
      const convertedPriceDisplay =
        p.currency === targetCurrency
          ? `${targetCurrency} ${p.price.toLocaleString()}`
          : currencyService.format(currencyService.convert(p.price, p.currency, targetCurrency).targetAmount, targetCurrency);

      const distanceDisplay =
        p.distanceFromCampusKm !== null && p.distanceFromCampusKm !== undefined
          ? `${p.distanceFromCampusKm} km from ${p.primaryCampusName || 'Campus'}`
          : 'Distance unavailable';

      const keyAmenities = p.amenities;
      const missingAmenities = allAmenitiesUnion.filter((a) => !p.amenities.includes(a));

      return {
        property: p,
        convertedPriceDisplay,
        originalPriceDisplay: `${p.currency} ${p.price.toLocaleString()}`,
        distanceDisplay,
        keyAmenities,
        missingAmenities,
      };
    });
  }

  /**
   * Submit Review
   */
  submitReview(data: {
    propertyId: string;
    userId: string;
    userName: string;
    userRole?: string;
    rating: number;
    comment: string;
  }): PropertyReview {
    const prop = this.properties.get(data.propertyId);
    if (!prop) throw new Error('Property not found');

    const id = `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const review: PropertyReview = {
      id,
      propertyId: data.propertyId,
      userId: data.userId,
      userName: data.userName,
      userRole: data.userRole,
      rating: Math.min(5, Math.max(1, data.rating)),
      comment: data.comment.trim(),
      status: ReviewStatus.APPROVED, // Auto-moderated for verified users
      createdAt: new Date().toISOString(),
    };

    this.reviews.set(id, review);

    // Recalculate average rating
    const approvedReviews = Array.from(this.reviews.values()).filter(
      (r) => r.propertyId === data.propertyId && r.status === ReviewStatus.APPROVED
    );
    const avg = approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length;
    prop.rating = Number(avg.toFixed(1));
    prop.reviewsCount = approvedReviews.length;
    this.properties.set(prop.id, prop);

    return review;
  }

  /**
   * Get approved reviews for a property
   */
  getPropertyReviews(propertyId: string): PropertyReview[] {
    return Array.from(this.reviews.values())
      .filter((r) => r.propertyId === propertyId && r.status === ReviewStatus.APPROVED)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Report Property (Scam / Inaccuracy / Abuse)
   */
  reportProperty(data: {
    propertyId: string;
    reportedByUserId: string;
    reporterEmail?: string;
    reason: ReportReason;
    details: string;
  }): PropertyReport {
    const prop = this.properties.get(data.propertyId);
    if (!prop) throw new Error('Property not found');

    const id = `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const report: PropertyReport = {
      id,
      propertyId: data.propertyId,
      propertyTitle: prop.title,
      reportedByUserId: data.reportedByUserId,
      reporterEmail: data.reporterEmail,
      reason: data.reason,
      details: data.details.trim(),
      status: ReportStatus.PENDING,
      createdAt: new Date().toISOString(),
    };

    this.reports.set(id, report);

    adminService.logAction({
      actorUserId: data.reportedByUserId,
      actorEmail: data.reporterEmail || 'student@enermind.org',
      actorRole: UserRole.STUDENT,
      action: 'PROPERTY_REPORTED',
      targetType: 'ACCOMMODATION',
      targetId: data.propertyId,
      details: `Reported property "${prop.title}" for ${data.reason}. Details: ${data.details.substring(0, 100)}`,
    });

    return report;
  }

  /**
   * Explainable Recommendations for Students
   */
  getRecommendationsForStudent(userContext: {
    countryCode?: string;
    institutionId?: string;
    campusId?: string;
    maxBudgetUSD?: number;
    preferredAmenities?: string[];
  }): Array<Property & { matchScore: number; recommendationReason: string }> {
    const published = Array.from(this.properties.values()).filter(
      (p) => p.listingStatus === ListingStatus.PUBLISHED && p.availableUnits > 0
    );

    const scored = published.map((p) => {
      let score = 0;
      const reasons: string[] = [];

      // Same campus / institution match
      if (userContext.campusId && p.campusIds.includes(userContext.campusId)) {
        score += 40;
        reasons.push(`Directly adjacent to ${p.primaryCampusName || 'your campus'}`);
      } else if (userContext.institutionId && p.institutionIds.includes(userContext.institutionId)) {
        score += 25;
        reasons.push(`Serving ${p.primaryInstitutionName || 'your institution'}`);
      } else if (userContext.countryCode && p.country.toUpperCase() === userContext.countryCode.toUpperCase()) {
        score += 15;
      }

      // Proximity
      if (p.distanceFromCampusKm !== null && p.distanceFromCampusKm !== undefined) {
        if (p.distanceFromCampusKm <= 0.5) {
          score += 20;
          reasons.push(`Very close walking distance (${Math.round(p.distanceFromCampusKm * 1000)}m)`);
        } else if (p.distanceFromCampusKm <= 1.5) {
          score += 10;
          reasons.push(`Within 1.5 km of campus`);
        }
      }

      // Verification Badge
      if (p.verificationBadge) {
        score += 15;
        reasons.push('Verified safe student accommodation');
      }

      // Rating
      if (p.rating >= 4.5) {
        score += 10;
        reasons.push(`Top-rated (${p.rating}★ by student residents)`);
      }

      // Key student amenities
      if (p.amenities.some((a) => a.toLowerCase().includes('wi-fi') || a.toLowerCase().includes('broadband'))) {
        score += 10;
      }

      const matchScore = Math.min(100, Math.max(10, score));
      const recommendationReason =
        reasons.length > 0 ? reasons.slice(0, 2).join(' • ') : 'Popular student accommodation with active availability';

      return {
        ...p,
        matchScore,
        recommendationReason,
      };
    });

    return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 6);
  }

  // ================= ADMIN MODERATION METHODS =================

  getPendingModerationProperties(): Property[] {
    return Array.from(this.properties.values()).filter(
      (p) => p.listingStatus === ListingStatus.PENDING_REVIEW
    );
  }

  reviewPropertyListing(params: {
    propertyId: string;
    action: 'APPROVE' | 'REJECT' | 'REQUEST_CHANGES' | 'SUSPEND' | 'RESTORE';
    reviewerUserId: string;
    reviewerEmail: string;
    moderatorNotes?: string;
  }): Property {
    const prop = this.properties.get(params.propertyId);
    if (!prop) throw new Error('Property not found');

    if (params.action === 'APPROVE') {
      prop.listingStatus = ListingStatus.PUBLISHED;
      prop.publishedAt = new Date().toISOString();
    } else if (params.action === 'REJECT') {
      prop.listingStatus = ListingStatus.REJECTED;
    } else if (params.action === 'REQUEST_CHANGES') {
      prop.listingStatus = ListingStatus.DRAFT;
    } else if (params.action === 'SUSPEND') {
      prop.listingStatus = ListingStatus.PAUSED;
    } else if (params.action === 'RESTORE') {
      prop.listingStatus = ListingStatus.PUBLISHED;
    }

    prop.updatedAt = new Date().toISOString();
    this.properties.set(params.propertyId, prop);

    adminService.logAction({
      actorUserId: params.reviewerUserId,
      actorEmail: params.reviewerEmail,
      actorRole: UserRole.ADMIN,
      action: `PROPERTY_${params.action}`,
      targetType: 'ACCOMMODATION',
      targetId: params.propertyId,
      details: `Admin ${params.reviewerEmail} executed ${params.action} on property "${prop.title}". Notes: ${params.moderatorNotes || 'None'}`,
    });

    return prop;
  }

  getPendingVerifications(): Array<{ property: Property; documents: PropertyVerificationDocument[] }> {
    const list: Array<{ property: Property; documents: PropertyVerificationDocument[] }> = [];
    for (const [propId, docs] of this.privateVerificationDocuments.entries()) {
      const prop = this.properties.get(propId);
      if (prop && (prop.verificationStatus === VerificationStatus.UNDER_REVIEW || prop.verificationStatus === VerificationStatus.SUBMITTED)) {
        list.push({ property: prop, documents: docs });
      }
    }
    return list;
  }

  verifyProperty(params: {
    propertyId: string;
    decision: 'VERIFY' | 'REJECT';
    reviewerUserId: string;
    reviewerEmail: string;
    rejectionReason?: string;
  }): Property {
    const prop = this.properties.get(params.propertyId);
    if (!prop) throw new Error('Property not found');

    if (params.decision === 'VERIFY') {
      prop.verificationStatus = VerificationStatus.VERIFIED;
      prop.verificationBadge = true;
    } else {
      prop.verificationStatus = VerificationStatus.REJECTED;
      prop.verificationBadge = false;
    }

    const docs = this.privateVerificationDocuments.get(params.propertyId) || [];
    docs.forEach((d) => {
      d.status = params.decision === 'VERIFY' ? 'VERIFIED' : 'REJECTED';
      d.rejectionReason = params.rejectionReason;
    });
    this.privateVerificationDocuments.set(params.propertyId, docs);

    prop.updatedAt = new Date().toISOString();
    this.properties.set(params.propertyId, prop);

    adminService.logAction({
      actorUserId: params.reviewerUserId,
      actorEmail: params.reviewerEmail,
      actorRole: UserRole.ADMIN,
      action: `PROPERTY_VERIFICATION_${params.decision}`,
      targetType: 'ACCOMMODATION',
      targetId: params.propertyId,
      details: `Property "${prop.title}" verification was ${params.decision}. Reason: ${params.rejectionReason || 'Documents Verified'}`,
    });

    return prop;
  }

  getReports(status?: ReportStatus): PropertyReport[] {
    let list = Array.from(this.reports.values());
    if (status) {
      list = list.filter((r) => r.status === status);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  actionReport(params: {
    reportId: string;
    action: 'INVESTIGATE' | 'DISMISS' | 'SUSPEND_PROPERTY';
    moderatorUserId: string;
    moderatorNotes?: string;
  }): PropertyReport {
    const rep = this.reports.get(params.reportId);
    if (!rep) throw new Error('Report not found');

    if (params.action === 'INVESTIGATE') {
      rep.status = ReportStatus.INVESTIGATING;
    } else if (params.action === 'DISMISS') {
      rep.status = ReportStatus.DISMISSED;
    } else if (params.action === 'SUSPEND_PROPERTY') {
      rep.status = ReportStatus.ACTIONED;
      const prop = this.properties.get(rep.propertyId);
      if (prop) {
        prop.listingStatus = ListingStatus.PAUSED;
        this.properties.set(prop.id, prop);
      }
    }

    rep.moderatorNotes = params.moderatorNotes;
    rep.updatedAt = new Date().toISOString();
    this.reports.set(params.reportId, rep);

    return rep;
  }
}

export const accommodationService = new AccommodationService();

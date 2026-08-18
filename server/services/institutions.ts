/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Campus,
  CampusSubmission,
  CountryInfo,
  DuplicateCheckResult,
  Institution,
  InstitutionStatus,
  InstitutionType,
} from '../../src/types/index.js';

export const GLOBAL_COUNTRIES: CountryInfo[] = [
  // Africa
  { code: 'KE', name: 'Kenya', currency: 'KES', flagEmoji: '🇰🇪', phoneCode: '+254', region: 'Africa' },
  { code: 'UG', name: 'Uganda', currency: 'UGX', flagEmoji: '🇺🇬', phoneCode: '+256', region: 'Africa' },
  { code: 'TZ', name: 'Tanzania', currency: 'TZS', flagEmoji: '🇹🇿', phoneCode: '+255', region: 'Africa' },
  { code: 'RW', name: 'Rwanda', currency: 'RWF', flagEmoji: '🇷🇼', phoneCode: '+250', region: 'Africa' },
  { code: 'NG', name: 'Nigeria', currency: 'NGN', flagEmoji: '🇳🇬', phoneCode: '+234', region: 'Africa' },
  { code: 'GH', name: 'Ghana', currency: 'GHS', flagEmoji: '🇬🇭', phoneCode: '+233', region: 'Africa' },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR', flagEmoji: '🇿🇦', phoneCode: '+27', region: 'Africa' },
  { code: 'ET', name: 'Ethiopia', currency: 'ETB', flagEmoji: '🇪🇹', phoneCode: '+251', region: 'Africa' },
  { code: 'EG', name: 'Egypt', currency: 'EGP', flagEmoji: '🇪🇬', phoneCode: '+20', region: 'Africa' },
  { code: 'MA', name: 'Morocco', currency: 'MAD', flagEmoji: '🇲🇦', phoneCode: '+212', region: 'Africa' },

  // North America
  { code: 'US', name: 'United States', currency: 'USD', flagEmoji: '🇺🇸', phoneCode: '+1', region: 'North America' },
  { code: 'CA', name: 'Canada', currency: 'CAD', flagEmoji: '🇨🇦', phoneCode: '+1', region: 'North America' },
  { code: 'MX', name: 'Mexico', currency: 'MXN', flagEmoji: '🇲🇽', phoneCode: '+52', region: 'North America' },

  // Europe
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', flagEmoji: '🇬🇧', phoneCode: '+44', region: 'Europe' },
  { code: 'DE', name: 'Germany', currency: 'EUR', flagEmoji: '🇩🇪', phoneCode: '+49', region: 'Europe' },
  { code: 'FR', name: 'France', currency: 'EUR', flagEmoji: '🇫🇷', phoneCode: '+33', region: 'Europe' },
  { code: 'NL', name: 'Netherlands', currency: 'EUR', flagEmoji: '🇳🇱', phoneCode: '+31', region: 'Europe' },
  { code: 'CH', name: 'Switzerland', currency: 'CHF', flagEmoji: '🇨🇭', phoneCode: '+41', region: 'Europe' },
  { code: 'SE', name: 'Sweden', currency: 'SEK', flagEmoji: '🇸🇪', phoneCode: '+46', region: 'Europe' },
  { code: 'IE', name: 'Ireland', currency: 'EUR', flagEmoji: '🇮🇪', phoneCode: '+353', region: 'Europe' },

  // Asia & Oceania
  { code: 'IN', name: 'India', currency: 'INR', flagEmoji: '🇮🇳', phoneCode: '+91', region: 'Asia' },
  { code: 'AU', name: 'Australia', currency: 'AUD', flagEmoji: '🇦🇺', phoneCode: '+61', region: 'Oceania' },
  { code: 'NZ', name: 'New Zealand', currency: 'NZD', flagEmoji: '🇳🇿', phoneCode: '+64', region: 'Oceania' },
  { code: 'SG', name: 'Singapore', currency: 'SGD', flagEmoji: '🇸🇬', phoneCode: '+65', region: 'Asia' },
  { code: 'AE', name: 'United Arab Emirates', currency: 'AED', flagEmoji: '🇦🇪', phoneCode: '+971', region: 'Middle East' },
  { code: 'JP', name: 'Japan', currency: 'JPY', flagEmoji: '🇯🇵', phoneCode: '+81', region: 'Asia' },
  { code: 'CN', name: 'China', currency: 'CNY', flagEmoji: '🇨🇳', phoneCode: '+86', region: 'Asia' },
  { code: 'MY', name: 'Malaysia', currency: 'MYR', flagEmoji: '🇲🇾', phoneCode: '+60', region: 'Asia' },
  { code: 'BR', name: 'Brazil', currency: 'BRL', flagEmoji: '🇧🇷', phoneCode: '+55', region: 'South America' },
];

export const INITIAL_INSTITUTIONS: Institution[] = [
  // 1. Kenya - University of Nairobi
  {
    id: 'inst-uon-ke',
    countryCode: 'KE',
    name: 'University of Nairobi',
    shortName: 'UoN',
    type: InstitutionType.UNIVERSITY,
    website: 'https://www.uonbi.ac.ke',
    domainPattern: 'uonbi.ac.ke',
    status: InstitutionStatus.APPROVED,
    createdDate: new Date('2025-01-01').toISOString(),
    updatedDate: new Date('2025-01-01').toISOString(),
    campuses: [
      {
        id: 'camp-uon-main',
        institutionId: 'inst-uon-ke',
        name: 'Main Campus (Nairobi CBD)',
        city: 'Nairobi',
        isMainCampus: true,
        collegesOrFaculties: [
          {
            id: 'col-uon-cbet',
            campusId: 'camp-uon-main',
            name: 'Faculty of Science and Technology',
            departments: [
              {
                id: 'dept-uon-sci',
                schoolOrFacultyId: 'col-uon-cbet',
                name: 'Department of Computing and Informatics',
                courses: [
                  {
                    id: 'course-uon-bsc-cs',
                    departmentId: 'dept-uon-sci',
                    code: 'CSC-100',
                    title: 'BSc Computer Science',
                    degreeType: 'BACHELOR',
                    durationYears: 4,
                    availableYears: [
                      { id: 'yr-1', label: 'Year 1', order: 1 },
                      { id: 'yr-2', label: 'Year 2', order: 2 },
                      { id: 'yr-3', label: 'Year 3', order: 3 },
                      { id: 'yr-4', label: 'Year 4', order: 4 },
                    ],
                  },
                  {
                    id: 'course-uon-bsc-it',
                    departmentId: 'dept-uon-sci',
                    code: 'BIT-200',
                    title: 'BSc Information Technology',
                    degreeType: 'BACHELOR',
                    durationYears: 4,
                    availableYears: [
                      { id: 'yr-1', label: 'Year 1', order: 1 },
                      { id: 'yr-2', label: 'Year 2', order: 2 },
                      { id: 'yr-3', label: 'Year 3', order: 3 },
                      { id: 'yr-4', label: 'Year 4', order: 4 },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'col-uon-business',
            campusId: 'camp-uon-main',
            name: 'Faculty of Business and Management Sciences',
            departments: [
              {
                id: 'dept-uon-finance',
                schoolOrFacultyId: 'col-uon-business',
                name: 'Department of Finance and Accounting',
                courses: [
                  {
                    id: 'course-uon-bcom',
                    departmentId: 'dept-uon-finance',
                    code: 'BCOM-101',
                    title: 'Bachelor of Commerce (B.Com)',
                    degreeType: 'BACHELOR',
                    durationYears: 4,
                    availableYears: [
                      { id: 'yr-1', label: 'Year 1', order: 1 },
                      { id: 'yr-2', label: 'Year 2', order: 2 },
                      { id: 'yr-3', label: 'Year 3', order: 3 },
                      { id: 'yr-4', label: 'Year 4', order: 4 },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'camp-uon-chiromo',
        institutionId: 'inst-uon-ke',
        name: 'Chiromo Campus',
        city: 'Riverside, Nairobi',
        isMainCampus: false,
        collegesOrFaculties: [
          {
            id: 'col-uon-bio',
            campusId: 'camp-uon-chiromo',
            name: 'School of Biological Sciences',
            departments: [
              {
                id: 'dept-uon-biotech',
                schoolOrFacultyId: 'col-uon-bio',
                name: 'Biotechnology',
                courses: [
                  {
                    id: 'course-uon-biotech',
                    departmentId: 'dept-uon-biotech',
                    code: 'BIO-301',
                    title: 'BSc Biotechnology',
                    degreeType: 'BACHELOR',
                    durationYears: 4,
                    availableYears: [
                      { id: 'yr-1', label: 'Year 1', order: 1 },
                      { id: 'yr-2', label: 'Year 2', order: 2 },
                      { id: 'yr-3', label: 'Year 3', order: 3 },
                      { id: 'yr-4', label: 'Year 4', order: 4 },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // 2. United Kingdom - University of Oxford
  {
    id: 'inst-oxford-gb',
    countryCode: 'GB',
    name: 'University of Oxford',
    shortName: 'Oxford',
    type: InstitutionType.UNIVERSITY,
    website: 'https://www.ox.ac.uk',
    domainPattern: 'ox.ac.uk',
    status: InstitutionStatus.APPROVED,
    createdDate: new Date('2025-01-01').toISOString(),
    updatedDate: new Date('2025-01-01').toISOString(),
    campuses: [
      {
        id: 'camp-oxford-main',
        institutionId: 'inst-oxford-gb',
        name: 'Collegiate Campus',
        city: 'Oxford',
        isMainCampus: true,
        collegesOrFaculties: [
          {
            id: 'col-oxford-mpls',
            campusId: 'camp-oxford-main',
            name: 'Mathematical, Physical and Life Sciences Division',
            departments: [
              {
                id: 'dept-oxford-compsci',
                schoolOrFacultyId: 'col-oxford-mpls',
                name: 'Department of Computer Science',
                courses: [
                  {
                    id: 'course-oxford-ba-cs',
                    departmentId: 'dept-oxford-compsci',
                    code: 'OX-CS',
                    title: 'BA in Computer Science',
                    degreeType: 'BACHELOR',
                    durationYears: 3,
                    availableYears: [
                      { id: 'yr-1', label: 'Year 1', order: 1 },
                      { id: 'yr-2', label: 'Year 2', order: 2 },
                      { id: 'yr-3', label: 'Year 3', order: 3 },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // 3. United States - Harvard University
  {
    id: 'inst-harvard-us',
    countryCode: 'US',
    name: 'Harvard University',
    shortName: 'Harvard',
    type: InstitutionType.UNIVERSITY,
    website: 'https://www.harvard.edu',
    domainPattern: 'harvard.edu',
    status: InstitutionStatus.APPROVED,
    createdDate: new Date('2025-01-01').toISOString(),
    updatedDate: new Date('2025-01-01').toISOString(),
    campuses: [
      {
        id: 'camp-harvard-cambridge',
        institutionId: 'inst-harvard-us',
        name: 'Cambridge Main Campus',
        city: 'Cambridge, MA',
        isMainCampus: true,
        collegesOrFaculties: [
          {
            id: 'col-harvard-seas',
            campusId: 'camp-harvard-cambridge',
            name: 'Harvard John A. Paulson School of Engineering',
            departments: [
              {
                id: 'dept-harvard-cs',
                schoolOrFacultyId: 'col-harvard-seas',
                name: 'Computer Science',
                courses: [
                  {
                    id: 'course-harvard-cs50',
                    departmentId: 'dept-harvard-cs',
                    code: 'CS50',
                    title: 'BSc Computer Science',
                    degreeType: 'BACHELOR',
                    durationYears: 4,
                    availableYears: [
                      { id: 'yr-1', label: 'Year 1 / Freshman', order: 1 },
                      { id: 'yr-2', label: 'Year 2 / Sophomore', order: 2 },
                      { id: 'yr-3', label: 'Year 3 / Junior', order: 3 },
                      { id: 'yr-4', label: 'Year 4 / Senior', order: 4 },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // 4. Canada - University of Toronto
  {
    id: 'inst-utoronto-ca',
    countryCode: 'CA',
    name: 'University of Toronto',
    shortName: 'U of T',
    type: InstitutionType.UNIVERSITY,
    website: 'https://www.utoronto.ca',
    domainPattern: 'utoronto.ca',
    status: InstitutionStatus.APPROVED,
    createdDate: new Date('2025-01-01').toISOString(),
    updatedDate: new Date('2025-01-01').toISOString(),
    campuses: [
      {
        id: 'camp-utoronto-stgeorge',
        institutionId: 'inst-utoronto-ca',
        name: 'St. George (Downtown)',
        city: 'Toronto, ON',
        isMainCampus: true,
        collegesOrFaculties: [
          {
            id: 'col-utoronto-artsci',
            campusId: 'camp-utoronto-stgeorge',
            name: 'Faculty of Arts & Science',
            departments: [
              {
                id: 'dept-utoronto-cs',
                schoolOrFacultyId: 'col-utoronto-artsci',
                name: 'Department of Computer Science',
                courses: [
                  {
                    id: 'course-utoronto-bsc-cs',
                    departmentId: 'dept-utoronto-cs',
                    code: 'CSC108',
                    title: 'Honours Bachelor of Science in CS',
                    degreeType: 'BACHELOR',
                    durationYears: 4,
                    availableYears: [
                      { id: 'yr-1', label: 'Year 1', order: 1 },
                      { id: 'yr-2', label: 'Year 2', order: 2 },
                      { id: 'yr-3', label: 'Year 3', order: 3 },
                      { id: 'yr-4', label: 'Year 4', order: 4 },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // 5. South Africa - University of Cape Town
  {
    id: 'inst-uct-za',
    countryCode: 'ZA',
    name: 'University of Cape Town',
    shortName: 'UCT',
    type: InstitutionType.UNIVERSITY,
    website: 'https://www.uct.ac.za',
    domainPattern: 'uct.ac.za',
    status: InstitutionStatus.APPROVED,
    createdDate: new Date('2025-01-01').toISOString(),
    updatedDate: new Date('2025-01-01').toISOString(),
    campuses: [
      {
        id: 'camp-uct-rondebosch',
        institutionId: 'inst-uct-za',
        name: 'Upper Campus Rondebosch',
        city: 'Cape Town',
        isMainCampus: true,
        collegesOrFaculties: [
          {
            id: 'col-uct-science',
            campusId: 'camp-uct-rondebosch',
            name: 'Faculty of Science',
            departments: [
              {
                id: 'dept-uct-cs',
                schoolOrFacultyId: 'col-uct-science',
                name: 'Computer Science',
                courses: [
                  {
                    id: 'course-uct-bsc',
                    departmentId: 'dept-uct-cs',
                    code: 'CSC1015F',
                    title: 'BSc in Computer Science',
                    degreeType: 'BACHELOR',
                    durationYears: 3,
                    availableYears: [
                      { id: 'yr-1', label: 'Year 1', order: 1 },
                      { id: 'yr-2', label: 'Year 2', order: 2 },
                      { id: 'yr-3', label: 'Year 3', order: 3 },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // 6. Australia - University of Melbourne
  {
    id: 'inst-unimelb-au',
    countryCode: 'AU',
    name: 'University of Melbourne',
    shortName: 'UniMelb',
    type: InstitutionType.UNIVERSITY,
    website: 'https://www.unimelb.edu.au',
    domainPattern: 'unimelb.edu.au',
    status: InstitutionStatus.APPROVED,
    createdDate: new Date('2025-01-01').toISOString(),
    updatedDate: new Date('2025-01-01').toISOString(),
    campuses: [
      {
        id: 'camp-unimelb-parkville',
        institutionId: 'inst-unimelb-au',
        name: 'Parkville Main Campus',
        city: 'Melbourne, VIC',
        isMainCampus: true,
        collegesOrFaculties: [
          {
            id: 'col-unimelb-eng',
            campusId: 'camp-unimelb-parkville',
            name: 'Faculty of Engineering and IT',
            departments: [
              {
                id: 'dept-unimelb-cis',
                schoolOrFacultyId: 'col-unimelb-eng',
                name: 'School of Computing and Information Systems',
                courses: [
                  {
                    id: 'course-unimelb-bscience',
                    departmentId: 'dept-unimelb-cis',
                    code: 'COMP10001',
                    title: 'Bachelor of Science (Computing)',
                    degreeType: 'BACHELOR',
                    durationYears: 3,
                    availableYears: [
                      { id: 'yr-1', label: 'Year 1', order: 1 },
                      { id: 'yr-2', label: 'Year 2', order: 2 },
                      { id: 'yr-3', label: 'Year 3', order: 3 },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

/**
 * Normalization helper for duplicate prevention
 */
export function normalizeInstitutionName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9\s]/g, ' ') // replace punctuation with spaces
    .replace(/\b(the|university|college|institute|of|for|and|in|at)\b/g, ' ') // remove common stop words
    .replace(/\s+/g, ' ')
    .trim();
}

class InstitutionDataService {
  private institutions: Map<string, Institution> = new Map();
  private campusSubmissions: Map<string, CampusSubmission> = new Map();

  constructor() {
    INITIAL_INSTITUTIONS.forEach((inst) => {
      this.institutions.set(inst.id, inst);
    });
  }

  getCountries(): CountryInfo[] {
    return GLOBAL_COUNTRIES;
  }

  getCountryByCode(code: string): CountryInfo | undefined {
    return GLOBAL_COUNTRIES.find((c) => c.code.toUpperCase() === code.toUpperCase());
  }

  getAllInstitutions(countryCode?: string, status?: InstitutionStatus): Institution[] {
    let list = Array.from(this.institutions.values());
    if (countryCode) {
      list = list.filter((inst) => inst.countryCode.toUpperCase() === countryCode.toUpperCase());
    }
    if (status) {
      list = list.filter((inst) => inst.status === status);
    }
    return list;
  }

  getInstitutionById(id: string): Institution | undefined {
    return this.institutions.get(id);
  }

  /**
   * Search institutions by query string with debouncing support
   */
  searchInstitutions(query: string, countryCode?: string): Institution[] {
    const q = query.toLowerCase().trim();
    return Array.from(this.institutions.values()).filter((inst) => {
      if (countryCode && inst.countryCode.toUpperCase() !== countryCode.toUpperCase()) {
        return false;
      }
      if (!q) return inst.status === InstitutionStatus.APPROVED;

      const matchesName = inst.name.toLowerCase().includes(q);
      const matchesShort = inst.shortName?.toLowerCase().includes(q);
      const matchesCampus = inst.campuses.some((c) => c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q));
      return (matchesName || matchesShort || matchesCampus) && inst.status !== InstitutionStatus.REJECTED;
    });
  }

  /**
   * Duplicate detection: checks if a candidate name has close matches in the database
   */
  checkDuplicates(name: string, countryCode: string): DuplicateCheckResult {
    const normalizedInput = normalizeInstitutionName(name);
    const countryInstitutions = this.getAllInstitutions(countryCode);

    const matches: Array<{
      id: string;
      name: string;
      countryCode: string;
      similarityScore: number;
      campusesCount: number;
    }> = [];

    for (const inst of countryInstitutions) {
      const normalizedExisting = normalizeInstitutionName(inst.name);
      
      // Exact normalized match or substring match
      if (normalizedExisting === normalizedInput) {
        matches.push({
          id: inst.id,
          name: inst.name,
          countryCode: inst.countryCode,
          similarityScore: 1.0,
          campusesCount: inst.campuses.length,
        });
      } else if (
        normalizedExisting.includes(normalizedInput) ||
        normalizedInput.includes(normalizedExisting)
      ) {
        matches.push({
          id: inst.id,
          name: inst.name,
          countryCode: inst.countryCode,
          similarityScore: 0.85,
          campusesCount: inst.campuses.length,
        });
      }
    }

    return {
      hasPotentialDuplicates: matches.length > 0,
      matches,
    };
  }

  /**
   * Propose a missing institution (Created with PENDING status)
   */
  proposeInstitution(data: {
    countryCode: string;
    name: string;
    shortName?: string;
    type?: InstitutionType;
    website?: string;
    campusName?: string;
    city?: string;
    submissionNotes?: string;
    submittedByUserId?: string;
  }): { institution: Institution; duplicates: DuplicateCheckResult } {
    const duplicates = this.checkDuplicates(data.name, data.countryCode);
    const id = `inst-prop-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const campusId = `camp-${id}-main`;
    const collegeId = `col-${id}-gen`;
    const deptId = `dept-${id}-gen`;
    const courseId = `course-${id}-gen`;

    const newInstitution: Institution = {
      id,
      countryCode: data.countryCode.toUpperCase(),
      name: data.name.trim(),
      shortName: data.shortName?.trim() || undefined,
      type: data.type || InstitutionType.UNIVERSITY,
      website: data.website?.trim() || undefined,
      status: InstitutionStatus.PENDING,
      submissionNotes: data.submissionNotes || 'User submitted during campus onboarding',
      submittedByUserId: data.submittedByUserId,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      campuses: [
        {
          id: campusId,
          institutionId: id,
          name: data.campusName?.trim() || 'Main Campus',
          city: data.city?.trim() || 'Primary City',
          isMainCampus: true,
          collegesOrFaculties: [
            {
              id: collegeId,
              campusId,
              name: 'General Faculty',
              departments: [
                {
                  id: deptId,
                  schoolOrFacultyId: collegeId,
                  name: 'General Department',
                  courses: [
                    {
                      id: courseId,
                      departmentId: deptId,
                      code: 'GEN101',
                      title: 'General Academic Program',
                      degreeType: 'BACHELOR',
                      durationYears: 4,
                      availableYears: [
                        { id: 'yr-1', label: 'Year 1', order: 1 },
                        { id: 'yr-2', label: 'Year 2', order: 2 },
                        { id: 'yr-3', label: 'Year 3', order: 3 },
                        { id: 'yr-4', label: 'Year 4', order: 4 },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    this.institutions.set(id, newInstitution);
    return { institution: newInstitution, duplicates };
  }

  /**
   * Submit a missing campus for an existing institution
   */
  submitCampus(data: {
    institutionId: string;
    campusName: string;
    city: string;
    countryCode: string;
    address?: string;
    website?: string;
    description?: string;
    submittedByUserId?: string;
  }): CampusSubmission {
    const submissionId = `csub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const inst = this.institutions.get(data.institutionId);

    const submission: CampusSubmission = {
      id: submissionId,
      institutionId: data.institutionId,
      institutionName: inst?.name || 'Unknown Institution',
      campusName: data.campusName.trim(),
      city: data.city.trim(),
      countryCode: data.countryCode.toUpperCase(),
      address: data.address?.trim(),
      website: data.website?.trim(),
      description: data.description?.trim(),
      submittedByUserId: data.submittedByUserId,
      status: InstitutionStatus.PENDING,
      createdDate: new Date().toISOString(),
    };

    this.campusSubmissions.set(submissionId, submission);
    return submission;
  }

  getCampusSubmissions(status?: InstitutionStatus): CampusSubmission[] {
    let list = Array.from(this.campusSubmissions.values());
    if (status) {
      list = list.filter((s) => s.status === status);
    }
    return list;
  }

  /**
   * Review/moderate campus submission
   */
  reviewCampusSubmission(submissionId: string, action: 'APPROVE' | 'REJECT'): { success: boolean; campus?: Campus } {
    const submission = this.campusSubmissions.get(submissionId);
    if (!submission) return { success: false };

    if (action === 'APPROVE') {
      submission.status = InstitutionStatus.APPROVED;
      const inst = this.institutions.get(submission.institutionId);
      if (inst) {
        const newCampus: Campus = {
          id: `camp-${submission.institutionId}-${Date.now().toString(36)}`,
          institutionId: submission.institutionId,
          name: submission.campusName,
          city: submission.city,
          isMainCampus: false,
          collegesOrFaculties: [
            {
              id: `col-${Date.now().toString(36)}`,
              campusId: `camp-${submission.institutionId}-${Date.now().toString(36)}`,
              name: 'General Faculty',
              departments: [],
            },
          ],
        };
        inst.campuses.push(newCampus);
        inst.updatedDate = new Date().toISOString();
        this.institutions.set(inst.id, inst);
        return { success: true, campus: newCampus };
      }
    } else {
      submission.status = InstitutionStatus.REJECTED;
    }

    return { success: true };
  }

  /**
   * Moderate institution (APPROVE, REJECT, REQUEST_CHANGES, MERGE_DUPLICATE)
   */
  moderateInstitution(
    id: string,
    newStatus: InstitutionStatus,
    reviewerNotes?: string,
    targetMergeId?: string
  ): Institution | null {
    const inst = this.institutions.get(id);
    if (!inst) return null;

    inst.status = newStatus;
    if (reviewerNotes) {
      inst.submissionNotes = `${inst.submissionNotes || ''} | Reviewer note: ${reviewerNotes}`;
    }

    if (newStatus === InstitutionStatus.MERGE_DUPLICATE && targetMergeId) {
      const target = this.institutions.get(targetMergeId);
      if (target) {
        // Merge campuses from candidate into target
        inst.campuses.forEach((c) => {
          c.institutionId = target.id;
          target.campuses.push(c);
        });
        target.updatedDate = new Date().toISOString();
        this.institutions.set(target.id, target);
        inst.status = InstitutionStatus.MERGED;
      }
    }

    inst.updatedDate = new Date().toISOString();
    this.institutions.set(id, inst);
    return inst;
  }
}

export const institutionService = new InstitutionDataService();

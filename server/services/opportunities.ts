/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Opportunity,
  OpportunityType,
  RemoteType,
  SalaryPeriod,
  ApplicationMethod,
  ApplicationStatus,
  EmployerVerificationStatus,
  ListingStatus,
  PromotionTier,
  Organization,
  Skill,
  OpportunityApplication,
  CareerProfile,
  SavedOpportunity,
  OpportunityReport,
  ReportStatus,
  OpportunitySearchParams,
  OpportunityRecommendation,
  UserRole,
} from '../../src/types/index.js';
import { currencyService } from './currency.js';
import { adminService } from './admin.js';

export const GLOBAL_SKILLS_CATALOG: Skill[] = [
  // Software & Engineering
  { id: 'sk-py', name: 'Python', category: 'Software & Engineering', aliases: ['python3', 'py'] },
  { id: 'sk-ts', name: 'TypeScript', category: 'Software & Engineering', aliases: ['ts', 'javascript', 'js'] },
  { id: 'sk-react', name: 'React', category: 'Software & Engineering', aliases: ['reactjs', 'react.js', 'nextjs'] },
  { id: 'sk-node', name: 'Node.js', category: 'Software & Engineering', aliases: ['nodejs', 'express'] },
  { id: 'sk-java', name: 'Java', category: 'Software & Engineering', aliases: ['spring', 'springboot'] },
  { id: 'sk-cpp', name: 'C++', category: 'Software & Engineering', aliases: ['cpp', 'c'] },
  { id: 'sk-sql', name: 'SQL & Databases', category: 'Software & Engineering', aliases: ['postgresql', 'mysql', 'sql'] },
  { id: 'sk-cloud', name: 'Cloud Computing (GCP / AWS)', category: 'Software & Engineering', aliases: ['gcp', 'aws', 'docker', 'kubernetes'] },
  { id: 'sk-cad', name: 'CAD & 3D Modeling', category: 'Engineering & Hardware', aliases: ['autocad', 'solidworks', 'revit'] },
  { id: 'sk-ee', name: 'Circuit Design & Embedded Systems', category: 'Engineering & Hardware', aliases: ['embedded', 'pcb', 'arduino', 'fpga'] },
  { id: 'sk-matlab', name: 'MATLAB & Simulink', category: 'Engineering & Hardware', aliases: ['matlab', 'simulink'] },
  
  // Data Science & AI
  { id: 'sk-ai', name: 'Machine Learning & AI', category: 'Data & AI', aliases: ['ml', 'deep-learning', 'pytorch', 'tensorflow', 'gemini'] },
  { id: 'sk-data', name: 'Data Analysis & Pandas', category: 'Data & AI', aliases: ['pandas', 'numpy', 'scipy', 'r'] },
  { id: 'sk-viz', name: 'Data Visualization & BI', category: 'Data & AI', aliases: ['tableau', 'powerbi', 'looker', 'd3'] },
  
  // Business, Finance & Productivity
  { id: 'sk-sheets', name: 'Google Sheets & Excel Modeling', category: 'Business & Finance', aliases: ['excel', 'financial-modeling', 'spreadsheets'] },
  { id: 'sk-acc', name: 'Financial Accounting', category: 'Business & Finance', aliases: ['bookkeeping', 'gaap', 'ifrs', 'quickbooks'] },
  { id: 'sk-pm', name: 'Project Management & Agile', category: 'Business & Operations', aliases: ['scrum', 'jira', 'trello', 'asana'] },
  { id: 'sk-mkt', name: 'Digital Marketing & SEO', category: 'Marketing & Media', aliases: ['seo', 'sem', 'content-strategy', 'growth'] },
  
  // Design & Creative
  { id: 'sk-uiux', name: 'UI/UX & Product Design', category: 'Design & Creative', aliases: ['figma', 'wireframing', 'user-research'] },
  { id: 'sk-graphic', name: 'Graphic Design', category: 'Design & Creative', aliases: ['photoshop', 'illustrator', 'canva'] },
  
  // Healthcare & Science
  { id: 'sk-lab', name: 'Laboratory Diagnostics & Assay', category: 'Healthcare & Science', aliases: ['lab', 'biochemistry', 'pcr', 'microbiology'] },
  { id: 'sk-clinical', name: 'Clinical Research & Data', category: 'Healthcare & Science', aliases: ['gcp-trials', 'epidemiology', 'public-health'] },
  
  // General & Soft Skills
  { id: 'sk-comm', name: 'Technical Writing & Communication', category: 'Communication', aliases: ['writing', 'presentation', 'documentation'] },
  { id: 'sk-research', name: 'Academic & Market Research', category: 'Research', aliases: ['literature-review', 'qualitative-research'] },
];

export const INITIAL_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-google',
    name: 'Google Cloud & Labs',
    logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80',
    description: 'Leading global cloud computing, artificial intelligence, and developer tooling innovator.',
    website: 'https://careers.google.com/students',
    industry: 'Technology & Artificial Intelligence',
    country: 'United States',
    countryCode: 'US',
    city: 'Mountain View, CA',
    verificationStatus: EmployerVerificationStatus.VERIFIED,
    createdBy: 'usr-admin-seed',
    createdAt: '2025-01-10T08:00:00.000Z',
    updatedAt: '2025-01-10T08:00:00.000Z',
  },
  {
    id: 'org-safaricom',
    name: 'Safaricom Innovation Hub',
    logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&auto=format&fit=crop&q=80',
    description: 'Leading African communications, fintech, and digital enterprise provider in East Africa.',
    website: 'https://www.safaricom.co.ke/careers',
    industry: 'Telecommunications & Fintech',
    country: 'Kenya',
    countryCode: 'KE',
    city: 'Nairobi',
    verificationStatus: EmployerVerificationStatus.VERIFIED,
    createdBy: 'usr-admin-seed',
    createdAt: '2025-01-12T09:30:00.000Z',
    updatedAt: '2025-01-12T09:30:00.000Z',
  },
  {
    id: 'org-kengen',
    name: 'KenGen Energy & Power',
    logo: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=150&auto=format&fit=crop&q=80',
    description: 'Premier renewable energy producer in East Africa specializing in geothermal and hydro power.',
    website: 'https://www.kengen.co.ke/careers',
    industry: 'Energy & Electrical Engineering',
    country: 'Kenya',
    countryCode: 'KE',
    city: 'Naivasha & Nairobi',
    verificationStatus: EmployerVerificationStatus.VERIFIED,
    createdBy: 'usr-admin-seed',
    createdAt: '2025-01-15T11:00:00.000Z',
    updatedAt: '2025-01-15T11:00:00.000Z',
  },
  {
    id: 'org-deepmind-uk',
    name: 'DeepMind Research Labs',
    logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=150&auto=format&fit=crop&q=80',
    description: 'World-leading artificial intelligence and fundamental research company solving intelligence.',
    website: 'https://deepmind.google/about/careers',
    industry: 'AI & Scientific Research',
    country: 'United Kingdom',
    countryCode: 'GB',
    city: 'London',
    verificationStatus: EmployerVerificationStatus.VERIFIED,
    createdBy: 'usr-admin-seed',
    createdAt: '2025-01-18T14:00:00.000Z',
    updatedAt: '2025-01-18T14:00:00.000Z',
  },
  {
    id: 'org-deloitte',
    name: 'Deloitte Global Advisory',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80',
    description: 'Global audit, financial advisory, risk management, and tax consultation firm.',
    website: 'https://www2.deloitte.com/global/en/pages/careers.html',
    industry: 'Finance, Audit & Advisory',
    country: 'Canada',
    countryCode: 'CA',
    city: 'Toronto, ON',
    verificationStatus: EmployerVerificationStatus.VERIFIED,
    createdBy: 'usr-admin-seed',
    createdAt: '2025-01-20T10:15:00.000Z',
    updatedAt: '2025-01-20T10:15:00.000Z',
  },
  {
    id: 'org-uon-it',
    name: 'University ICT & Library Directorate',
    logo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=150&auto=format&fit=crop&q=80',
    description: 'Internal campus student workforce program providing on-campus part-time roles for enrolled students.',
    website: 'https://uonbi.ac.ke',
    industry: 'Higher Education & Campus Services',
    country: 'Kenya',
    countryCode: 'KE',
    city: 'Nairobi',
    verificationStatus: EmployerVerificationStatus.VERIFIED,
    createdBy: 'usr-admin-seed',
    createdAt: '2025-01-25T16:00:00.000Z',
    updatedAt: '2025-01-25T16:00:00.000Z',
  },
  {
    id: 'org-bio-synth',
    name: 'BioSynth Biotech Labs',
    logo: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=150&auto=format&fit=crop&q=80',
    description: 'Biopharmaceutical research venture developing novel diagnostic assays and clinical tools.',
    website: 'https://biosynthlabs.example.com',
    industry: 'Healthcare & Biotechnology',
    country: 'Germany',
    countryCode: 'DE',
    city: 'Berlin',
    verificationStatus: EmployerVerificationStatus.UNDER_REVIEW,
    createdBy: 'usr-employer-seed',
    createdAt: '2025-02-01T09:00:00.000Z',
    updatedAt: '2025-02-01T09:00:00.000Z',
  },
];

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-sw-intern-us',
    organizationId: 'org-google',
    organizationName: 'Google Cloud & Labs',
    organizationLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80',
    organizationWebsite: 'https://careers.google.com/students',
    createdBy: 'usr-admin-seed',
    title: 'Software Engineering Summer Intern (2026)',
    description: 'Join our Cloud Systems engineering team to design, test, and deploy resilient scalable distributed microservices used by millions of enterprise developers worldwide.',
    type: OpportunityType.INTERNSHIP,
    industry: 'Technology & Artificial Intelligence',
    location: 'Mountain View, CA / Remote Option',
    country: 'United States',
    countryCode: 'US',
    city: 'Mountain View',
    region: 'California',
    remoteType: RemoteType.HYBRID,
    remoteCountries: ['United States', 'Canada'],
    employmentType: 'Full-time Internship',
    salaryMin: 7200,
    salaryMax: 8800,
    salaryCurrency: 'USD',
    salaryPeriod: SalaryPeriod.MONTHLY,
    isSalaryDisclosed: true,
    applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    startDate: '2026-06-01',
    duration: '12 Weeks',
    requirements: [
      'Currently enrolled in an Associate, Bachelor, or Master degree program in Computer Science, Software Engineering, or related STEM discipline',
      'Proficiency in Python, TypeScript, Java, C++, or Go',
      'Solid foundation in data structures, algorithms, and modular object-oriented architecture',
      'Ability to collaborate in a cross-functional Agile team environment',
    ],
    responsibilities: [
      'Implement production-ready distributed features with comprehensive automated testing',
      'Participate in architecture design reviews and peer code quality critiques',
      'Benchmark API latency and optimize backend throughput',
      'Present internship project outcomes to senior engineering leaders',
    ],
    skills: ['Python', 'TypeScript', 'Cloud Computing (GCP / AWS)', 'SQL & Databases'],
    courseRequirements: ['Computer Science', 'Software Engineering', 'Computer Engineering', 'Information Technology'],
    educationRequirements: ['Bachelor in Progress', 'Master in Progress'],
    experienceRequirements: 'Student / Academic projects',
    status: ListingStatus.PUBLISHED,
    verificationStatus: EmployerVerificationStatus.VERIFIED,
    applicationMethod: ApplicationMethod.EXTERNAL_URL,
    applicationUrl: 'https://careers.google.com/jobs/results/12345-swe-intern',
    promotionTier: PromotionTier.FEATURED,
    isPromoted: true,
    viewsCount: 842,
    savesCount: 194,
    applicationsCount: 78,
    createdAt: '2025-01-20T10:00:00.000Z',
    updatedAt: '2025-01-20T10:00:00.000Z',
    publishedAt: '2025-01-20T10:00:00.000Z',
    expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'opp-kengen-attach-ke',
    organizationId: 'org-kengen',
    organizationName: 'KenGen Energy & Power',
    organizationLogo: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=150&auto=format&fit=crop&q=80',
    organizationWebsite: 'https://www.kengen.co.ke/careers',
    createdBy: 'usr-admin-seed',
    title: 'Industrial Attachment: Electrical & Instrumentation Engineering',
    description: 'Official undergraduate attachment program offering hands-on technical field experience at our Olkaria Geothermal Generation Complex. Students rotate through high-voltage switchgear, SCADA telemetry, and automated turbine safety systems.',
    type: OpportunityType.ATTACHMENT,
    industry: 'Energy & Electrical Engineering',
    location: 'Olkaria Complex, Naivasha',
    country: 'Kenya',
    countryCode: 'KE',
    city: 'Naivasha',
    region: 'Nakuru County',
    remoteType: RemoteType.ON_SITE,
    employmentType: 'Academic Attachment',
    salaryMin: 25000,
    salaryMax: 35000,
    salaryCurrency: 'KES',
    salaryPeriod: SalaryPeriod.MONTHLY,
    isSalaryDisclosed: true,
    applicationDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    startDate: '2026-05-01',
    duration: '3 Months (Trimester)',
    requirements: [
      '3rd or 4th year undergraduate student pursuing Electrical & Electronics, Mechanical, or Mechatronics Engineering',
      'Official letter of recommendation and industrial attachment request from recognized university/college',
      'Valid student insurance and NITA registration compliance',
      'Basic competence in CAD, circuit schematics, and electrical measurement tooling',
    ],
    responsibilities: [
      'Assist plant instrumentation engineers with transducer calibrations and PLC diagnostics',
      'Conduct daily equipment inspection rounds across turbine generation halls',
      'Compile weekly technical maintenance logs and equipment efficiency reports',
      'Comply with rigorous high-voltage OSHA and plant safety protocols',
    ],
    skills: ['Circuit Design & Embedded Systems', 'CAD & 3D Modeling', 'MATLAB & Simulink'],
    courseRequirements: ['Electrical & Electronics Engineering', 'Mechanical Engineering', 'Mechatronic Engineering'],
    educationRequirements: ['Bachelor 3rd/4th Year', 'Diploma 2nd/3rd Year'],
    experienceRequirements: 'Academic coursework completed',
    institutionIds: ['inst-ke-1', 'inst-ke-2', 'inst-ke-3'],
    status: ListingStatus.PUBLISHED,
    verificationStatus: EmployerVerificationStatus.VERIFIED,
    applicationMethod: ApplicationMethod.ENERMIND,
    promotionTier: PromotionTier.FEATURED,
    isPromoted: true,
    viewsCount: 620,
    savesCount: 145,
    applicationsCount: 42,
    createdAt: '2025-01-22T08:30:00.000Z',
    updatedAt: '2025-01-22T08:30:00.000Z',
    publishedAt: '2025-01-22T08:30:00.000Z',
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'opp-fintech-saf-ke',
    organizationId: 'org-safaricom',
    organizationName: 'Safaricom Innovation Hub',
    organizationLogo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&auto=format&fit=crop&q=80',
    organizationWebsite: 'https://www.safaricom.co.ke/careers',
    createdBy: 'usr-admin-seed',
    title: 'Graduate Fintech & Data Analytics Associate',
    description: 'Accelerate your career through our structured 18-month graduate engineering development track. Rotate through M-PESA API architecture, merchant intelligence analytics, and fraud anomaly detection engines.',
    type: OpportunityType.GRADUATE_PROGRAM,
    industry: 'Telecommunications & Fintech',
    location: 'Safaricom HQ, Waiyaki Way, Nairobi',
    country: 'Kenya',
    countryCode: 'KE',
    city: 'Nairobi',
    region: 'Nairobi County',
    remoteType: RemoteType.HYBRID,
    employmentType: 'Full-time Graduate Track',
    salaryMin: 90000,
    salaryMax: 130000,
    salaryCurrency: 'KES',
    salaryPeriod: SalaryPeriod.MONTHLY,
    isSalaryDisclosed: true,
    applicationDeadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
    startDate: '2026-07-01',
    duration: '18 Months',
    requirements: [
      'Recent graduate or final year student graduating in 2025/2026 with 1st Class or Upper 2nd Class Honours',
      'Degree in Computer Science, Data Science, Actuarial Science, Statistics, or Information Systems',
      'Demonstrated experience with SQL, Python, and data visualization tools',
      'Strong problem-solving, numerical aptitude, and communication skills',
    ],
    responsibilities: [
      'Build automated metric dashboards tracking real-time transactional velocity and payment settlement',
      'Collaborate with product squads to pilot financial inclusion APIs for small enterprises',
      'Conduct exploratory data analysis on merchant customer journeys',
      'Participate in quarterly hackathons and cross-functional leadership mentorship circles',
    ],
    skills: ['Python', 'SQL & Databases', 'Data Analysis & Pandas', 'Data Visualization & BI', 'Google Sheets & Excel Modeling'],
    courseRequirements: ['Computer Science', 'Data Science', 'Actuarial Science', 'Statistics', 'Information Technology'],
    educationRequirements: ['Bachelor Degree (Graduating or Recent)'],
    experienceRequirements: '0 - 1 years',
    status: ListingStatus.PUBLISHED,
    verificationStatus: EmployerVerificationStatus.VERIFIED,
    applicationMethod: ApplicationMethod.ENERMIND,
    promotionTier: PromotionTier.PROMOTED,
    isPromoted: true,
    viewsCount: 1105,
    savesCount: 310,
    applicationsCount: 95,
    createdAt: '2025-01-25T14:20:00.000Z',
    updatedAt: '2025-01-25T14:20:00.000Z',
    publishedAt: '2025-01-25T14:20:00.000Z',
    expiresAt: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'opp-ai-res-uk',
    organizationId: 'org-deepmind-uk',
    organizationName: 'DeepMind Research Labs',
    organizationLogo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=150&auto=format&fit=crop&q=80',
    organizationWebsite: 'https://deepmind.google/about/careers',
    createdBy: 'usr-admin-seed',
    title: 'Research Scientist Apprentice — Multimodal Reasoning',
    description: 'Work alongside world-class research scientists investigating frontier multimodal transformer models, mathematical grounding, and safe evaluation benchmarks.',
    type: OpportunityType.APPRENTICESHIP,
    industry: 'AI & Scientific Research',
    location: 'King\'s Cross, London',
    country: 'United Kingdom',
    countryCode: 'GB',
    city: 'London',
    remoteType: RemoteType.HYBRID,
    remoteCountries: ['United Kingdom', 'European Union'],
    employmentType: 'Apprenticeship / Research Track',
    salaryMin: 3800,
    salaryMax: 4500,
    salaryCurrency: 'GBP',
    salaryPeriod: SalaryPeriod.MONTHLY,
    isSalaryDisclosed: true,
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    startDate: '2026-09-01',
    duration: '1 Year (Renewable)',
    requirements: [
      'Enrolled in or completed studies in Mathematics, Computer Science, Physics, or Computational Neuroscience',
      'Strong mathematical maturity in linear algebra, probability, and optimization',
      'Proficiency with PyTorch or JAX and distributed GPU clusters',
      'Demonstrated research curiosity or open-source scientific contributions',
    ],
    responsibilities: [
      'Design and execute rigorous empirical experiments evaluating reasoning capabilities',
      'Clean, curate, and analyze large-scale scientific benchmark datasets',
      'Co-author peer-reviewed workshop and conference papers',
      'Present research progress in weekly team lab seminars',
    ],
    skills: ['Machine Learning & AI', 'Python', 'Data Analysis & Pandas', 'Technical Writing & Communication'],
    courseRequirements: ['Computer Science', 'Mathematics', 'Physics', 'Artificial Intelligence'],
    educationRequirements: ['Bachelor Graduate', 'Master Graduate', 'PhD Candidate'],
    experienceRequirements: 'Research or Machine Learning project portfolio',
    status: ListingStatus.PUBLISHED,
    verificationStatus: EmployerVerificationStatus.VERIFIED,
    applicationMethod: ApplicationMethod.EXTERNAL_URL,
    applicationUrl: 'https://deepmind.google/about/careers/res-apprentice-2026',
    promotionTier: PromotionTier.NORMAL,
    viewsCount: 512,
    savesCount: 168,
    applicationsCount: 39,
    createdAt: '2025-01-28T11:00:00.000Z',
    updatedAt: '2025-01-28T11:00:00.000Z',
    publishedAt: '2025-01-28T11:00:00.000Z',
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'opp-deloitte-ca',
    organizationId: 'org-deloitte',
    organizationName: 'Deloitte Global Advisory',
    organizationLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80',
    organizationWebsite: 'https://www2.deloitte.com/global/en/pages/careers.html',
    createdBy: 'usr-admin-seed',
    title: 'Financial Advisory & Valuation Student Analyst',
    description: 'Assist our mergers and acquisitions (M&A) advisory practice with discounted cash flow (DCF) models, industry benchmark research, and financial due diligence reports for global mid-market transactions.',
    type: OpportunityType.INTERNSHIP,
    industry: 'Finance, Audit & Advisory',
    location: 'Bay Street, Toronto, ON / Remote Hybrid',
    country: 'Canada',
    countryCode: 'CA',
    city: 'Toronto',
    region: 'Ontario',
    remoteType: RemoteType.HYBRID,
    remoteCountries: ['Canada'],
    employmentType: 'Co-op / Student Internship',
    salaryMin: 4200,
    salaryMax: 5000,
    salaryCurrency: 'CAD',
    salaryPeriod: SalaryPeriod.MONTHLY,
    isSalaryDisclosed: true,
    applicationDeadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    startDate: '2026-05-15',
    duration: '4 Months (Summer Co-op)',
    requirements: [
      'Enrolled in Commerce, Finance, Economics, or Accounting undergraduate program',
      'Advanced proficiency in Google Sheets / Microsoft Excel financial formulas (INDEX/MATCH, XLOOKUP, NPV, IRR)',
      'Understanding of 3-statement financial models and corporate balance sheets',
      'Clear business communication and professional deck preparation skills',
    ],
    responsibilities: [
      'Construct comparative company valuation multiples across market sectors',
      'Draft industry research summaries and executive briefing notes',
      'Support senior managers with client diligence data rooms and audit verification',
      'Deliver final co-op presentation to practice partners',
    ],
    skills: ['Google Sheets & Excel Modeling', 'Financial Accounting', 'Data Analysis & Pandas', 'Technical Writing & Communication'],
    courseRequirements: ['Commerce', 'Finance', 'Economics', 'Accounting', 'Business Administration'],
    educationRequirements: ['Bachelor 2nd/3rd/4th Year'],
    experienceRequirements: 'Business coursework or case competitions',
    status: ListingStatus.PUBLISHED,
    verificationStatus: EmployerVerificationStatus.VERIFIED,
    applicationMethod: ApplicationMethod.ENERMIND,
    promotionTier: PromotionTier.NORMAL,
    viewsCount: 430,
    savesCount: 98,
    applicationsCount: 31,
    createdAt: '2025-01-30T15:00:00.000Z',
    updatedAt: '2025-01-30T15:00:00.000Z',
    publishedAt: '2025-01-30T15:00:00.000Z',
    expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'opp-campus-lib-ke',
    organizationId: 'org-uon-it',
    organizationName: 'University ICT & Library Directorate',
    organizationLogo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=150&auto=format&fit=crop&q=80',
    organizationWebsite: 'https://uonbi.ac.ke',
    createdBy: 'usr-admin-seed',
    title: 'Student Campus IT & Digital Repository Assistant',
    description: 'On-campus part-time opportunity designed around your class schedule. Support campus students with Wi-Fi onboarding, digital library access, laboratory computer maintenance, and past paper cataloging in the Enermind repository.',
    type: OpportunityType.CAMPUS_JOB,
    industry: 'Higher Education & Campus Services',
    location: 'Main Campus Library & Computer Labs',
    country: 'Kenya',
    countryCode: 'KE',
    city: 'Nairobi',
    remoteType: RemoteType.ON_SITE,
    employmentType: 'Part-Time Work Study (15 hrs/week)',
    salaryMin: 18000,
    salaryMax: 22000,
    salaryCurrency: 'KES',
    salaryPeriod: SalaryPeriod.MONTHLY,
    isSalaryDisclosed: true,
    applicationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    startDate: '2026-03-01',
    duration: 'Current Academic Semester',
    requirements: [
      'Currently enrolled full-time student in good academic standing (GPA > 2.5 / C+ or higher)',
      'Basic hardware troubleshooting, OS installation, and network setup skills',
      'Polite, patient interpersonal customer support demeanor',
      'Flexible availability for 3-hour morning or afternoon shifts',
    ],
    responsibilities: [
      'Staff the student ICT helpdesk and assist freshmen with institutional portal logins',
      'Perform routine printer maintenance and lab PC software updates',
      'Scan, OCR, and categorize past exam papers into campus digital repositories',
      'Assist librarians during peak revision hours before main examinations',
    ],
    skills: ['Technical Writing & Communication', 'Project Management & Agile', 'Google Sheets & Excel Modeling'],
    institutionIds: ['inst-ke-1'],
    campusIds: ['campus-ke-1-main', 'campus-ke-1-chiromo'],
    status: ListingStatus.PUBLISHED,
    verificationStatus: EmployerVerificationStatus.VERIFIED,
    applicationMethod: ApplicationMethod.ENERMIND,
    promotionTier: PromotionTier.NORMAL,
    viewsCount: 380,
    savesCount: 88,
    applicationsCount: 45,
    createdAt: '2025-02-02T09:00:00.000Z',
    updatedAt: '2025-02-02T09:00:00.000Z',
    publishedAt: '2025-02-02T09:00:00.000Z',
    expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'opp-remote-dev-world',
    organizationId: 'org-google',
    organizationName: 'Open Campus Global Initiative',
    organizationLogo: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=150&auto=format&fit=crop&q=80',
    organizationWebsite: 'https://opencampus.example.org',
    createdBy: 'usr-admin-seed',
    title: 'Remote React & TypeScript Frontend Contractor',
    description: 'Contract opportunity for skilled student developers worldwide to contribute modular UI widgets, interactive campus maps, and spreadsheet visualization tools for international student portals.',
    type: OpportunityType.FREELANCE,
    industry: 'Software & Web Development',
    location: 'Worldwide 100% Remote',
    country: 'Global',
    countryCode: 'GLOBAL',
    city: 'Remote',
    remoteType: RemoteType.REMOTE,
    remoteCountries: ['Worldwide'],
    employmentType: 'Project / Freelance Contract',
    salaryMin: 1200,
    salaryMax: 2000,
    salaryCurrency: 'USD',
    salaryPeriod: SalaryPeriod.PROJECT,
    isSalaryDisclosed: true,
    applicationDeadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    startDate: 'Immediate',
    duration: '6 Weeks Deliverables',
    requirements: [
      'Strong mastery of modern React, TypeScript, and Tailwind CSS',
      'Demonstrated GitHub portfolio or deployed web applications',
      'Disciplined asynchronous communication and Git workflow proficiency',
      'High attention to responsive layout design, accessibility, and clean code formatting',
    ],
    responsibilities: [
      'Develop pixel-perfect React components according to Figma design tokens',
      'Write modular unit tests and integrate with REST API endpoints',
      'Document component props and usage examples',
      'Participate in weekly async sprint retrospectives',
    ],
    skills: ['TypeScript', 'React', 'UI/UX & Product Design'],
    educationRequirements: ['Any degree or self-taught with portfolio'],
    experienceRequirements: 'Portfolio of 2+ completed web projects',
    status: ListingStatus.PUBLISHED,
    verificationStatus: EmployerVerificationStatus.VERIFIED,
    applicationMethod: ApplicationMethod.ENERMIND,
    promotionTier: PromotionTier.FEATURED,
    isPromoted: true,
    viewsCount: 920,
    savesCount: 280,
    applicationsCount: 64,
    createdAt: '2025-02-04T12:00:00.000Z',
    updatedAt: '2025-02-04T12:00:00.000Z',
    publishedAt: '2025-02-04T12:00:00.000Z',
    expiresAt: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export class OpportunitiesService {
  private opportunities = new Map<string, Opportunity>();
  private organizations = new Map<string, Organization>();
  private skills = new Map<string, Skill>();
  private applications = new Map<string, OpportunityApplication>();
  private savedOpportunities = new Map<string, SavedOpportunity>(); // key: `${userId}_${oppId}`
  private careerProfiles = new Map<string, CareerProfile>();
  private reports = new Map<string, OpportunityReport>();

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // Seed skills
    for (const skill of GLOBAL_SKILLS_CATALOG) {
      this.skills.set(skill.id, skill);
    }

    // Seed organizations
    for (const org of INITIAL_ORGANIZATIONS) {
      this.organizations.set(org.id, org);
    }

    // Seed opportunities
    for (const opp of INITIAL_OPPORTUNITIES) {
      this.opportunities.set(opp.id, {
        ...opp,
        organization: opp.organizationName,
        isRemote: opp.remoteType === RemoteType.REMOTE || opp.remoteType === RemoteType.HYBRID,
        deadlineDate: opp.applicationDeadline,
        stipendOrSalary: opp.isSalaryDisclosed
          ? `${opp.salaryCurrency} ${opp.salaryMin ? opp.salaryMin.toLocaleString() : ''}${opp.salaryMax ? ' - ' + opp.salaryMax.toLocaleString() : ''}/${opp.salaryPeriod?.toLowerCase() || 'mo'}`
          : 'Salary not disclosed',
        isVerified: opp.verificationStatus === EmployerVerificationStatus.VERIFIED,
        isExternalLink: opp.applicationMethod === ApplicationMethod.EXTERNAL_URL,
        postedByUserId: opp.createdBy,
        createdDate: opp.createdAt,
        targetCourses: opp.courseRequirements,
      });
    }

    // Seed default student career profile for demonstration
    this.careerProfiles.set('usr-enermind-lead', {
      userId: 'usr-enermind-lead',
      headline: 'Computer Science & Software Systems Student | Full Stack & AI Enthusiast',
      bio: 'Enthusiastic undergraduate building scalable web applications and Google-integrated digital tools for students globally. Passionate about TypeScript, React, Cloud microservices, and AI reasoning.',
      education: [
        {
          id: 'edu-1',
          institution: 'University of Nairobi',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science',
          startDate: '2023-09-01',
          endDate: '2027-06-30',
          current: true,
          grade: 'First Class Honours Track',
        },
      ],
      skills: ['Python', 'TypeScript', 'React', 'Node.js', 'SQL & Databases', 'Machine Learning & AI'],
      experience: [
        {
          id: 'exp-1',
          title: 'Campus Developer Lead',
          company: 'Google Developer Student Clubs',
          location: 'Nairobi',
          startDate: '2024-01-15',
          current: true,
          description: 'Organized campus workshops on web development and cloud deployments. Guided 150+ students in building open-source community solutions.',
        },
      ],
      projects: [
        {
          id: 'proj-1',
          title: 'Enermind Global Campus Hub',
          description: 'Full-stack campus ecosystem featuring Google Drive private vault, multi-currency marketplace, and Gemini-powered study assistant.',
          url: 'https://github.com/enermind/hub',
          skillsUsed: ['TypeScript', 'React', 'Node.js', 'Google Cloud'],
        },
      ],
      certifications: [
        {
          id: 'cert-1',
          name: 'Google Cloud Associate Cloud Engineer',
          issuer: 'Google Cloud',
          issueDate: '2024-08-10',
          credentialUrl: 'https://cloud.google.com/certification',
        },
      ],
      languages: ['English (Fluent)', 'Swahili (Fluent)'],
      portfolioUrl: 'https://pauline.dev',
      githubUrl: 'https://github.com/paulineamoit',
      linkedinUrl: 'https://linkedin.com/in/paulineamoit',
      preferredRoles: [OpportunityType.INTERNSHIP, OpportunityType.JOB, OpportunityType.ATTACHMENT, OpportunityType.FREELANCE],
      preferredLocations: ['Kenya', 'United States', 'Remote Worldwide'],
      remotePreference: 'ANY',
      isPublic: true,
      updatedAt: new Date().toISOString(),
    });
  }

  // ==========================================
  // 1. SEARCH & BROWSE OPPORTUNITIES
  // ==========================================

  searchOpportunities(params: OpportunitySearchParams, targetCurrency: string = 'USD'): {
    opportunities: Opportunity[];
    total: number;
    page: number;
    totalPages: number;
  } {
    const now = Date.now();
    let results = Array.from(this.opportunities.values());

    // Filter active/published unless staff is filtering
    if (params.activeOnly !== false) {
      results = results.filter((o) => o.status === ListingStatus.PUBLISHED);
    }

    // Keyword Search across title, org, industry, description, skills, requirements
    if (params.q && params.q.trim().length > 0) {
      const q = params.q.toLowerCase().trim();
      results = results.filter((o) => {
        return (
          o.title.toLowerCase().includes(q) ||
          o.organizationName.toLowerCase().includes(q) ||
          o.industry.toLowerCase().includes(q) ||
          o.description.toLowerCase().includes(q) ||
          o.city.toLowerCase().includes(q) ||
          o.country.toLowerCase().includes(q) ||
          o.skills.some((s) => s.toLowerCase().includes(q)) ||
          o.courseRequirements?.some((c) => c.toLowerCase().includes(q))
        );
      });
    }

    // Opportunity Type
    if (params.type && params.type !== 'ALL') {
      results = results.filter((o) => o.type === params.type);
    }

    // Industry
    if (params.industry && params.industry !== 'ALL') {
      results = results.filter((o) => o.industry.toLowerCase() === params.industry?.toLowerCase());
    }

    // Country
    if (params.countryCode && params.countryCode !== 'ALL' && params.countryCode !== 'GLOBAL') {
      results = results.filter(
        (o) =>
          o.countryCode === params.countryCode ||
          o.country.toLowerCase() === params.countryCode?.toLowerCase() ||
          o.remoteCountries?.some((rc) => rc.toLowerCase() === 'worldwide' || rc.toLowerCase() === params.countryCode?.toLowerCase())
      );
    }

    // Remote Type
    if (params.remoteType && params.remoteType !== 'ALL') {
      results = results.filter((o) => o.remoteType === params.remoteType);
    }

    // Verified only
    if (params.isVerifiedOnly) {
      results = results.filter((o) => o.verificationStatus === EmployerVerificationStatus.VERIFIED);
    }

    // Skills Filter
    if (params.skills && params.skills.length > 0) {
      results = results.filter((o) =>
        params.skills!.some((reqSkill) =>
          o.skills.some((s) => s.toLowerCase().includes(reqSkill.toLowerCase()))
        )
      );
    }

    // Course Matching
    if (params.course && params.course.trim().length > 0) {
      const cLower = params.course.toLowerCase();
      results = results.filter((o) => {
        if (!o.courseRequirements || o.courseRequirements.length === 0) return true; // Open to all
        return o.courseRequirements.some((cr) => cr.toLowerCase().includes(cLower));
      });
    }

    // Campus / Institution Relevance
    if (params.institutionId) {
      results = results.filter((o) => {
        if (!o.institutionIds || o.institutionIds.length === 0) return true;
        return o.institutionIds.includes(params.institutionId!);
      });
    }

    // Currency conversion & Salary filtering
    if (params.minSalary !== undefined || params.maxSalary !== undefined) {
      results = results.filter((o) => {
        if (!o.salaryMin || !o.salaryCurrency) return false;
        const converted = currencyService.convert(o.salaryMin, o.salaryCurrency, targetCurrency);
        if (params.minSalary !== undefined && converted.targetAmount < params.minSalary) return false;
        if (params.maxSalary !== undefined && converted.targetAmount > params.maxSalary) return false;
        return true;
      });
    }

    // Sorting
    const sortBy = params.sortBy || 'RECOMMENDED';
    results.sort((a, b) => {
      // Promoted / Featured always rank with slight boost in RECOMMENDED
      if (sortBy === 'RECOMMENDED') {
        const aBoost = a.promotionTier === PromotionTier.PROMOTED ? 3 : a.promotionTier === PromotionTier.FEATURED ? 2 : 0;
        const bBoost = b.promotionTier === PromotionTier.PROMOTED ? 3 : b.promotionTier === PromotionTier.FEATURED ? 2 : 0;
        if (aBoost !== bBoost) return bBoost - aBoost;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }

      if (sortBy === 'NEWEST') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }

      if (sortBy === 'DEADLINE') {
        return new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime();
      }

      if (sortBy === 'SALARY_HIGH_LOW') {
        const aVal = a.salaryMin ? currencyService.convert(a.salaryMin, a.salaryCurrency || 'USD', 'USD').targetAmount : 0;
        const bVal = b.salaryMin ? currencyService.convert(b.salaryMin, b.salaryCurrency || 'USD', 'USD').targetAmount : 0;
        return bVal - aVal;
      }

      return 0;
    });

    const page = Math.max(1, params.page || 1);
    const limit = Math.min(50, params.limit || 20);
    const total = results.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginated = results.slice(startIndex, startIndex + limit);

    return {
      opportunities: paginated,
      total,
      page,
      totalPages,
    };
  }

  // ==========================================
  // 2. SINGLE OPPORTUNITY & VIEW COUNTER
  // ==========================================

  getOpportunityById(id: string, viewerUserId?: string, isStaff: boolean = false): Opportunity | null {
    const opp = this.opportunities.get(id);
    if (!opp) return null;

    // Increment views safely if public
    if (opp.status === ListingStatus.PUBLISHED) {
      opp.viewsCount = (opp.viewsCount || 0) + 1;
      this.opportunities.set(id, opp);
    }

    return opp;
  }

  // ==========================================
  // 3. STUDENT RECOMMENDATION ENGINE
  // ==========================================

  getRecommendationsForStudent(userContext: {
    userId?: string;
    courseName?: string;
    institutionId?: string;
    campusId?: string;
    skills?: string[];
    countryCode?: string;
  }): OpportunityRecommendation[] {
    const active = Array.from(this.opportunities.values()).filter((o) => o.status === ListingStatus.PUBLISHED);
    const recommendations: OpportunityRecommendation[] = [];

    for (const opp of active) {
      let score = 50; // base score
      const matchReasons: string[] = [];

      // 1. Course Match
      if (userContext.courseName && opp.courseRequirements && opp.courseRequirements.length > 0) {
        const matched = opp.courseRequirements.find((c) =>
          userContext.courseName?.toLowerCase().includes(c.toLowerCase()) ||
          c.toLowerCase().includes(userContext.courseName?.toLowerCase() || '')
        );
        if (matched) {
          score += 30;
          matchReasons.push(`Matches your ${userContext.courseName} major`);
        }
      }

      // 2. Skills Match
      if (userContext.skills && userContext.skills.length > 0) {
        const matchedSkills = opp.skills.filter((reqSkill) =>
          userContext.skills!.some((s) => s.toLowerCase() === reqSkill.toLowerCase())
        );
        if (matchedSkills.length > 0) {
          score += matchedSkills.length * 10;
          matchReasons.push(`Requires skills you possess: ${matchedSkills.slice(0, 3).join(', ')}`);
        }
      }

      // 3. Campus & Institution Relevance
      if (userContext.institutionId && opp.institutionIds?.includes(userContext.institutionId)) {
        score += 25;
        matchReasons.push('Targeted specifically to your institution/campus');
      }

      // 4. Location / Remote Match
      if (opp.remoteType === RemoteType.REMOTE) {
        score += 15;
        matchReasons.push('Available 100% remote worldwide');
      } else if (userContext.countryCode && opp.countryCode === userContext.countryCode) {
        score += 15;
        matchReasons.push(`Located in your home country (${opp.country})`);
      }

      // 5. Approaching Deadline Boost
      const daysLeft = Math.ceil((new Date(opp.applicationDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      if (daysLeft > 0 && daysLeft <= 14) {
        matchReasons.push(`Application deadline closing in ${daysLeft} days`);
      }

      if (matchReasons.length === 0) {
        matchReasons.push(`Verified ${opp.type.toLowerCase().replace('_', ' ')} with global eligibility`);
      }

      recommendations.push({
        opportunity: opp,
        score,
        matchReasons,
      });
    }

    recommendations.sort((a, b) => b.score - a.score);
    return recommendations.slice(0, 8);
  }

  // ==========================================
  // 4. EMPLOYER OPERATIONS: POST & MANAGE
  // ==========================================

  createOpportunity(payload: Partial<Opportunity>, creatorUserId: string, creatorRole: UserRole): {
    success: boolean;
    opportunity: Opportunity;
  } {
    if (!payload.title || !payload.description || !payload.type || !payload.organizationName) {
      throw new Error('Title, description, opportunity type, and organization name are required.');
    }

    const id = `opp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const organizationId = payload.organizationId || `org-${Date.now()}`;

    // Get or create org
    let org = this.organizations.get(organizationId);
    if (!org) {
      org = {
        id: organizationId,
        name: payload.organizationName,
        logo: payload.organizationLogo || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80',
        description: `${payload.organizationName} employer organization`,
        website: payload.organizationWebsite,
        industry: payload.industry || 'General Industry',
        country: payload.country || 'Global',
        countryCode: payload.countryCode || 'GLOBAL',
        city: payload.city || 'Remote',
        verificationStatus: EmployerVerificationStatus.SUBMITTED,
        createdBy: creatorUserId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.organizations.set(org.id, org);
    }

    const isDirectPublish = creatorRole === UserRole.ADMIN || creatorRole === UserRole.SUPER_ADMIN || org.verificationStatus === EmployerVerificationStatus.VERIFIED;
    const status = isDirectPublish ? ListingStatus.PUBLISHED : ListingStatus.PENDING_REVIEW;

    const opportunity: Opportunity = {
      id,
      organizationId: org.id,
      organizationName: org.name,
      organizationLogo: org.logo,
      organizationWebsite: org.website,
      createdBy: creatorUserId,
      title: payload.title.trim(),
      description: payload.description.trim(),
      type: payload.type,
      industry: payload.industry || 'General Industry',
      location: payload.location || `${payload.city || 'Remote'}, ${payload.country || 'Global'}`,
      country: payload.country || 'Global',
      countryCode: payload.countryCode || 'GLOBAL',
      city: payload.city || 'Remote',
      region: payload.region,
      address: payload.address,
      remoteType: payload.remoteType || RemoteType.ON_SITE,
      remoteCountries: payload.remoteCountries || ['Worldwide'],
      employmentType: payload.employmentType || payload.type,
      salaryMin: payload.salaryMin,
      salaryMax: payload.salaryMax,
      salaryCurrency: payload.salaryCurrency || 'USD',
      salaryPeriod: payload.salaryPeriod || SalaryPeriod.MONTHLY,
      isSalaryDisclosed: Boolean(payload.salaryMin && payload.isSalaryDisclosed !== false),
      applicationDeadline: payload.applicationDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      startDate: payload.startDate,
      duration: payload.duration,
      requirements: payload.requirements && payload.requirements.length > 0 ? payload.requirements : ['Strong dedication and commitment to excellence.'],
      responsibilities: payload.responsibilities && payload.responsibilities.length > 0 ? payload.responsibilities : ['Perform assigned duties to high quality standards.'],
      skills: payload.skills || [],
      courseRequirements: payload.courseRequirements,
      educationRequirements: payload.educationRequirements,
      experienceRequirements: payload.experienceRequirements,
      institutionIds: payload.institutionIds,
      campusIds: payload.campusIds,
      status,
      verificationStatus: org.verificationStatus,
      applicationMethod: payload.applicationMethod || ApplicationMethod.ENERMIND,
      applicationUrl: payload.applicationUrl,
      applicationEmail: payload.applicationEmail,
      promotionTier: PromotionTier.NORMAL,
      viewsCount: 0,
      savesCount: 0,
      applicationsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: status === ListingStatus.PUBLISHED ? new Date().toISOString() : undefined,
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      organization: org.name,
      isRemote: payload.remoteType === RemoteType.REMOTE || payload.remoteType === RemoteType.HYBRID,
      deadlineDate: payload.applicationDeadline,
      stipendOrSalary: payload.salaryMin
        ? `${payload.salaryCurrency || 'USD'} ${payload.salaryMin.toLocaleString()}${payload.salaryMax ? ' - ' + payload.salaryMax.toLocaleString() : ''}/${payload.salaryPeriod?.toLowerCase() || 'mo'}`
        : 'Salary not disclosed',
      isVerified: org.verificationStatus === EmployerVerificationStatus.VERIFIED,
      isExternalLink: payload.applicationMethod === ApplicationMethod.EXTERNAL_URL,
      postedByUserId: creatorUserId,
      createdDate: new Date().toISOString(),
    };

    this.opportunities.set(id, opportunity);

    adminService.logAction({
      actorUserId: creatorUserId,
      actorEmail: 'employer@enermind.org',
      actorRole: creatorRole,
      action: 'OPPORTUNITY_CREATED',
      targetType: 'OPPORTUNITY',
      targetId: id,
      details: `Opportunity "${opportunity.title}" posted by ${org.name}. Status: ${opportunity.status}`,
    });

    return { success: true, opportunity };
  }

  updateOpportunity(id: string, editorUserId: string, updates: Partial<Opportunity>, isStaff: boolean = false): Opportunity {
    const opp = this.opportunities.get(id);
    if (!opp) {
      throw new Error('Opportunity not found.');
    }

    if (!isStaff && opp.createdBy !== editorUserId) {
      throw new Error('Unauthorized to edit this opportunity.');
    }

    const updated: Opportunity = {
      ...opp,
      ...updates,
      id: opp.id,
      createdBy: opp.createdBy,
      organizationId: opp.organizationId,
      updatedAt: new Date().toISOString(),
    };

    this.opportunities.set(id, updated);
    return updated;
  }

  changeOpportunityStatus(id: string, userId: string, action: 'PAUSE' | 'RESUME' | 'CLOSE' | 'ARCHIVE', isStaff: boolean = false): Opportunity {
    const opp = this.opportunities.get(id);
    if (!opp) {
      throw new Error('Opportunity not found.');
    }

    if (!isStaff && opp.createdBy !== userId) {
      throw new Error('Unauthorized: Only the creator can alter listing status.');
    }

    if (action === 'PAUSE') opp.status = ListingStatus.PAUSED;
    if (action === 'RESUME') opp.status = ListingStatus.PUBLISHED;
    if (action === 'CLOSE') opp.status = ListingStatus.FULL;
    if (action === 'ARCHIVE') opp.status = ListingStatus.ARCHIVED;

    opp.updatedAt = new Date().toISOString();
    this.opportunities.set(id, opp);
    return opp;
  }

  // ==========================================
  // 5. APPLICATIONS ENGINE (ENERMIND)
  // ==========================================

  applyToOpportunity(payload: {
    opportunityId: string;
    applicantId: string;
    applicantName: string;
    applicantEmail: string;
    applicantPhone?: string;
    resumeFileId?: string;
    resumeFileName?: string;
    resumeDriveLink?: string;
    coverLetter?: string;
    answers?: Record<string, string>;
  }): OpportunityApplication {
    const opp = this.opportunities.get(payload.opportunityId);
    if (!opp) {
      throw new Error('Opportunity not found.');
    }

    if (opp.status !== ListingStatus.PUBLISHED) {
      throw new Error('This opportunity is not currently accepting applications.');
    }

    // Check duplicate
    const existing = Array.from(this.applications.values()).find(
      (a) => a.opportunityId === payload.opportunityId && a.applicantId === payload.applicantId && a.status !== ApplicationStatus.WITHDRAWN
    );
    if (existing) {
      throw new Error('You have already submitted an active application for this opportunity.');
    }

    const id = `app-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const application: OpportunityApplication = {
      id,
      opportunityId: opp.id,
      opportunityTitle: opp.title,
      organizationName: opp.organizationName,
      applicantId: payload.applicantId,
      applicantName: payload.applicantName,
      applicantEmail: payload.applicantEmail,
      applicantPhone: payload.applicantPhone,
      status: ApplicationStatus.SUBMITTED,
      resumeFileId: payload.resumeFileId,
      resumeFileName: payload.resumeFileName || 'Student_CV.pdf',
      resumeDriveLink: payload.resumeDriveLink,
      coverLetter: payload.coverLetter,
      answers: payload.answers,
      appliedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.applications.set(id, application);

    // Increment application count on opportunity
    opp.applicationsCount = (opp.applicationsCount || 0) + 1;
    this.opportunities.set(opp.id, opp);

    adminService.logAction({
      actorUserId: payload.applicantId,
      actorEmail: payload.applicantEmail,
      actorRole: UserRole.STUDENT,
      action: 'APPLICATION_SUBMITTED',
      targetType: 'OPPORTUNITY_APPLICATION',
      targetId: id,
      details: `Application submitted for "${opp.title}" at ${opp.organizationName}`,
    });

    return application;
  }

  getStudentApplications(studentId: string): OpportunityApplication[] {
    return Array.from(this.applications.values())
      .filter((a) => a.applicantId === studentId)
      .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
  }

  getEmployerApplications(userId: string, isStaff: boolean = false): OpportunityApplication[] {
    const userOpps = Array.from(this.opportunities.values())
      .filter((o) => isStaff || o.createdBy === userId)
      .map((o) => o.id);

    return Array.from(this.applications.values())
      .filter((a) => userOpps.includes(a.opportunityId))
      .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
  }

  updateApplicationStatus(
    applicationId: string,
    editorUserId: string,
    newStatus: ApplicationStatus,
    employerNotes?: string,
    isStaff: boolean = false
  ): OpportunityApplication {
    const app = this.applications.get(applicationId);
    if (!app) {
      throw new Error('Application record not found.');
    }

    const opp = this.opportunities.get(app.opportunityId);
    if (!isStaff && opp?.createdBy !== editorUserId) {
      throw new Error('Unauthorized to manage applications for this organization.');
    }

    app.status = newStatus;
    if (employerNotes) app.employerNotes = employerNotes;
    app.updatedAt = new Date().toISOString();

    this.applications.set(applicationId, app);
    return app;
  }

  withdrawApplication(applicationId: string, studentId: string): boolean {
    const app = this.applications.get(applicationId);
    if (!app || app.applicantId !== studentId) {
      throw new Error('Unauthorized or application not found.');
    }

    app.status = ApplicationStatus.WITHDRAWN;
    app.updatedAt = new Date().toISOString();
    this.applications.set(applicationId, app);
    return true;
  }

  // ==========================================
  // 6. SAVED / BOOKMARKED OPPORTUNITIES
  // ==========================================

  toggleSaveOpportunity(userId: string, opportunityId: string): { isSaved: boolean; count: number } {
    const key = `${userId}_${opportunityId}`;
    const opp = this.opportunities.get(opportunityId);
    if (!opp) throw new Error('Opportunity not found.');

    if (this.savedOpportunities.has(key)) {
      this.savedOpportunities.delete(key);
      opp.savesCount = Math.max(0, (opp.savesCount || 0) - 1);
      this.opportunities.set(opportunityId, opp);
      return { isSaved: false, count: opp.savesCount };
    } else {
      this.savedOpportunities.set(key, {
        id: `save-${Date.now()}`,
        userId,
        opportunityId,
        createdAt: new Date().toISOString(),
      });
      opp.savesCount = (opp.savesCount || 0) + 1;
      this.opportunities.set(opportunityId, opp);
      return { isSaved: true, count: opp.savesCount };
    }
  }

  getUserSavedOpportunities(userId: string): Opportunity[] {
    const oppIds = Array.from(this.savedOpportunities.values())
      .filter((s) => s.userId === userId)
      .map((s) => s.opportunityId);

    return oppIds
      .map((id) => this.opportunities.get(id))
      .filter((o): o is Opportunity => o !== undefined);
  }

  // ==========================================
  // 7. CAREER PROFILE & RESUME
  // ==========================================

  getCareerProfile(userId: string): CareerProfile {
    let profile = this.careerProfiles.get(userId);
    if (!profile) {
      profile = {
        userId,
        education: [],
        skills: [],
        experience: [],
        projects: [],
        certifications: [],
        languages: [],
        isPublic: false,
        updatedAt: new Date().toISOString(),
      };
      this.careerProfiles.set(userId, profile);
    }
    return profile;
  }

  saveCareerProfile(userId: string, profileData: Partial<CareerProfile>): CareerProfile {
    const existing = this.getCareerProfile(userId);
    const updated: CareerProfile = {
      ...existing,
      ...profileData,
      userId,
      updatedAt: new Date().toISOString(),
    };

    this.careerProfiles.set(userId, updated);
    return updated;
  }

  // ==========================================
  // 8. SKILLS CATALOG
  // ==========================================

  getSkills(): Skill[] {
    return Array.from(this.skills.values());
  }

  // ==========================================
  // 9. ORGANIZATIONS & EMPLOYER PROFILES
  // ==========================================

  getOrganizations(): Organization[] {
    return Array.from(this.organizations.values());
  }

  getOrganizationById(id: string): Organization | null {
    return this.organizations.get(id) || null;
  }

  createOrUpdateOrganization(payload: Partial<Organization>, userId: string): Organization {
    const id = payload.id || `org-${Date.now()}`;
    const existing = this.organizations.get(id);

    const org: Organization = {
      id,
      name: payload.name || existing?.name || 'New Organization',
      logo: payload.logo || existing?.logo,
      description: payload.description || existing?.description || '',
      website: payload.website || existing?.website,
      industry: payload.industry || existing?.industry || 'General',
      country: payload.country || existing?.country || 'Global',
      countryCode: payload.countryCode || existing?.countryCode || 'GLOBAL',
      city: payload.city || existing?.city || 'Remote',
      verificationStatus: existing?.verificationStatus || EmployerVerificationStatus.UNVERIFIED,
      verificationDocuments: payload.verificationDocuments || existing?.verificationDocuments,
      createdBy: existing?.createdBy || userId,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.organizations.set(id, org);
    return org;
  }

  submitEmployerVerification(organizationId: string, userId: string, documents: any[]): Organization {
    const org = this.organizations.get(organizationId);
    if (!org) throw new Error('Organization not found.');

    org.verificationStatus = EmployerVerificationStatus.UNDER_REVIEW;
    org.verificationDocuments = documents;
    org.updatedAt = new Date().toISOString();
    this.organizations.set(organizationId, org);

    adminService.logAction({
      actorUserId: userId,
      actorEmail: 'employer@enermind.org',
      actorRole: UserRole.EMPLOYER,
      action: 'EMPLOYER_VERIFICATION_SUBMITTED',
      targetType: 'ORGANIZATION',
      targetId: organizationId,
      details: `Employer verification submitted for ${org.name} with ${documents.length} documents.`,
    });

    return org;
  }

  // ==========================================
  // 10. FRAUD & SCAM REPORTING
  // ==========================================

  reportOpportunity(payload: {
    opportunityId: string;
    reportedByUserId: string;
    reporterEmail?: string;
    reason: any;
    details: string;
  }): OpportunityReport {
    const opp = this.opportunities.get(payload.opportunityId);
    if (!opp) throw new Error('Opportunity not found.');

    const reportId = `rep-opp-${Date.now()}`;
    const report: OpportunityReport = {
      id: reportId,
      opportunityId: opp.id,
      opportunityTitle: opp.title,
      organizationName: opp.organizationName,
      reportedByUserId: payload.reportedByUserId,
      reporterEmail: payload.reporterEmail,
      reason: payload.reason,
      details: payload.details,
      status: ReportStatus.PENDING,
      createdAt: new Date().toISOString(),
    };

    this.reports.set(reportId, report);

    adminService.logAction({
      actorUserId: payload.reportedByUserId,
      actorEmail: payload.reporterEmail || 'student@enermind.org',
      actorRole: UserRole.STUDENT,
      action: 'OPPORTUNITY_REPORTED',
      targetType: 'OPPORTUNITY',
      targetId: opp.id,
      details: `Report for "${opp.title}" [${payload.reason}]: ${payload.details}`,
    });

    return report;
  }

  getReports(status?: ReportStatus): OpportunityReport[] {
    const list = Array.from(this.reports.values());
    if (status) return list.filter((r) => r.status === status);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  actionReport(reportId: string, action: 'DISMISS' | 'SUSPEND_LISTING' | 'ACTIONED', moderatorUserId: string, notes?: string): OpportunityReport {
    const report = this.reports.get(reportId);
    if (!report) throw new Error('Report not found.');

    if (action === 'DISMISS') {
      report.status = ReportStatus.DISMISSED;
    } else {
      report.status = ReportStatus.ACTIONED;
      if (action === 'SUSPEND_LISTING') {
        const opp = this.opportunities.get(report.opportunityId);
        if (opp) {
          opp.status = ListingStatus.REJECTED;
          this.opportunities.set(opp.id, opp);
        }
      }
    }

    report.moderatorNotes = notes;
    report.actionedAt = new Date().toISOString();
    this.reports.set(reportId, report);
    return report;
  }

  // ==========================================
  // 11. ADMIN MODERATION & VERIFICATION
  // ==========================================

  getPendingModerationOpportunities(): Opportunity[] {
    return Array.from(this.opportunities.values()).filter(
      (o) => o.status === ListingStatus.PENDING_REVIEW || o.status === ListingStatus.DRAFT
    );
  }

  reviewOpportunityListing(payload: {
    opportunityId: string;
    action: 'APPROVE' | 'REJECT' | 'SUSPEND' | 'RESTORE';
    reviewerUserId: string;
    moderatorNotes?: string;
  }): Opportunity {
    const opp = this.opportunities.get(payload.opportunityId);
    if (!opp) throw new Error('Opportunity not found.');

    if (payload.action === 'APPROVE') {
      opp.status = ListingStatus.PUBLISHED;
      opp.publishedAt = new Date().toISOString();
    } else if (payload.action === 'REJECT') {
      opp.status = ListingStatus.REJECTED;
    } else if (payload.action === 'SUSPEND') {
      opp.status = ListingStatus.REJECTED;
    } else if (payload.action === 'RESTORE') {
      opp.status = ListingStatus.PUBLISHED;
    }

    opp.updatedAt = new Date().toISOString();
    this.opportunities.set(opp.id, opp);

    adminService.logAction({
      actorUserId: payload.reviewerUserId,
      actorEmail: 'admin@enermind.org',
      actorRole: UserRole.ADMIN,
      action: 'OPPORTUNITY_MODERATED',
      targetType: 'OPPORTUNITY',
      targetId: opp.id,
      details: `Opportunity "${opp.title}" moderated: ${payload.action}. Notes: ${payload.moderatorNotes || 'None'}`,
    });

    return opp;
  }

  getPendingEmployerVerifications(): Organization[] {
    return Array.from(this.organizations.values()).filter(
      (org) => org.verificationStatus === EmployerVerificationStatus.UNDER_REVIEW || org.verificationStatus === EmployerVerificationStatus.SUBMITTED
    );
  }

  verifyEmployer(payload: {
    organizationId: string;
    decision: 'APPROVE' | 'REJECT' | 'SUSPEND';
    reviewerUserId: string;
    notes?: string;
  }): Organization {
    const org = this.organizations.get(payload.organizationId);
    if (!org) throw new Error('Organization not found.');

    if (payload.decision === 'APPROVE') {
      org.verificationStatus = EmployerVerificationStatus.VERIFIED;
      // Sync verification to opportunities
      for (const opp of this.opportunities.values()) {
        if (opp.organizationId === org.id) {
          opp.verificationStatus = EmployerVerificationStatus.VERIFIED;
          opp.isVerified = true;
          this.opportunities.set(opp.id, opp);
        }
      }
    } else if (payload.decision === 'REJECT') {
      org.verificationStatus = EmployerVerificationStatus.REJECTED;
    } else if (payload.decision === 'SUSPEND') {
      org.verificationStatus = EmployerVerificationStatus.SUSPENDED;
    }

    org.updatedAt = new Date().toISOString();
    this.organizations.set(org.id, org);

    adminService.logAction({
      actorUserId: payload.reviewerUserId,
      actorEmail: 'admin@enermind.org',
      actorRole: UserRole.ADMIN,
      action: 'EMPLOYER_VERIFIED',
      targetType: 'ORGANIZATION',
      targetId: org.id,
      details: `Employer "${org.name}" verification decision: ${payload.decision}. Notes: ${payload.notes || 'None'}`,
    });

    return org;
  }

  // ==========================================
  // 12. EMPLOYER MONETIZATION & PROMOTION
  // ==========================================

  promoteOpportunity(opportunityId: string, userId: string, tier: PromotionTier): Opportunity {
    const opp = this.opportunities.get(opportunityId);
    if (!opp) throw new Error('Opportunity not found.');

    opp.promotionTier = tier;
    opp.isPromoted = tier !== PromotionTier.NORMAL;
    opp.updatedAt = new Date().toISOString();
    this.opportunities.set(opportunityId, opp);

    adminService.logAction({
      actorUserId: userId,
      actorEmail: 'employer@enermind.org',
      actorRole: UserRole.EMPLOYER,
      action: 'PROMOTION_ACTIVATED',
      targetType: 'OPPORTUNITY',
      targetId: opportunityId,
      details: `Opportunity "${opp.title}" promoted to tier ${tier}`,
    });

    return opp;
  }
}

export const opportunitiesService = new OpportunitiesService();

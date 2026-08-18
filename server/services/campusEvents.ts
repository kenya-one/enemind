/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AcademicDeadline,
  AcademicDeadlineType,
  CampusAnnouncement,
  CampusEvent,
  CampusEventCategory,
  CampusEventType,
  CampusLocation,
  Club,
  ClubCategory,
  DeadlinePriority,
  DeadlineSource,
  EventRegistration,
  EventReport,
  EventStatus,
  EventVerificationStatus,
  EventVisibility,
  ExamEvent,
  ExamType,
  PersonalDeadline,
  SavedEvent,
  UserRole,
} from '../../src/types/index.js';
import { adminService } from './admin.js';
import { googleDriveService } from './drive.js';

export class CampusEventsService {
  private events: CampusEvent[] = [];
  private registrations: EventRegistration[] = [];
  private savedEvents: SavedEvent[] = [];
  private academicDeadlines: AcademicDeadline[] = [];
  private personalDeadlines: PersonalDeadline[] = [];
  private exams: ExamEvent[] = [];
  private announcements: CampusAnnouncement[] = [];
  private clubs: Club[] = [];
  private locations: CampusLocation[] = [];
  private reports: EventReport[] = [];
  private clubFollowers: Array<{ userId: string; clubId: string; followedAt: string }> = [];

  constructor() {
    this.seedInitialData();
  }

  // =========================================================================
  // 1. SEED DATA (Real-world global universities, deadlines, events, exams)
  // =========================================================================

  private seedInitialData() {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const addDays = (d: number, hour = 9, min = 0) => {
      const target = new Date(now.getTime() + d * 86400000);
      target.setHours(hour, min, 0, 0);
      return target.toISOString();
    };

    // --- 1. Campus Locations ---
    this.locations = [
      {
        id: 'loc-uon-taifa',
        institutionId: 'inst-uon-ke',
        campusId: 'campus-uon-main',
        campusName: 'Main Campus',
        name: 'Taifa Hall',
        building: 'Main Administration Complex',
        floor: 'Ground Floor',
        category: 'AUDITORIUM',
        capacity: 1200,
        description: 'Historic central auditorium for academic convocations, public lectures, and symposiums.',
        facilities: ['Stage AV & Microphones', 'Live Stream Feed', 'Projector Screens', 'Wheelchair Accessible'],
      },
      {
        id: 'loc-uon-844',
        institutionId: 'inst-uon-ke',
        campusId: 'campus-uon-main',
        campusName: 'Main Campus',
        name: '8-4-4 Multi-Purpose Lecture Theatre',
        building: '8-4-4 Building',
        room: 'LT-1',
        category: 'LECTURE_HALL',
        capacity: 450,
        description: 'Large tier lecture hall for university common units and examinations.',
        facilities: ['Dual HD Projectors', 'PA Audio System', 'Air Conditioning'],
      },
      {
        id: 'loc-uon-chiromo-lab',
        institutionId: 'inst-uon-ke',
        campusId: 'campus-uon-chiromo',
        campusName: 'Chiromo Science Campus',
        name: 'Computing Science Lab 3',
        building: 'School of Computing & Informatics',
        room: 'SCI Lab 302',
        category: 'LABORATORY',
        capacity: 80,
        description: 'High-performance computing laboratory with dual-boot Linux/Windows workstations.',
        facilities: ['Gigabit LAN', 'Backup Inverter', 'Smart Board'],
      },
      {
        id: 'loc-oxford-sheldonian',
        institutionId: 'inst-oxford-gb',
        campusId: 'campus-oxford-central',
        campusName: 'Central Oxford',
        name: 'Sheldonian Theatre',
        building: 'Broad Street',
        category: 'AUDITORIUM',
        capacity: 1000,
        description: 'Ceremonial hall for University of Oxford degree ceremonies and public lectures.',
      },
      {
        id: 'loc-harvard-sanders',
        institutionId: 'inst-harvard-us',
        campusId: 'campus-harvard-cambridge',
        campusName: 'Cambridge Main Campus',
        name: 'Sanders Theatre',
        building: 'Memorial Hall',
        category: 'AUDITORIUM',
        capacity: 1166,
        description: 'Historic high-capacity hall for guest lectures and academic ceremonies.',
      },
    ];

    // --- 2. Clubs & Student Organizations ---
    this.clubs = [
      {
        id: 'club-gdsc-uon',
        institutionId: 'inst-uon-ke',
        institutionName: 'University of Nairobi',
        campusId: 'campus-uon-chiromo',
        campusName: 'Chiromo Science Campus',
        name: 'Google Developer Student Clubs (GDSC UoN)',
        acronym: 'GDSC UoN',
        description: 'University-based community group for students interested in Google developer technologies, open-source AI, mobile and cloud development.',
        category: 'TECHNOLOGY',
        logoUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=200&auto=format&fit=crop&q=80',
        coverImageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
        leaderName: 'Brian Mutua',
        leaderContact: '+254 712 345 678',
        leaderEmail: 'gdsc@uonbi.ac.ke',
        membershipFee: 0,
        currency: 'KES',
        registrationUrl: 'https://gdsc.community.dev/university-of-nairobi/',
        socialLinks: {
          twitter: 'https://twitter.com/gdsc_uon',
          github: 'https://github.com/gdsc-uon',
        },
        verificationStatus: 'VERIFIED',
        isOfficial: true,
        followersCount: 430,
        membersCount: 285,
        eventsCount: 8,
        createdBy: 'usr-lead-student',
        createdAt: new Date(now.getTime() - 90 * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'club-uon-ieee',
        institutionId: 'inst-uon-ke',
        institutionName: 'University of Nairobi',
        campusId: 'campus-uon-main',
        campusName: 'Main Campus',
        name: 'IEEE Student Branch UoN',
        acronym: 'IEEE UoN',
        description: 'Advancing technological innovation and excellence for the benefit of humanity across electrical, electronic, and software disciplines.',
        category: 'TECHNOLOGY',
        logoUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=200&auto=format&fit=crop&q=80',
        leaderName: 'Faith Chebet',
        leaderEmail: 'ieee@uonbi.ac.ke',
        verificationStatus: 'VERIFIED',
        isOfficial: true,
        followersCount: 310,
        membersCount: 160,
        eventsCount: 5,
        createdBy: 'usr-ieee-chair',
        createdAt: new Date(now.getTime() - 120 * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'club-rotaract-uon',
        institutionId: 'inst-uon-ke',
        institutionName: 'University of Nairobi',
        campusId: 'campus-uon-main',
        campusName: 'Main Campus',
        name: 'Rotaract Club of Nairobi Central',
        acronym: 'Rotaract',
        description: 'Community service, leadership development, professional networking, and global youth humanitarian outreach.',
        category: 'SOCIAL_COMMUNITY',
        logoUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=200&auto=format&fit=crop&q=80',
        leaderName: 'Kelvin Omwamba',
        leaderEmail: 'rotaract@uonbi.ac.ke',
        verificationStatus: 'VERIFIED',
        isOfficial: true,
        followersCount: 520,
        membersCount: 310,
        eventsCount: 12,
        createdBy: 'usr-rotaract-pres',
        createdAt: new Date(now.getTime() - 180 * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'club-oxford-fintech',
        institutionId: 'inst-oxford-gb',
        institutionName: 'University of Oxford',
        campusId: 'campus-oxford-central',
        campusName: 'Central Oxford',
        name: 'Oxford FinTech & AI Society',
        description: 'Premier student society for exploring machine learning in quantitative finance, blockchain architectures, and digital banking.',
        category: 'BUSINESS_ENTREPRENEURSHIP',
        leaderName: 'Alexander Hayes',
        verificationStatus: 'VERIFIED',
        isOfficial: true,
        followersCount: 680,
        membersCount: 420,
        eventsCount: 14,
        createdBy: 'usr-oxford-rep',
        createdAt: new Date(now.getTime() - 200 * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // --- 3. Campus Announcements ---
    this.announcements = [
      {
        id: 'ann-sem-reg-2026',
        authorId: 'usr-academic-registrar',
        authorName: 'Office of the Academic Registrar',
        authorRole: 'University Registrar',
        institutionId: 'inst-uon-ke',
        institutionName: 'University of Nairobi',
        campusId: 'campus-uon-main',
        campusName: 'Main Campus',
        title: 'Semester 2 Unit Registration & Fee Clearance Deadline',
        content: 'All undergraduate and postgraduate students must complete unit registration and clear at least 50% tuition fees by Friday 5:00 PM to access exam registration portals.',
        priority: 'URGENT',
        isOfficial: true,
        source: 'Office of Academic Registrar',
        actionUrl: 'https://smis.uonbi.ac.ke',
        actionLabel: 'Open SMIS Portal',
        publishedAt: addDays(-2),
        expiresAt: addDays(12),
        status: 'ACTIVE',
      },
      {
        id: 'ann-career-expo-2026',
        authorId: 'usr-career-office',
        authorName: 'Directorate of Career Services',
        authorRole: 'Career Director',
        institutionId: 'inst-uon-ke',
        institutionName: 'University of Nairobi',
        campusId: 'campus-uon-main',
        campusName: 'Main Campus',
        title: 'Annual Global Tech & Corporate Career Expo 2026',
        content: 'Over 60 top multinationals, banks, and software engineering firms are hosting on-campus interviews and internship hiring drives at Taifa Hall next Wednesday.',
        priority: 'IMPORTANT',
        isOfficial: true,
        source: 'Career Services',
        actionUrl: '#events',
        actionLabel: 'View Schedule',
        publishedAt: addDays(-1),
        expiresAt: addDays(7),
        status: 'ACTIVE',
      },
      {
        id: 'ann-lib-extended',
        authorId: 'usr-library-admin',
        authorName: 'JKML University Library',
        authorRole: 'Chief Librarian',
        institutionId: 'inst-uon-ke',
        institutionName: 'University of Nairobi',
        campusId: 'campus-uon-main',
        title: '24-Hour Library Service & Quiet Study Zones Open for Revision',
        content: 'Jomo Kenyatta Memorial Library is operating on a 24-hour schedule starting this Monday through the end of final examinations.',
        priority: 'NORMAL',
        isOfficial: true,
        source: 'JKML Administration',
        publishedAt: addDays(-3),
        expiresAt: addDays(25),
        status: 'ACTIVE',
      },
    ];

    // --- 4. Academic Deadlines ---
    this.academicDeadlines = [
      {
        id: 'dl-unit-reg-close',
        institutionId: 'inst-uon-ke',
        institutionName: 'University of Nairobi',
        campusId: 'campus-uon-main',
        campusName: 'Main Campus',
        title: 'Online Course / Unit Registration Closes',
        description: 'Final date to add or drop semester units on the student portal without incurring administrative late penalties.',
        deadline: addDays(3, 17, 0),
        timezone: 'Africa/Nairobi',
        type: 'REGISTRATION',
        source: 'UNIVERSITY',
        sourceDisplayName: 'Academic Registrar',
        isOfficial: true,
        priority: 'URGENT',
        status: 'ACTIVE',
        createdAt: addDays(-10),
        updatedAt: addDays(-1),
      },
      {
        id: 'dl-tuition-first-inst',
        institutionId: 'inst-uon-ke',
        institutionName: 'University of Nairobi',
        campusId: 'campus-uon-main',
        title: 'Semester Tuition Fee First Installment Deadline (50%)',
        description: 'Mandatory minimum tuition fee payment required for nominal roll validation and continuous assessment participation.',
        deadline: addDays(5, 23, 59),
        timezone: 'Africa/Nairobi',
        type: 'TUITION',
        source: 'UNIVERSITY',
        sourceDisplayName: 'Finance Directorate',
        isOfficial: true,
        priority: 'HIGH',
        status: 'ACTIVE',
        createdAt: addDays(-14),
        updatedAt: addDays(-2),
      },
      {
        id: 'dl-csc301-assignment-2',
        institutionId: 'inst-uon-ke',
        institutionName: 'University of Nairobi',
        campusId: 'campus-uon-chiromo',
        campusName: 'Chiromo Science Campus',
        departmentId: 'dept-sci',
        departmentName: 'School of Computing & Informatics',
        courseId: 'course-csc301',
        courseCode: 'CSC 301',
        courseName: 'Database Management Systems',
        title: 'CSC 301: Distributed Database Architecture Project Submission',
        description: 'Submit GitHub repository link and PDF design document covering 3-node replication and ACID transaction benchmarks.',
        deadline: addDays(4, 23, 59),
        timezone: 'Africa/Nairobi',
        type: 'ASSIGNMENT',
        source: 'LECTURER',
        sourceDisplayName: 'Dr. O. Nyagah (Lecturer)',
        isOfficial: true,
        priority: 'HIGH',
        status: 'ACTIVE',
        createdAt: addDays(-7),
        updatedAt: addDays(-1),
      },
      {
        id: 'dl-csc305-midterm-cat',
        institutionId: 'inst-uon-ke',
        institutionName: 'University of Nairobi',
        campusId: 'campus-uon-chiromo',
        campusName: 'Chiromo Science Campus',
        courseId: 'course-csc305',
        courseCode: 'CSC 305',
        courseName: 'Operating Systems & Concurrency',
        title: 'CSC 305: Continuous Assessment Test (CAT 1)',
        description: 'In-person closed-book assessment on CPU scheduling algorithms, virtual memory paging, and deadlock avoidance.',
        deadline: addDays(6, 10, 0),
        timezone: 'Africa/Nairobi',
        type: 'EXAM',
        source: 'DEPARTMENT',
        sourceDisplayName: 'Dept. of Computer Science',
        isOfficial: true,
        priority: 'HIGH',
        status: 'ACTIVE',
        createdAt: addDays(-10),
        updatedAt: addDays(-2),
      },
      {
        id: 'dl-schol-hef-2026',
        institutionId: 'inst-uon-ke',
        institutionName: 'University of Nairobi',
        title: 'Higher Education Funding (HEF) & Bursary Appeal Submission',
        description: 'Submission portal closes for students seeking band revision and emergency university relief funds.',
        deadline: addDays(11, 18, 0),
        timezone: 'Africa/Nairobi',
        type: 'SCHOLARSHIP',
        source: 'UNIVERSITY',
        sourceDisplayName: 'Dean of Students',
        isOfficial: true,
        priority: 'MEDIUM',
        status: 'ACTIVE',
        createdAt: addDays(-20),
        updatedAt: addDays(-3),
      },
      {
        id: 'dl-oxford-thesis-draft',
        institutionId: 'inst-oxford-gb',
        institutionName: 'University of Oxford',
        title: 'Honours Thesis First Draft Submission',
        description: 'Deliver chapter 1-3 draft to faculty academic advisor.',
        deadline: addDays(8, 16, 0),
        timezone: 'Europe/London',
        type: 'PROJECT',
        source: 'DEPARTMENT',
        sourceDisplayName: 'Faculty of Computer Science',
        isOfficial: true,
        priority: 'HIGH',
        status: 'ACTIVE',
        createdAt: addDays(-30),
        updatedAt: addDays(-5),
      },
    ];

    // --- 5. Exam Timetable ---
    this.exams = [
      {
        id: 'exam-csc301-main',
        institutionId: 'inst-uon-ke',
        institutionName: 'University of Nairobi',
        campusId: 'campus-uon-chiromo',
        campusName: 'Chiromo Science Campus',
        departmentId: 'dept-sci',
        departmentName: 'School of Computing & Informatics',
        courseId: 'course-csc301',
        courseCode: 'CSC 301',
        courseName: 'Database Management Systems',
        academicYear: '2025/2026',
        semester: 'Semester 2',
        examType: 'FINAL',
        dateTime: addDays(14, 9, 0),
        endDateTime: addDays(14, 12, 0),
        timezone: 'Africa/Nairobi',
        venue: 'Chiromo Physical Sciences Block',
        room: 'Hall B (Rooms 201-205)',
        building: 'SCI Complex',
        seatNumber: 'Assigned on arrival by Registration Number',
        durationMinutes: 180,
        instructions: [
          'Arrive at least 30 minutes before 9:00 AM start time.',
          'Bring valid Student ID card and printed Exam Clearance Card.',
          'No programmable calculators or cellular devices permitted in examination hall.',
        ],
        examinerName: 'Dr. O. Nyagah / Prof. E. Omwenga',
        source: 'UNIVERSITY',
        isOfficial: true,
        status: 'SCHEDULED',
        createdAt: addDays(-14),
        updatedAt: addDays(-2),
      },
      {
        id: 'exam-csc305-main',
        institutionId: 'inst-uon-ke',
        institutionName: 'University of Nairobi',
        campusId: 'campus-uon-main',
        campusName: 'Main Campus',
        courseCode: 'CSC 305',
        courseName: 'Operating Systems & Concurrency',
        academicYear: '2025/2026',
        semester: 'Semester 2',
        examType: 'FINAL',
        dateTime: addDays(17, 14, 0),
        endDateTime: addDays(17, 17, 0),
        timezone: 'Africa/Nairobi',
        venue: '8-4-4 Multi-Purpose Building',
        room: 'LT-1 & LT-2',
        durationMinutes: 180,
        instructions: [
          'Closed-book 3-hour theoretical & architectural assessment.',
          'Non-programmable scientific calculators permitted.',
        ],
        examinerName: 'Prof. K. Mutahi',
        source: 'UNIVERSITY',
        isOfficial: true,
        status: 'SCHEDULED',
        createdAt: addDays(-14),
        updatedAt: addDays(-2),
      },
      {
        id: 'exam-mat201-main',
        institutionId: 'inst-uon-ke',
        institutionName: 'University of Nairobi',
        campusId: 'campus-uon-chiromo',
        campusName: 'Chiromo Science Campus',
        courseCode: 'MAT 201',
        courseName: 'Linear Algebra II & Matrix Theory',
        academicYear: '2025/2026',
        semester: 'Semester 2',
        examType: 'FINAL',
        dateTime: addDays(20, 9, 0),
        endDateTime: addDays(20, 11, 30),
        timezone: 'Africa/Nairobi',
        venue: 'Biological Sciences Block',
        room: 'LH 003',
        durationMinutes: 150,
        instructions: [
          'Mathematical formula tables provided in booklet.',
        ],
        examinerName: 'Dr. W. Gikonyo',
        source: 'UNIVERSITY',
        isOfficial: true,
        status: 'SCHEDULED',
        createdAt: addDays(-14),
        updatedAt: addDays(-2),
      },
      {
        id: 'exam-oxford-cs101',
        institutionId: 'inst-oxford-gb',
        institutionName: 'University of Oxford',
        campusId: 'campus-oxford-central',
        campusName: 'Central Oxford',
        courseCode: 'CS 101',
        courseName: 'Algorithms & Data Structures',
        examType: 'FINAL',
        dateTime: addDays(18, 10, 0),
        endDateTime: addDays(18, 13, 0),
        timezone: 'Europe/London',
        venue: 'Examination Schools',
        room: 'South School',
        durationMinutes: 180,
        source: 'UNIVERSITY',
        isOfficial: true,
        status: 'SCHEDULED',
        createdAt: addDays(-20),
        updatedAt: addDays(-3),
      },
    ];

    // --- 6. Campus Events ---
    this.events = [
      {
        id: 'evt-gdsc-ai-hackathon',
        createdBy: 'usr-lead-student',
        creatorRole: 'Club Lead',
        creatorName: 'Brian Mutua',
        clubId: 'club-gdsc-uon',
        clubName: 'Google Developer Student Clubs (GDSC UoN)',
        institutionId: 'inst-uon-ke',
        institutionName: 'University of Nairobi',
        campusId: 'campus-uon-chiromo',
        campusName: 'Chiromo Science Campus',
        departmentId: 'dept-sci',
        departmentName: 'School of Computing & Informatics',
        title: 'Inter-University Gemini AI & Cloud Hackathon 2026',
        description: 'A 48-hour build sprint empowering student developers to build high-impact multi-modal AI applications addressing health, education, and climate challenges using Google Cloud & Gemini models.',
        type: 'WORKSHOP',
        category: 'TECH_HACKATHON',
        startDateTime: addDays(2, 9, 0),
        endDateTime: addDays(3, 18, 0),
        timezone: 'Africa/Nairobi',
        location: 'Chiromo Science Campus, SCI Labs & Virtual Stream',
        locationType: 'HYBRID',
        venueName: 'Computing Science Complex',
        building: 'School of Computing',
        room: 'Lab 1 & 2 + Online Discord',
        onlineUrl: 'https://meet.google.com/enermind-gdsc-hack',
        organizerName: 'GDSC UoN & Enermind Developer Network',
        organizerContact: '+254 712 345 678',
        organizerEmail: 'gdsc@uonbi.ac.ke',
        organizerRole: 'Campus Technology Organization',
        coverImageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80',
        capacity: 150,
        registeredCount: 118,
        waitlistCount: 0,
        registrationRequired: true,
        registrationDeadline: addDays(1, 23, 59),
        registrationUrl: 'https://gdsc.community.dev/events/details/developer-hackathon-2026/',
        targetAudience: ['All Computer Science, Engineering, Math and Tech students across institutions.'],
        visibility: 'GLOBAL',
        status: 'PUBLISHED',
        verificationStatus: 'CLUB_VERIFIED',
        isOfficial: true,
        isPromoted: true,
        tags: ['AI', 'Gemini', 'Hackathon', 'Google Cloud', 'Prizes'],
        materials: [
          { name: 'Hackathon Problem Statements & API Keys Guide.pdf', url: 'https://drive.google.com/sample-hackathon-guide' },
          { name: 'Gemini 3.7 Flash Starter Template.zip' },
        ],
        viewsCount: 1420,
        savesCount: 88,
        createdAt: addDays(-12),
        updatedAt: addDays(-1),
        publishedAt: addDays(-12),
      },
      {
        id: 'evt-career-fair-2026',
        createdBy: 'usr-career-office',
        creatorRole: 'Institutional Admin',
        creatorName: 'Directorate of Career Services',
        institutionId: 'inst-uon-ke',
        institutionName: 'University of Nairobi',
        campusId: 'campus-uon-main',
        campusName: 'Main Campus',
        title: 'University Annual Career & Internship Fair 2026',
        description: 'Connect directly with hiring executives from Google, Microsoft, Safaricom, Equity Group, PwC, KPMG, and 45+ leading employers offering graduate traineeships and student internships.',
        type: 'CAREER_EVENT',
        category: 'CAREER',
        startDateTime: addDays(4, 9, 0),
        endDateTime: addDays(4, 16, 30),
        timezone: 'Africa/Nairobi',
        location: 'Taifa Hall & Great Court Grounds',
        locationType: 'PHYSICAL',
        venueName: 'Taifa Hall & Central Court',
        building: 'Main Administration Building',
        room: 'Main Floor & Marquees',
        organizerName: 'UoN Career Services Directorate',
        organizerContact: '+254 20 491 0000',
        organizerEmail: 'careerservices@uonbi.ac.ke',
        organizerRole: 'Official University Directorate',
        coverImageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&auto=format&fit=crop&q=80',
        capacity: 1200,
        registeredCount: 840,
        waitlistCount: 0,
        registrationRequired: false,
        visibility: 'INSTITUTION',
        status: 'PUBLISHED',
        verificationStatus: 'OFFICIAL_INSTITUTION',
        isOfficial: true,
        isPromoted: true,
        tags: ['Career', 'Internships', 'Jobs', 'Networking', 'CV Review'],
        materials: [
          { name: 'Career Fair Company Directory & Booth Map.pdf' },
          { name: 'Professional CV & Interview Prep Checklist.pdf' },
        ],
        viewsCount: 3820,
        savesCount: 310,
        createdAt: addDays(-20),
        updatedAt: addDays(-2),
        publishedAt: addDays(-20),
      },
      {
        id: 'evt-ieee-robotics-workshop',
        createdBy: 'usr-ieee-chair',
        creatorRole: 'Student Leader',
        creatorName: 'Faith Chebet',
        clubId: 'club-uon-ieee',
        clubName: 'IEEE Student Branch UoN',
        institutionId: 'inst-uon-ke',
        institutionName: 'University of Nairobi',
        campusId: 'campus-uon-main',
        campusName: 'Main Campus',
        title: 'Embedded Systems & IoT Robotics Workshop',
        description: 'Hands-on hardware interfacing session covering ESP32 microcontrollers, MQTT telemetry, sensor integration, and real-time robotic controls.',
        type: 'WORKSHOP',
        category: 'ACADEMIC',
        startDateTime: addDays(6, 14, 0),
        endDateTime: addDays(6, 17, 30),
        timezone: 'Africa/Nairobi',
        location: 'Department of Electrical & Information Engineering Lab 4',
        locationType: 'PHYSICAL',
        venueName: 'Engineering Complex',
        building: 'Harry Thuku Wing',
        room: 'EIE Hardware Lab 4',
        organizerName: 'IEEE Student Branch UoN',
        organizerEmail: 'ieee@uonbi.ac.ke',
        coverImageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&auto=format&fit=crop&q=80',
        capacity: 40,
        registeredCount: 40, // FULL
        waitlistCount: 12,
        registrationRequired: true,
        visibility: 'CAMPUS',
        status: 'PUBLISHED',
        verificationStatus: 'CLUB_VERIFIED',
        isOfficial: true,
        tags: ['Robotics', 'IoT', 'Hardware', 'IEEE', 'Engineering'],
        viewsCount: 680,
        savesCount: 42,
        createdAt: addDays(-8),
        updatedAt: addDays(-1),
        publishedAt: addDays(-8),
      },
      {
        id: 'evt-inter-campus-football-finals',
        createdBy: 'usr-sports-director',
        creatorRole: 'Sports Officer',
        creatorName: 'Coach J. Mwangi',
        institutionId: 'inst-uon-ke',
        institutionName: 'University of Nairobi',
        campusId: 'campus-uon-main',
        campusName: 'Main Campus',
        title: 'Inter-Faculty Football Championship Grand Finals',
        description: 'Chiromo Science FC vs Main Campus Engineering FC in the thrilling finals of the Chancellor Cup 2026.',
        type: 'SPORT_EVENT',
        category: 'SPORTS',
        startDateTime: addDays(7, 15, 0),
        endDateTime: addDays(7, 18, 0),
        timezone: 'Africa/Nairobi',
        location: 'University Main Sports Grounds, Nairobi',
        locationType: 'PHYSICAL',
        venueName: 'Main Campus Stadium',
        organizerName: 'UoN Sports & Games Department',
        coverImageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80',
        capacity: 2500,
        registeredCount: 1100,
        registrationRequired: false,
        visibility: 'INSTITUTION',
        status: 'PUBLISHED',
        verificationStatus: 'OFFICIAL_INSTITUTION',
        isOfficial: true,
        tags: ['Sports', 'Football', 'Championship', 'Campus Life'],
        viewsCount: 2200,
        savesCount: 75,
        createdAt: addDays(-10),
        updatedAt: addDays(-1),
        publishedAt: addDays(-10),
      },
      {
        id: 'evt-rotaract-blood-drive',
        createdBy: 'usr-rotaract-pres',
        creatorRole: 'Club President',
        creatorName: 'Kelvin Omwamba',
        clubId: 'club-rotaract-uon',
        clubName: 'Rotaract Club of Nairobi Central',
        institutionId: 'inst-uon-ke',
        institutionName: 'University of Nairobi',
        campusId: 'campus-uon-main',
        campusName: 'Main Campus',
        title: 'Annual Campus Blood Donation Drive & Free Health Screening',
        description: 'Partnering with the Kenya National Blood Transfusion Service to support local hospitals. Free blood pressure, BMI, and glucose checkups for all students and faculty.',
        type: 'PUBLIC_CAMPUS_EVENT',
        category: 'VOLUNTEERING',
        startDateTime: addDays(1, 8, 30),
        endDateTime: addDays(1, 16, 0),
        timezone: 'Africa/Nairobi',
        location: 'Student Center Courtyard, Main Campus',
        locationType: 'PHYSICAL',
        organizerName: 'Rotaract Club & KNBTS',
        coverImageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200&auto=format&fit=crop&q=80',
        capacity: 500,
        registeredCount: 230,
        registrationRequired: false,
        visibility: 'CAMPUS',
        status: 'PUBLISHED',
        verificationStatus: 'CLUB_VERIFIED',
        isOfficial: true,
        tags: ['Health', 'Volunteering', 'Blood Donation', 'Community'],
        viewsCount: 1100,
        savesCount: 65,
        createdAt: addDays(-6),
        updatedAt: addDays(-1),
        publishedAt: addDays(-6),
      },
      {
        id: 'evt-oxford-distinguished-lecture',
        createdBy: 'usr-oxford-rep',
        creatorRole: 'Academic Admin',
        creatorName: 'Oxford Academic Affairs',
        institutionId: 'inst-oxford-gb',
        institutionName: 'University of Oxford',
        campusId: 'campus-oxford-central',
        campusName: 'Central Oxford',
        title: 'Sir Roger Penrose: Quantum Mechanics & Artificial Intelligence Foundations',
        description: 'Distinguished public lecture in the Sheldonian Theatre on geometry, spacetime, and computational bounds of intelligence.',
        type: 'SEMINAR',
        category: 'ACADEMIC',
        startDateTime: addDays(5, 17, 0),
        endDateTime: addDays(5, 19, 0),
        timezone: 'Europe/London',
        location: 'Sheldonian Theatre, Broad St, Oxford',
        locationType: 'HYBRID',
        onlineUrl: 'https://ox.ac.uk/livestream/penrose-lecture',
        organizerName: 'Oxford Mathematical Institute',
        coverImageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&auto=format&fit=crop&q=80',
        capacity: 950,
        registeredCount: 890,
        registrationRequired: true,
        visibility: 'GLOBAL',
        status: 'PUBLISHED',
        verificationStatus: 'OFFICIAL_INSTITUTION',
        isOfficial: true,
        isPromoted: true,
        tags: ['Physics', 'Quantum', 'Mathematics', 'AI', 'Public Lecture'],
        viewsCount: 5400,
        savesCount: 430,
        createdAt: addDays(-15),
        updatedAt: addDays(-2),
        publishedAt: addDays(-15),
      },
      {
        id: 'evt-harvard-entrepreneurship-summit',
        createdBy: 'usr-harvard-admin',
        creatorRole: 'Program Manager',
        creatorName: 'Harvard Innovation Labs',
        institutionId: 'inst-harvard-us',
        institutionName: 'Harvard University',
        campusId: 'campus-harvard-cambridge',
        campusName: 'Cambridge Main Campus',
        title: 'Harvard Global Student Startup Pitch & Venture Showcase',
        description: '20 student-founded startups pitching live to top venture capital partners for $250,000 in non-dilutive grant funding.',
        type: 'CONFERENCE',
        category: 'CAREER',
        startDateTime: addDays(9, 13, 0),
        endDateTime: addDays(9, 18, 0),
        timezone: 'America/New_York',
        location: 'Harvard i-lab, Batten Hall & Zoom Live',
        locationType: 'HYBRID',
        onlineUrl: 'https://innovationlabs.harvard.edu/pitch-2026',
        organizerName: 'Harvard Innovation Labs',
        coverImageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&auto=format&fit=crop&q=80',
        capacity: 500,
        registeredCount: 460,
        registrationRequired: true,
        visibility: 'GLOBAL',
        status: 'PUBLISHED',
        verificationStatus: 'OFFICIAL_INSTITUTION',
        isOfficial: true,
        tags: ['Startups', 'Venture Capital', 'Pitch', 'Innovation'],
        viewsCount: 4100,
        savesCount: 290,
        createdAt: addDays(-18),
        updatedAt: addDays(-2),
        publishedAt: addDays(-18),
      },
    ];

    // Seed sample personal deadlines for default student
    this.personalDeadlines = [
      {
        id: 'pdl-1',
        userId: 'usr-enermind-lead',
        title: 'Complete CSC 301 Database Lab Exercise 4',
        description: 'Write SQL triggers and stored procedures for transaction isolation testing.',
        dueDateTime: addDays(2, 20, 0),
        timezone: 'Africa/Nairobi',
        category: 'ASSIGNMENT',
        priority: 'HIGH',
        completed: false,
        courseCode: 'CSC 301',
        createdAt: addDays(-3),
        updatedAt: addDays(-1),
      },
      {
        id: 'pdl-2',
        userId: 'usr-enermind-lead',
        title: 'Revise Operating Systems Memory Management Notes',
        description: 'Go through textbook chapters 7-9 on paging, segmentation, and TLBs.',
        dueDateTime: addDays(4, 18, 0),
        timezone: 'Africa/Nairobi',
        category: 'EXAM_PREP',
        priority: 'MEDIUM',
        completed: false,
        courseCode: 'CSC 305',
        createdAt: addDays(-4),
        updatedAt: addDays(-1),
      },
      {
        id: 'pdl-3',
        userId: 'usr-enermind-lead',
        title: 'Print Exam Clearance Form from SMIS Portal',
        description: 'Get stamped by Department Chairman before Monday.',
        dueDateTime: addDays(7, 12, 0),
        timezone: 'Africa/Nairobi',
        category: 'PERSONAL',
        priority: 'URGENT',
        completed: true,
        completedAt: addDays(-1),
        createdAt: addDays(-5),
        updatedAt: addDays(-1),
      },
    ];

    // Seed sample saved events
    this.savedEvents = [
      {
        id: 'save-1',
        userId: 'usr-enermind-lead',
        eventId: 'evt-gdsc-ai-hackathon',
        createdAt: addDays(-5),
        reminderOffsetMinutes: 60,
      },
      {
        id: 'save-2',
        userId: 'usr-enermind-lead',
        eventId: 'evt-career-fair-2026',
        createdAt: addDays(-4),
        reminderOffsetMinutes: 1440,
      },
    ];

    // Seed sample registration
    this.registrations = [
      {
        id: 'reg-lead-hackathon',
        eventId: 'evt-gdsc-ai-hackathon',
        eventTitle: 'Inter-University Gemini AI & Cloud Hackathon 2026',
        eventStartDateTime: addDays(2, 9, 0),
        userId: 'usr-enermind-lead',
        userName: 'Enermind Student',
        userEmail: 'student@enermind.org',
        userInstitutionName: 'University of Nairobi',
        status: 'REGISTERED',
        registeredAt: addDays(-3),
      },
    ];
  }

  // =========================================================================
  // 2. EVENTS DISCOVERY & SEARCH
  // =========================================================================

  searchEvents(params: {
    query?: string;
    category?: string;
    type?: string;
    institutionId?: string;
    campusId?: string;
    countryCode?: string;
    timeframe?: 'ALL' | 'TODAY' | 'THIS_WEEK' | 'THIS_MONTH' | 'UPCOMING' | 'PAST';
    visibility?: string;
    status?: string;
    clubId?: string;
    isOfficialOnly?: boolean;
    isFeaturedOnly?: boolean;
    hasRegistrationOnly?: boolean;
    page?: number;
    limit?: number;
    sortBy?: 'DATE_ASC' | 'DATE_DESC' | 'POPULARITY' | 'NEWEST';
    currentUserId?: string;
  }) {
    let list = [...this.events];

    // Status filter (defaults to PUBLISHED unless admin requesting)
    if (params.status && params.status !== 'ALL') {
      list = list.filter((e) => e.status === params.status);
    } else {
      list = list.filter((e) => e.status === 'PUBLISHED' || (params.currentUserId && e.createdBy === params.currentUserId));
    }

    // Institution / Campus filtering
    if (params.institutionId && params.institutionId !== 'ALL') {
      list = list.filter((e) => e.institutionId === params.institutionId || e.visibility === 'GLOBAL');
    }

    if (params.campusId && params.campusId !== 'ALL') {
      list = list.filter((e) => !e.campusId || e.campusId === params.campusId || e.visibility === 'GLOBAL' || e.visibility === 'INSTITUTION');
    }

    // Category filter
    if (params.category && params.category !== 'ALL') {
      list = list.filter((e) => e.category === params.category);
    }

    // Type filter
    if (params.type && params.type !== 'ALL') {
      list = list.filter((e) => e.type === params.type);
    }

    // Club filter
    if (params.clubId) {
      list = list.filter((e) => e.clubId === params.clubId);
    }

    // Official only
    if (params.isOfficialOnly) {
      list = list.filter((e) => e.isOfficial);
    }

    // Featured only
    if (params.isFeaturedOnly) {
      list = list.filter((e) => e.isPromoted || e.isSponsored);
    }

    // Has registration
    if (params.hasRegistrationOnly) {
      list = list.filter((e) => e.registrationRequired);
    }

    // Query text search
    if (params.query && params.query.trim()) {
      const q = params.query.toLowerCase().trim();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.organizerName.toLowerCase().includes(q) ||
          (e.tags && e.tags.some((t) => t.toLowerCase().includes(q))) ||
          (e.clubName && e.clubName.toLowerCase().includes(q))
      );
    }

    // Timeframe filtering
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const endOfToday = startOfToday + 86400000;
    const endOfWeek = startOfToday + 7 * 86400000;
    const endOfMonth = startOfToday + 30 * 86400000;

    if (params.timeframe === 'TODAY') {
      list = list.filter((e) => {
        const start = new Date(e.startDateTime).getTime();
        return start >= startOfToday && start < endOfToday;
      });
    } else if (params.timeframe === 'THIS_WEEK') {
      list = list.filter((e) => {
        const start = new Date(e.startDateTime).getTime();
        return start >= startOfToday && start <= endOfWeek;
      });
    } else if (params.timeframe === 'THIS_MONTH') {
      list = list.filter((e) => {
        const start = new Date(e.startDateTime).getTime();
        return start >= startOfToday && start <= endOfMonth;
      });
    } else if (params.timeframe === 'UPCOMING') {
      list = list.filter((e) => new Date(e.endDateTime || e.startDateTime).getTime() >= startOfToday);
    } else if (params.timeframe === 'PAST') {
      list = list.filter((e) => new Date(e.endDateTime || e.startDateTime).getTime() < startOfToday);
    }

    // Sorting
    const sortBy = params.sortBy || 'DATE_ASC';
    if (sortBy === 'DATE_ASC') {
      list.sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());
    } else if (sortBy === 'DATE_DESC') {
      list.sort((a, b) => new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime());
    } else if (sortBy === 'POPULARITY') {
      list.sort((a, b) => (b.registeredCount + (b.savesCount || 0)) - (a.registeredCount + (a.savesCount || 0)));
    } else if (sortBy === 'NEWEST') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const total = list.length;
    const page = params.page || 1;
    const limit = params.limit || 20;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return {
      events: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  getEventById(id: string, userId?: string): CampusEvent | null {
    const event = this.events.find((e) => e.id === id);
    if (!event) return null;

    // Increment views safely
    event.viewsCount = (event.viewsCount || 0) + 1;
    return event;
  }

  // =========================================================================
  // 3. EVENT CREATION & LIFECYCLE
  // =========================================================================

  createEvent(
    data: Omit<CampusEvent, 'id' | 'createdAt' | 'updatedAt' | 'registeredCount' | 'waitlistCount' | 'viewsCount' | 'savesCount'> & {
      userRole?: UserRole;
    }
  ): { success: boolean; event: CampusEvent; message: string } {
    const isStaffOrAdmin =
      data.userRole === UserRole.ADMIN ||
      data.userRole === UserRole.SUPER_ADMIN ||
      data.userRole === UserRole.INSTITUTION_ADMIN;

    const isVerifiedClubLead = Boolean(
      data.clubId && this.clubs.some((c) => c.id === data.clubId && c.verificationStatus === 'VERIFIED')
    );

    // Initial status and verification based on trust hierarchy
    let initialStatus: EventStatus = 'PUBLISHED';
    let initialVerification: EventVerificationStatus = 'COMMUNITY_SUBMITTED';
    let isOfficial = false;

    if (isStaffOrAdmin) {
      initialStatus = 'PUBLISHED';
      initialVerification = 'OFFICIAL_INSTITUTION';
      isOfficial = true;
    } else if (isVerifiedClubLead) {
      initialStatus = 'PUBLISHED';
      initialVerification = 'CLUB_VERIFIED';
      isOfficial = true;
    } else {
      // Normal students / external organizations submit for review
      initialStatus = 'PUBLISHED'; // Allow immediate view with Community submitted badge or moderation queue
      initialVerification = 'COMMUNITY_SUBMITTED';
      isOfficial = false;
    }

    const newEvent: CampusEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdBy: data.createdBy,
      creatorRole: data.creatorRole || 'STUDENT',
      creatorName: data.creatorName || 'Student Organizer',
      creatorEmail: data.creatorEmail,
      organizationId: data.organizationId,
      clubId: data.clubId,
      clubName: data.clubName,
      institutionId: data.institutionId,
      institutionName: data.institutionName,
      campusId: data.campusId,
      campusName: data.campusName,
      departmentId: data.departmentId,
      departmentName: data.departmentName,
      courseId: data.courseId,
      courseCode: data.courseCode,
      courseName: data.courseName,
      title: data.title.trim(),
      description: data.description.trim(),
      type: data.type || 'PUBLIC_CAMPUS_EVENT',
      category: data.category || 'ACADEMIC',
      startDateTime: data.startDateTime,
      endDateTime: data.endDateTime || data.startDateTime,
      timezone: data.timezone || 'Africa/Nairobi',
      location: data.location.trim(),
      locationType: data.locationType || 'PHYSICAL',
      venueName: data.venueName,
      building: data.building,
      room: data.room,
      mapCoordinates: data.mapCoordinates,
      onlineUrl: data.onlineUrl,
      organizerName: data.organizerName.trim(),
      organizerContact: data.organizerContact,
      organizerEmail: data.organizerEmail,
      organizerRole: data.organizerRole,
      organizerLogoUrl: data.organizerLogoUrl,
      coverImageUrl: data.coverImageUrl,
      capacity: data.capacity ? Number(data.capacity) : undefined,
      registeredCount: 0,
      waitlistCount: 0,
      registrationRequired: Boolean(data.registrationRequired),
      registrationDeadline: data.registrationDeadline,
      registrationUrl: data.registrationUrl,
      requiresApproval: Boolean(data.requiresApproval),
      targetAudience: data.targetAudience,
      visibility: data.visibility || 'INSTITUTION',
      status: initialStatus,
      verificationStatus: initialVerification,
      isOfficial,
      isSponsored: false,
      isPromoted: false,
      tags: data.tags || [],
      materials: data.materials || [],
      viewsCount: 1,
      savesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: initialStatus === 'PUBLISHED' ? new Date().toISOString() : undefined,
      // Compatibility aliases
      startDate: data.startDateTime,
      endDate: data.endDateTime || data.startDateTime,
      createdDate: new Date().toISOString(),
    };

    this.events.unshift(newEvent);

    // Audit log
    adminService.logAction({
      actorUserId: data.createdBy,
      actorEmail: data.creatorEmail || 'organizer@campus.edu',
      actorRole: data.userRole || UserRole.STUDENT,
      action: 'EVENT_CREATED',
      targetType: 'CAMPUS_EVENT',
      targetId: newEvent.id,
      details: `Campus event "${newEvent.title}" created. Status: ${newEvent.status}, Verification: ${newEvent.verificationStatus}.`,
    });

    return {
      success: true,
      event: newEvent,
      message: `Event "${newEvent.title}" published successfully with ${newEvent.verificationStatus.replace('_', ' ')} badge.`,
    };
  }

  updateEvent(
    id: string,
    editorUserId: string,
    updates: Partial<CampusEvent>,
    isStaff = false
  ): CampusEvent {
    const index = this.events.findIndex((e) => e.id === id);
    if (index === -1) throw new Error('Event not found');

    const existing = this.events[index];
    if (existing.createdBy !== editorUserId && !isStaff) {
      throw new Error('Unauthorized: Only the creator or administrator can update this event');
    }

    const updated: CampusEvent = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.events[index] = updated;

    adminService.logAction({
      actorUserId: editorUserId,
      actorEmail: 'editor@campus.edu',
      actorRole: isStaff ? UserRole.ADMIN : UserRole.STUDENT,
      action: 'EVENT_UPDATED',
      targetType: 'CAMPUS_EVENT',
      targetId: id,
      details: `Event "${updated.title}" was updated.`,
    });

    return updated;
  }

  cancelOrPostponeEvent(
    id: string,
    userId: string,
    action: 'CANCEL' | 'POSTPONE',
    note?: string,
    newStartDateTime?: string,
    newEndDateTime?: string,
    isStaff = false
  ): CampusEvent {
    const event = this.getEventById(id);
    if (!event) throw new Error('Event not found');

    if (event.createdBy !== userId && !isStaff) {
      throw new Error('Unauthorized: Cannot modify event status');
    }

    if (action === 'CANCEL') {
      event.status = 'CANCELLED';
      event.postponedNote = note || 'This event has been cancelled by the organizer.';
    } else if (action === 'POSTPONE') {
      event.status = 'POSTPONED';
      event.postponedNote = note || 'This event has been postponed to a new date.';
      if (newStartDateTime) event.startDateTime = newStartDateTime;
      if (newEndDateTime) event.endDateTime = newEndDateTime;
    }

    event.updatedAt = new Date().toISOString();

    adminService.logAction({
      actorUserId: userId,
      actorEmail: 'organizer@campus.edu',
      actorRole: isStaff ? UserRole.ADMIN : UserRole.STUDENT,
      action: action === 'CANCEL' ? 'EVENT_CANCELLED' : 'EVENT_POSTPONED',
      targetType: 'CAMPUS_EVENT',
      targetId: id,
      details: `Event "${event.title}" ${action.toLowerCase()}ed. Note: ${note || 'None'}`,
    });

    return event;
  }

  // =========================================================================
  // 4. REGISTRATION, RSVP & WAITLISTING
  // =========================================================================

  registerForEvent(params: {
    eventId: string;
    userId: string;
    userName: string;
    userEmail: string;
    userInstitutionName?: string;
    notes?: string;
  }): { success: boolean; registration: EventRegistration; isWaitlisted: boolean; message: string } {
    const event = this.getEventById(params.eventId);
    if (!event) throw new Error('Event not found');

    if (event.status === 'CANCELLED') {
      throw new Error('Cannot register for a cancelled event');
    }

    // Check existing registration
    const existing = this.registrations.find(
      (r) => r.eventId === params.eventId && r.userId === params.userId && r.status !== 'CANCELLED'
    );
    if (existing) {
      return {
        success: true,
        registration: existing,
        isWaitlisted: existing.status === 'WAITLISTED',
        message: existing.status === 'WAITLISTED' ? 'You are currently on the waitlist.' : 'You are already registered for this event.',
      };
    }

    // Capacity Check
    let isWaitlisted = false;
    if (event.capacity && event.capacity > 0 && event.registeredCount >= event.capacity) {
      isWaitlisted = true;
    }

    const regStatus = isWaitlisted ? 'WAITLISTED' : 'REGISTERED';

    const reg: EventRegistration = {
      id: `reg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      eventId: params.eventId,
      eventTitle: event.title,
      eventStartDateTime: event.startDateTime,
      userId: params.userId,
      userName: params.userName,
      userEmail: params.userEmail,
      userInstitutionName: params.userInstitutionName,
      status: regStatus,
      registeredAt: new Date().toISOString(),
      notes: params.notes,
    };

    this.registrations.push(reg);

    if (isWaitlisted) {
      event.waitlistCount = (event.waitlistCount || 0) + 1;
    } else {
      event.registeredCount = (event.registeredCount || 0) + 1;
    }

    adminService.logAction({
      actorUserId: params.userId,
      actorEmail: params.userEmail,
      actorRole: UserRole.STUDENT,
      action: isWaitlisted ? 'EVENT_WAITLISTED' : 'EVENT_REGISTERED',
      targetType: 'CAMPUS_EVENT',
      targetId: params.eventId,
      details: `${params.userName} ${isWaitlisted ? 'joined waitlist for' : 'registered for'} "${event.title}".`,
    });

    return {
      success: true,
      registration: reg,
      isWaitlisted,
      message: isWaitlisted
        ? `Event is at capacity (${event.capacity} seats). You have been added to the waitlist (Position #${event.waitlistCount}).`
        : `Registration confirmed for "${event.title}". We've added this to your Campus Calendar.`,
    };
  }

  cancelRegistration(eventId: string, userId: string): { success: boolean; message: string; promotedUser?: string } {
    const regIndex = this.registrations.findIndex(
      (r) => r.eventId === eventId && r.userId === userId && r.status !== 'CANCELLED'
    );
    if (regIndex === -1) throw new Error('Active registration not found');

    const reg = this.registrations[regIndex];
    const prevStatus = reg.status;
    reg.status = 'CANCELLED';
    reg.cancelledAt = new Date().toISOString();

    const event = this.getEventById(eventId);
    let promotedUserName: string | undefined;

    if (event) {
      if (prevStatus === 'REGISTERED') {
        event.registeredCount = Math.max(0, (event.registeredCount || 1) - 1);

        // Auto-promote first waitlisted user
        const firstWaitlisted = this.registrations.find(
          (r) => r.eventId === eventId && r.status === 'WAITLISTED'
        );
        if (firstWaitlisted) {
          firstWaitlisted.status = 'REGISTERED';
          event.registeredCount += 1;
          event.waitlistCount = Math.max(0, (event.waitlistCount || 1) - 1);
          promotedUserName = firstWaitlisted.userName;

          adminService.logAction({
            actorUserId: firstWaitlisted.userId,
            actorEmail: firstWaitlisted.userEmail,
            actorRole: UserRole.STUDENT,
            action: 'EVENT_WAITLIST_PROMOTED',
            targetType: 'CAMPUS_EVENT',
            targetId: eventId,
            details: `Waitlisted student ${firstWaitlisted.userName} promoted to REGISTERED for "${event.title}".`,
          });
        }
      } else if (prevStatus === 'WAITLISTED') {
        event.waitlistCount = Math.max(0, (event.waitlistCount || 1) - 1);
      }
    }

    return {
      success: true,
      message: 'Registration cancelled successfully.',
      promotedUser: promotedUserName,
    };
  }

  getUserRegistrations(userId: string): EventRegistration[] {
    return this.registrations.filter((r) => r.userId === userId && r.status !== 'CANCELLED');
  }

  getEventAttendees(eventId: string, requesterUserId: string, isStaff = false): EventRegistration[] {
    const event = this.getEventById(eventId);
    if (!event) throw new Error('Event not found');

    // Strict privacy: only creator or staff can view full attendee roster
    if (event.createdBy !== requesterUserId && !isStaff) {
      throw new Error('Unauthorized: Full attendee list is private to event organizers and institution administrators');
    }

    return this.registrations.filter((r) => r.eventId === eventId);
  }

  // =========================================================================
  // 5. SAVED EVENTS & CALENDAR BOOKMARKS
  // =========================================================================

  toggleSaveEvent(userId: string, eventId: string, reminderMinutes = 60): { isSaved: boolean; message: string } {
    const existingIndex = this.savedEvents.findIndex((s) => s.userId === userId && s.eventId === eventId);
    const event = this.getEventById(eventId);

    if (existingIndex > -1) {
      this.savedEvents.splice(existingIndex, 1);
      if (event && event.savesCount) event.savesCount = Math.max(0, event.savesCount - 1);
      return { isSaved: false, message: 'Event removed from saved events' };
    } else {
      this.savedEvents.push({
        id: `save-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        userId,
        eventId,
        reminderOffsetMinutes: reminderMinutes,
        createdAt: new Date().toISOString(),
      });
      if (event) event.savesCount = (event.savesCount || 0) + 1;
      return { isSaved: true, message: 'Event saved to your personal campus calendar' };
    }
  }

  getUserSavedEvents(userId: string): Array<CampusEvent & { savedReminderMinutes?: number }> {
    const saved = this.savedEvents.filter((s) => s.userId === userId);
    const result: Array<CampusEvent & { savedReminderMinutes?: number }> = [];

    for (const item of saved) {
      const event = this.getEventById(item.eventId);
      if (event) {
        result.push({
          ...event,
          savedReminderMinutes: item.reminderOffsetMinutes,
        });
      }
    }

    return result;
  }

  // =========================================================================
  // 6. ACADEMIC DEADLINES
  // =========================================================================

  getAcademicDeadlines(params: {
    institutionId?: string;
    campusId?: string;
    courseCode?: string;
    type?: string;
    priority?: string;
  }): AcademicDeadline[] {
    let list = [...this.academicDeadlines];

    if (params.institutionId && params.institutionId !== 'ALL') {
      list = list.filter((d) => d.institutionId === params.institutionId);
    }

    if (params.campusId && params.campusId !== 'ALL') {
      list = list.filter((d) => !d.campusId || d.campusId === params.campusId);
    }

    if (params.courseCode && params.courseCode !== 'ALL') {
      list = list.filter((d) => !d.courseCode || d.courseCode.toLowerCase().includes(params.courseCode!.toLowerCase()));
    }

    if (params.type && params.type !== 'ALL') {
      list = list.filter((d) => d.type === params.type);
    }

    if (params.priority && params.priority !== 'ALL') {
      list = list.filter((d) => d.priority === params.priority);
    }

    // Sort by deadline ascending
    return list.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  }

  createAcademicDeadline(
    data: Omit<AcademicDeadline, 'id' | 'createdAt' | 'updatedAt'>,
    authorUserId: string,
    isStaff = false
  ): AcademicDeadline {
    const newDeadline: AcademicDeadline = {
      id: `dl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      institutionId: data.institutionId,
      institutionName: data.institutionName,
      campusId: data.campusId,
      campusName: data.campusName,
      departmentId: data.departmentId,
      departmentName: data.departmentName,
      courseId: data.courseId,
      courseCode: data.courseCode,
      courseName: data.courseName,
      title: data.title.trim(),
      description: data.description.trim(),
      deadline: data.deadline,
      timezone: data.timezone || 'Africa/Nairobi',
      type: data.type || 'ASSIGNMENT',
      source: isStaff ? 'UNIVERSITY' : 'USER_CREATED',
      sourceDisplayName: data.sourceDisplayName || (isStaff ? 'Academic Directorate' : 'Community Submission'),
      isOfficial: isStaff,
      priority: data.priority || 'MEDIUM',
      actionUrl: data.actionUrl,
      materialsUrl: data.materialsUrl,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.academicDeadlines.push(newDeadline);

    adminService.logAction({
      actorUserId: authorUserId,
      actorEmail: 'student@campus.edu',
      actorRole: isStaff ? UserRole.ADMIN : UserRole.STUDENT,
      action: 'DEADLINE_CREATED',
      targetType: 'ACADEMIC_DEADLINE',
      targetId: newDeadline.id,
      details: `Academic deadline "${newDeadline.title}" added (${newDeadline.deadline}). Official: ${newDeadline.isOfficial}.`,
    });

    return newDeadline;
  }

  // =========================================================================
  // 7. EXAMS & EXAM TIMETABLE
  // =========================================================================

  getExams(params: {
    institutionId?: string;
    campusId?: string;
    courseCode?: string;
    examType?: string;
    query?: string;
  }): ExamEvent[] {
    let list = [...this.exams];

    if (params.institutionId && params.institutionId !== 'ALL') {
      list = list.filter((e) => e.institutionId === params.institutionId);
    }

    if (params.campusId && params.campusId !== 'ALL') {
      list = list.filter((e) => !e.campusId || e.campusId === params.campusId);
    }

    if (params.courseCode && params.courseCode !== 'ALL') {
      list = list.filter((e) => e.courseCode.toLowerCase().includes(params.courseCode!.toLowerCase()));
    }

    if (params.examType && params.examType !== 'ALL') {
      list = list.filter((e) => e.examType === params.examType);
    }

    if (params.query && params.query.trim()) {
      const q = params.query.toLowerCase().trim();
      list = list.filter(
        (e) =>
          e.courseCode.toLowerCase().includes(q) ||
          e.courseName.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.room.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  }

  createExamSchedule(data: Omit<ExamEvent, 'id' | 'createdAt' | 'updatedAt'>, authorUserId: string): ExamEvent {
    const newExam: ExamEvent = {
      id: `exam-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      institutionId: data.institutionId,
      institutionName: data.institutionName,
      campusId: data.campusId,
      campusName: data.campusName,
      departmentId: data.departmentId,
      departmentName: data.departmentName,
      courseId: data.courseId,
      courseCode: data.courseCode.trim().toUpperCase(),
      courseName: data.courseName.trim(),
      academicYear: data.academicYear || '2025/2026',
      semester: data.semester || 'Semester 2',
      examType: data.examType || 'FINAL',
      dateTime: data.dateTime,
      endDateTime: data.endDateTime,
      timezone: data.timezone || 'Africa/Nairobi',
      venue: data.venue.trim(),
      room: data.room.trim(),
      building: data.building,
      seatNumber: data.seatNumber,
      durationMinutes: Number(data.durationMinutes) || 180,
      instructions: data.instructions || [],
      examinerName: data.examinerName,
      source: data.source || 'UNIVERSITY',
      isOfficial: Boolean(data.isOfficial),
      status: 'SCHEDULED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.exams.push(newExam);

    adminService.logAction({
      actorUserId: authorUserId,
      actorEmail: 'examinations@campus.edu',
      actorRole: UserRole.ADMIN,
      action: 'EXAM_TIMETABLE_CREATED',
      targetType: 'EXAM_EVENT',
      targetId: newExam.id,
      details: `Exam timetable entry added for ${newExam.courseCode}: ${newExam.courseName} (${newExam.dateTime}).`,
    });

    return newExam;
  }

  // =========================================================================
  // 8. PERSONAL DEADLINES (Private student planner)
  // =========================================================================

  getPersonalDeadlines(userId: string): PersonalDeadline[] {
    return this.personalDeadlines
      .filter((d) => d.userId === userId)
      .sort((a, b) => new Date(a.dueDateTime).getTime() - new Date(b.dueDateTime).getTime());
  }

  createPersonalDeadline(data: Omit<PersonalDeadline, 'id' | 'createdAt' | 'updatedAt' | 'completed'>): PersonalDeadline {
    const item: PersonalDeadline = {
      id: `pdl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: data.userId,
      title: data.title.trim(),
      description: data.description?.trim(),
      dueDateTime: data.dueDateTime,
      timezone: data.timezone || 'Africa/Nairobi',
      category: data.category || 'ASSIGNMENT',
      priority: data.priority || 'MEDIUM',
      completed: false,
      courseCode: data.courseCode,
      reminderMinutes: data.reminderMinutes || 60,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.personalDeadlines.push(item);
    return item;
  }

  togglePersonalDeadline(id: string, userId: string): PersonalDeadline {
    const item = this.personalDeadlines.find((d) => d.id === id && d.userId === userId);
    if (!item) throw new Error('Personal deadline not found');

    item.completed = !item.completed;
    item.completedAt = item.completed ? new Date().toISOString() : undefined;
    item.updatedAt = new Date().toISOString();
    return item;
  }

  deletePersonalDeadline(id: string, userId: string): boolean {
    const index = this.personalDeadlines.findIndex((d) => d.id === id && d.userId === userId);
    if (index === -1) return false;
    this.personalDeadlines.splice(index, 1);
    return true;
  }

  // =========================================================================
  // 9. CAMPUS ANNOUNCEMENTS
  // =========================================================================

  getAnnouncements(institutionId?: string, campusId?: string): CampusAnnouncement[] {
    let list = this.announcements.filter((a) => a.status === 'ACTIVE');

    if (institutionId && institutionId !== 'ALL') {
      list = list.filter((a) => a.institutionId === institutionId);
    }

    if (campusId && campusId !== 'ALL') {
      list = list.filter((a) => !a.campusId || a.campusId === campusId);
    }

    return list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  createAnnouncement(
    data: Omit<CampusAnnouncement, 'id' | 'publishedAt' | 'status'>,
    authorUserId: string,
    isStaff = false
  ): CampusAnnouncement {
    const announcement: CampusAnnouncement = {
      id: `ann-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      authorId: authorUserId,
      authorName: data.authorName,
      authorRole: data.authorRole,
      authorAvatar: data.authorAvatar,
      institutionId: data.institutionId,
      institutionName: data.institutionName,
      campusId: data.campusId,
      campusName: data.campusName,
      departmentId: data.departmentId,
      title: data.title.trim(),
      content: data.content.trim(),
      priority: data.priority || 'NORMAL',
      isOfficial: isStaff || Boolean(data.isOfficial),
      source: data.source || (isStaff ? 'University Administration' : 'Student Announcement'),
      actionUrl: data.actionUrl,
      actionLabel: data.actionLabel,
      publishedAt: new Date().toISOString(),
      expiresAt: data.expiresAt,
      status: 'ACTIVE',
    };

    this.announcements.unshift(announcement);

    adminService.logAction({
      actorUserId: authorUserId,
      actorEmail: 'announcements@campus.edu',
      actorRole: isStaff ? UserRole.ADMIN : UserRole.STUDENT,
      action: 'ANNOUNCEMENT_CREATED',
      targetType: 'CAMPUS_ANNOUNCEMENT',
      targetId: announcement.id,
      details: `Campus Announcement "${announcement.title}" broadcasted (${announcement.priority}).`,
    });

    return announcement;
  }

  // =========================================================================
  // 10. CLUBS & ORGANIZATIONS
  // =========================================================================

  getClubs(params: { institutionId?: string; campusId?: string; category?: string; query?: string }): Club[] {
    let list = [...this.clubs];

    if (params.institutionId && params.institutionId !== 'ALL') {
      list = list.filter((c) => c.institutionId === params.institutionId);
    }

    if (params.campusId && params.campusId !== 'ALL') {
      list = list.filter((c) => !c.campusId || c.campusId === params.campusId);
    }

    if (params.category && params.category !== 'ALL') {
      list = list.filter((c) => c.category === params.category);
    }

    if (params.query && params.query.trim()) {
      const q = params.query.toLowerCase().trim();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
    }

    return list.sort((a, b) => b.followersCount - a.followersCount);
  }

  toggleFollowClub(userId: string, clubId: string): { isFollowed: boolean; followersCount: number } {
    const club = this.clubs.find((c) => c.id === clubId);
    if (!club) throw new Error('Club not found');

    const index = this.clubFollowers.findIndex((f) => f.userId === userId && f.clubId === clubId);
    if (index > -1) {
      this.clubFollowers.splice(index, 1);
      club.followersCount = Math.max(0, club.followersCount - 1);
      return { isFollowed: false, followersCount: club.followersCount };
    } else {
      this.clubFollowers.push({ userId, clubId, followedAt: new Date().toISOString() });
      club.followersCount += 1;
      return { isFollowed: true, followersCount: club.followersCount };
    }
  }

  isClubFollowed(userId: string, clubId: string): boolean {
    return this.clubFollowers.some((f) => f.userId === userId && f.clubId === clubId);
  }

  createClub(data: Omit<Club, 'id' | 'createdAt' | 'updatedAt' | 'followersCount' | 'membersCount' | 'eventsCount' | 'verificationStatus' | 'isOfficial'>, authorUserId: string): Club {
    const club: Club = {
      id: `club-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      institutionId: data.institutionId,
      institutionName: data.institutionName,
      campusId: data.campusId,
      campusName: data.campusName,
      name: data.name.trim(),
      acronym: data.acronym?.trim(),
      description: data.description.trim(),
      category: data.category || 'TECHNOLOGY',
      logoUrl: data.logoUrl,
      coverImageUrl: data.coverImageUrl,
      leaderName: data.leaderName.trim(),
      leaderContact: data.leaderContact,
      leaderEmail: data.leaderEmail,
      membershipFee: data.membershipFee,
      currency: data.currency,
      registrationUrl: data.registrationUrl,
      socialLinks: data.socialLinks,
      verificationStatus: 'PENDING',
      isOfficial: false,
      followersCount: 1,
      membersCount: 1,
      eventsCount: 0,
      createdBy: authorUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.clubs.push(club);
    this.clubFollowers.push({ userId: authorUserId, clubId: club.id, followedAt: new Date().toISOString() });

    adminService.logAction({
      actorUserId: authorUserId,
      actorEmail: data.leaderEmail || 'club@campus.edu',
      actorRole: UserRole.STUDENT,
      action: 'CLUB_PROPOSED',
      targetType: 'CLUB',
      targetId: club.id,
      details: `New student club proposed: "${club.name}" (${club.category}). Status: PENDING verification.`,
    });

    return club;
  }

  // =========================================================================
  // 11. CAMPUS LOCATIONS & VENUES
  // =========================================================================

  getLocations(institutionId?: string, campusId?: string): CampusLocation[] {
    let list = [...this.locations];
    if (institutionId && institutionId !== 'ALL') {
      list = list.filter((l) => l.institutionId === institutionId);
    }
    if (campusId && campusId !== 'ALL') {
      list = list.filter((l) => l.campusId === campusId);
    }
    return list;
  }

  // =========================================================================
  // 12. COMBINED MY CALENDAR FEED
  // =========================================================================

  getMyCalendarFeed(userId: string, institutionId?: string, campusId?: string) {
    const userRegs = this.getUserRegistrations(userId);
    const registeredEventIds = new Set(userRegs.map((r) => r.eventId));

    const savedEvents = this.getUserSavedEvents(userId);
    const savedEventIds = new Set(savedEvents.map((s) => s.id));

    const personalDeadlines = this.getPersonalDeadlines(userId);
    const academicDeadlines = this.getAcademicDeadlines({ institutionId, campusId });
    const exams = this.getExams({ institutionId, campusId });

    // Filter campus events: only registered or saved, plus major official institution events
    const myEvents = this.events.filter(
      (e) =>
        registeredEventIds.has(e.id) ||
        savedEventIds.has(e.id) ||
        e.createdBy === userId ||
        (e.isOfficial && e.isPromoted)
    );

    return {
      events: myEvents,
      registrations: userRegs,
      savedEvents,
      personalDeadlines,
      academicDeadlines,
      exams,
      stats: {
        registeredEventsCount: userRegs.length,
        savedEventsCount: savedEvents.length,
        pendingDeadlinesCount: personalDeadlines.filter((d) => !d.completed).length + academicDeadlines.length,
        scheduledExamsCount: exams.length,
      },
    };
  }

  // =========================================================================
  // 13. EVENT REPORTING & MODERATION
  // =========================================================================

  reportEvent(data: {
    eventId: string;
    reportedByUserId: string;
    reportedByUserEmail?: string;
    reason: EventReport['reason'];
    details: string;
  }): { success: boolean; report: EventReport } {
    const event = this.getEventById(data.eventId);
    if (!event) throw new Error('Event not found');

    const report: EventReport = {
      id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      eventId: data.eventId,
      eventTitle: event.title,
      reportedByUserId: data.reportedByUserId,
      reportedByUserEmail: data.reportedByUserEmail,
      reason: data.reason,
      details: data.details.trim(),
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    this.reports.push(report);

    adminService.logAction({
      actorUserId: data.reportedByUserId,
      actorEmail: data.reportedByUserEmail || 'reporter@campus.edu',
      actorRole: UserRole.STUDENT,
      action: 'EVENT_REPORTED',
      targetType: 'CAMPUS_EVENT',
      targetId: data.eventId,
      details: `Report filed for "${event.title}". Reason: ${data.reason}.`,
    });

    return { success: true, report };
  }

  getEventReports(status?: string): EventReport[] {
    if (!status || status === 'ALL') return this.reports;
    return this.reports.filter((r) => r.status === status);
  }

  moderateEvent(params: {
    eventId: string;
    action: 'APPROVE' | 'REJECT' | 'VERIFY_OFFICIAL' | 'SUSPEND' | 'RESTORE';
    moderatorNotes?: string;
    adminUserId: string;
  }): CampusEvent {
    const event = this.getEventById(params.eventId);
    if (!event) throw new Error('Event not found');

    if (params.action === 'APPROVE' || params.action === 'RESTORE') {
      event.status = 'PUBLISHED';
    } else if (params.action === 'REJECT') {
      event.status = 'DRAFT';
      event.rejectionReason = params.moderatorNotes;
    } else if (params.action === 'SUSPEND') {
      event.status = 'SUSPENDED';
      event.rejectionReason = params.moderatorNotes;
    } else if (params.action === 'VERIFY_OFFICIAL') {
      event.isOfficial = true;
      event.verificationStatus = 'OFFICIAL_INSTITUTION';
    }

    event.updatedAt = new Date().toISOString();

    adminService.logAction({
      actorUserId: params.adminUserId,
      actorEmail: 'admin@campus.edu',
      actorRole: UserRole.ADMIN,
      action: `EVENT_MODERATION_${params.action}`,
      targetType: 'CAMPUS_EVENT',
      targetId: params.eventId,
      details: `Admin action: ${params.action} on event "${event.title}". Notes: ${params.moderatorNotes || 'None'}`,
    });

    return event;
  }

  // =========================================================================
  // 14. GOOGLE CALENDAR LINK BUILDER (1-click integration)
  // =========================================================================

  generateGoogleCalendarUrl(item: {
    title: string;
    description?: string;
    location?: string;
    startDateTime: string;
    endDateTime?: string;
    timezone?: string;
  }): string {
    const formatGCalDate = (isoString: string) => {
      return new Date(isoString).toISOString().replace(/-|:|\.\d\d\d/g, '');
    };

    const startFormatted = formatGCalDate(item.startDateTime);
    const endFormatted = item.endDateTime
      ? formatGCalDate(item.endDateTime)
      : formatGCalDate(new Date(new Date(item.startDateTime).getTime() + 3600000).toISOString());

    const datesParam = `${startFormatted}/${endFormatted}`;

    const url = new URL('https://calendar.google.com/calendar/render');
    url.searchParams.set('action', 'TEMPLATE');
    url.searchParams.set('text', item.title);
    if (item.description) url.searchParams.set('details', item.description);
    if (item.location) url.searchParams.set('location', item.location);
    url.searchParams.set('dates', datesParam);
    if (item.timezone) url.searchParams.set('ctz', item.timezone);

    return url.toString();
  }

  // =========================================================================
  // 15. GOOGLE DRIVE EXPORT HELPER (Save to Enermind/Campus/Events/)
  // =========================================================================

  async exportEventToDrive(userId: string, eventId: string): Promise<{ success: boolean; fileId: string; fileName: string; path: string }> {
    const event = this.getEventById(eventId);
    if (!event) throw new Error('Event not found');

    const fileContent = `# ENERMIND CAMPUS EVENT DOSSIER
Title: ${event.title}
Type: ${event.type}
Category: ${event.category}
Date & Time: ${event.startDateTime} to ${event.endDateTime}
Location: ${event.location} (${event.locationType})
Organizer: ${event.organizerName} (${event.organizerContact || event.organizerEmail || 'N/A'})
Official: ${event.isOfficial ? 'Yes (Verified)' : 'No'}

## Description
${event.description}

## Registration Details
- Capacity: ${event.capacity || 'Open'}
- Registered Attendees: ${event.registeredCount}
${event.onlineUrl ? `- Online Stream URL: ${event.onlineUrl}` : ''}

Generated automatically by Enermind Campus Workspace on ${new Date().toISOString()}.
`;

    const uploadRes = await googleDriveService.uploadFile(userId, {
      name: `${event.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_Event_Summary.txt`,
      mimeType: 'text/plain',
      sizeBytes: Buffer.byteLength(fileContent, 'utf-8'),
      category: 'ACADEMIC',
      resourceType: 'OTHER',
      institutionId: event.institutionId,
      campusId: event.campusId,
    });

    adminService.logAction({
      actorUserId: userId,
      actorEmail: 'student@enermind.org',
      actorRole: UserRole.STUDENT,
      action: 'DRIVE_EVENT_SAVED',
      targetType: 'GOOGLE_DRIVE',
      targetId: uploadRes.file.id,
      details: `Saved dossier for event "${event.title}" into Enermind Google Drive workspace.`,
    });

    return {
      success: true,
      fileId: uploadRes.file.id,
      fileName: uploadRes.file.name,
      path: 'Enermind/Campus/Events/',
    };
  }
}

export const campusEventsService = new CampusEventsService();

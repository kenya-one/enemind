import {
  StudyNote,
  PastPaper,
  ProjectIdea,
  IndustrialAttachment,
  EntertainmentMovie,
  EntertainmentMusic
} from '../types';

export const ENERMIND_LOGO_URL = 'https://cdn.oreateai.com/agentskill/c33477c488d4b7613c1e591f/multimedia/84205c8a6ffcd3b761e91635.png';

export const SAMPLE_STUDY_NOTES: StudyNote[] = [
  {
    id: 'note-cs-dsa-01',
    title: 'Data Structures & Algorithms in Java & Python (CSC 211)',
    courseCode: 'CSC 211',
    discipline: 'cs_it',
    disciplineName: 'Computer Science & Software Eng.',
    university: 'University of Nairobi (UoN)',
    semester: 'Year 2, Semester 1',
    pages: 142,
    fileSizeMb: 4.8,
    downloadCount: 3840,
    rating: 4.9,
    author: 'Prof. Okelo & UoN CS Club',
    summary: 'Comprehensive lecture notes and code implementations for Trees, Binary Search Trees, Graph Traversals (Dijkstra, BFS, DFS), Dynamic Programming, and Big-O Complexity Analysis.',
    topics: ['Arrays & Linked Lists', 'Binary Search Trees & AVL', 'Graph Algorithms', 'Dynamic Programming', 'Sorting & Searching', 'Algorithmic Complexity'],
    sampleContent: `CHAPTER 1: ASYMPTOTIC NOTATION & RECURSION
1.1 Big-O, Omega, and Theta Notations:
Formal definition: f(n) = O(g(n)) if there exist positive constants c and n0 such that 0 <= f(n) <= c*g(n) for all n >= n0.
Applications: Used to analyze worst-case time and space complexity of sorting algorithms like Merge Sort (O(n log n)) and QuickSort.

CHAPTER 2: BINARY SEARCH TREES
Properties of a valid BST:
- The left subtree of a node contains only nodes with keys lesser than the node’s key.
- The right subtree contains only nodes with keys greater than the node’s key.
- Both left and right subtrees must also be binary search trees.`,
    fileFormat: 'PDF'
  },
  {
    id: 'note-biz-cpa-01',
    title: 'Financial Accounting & Reporting Master Notes (CPA Part 1 / BAC 101)',
    courseCode: 'BAC 101 / CPA Sec 1',
    discipline: 'business',
    disciplineName: 'Business, Accounting & Finance',
    university: 'Strathmore University / KASNEB',
    semester: 'Year 1 & Professional CPA',
    pages: 198,
    fileSizeMb: 6.2,
    downloadCount: 5210,
    rating: 5.0,
    author: 'Strathmore Business School Faculty',
    summary: 'Master guide for double entry bookkeeping, IAS 1 Financial Statements, IFRS 15 Revenue from Contracts, Bank Reconciliation Statements, and Cash Flow Statements.',
    topics: ['Double Entry Bookkeeping', 'IAS 1 Balance Sheet & P&L', 'Bank Reconciliation', 'Depreciation Methods', 'IFRS Standards', 'Partnership Accounts'],
    sampleContent: `TOPIC 1: THE ACCOUNTING EQUATION & DOUBLE ENTRY
Assets = Liabilities + Owner's Equity (Capital + Retained Earnings)
Every financial transaction affects at least two accounts with equal debits and credits.

TOPIC 2: BANK RECONCILIATION STATEMENTS
Differences between Cashbook balance and Bank Statement balance arise due to:
1. Unpresented cheques (drawn but not yet presented for payment)
2. Direct debits and standing orders
3. Uncredited lodgements (deposited but not yet cleared)
4. Bank charges and interest credited.`,
    fileFormat: 'PDF'
  },
  {
    id: 'note-eng-circuits-01',
    title: 'Electrical Circuit Theory & Power Systems (FEE 221)',
    courseCode: 'FEE 221',
    discipline: 'engineering',
    disciplineName: 'Electrical & Electronic Engineering',
    university: 'JKUAT Juja',
    semester: 'Year 2, Semester 2',
    pages: 165,
    fileSizeMb: 5.5,
    downloadCount: 2940,
    rating: 4.8,
    author: 'Eng. Kinyua (JKUAT School of EE)',
    summary: 'Detailed theoretical and mathematical derivations for AC Circuit Analysis, Three-Phase Power, Laplace Transforms in Circuits, Fourier Series, and Transformers.',
    topics: ['Mesh & Nodal Analysis', 'Thevenin & Norton Theorems', 'AC Phasors & Impedance', 'Three-Phase Balanced Systems', 'Laplace Circuit Modeling', 'Resonance & Filters'],
    sampleContent: `SECTION 1: THEVENIN'S THEOREM IN FREQUENCY DOMAIN
Any linear, two-terminal AC network can be replaced with an equivalent circuit consisting of an independent voltage source Vth in series with an impedance Zth.

SECTION 2: THREE-PHASE POWER CALCULATION
In a balanced Star (Y) connected system:
- Line Voltage = sqrt(3) * Phase Voltage
- Line Current = Phase Current
Total Real Power P = sqrt(3) * V_L * I_L * cos(theta)`,
    fileFormat: 'PDF'
  },
  {
    id: 'note-health-pharm-01',
    title: 'General Pharmacology & Therapeutics Clinical Guide (PHA 301)',
    courseCode: 'PHA 301',
    discipline: 'health',
    disciplineName: 'Health Sciences & Medicine',
    university: 'Kenyatta University (KU)',
    semester: 'Year 3, Semester 1',
    pages: 210,
    fileSizeMb: 8.1,
    downloadCount: 4120,
    rating: 4.9,
    author: 'KU Medical School Pharmacology Dept',
    summary: 'High-yield clinical pharmacology covering Pharmacokinetics (ADME), Pharmacodynamics, Antimicrobial Chemotherapy, Cardiovascular Drugs, and Autonomic Nervous System Agents.',
    topics: ['Pharmacokinetics (ADME)', 'Autonomic Nervous System', 'Antimicrobial Agents', 'Antihypertensives', 'Analgesics & NSAIDs', 'Toxicology Basics'],
    sampleContent: `MODULE 1: PHARMACOKINETICS
ADME Principles:
- Absorption: Bioavailability (F) = (AUC oral / AUC IV) * 100
- Distribution: Volume of Distribution (Vd) = Dose / Plasma Concentration
- Metabolism: Phase 1 (Cytochrome P450 oxidation) vs Phase 2 (Glucuronidation conjugation)
- Elimination: Clearance (CL) = Rate of elimination / Plasma Concentration, Half-life t1/2 = 0.693 * Vd / CL`,
    fileFormat: 'PDF'
  },
  {
    id: 'note-law-land-01',
    title: 'Kenyan Land Law, Conveyancing & ArdhiSasa Procedures (LAW 204)',
    courseCode: 'LAW 204',
    discipline: 'law',
    disciplineName: 'School of Law',
    university: 'University of Nairobi (Parklands Campus)',
    semester: 'Year 2, Semester 2',
    pages: 175,
    fileSizeMb: 4.1,
    downloadCount: 3670,
    rating: 4.9,
    author: 'Dr. Wandera & UoN Law Society',
    summary: 'In-depth analysis of Kenyan land tenure systems under Land Act 2012, Land Registration Act 2012, Sectional Properties Act 2020, and digitised ArdhiSasa search & transfer procedures.',
    topics: ['Land Tenure in Kenya (Freehold vs Leasehold)', 'Sectional Properties Act 2020', 'Conveyancing Steps', 'ArdhiSasa Digital Searches', 'Mortgages & Charges', 'Compulsory Acquisition'],
    sampleContent: `CHAPTER 1: THE SECTIONAL PROPERTIES ACT 2020
Key Reforms:
1. Mandates the issuance of individual Certificates of Title or Lease for individual sectional units (apartments, flats, maisonettes).
2. Phased out the archaic sub-leases previously used by developers.
3. Establishes the Corporation of Owners for sectional maintenance and governance.`,
    fileFormat: 'PDF'
  },
  {
    id: 'note-kcse-math-01',
    title: 'KCSE Top Form 4 Mathematics & Physics Revision Formulas & Summary',
    courseCode: 'KCSE 121 / 232',
    discipline: 'kcse',
    disciplineName: 'High School & KCSE Revision',
    university: 'Kenya National Examinations Council (KNEC)',
    semester: 'Form 3 & Form 4 National Exam',
    pages: 110,
    fileSizeMb: 3.4,
    downloadCount: 6890,
    rating: 5.0,
    author: 'National KCSE Examiners Panel',
    summary: 'Essential formulas, short-cuts, calculus integration, binomial expansion, 3D geometry, matrices & transformations, vectors, and physics mechanics for grade A student success.',
    topics: ['Calculus (Differentiation & Integration)', 'Binomial Expansions', '3D Geometry & Trigonometry', 'Matrices & Transformations', 'Commercial Arithmetic', 'Electromagnetism & Waves'],
    sampleContent: `SECTION A: CALCULUS (DIFFERENTIATION & TURNING POINTS)
dy/dx = 0 at stationary points (maximum, minimum, point of inflection).
Nature of turning point:
- If d2y/dx2 < 0 -> Local Maximum
- If d2y/dx2 > 0 -> Local Minimum

SECTION B: MATRICES & TRANSFORMATIONS
Area Scale Factor (ASF) = Determinant of the Transformation Matrix |ad - bc|.
Linear Scale Factor (LSF) = sqrt(ASF).`,
    fileFormat: 'PDF'
  }
];

export const SAMPLE_PAST_PAPERS: PastPaper[] = [
  {
    id: 'pp-uon-cs-2024',
    title: 'UoN Database Systems & SQL Final Exam 2024',
    courseCode: 'CSC 314',
    discipline: 'cs_it',
    university: 'University of Nairobi (UoN)',
    year: 2024,
    semester: 'Second Semester',
    durationHours: 3,
    hasMarkingScheme: true,
    downloadCount: 2890,
    difficulty: 'Comprehensive',
    sampleQuestions: [
      'Q1 (20 Marks): Normalize the following hospital patient unnormalized relation to 3NF and BCNF.',
      'Q2 (15 Marks): Write SQL queries using Window Functions (RANK, DENSE_RANK, OVER PARTITION BY) for calculating monthly rental revenue across Nairobi estates.',
      'Q3 (15 Marks): Explain ACID properties and contrast Optimistic vs Pessimistic Concurrency Control in PostgreSQL.'
    ],
    workedSolutionsSummary: 'Includes full SQL solutions, ERD schemas, functional dependency diagrams, and marking breakdown for 100 marks.'
  },
  {
    id: 'pp-ku-finance-2024',
    title: 'Kenyatta University Corporate Finance & Investment Exam 2024',
    courseCode: 'BAC 402',
    discipline: 'business',
    university: 'Kenyatta University (KU)',
    year: 2024,
    semester: 'First Semester',
    durationHours: 3,
    hasMarkingScheme: true,
    downloadCount: 3120,
    difficulty: 'Challenging',
    sampleQuestions: [
      'Q1: Calculate Net Present Value (NPV), Internal Rate of Return (IRR), and Profitability Index for a KES 25M solar real estate project.',
      'Q2: Using the Capital Asset Pricing Model (CAPM), determine the expected return of Equity Group Holdings given beta = 1.25, Rf = 14.5% (CBK Treasury Bill rate), and Rm = 18%.',
      'Q3: Evaluate Modigliani-Miller theorem with corporate taxes and financial distress costs.'
    ],
    workedSolutionsSummary: 'Step-by-step financial model calculations, Excel formulae breakdowns, and theory marking notes.'
  },
  {
    id: 'pp-jkuat-eng-2023',
    title: 'JKUAT Microprocessor Systems & Embedded IoT Exam 2023',
    courseCode: 'ECE 312',
    discipline: 'engineering',
    university: 'JKUAT Juja',
    year: 2023,
    semester: 'Second Semester',
    durationHours: 3,
    hasMarkingScheme: true,
    downloadCount: 1980,
    difficulty: 'Standard',
    sampleQuestions: [
      'Q1: Design an 8051 / ARM Cortex-M micro-controller memory interface for 32KB RAM and 64KB Flash ROM.',
      'Q2: Write an assembly or C embedded routine to configure ADC for reading a borehole water level pressure sensor at 100Hz.',
      'Q3: Explain UART, SPI, and I2C serial communication protocols with timing diagrams.'
    ],
    workedSolutionsSummary: 'Schematic wiring diagrams, commented C code snippets, and register bit allocation guides.'
  },
  {
    id: 'pp-kasneb-cpa-2024',
    title: 'KASNEB Advanced Financial Management (AFM) Dec 2024 Paper',
    courseCode: 'CPA Advanced Level',
    discipline: 'kasneb_knec',
    university: 'KASNEB Professional Examinations',
    year: 2024,
    semester: 'December Sitting',
    durationHours: 3,
    hasMarkingScheme: true,
    downloadCount: 4780,
    difficulty: 'Comprehensive',
    sampleQuestions: [
      'Q1 (25 Marks): Multinational financial management - currency hedging using forward contracts and currency options for a tea exporter in Kericho.',
      'Q2 (25 Marks): Valuation of corporate bonds, convertible debentures, and Black-Scholes option pricing model calculations.'
    ],
    workedSolutionsSummary: 'Official KASNEB marking rubrics, detailed mathematical workings, and examiner pointers.'
  }
];

export const SAMPLE_PROJECT_IDEAS: ProjectIdea[] = [
  {
    id: 'proj-fintech-01',
    title: 'M-Pesa Daraja 2.0 Automated Chama & Rent Escrow Smart Ledger',
    field: 'fintech',
    fieldName: 'Fintech & Mobile Money',
    difficulty: 'Final Year Capstone',
    targetCourses: ['BSc Computer Science', 'Software Engineering', 'Business Information Technology (BBIT)'],
    problemStatement: 'Kenyan landlords and student chamas face massive transparency and reconciliation bottlenecks with manual M-Pesa statements and fraudulent SMS receipts.',
    proposedSolution: 'A real-time mobile and web dashboard that integrates Safaricom Daraja C2B/B2C Webhooks to automatically confirm rent payments, split water/token utilities, and generate verifiable digital receipts with SMS alerts.',
    techStack: ['React / Next.js', 'Node.js Express', 'Safaricom Daraja API', 'PostgreSQL / Supabase', 'AfricasTalking SMS'],
    architectureOverview: 'Client Frontend -> Express API Gateway -> Daraja Webhook Consumer -> PostgreSQL Ledger -> SMS Notification Service.',
    milestones: [
      { step: 1, title: 'Daraja Sandbox Setup', desc: 'Acquire Consumer Key, Secret, Passkey and configure C2B validation and confirmation URLs on HTTPS.' },
      { step: 2, title: 'Database Schema Design', desc: 'Design tables for Users, Landlords, Tenancy Contracts, Transactions (MpesaReceiptNumber, Amount, MSISDN).' },
      { step: 3, title: 'Automated Reconciliation Engine', desc: 'Build webhook listeners with idempotency keys to prevent double crediting.' },
      { step: 4, title: 'Viva Defense UI & Demo', desc: 'Create live dashboard with interactive payment simulator and exportable KRA-friendly PDF reports.' }
    ],
    vivaDefenseTips: [
      'Emphasize security: Explain how you prevent race conditions and handle network timeouts using exponential backoff.',
      'Highlight Kenyan context: Mention how Daraja STK Push simplifies student rent payments without manual paybill typing.'
    ],
    githubDemoUrl: 'https://github.com/wayongohlaurence/mpesa-smart-rent-escrow'
  },
  {
    id: 'proj-ai-swahili-01',
    title: 'Swahili & Sheng Real Estate & Academic Voice AI Assistant',
    field: 'ai_ml',
    fieldName: 'Artificial Intelligence & NLP',
    difficulty: 'Advanced',
    targetCourses: ['BSc Computer Science', 'Data Science & AI', 'Electrical & Information Engineering'],
    problemStatement: 'Most AI systems struggle with Kenyan multilingual contexts, code-mixing English, Swahili, and Sheng slang commonly used by students and local property caretakers.',
    proposedSolution: 'Fine-tuned Gemini LLM and Whisper speech pipeline that understands Kenyan queries like "Natafuta bedsitter Roysambu ya 10k ikiwa na maji 24/7" and provides structured recommendations.',
    techStack: ['Python FastApi', 'Google Gemini 3.7 SDK', 'Whisper Multilingual', 'React TypeScript', 'Vector Search (Pinecone)'],
    architectureOverview: 'Audio Input -> Whisper STT (Kenyan Accent Adjusted) -> Gemini 3.7 Flash Agent -> Vector Embeddings Search -> TTS Audio Response.',
    milestones: [
      { step: 1, title: 'Corpus Collection', desc: 'Curate 2,000+ local Kenya rental queries, campus slang, and landlord voice notes.' },
      { step: 2, title: 'Prompt & Context Engineering', desc: 'Set up server-side Gemini 3.7 agent with Kenyan geography and currency grounding.' },
      { step: 3, title: 'Client Speech Interface', desc: 'Build real-time audio capture and waveform visualizer in React.' }
    ],
    vivaDefenseTips: [
      'Explain evaluation metrics: Mention BLEU/ROUGE scores for Swahili translations and F1 score for entity extraction (Estate, Price, Amenities).'
    ],
    githubDemoUrl: 'https://github.com/wayongohlaurence/swahili-kenya-gemini-ai'
  },
  {
    id: 'proj-iot-solar-01',
    title: 'Smart GSM Water Tank & KPLC Token Telemetry for Hostels',
    field: 'iot_hardware',
    fieldName: 'IoT & Embedded Systems',
    difficulty: 'Final Year Capstone',
    targetCourses: ['BSc Electrical & Electronic Eng.', 'Mechatronics', 'Computer Technology'],
    problemStatement: 'Student hostels frequently run out of borehole water without warning, and shared tokens run low unexpectedly during exam weeks.',
    proposedSolution: 'Ultrasonic sensor and current transformer hooked to an ESP32 micro-controller that transmits live tank levels and token balances to a cloud dashboard and sends alert SMS to the caretaker.',
    techStack: ['ESP32 Microcontroller', 'C / C++ Arduino', 'SIM800L GSM Module', 'MQTT Broker', 'React Dashboard', 'Grafana / Firebase'],
    architectureOverview: 'Ultrasonic Sensor + CT Clamp -> ESP32 -> MQTT over GSM -> Node.js Server -> Realtime Web Dashboard.',
    milestones: [
      { step: 1, title: 'Hardware Breadboarding', desc: 'Wire HC-SR04 ultrasonic sensor, ACS712 current sensor, and SIM800L to ESP32.' },
      { step: 2, title: 'Firmware Development', desc: 'Write power-efficient C code with deep sleep cycles between 5-minute sensor readings.' },
      { step: 3, title: 'Web Dashboard & SMS Trigger', desc: 'Create live gauge meters and SMS triggers when water level drops below 20%.' }
    ],
    vivaDefenseTips: [
      'Demonstrate the physical prototype with a mini water container during your viva.',
      'Explain calibration: Show how temperature variations affect acoustic speed of sound in tank measurements.'
    ]
  },
  {
    id: 'proj-health-telemed-01',
    title: 'AfyaCampus: Student Mental Wellness & Clinic Booking Platform',
    field: 'health_tech',
    fieldName: 'Health Informatics & Telemedicine',
    difficulty: 'Intermediate',
    targetCourses: ['BSc Health Records', 'Computer Science', 'Public Health', 'Nursing'],
    problemStatement: 'University students face immense exam stress and long queues at university dispensaries with privacy concerns regarding reproductive and mental health.',
    proposedSolution: 'Anonymous peer counselling, digital triage chatbot, and private appointment scheduling for university health centers.',
    techStack: ['React Native / React Web', 'Node.js', 'WebRTC Video Calls', 'PostgreSQL (HIPAA compliant structure)'],
    architectureOverview: 'Anonymous Client -> End-to-End Encrypted Messaging -> Licensed Counsellor Dashboard.',
    milestones: [
      { step: 1, title: 'Triage Flow & Privacy Guard', desc: 'Implement zero-knowledge authentication for students using university email.' },
      { step: 2, title: 'Booking & Chatbot Engine', desc: 'Build real-time calendar and emergency crisis hotlines (Befrienders Kenya, Red Cross).' }
    ],
    vivaDefenseTips: [
      'Focus on data ethics, anonymous consent models, and psychological first aid protocols.'
    ]
  }
];

export const SAMPLE_INDUSTRIAL_ATTACHMENTS: IndustrialAttachment[] = [
  {
    id: 'att-safaricom-tech-2025',
    title: 'Software Engineering & Cloud Infrastructure Industrial Attachment',
    company: 'Safaricom PLC',
    logoUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=200&q=80',
    location: 'HQ Waiyaki Way, Westlands, Nairobi (Hybrid)',
    eligibleDisciplines: ['Computer Science', 'Software Eng.', 'IT', 'Telecommunications', 'Electrical Eng.'],
    stipend: 'KSh 30,000 / month',
    deadline: '15 April 2025 (Open Intake)',
    durationMonths: 3,
    status: 'Open',
    requirements: [
      'Undergraduate student in 2nd, 3rd, or 4th year from an accredited Kenyan University',
      'Valid Introduction Letter from University Attachment Coordinator',
      'Knowledge of JavaScript/TypeScript, Python, or Java and Git version control',
      'National ID and KRA PIN Certificate'
    ],
    duties: [
      'Collaborate with the M-Pesa core engineering team on microservices and API gateways',
      'Build internal test suites and monitor CI/CD deployment pipelines',
      'Participate in daily Agile scrums and sprint reviews'
    ],
    applicationEmail: 'attachments@safaricom.co.ke',
    applicationUrl: 'https://www.safaricom.co.ke/careers/students-internships',
    howToApply: 'Submit your CV, University Attachment Introduction Letter, and Transcripts through the Safaricom Career Portal.',
    tipsForSuccess: 'Highlight any hands-on GitHub projects with Daraja API, React, or Python. Safaricom values demonstrable code repositories over theoretical coursework.'
  },
  {
    id: 'att-equity-fintech-2025',
    title: 'Data Analytics & Digital Banking Industrial Attachment',
    company: 'Equity Group Holdings',
    logoUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=200&q=80',
    location: 'Equity Centre, Upper Hill, Nairobi',
    eligibleDisciplines: ['Finance', 'Economics', 'Computer Science', 'Data Science', 'Statistics', 'BBIT'],
    stipend: 'KSh 25,000 / month',
    deadline: '30 April 2025',
    durationMonths: 3,
    status: 'Urgent',
    requirements: [
      'Continuing Bachelor student with Minimum Second Class Upper standing',
      'Proficiency in Excel, SQL, Python, or PowerBI',
      'Official recommendation letter from Dean/HOD',
      'Valid Student ID and National ID'
    ],
    duties: [
      'Assist in compiling credit risk models and loan performance visual dashboards',
      'Perform data cleansing on transactional datasets across East African subsidiaries',
      'Support branch digital transformation initiatives'
    ],
    applicationEmail: 'jobs@equitybank.co.ke',
    applicationUrl: 'https://equitygroupholdings.com/ke/careers',
    howToApply: 'Send email subject "APPLICATION FOR 3-MONTH INDUSTRIAL ATTACHMENT - [YOUR COURSE]" with attached PDF letter.',
    tipsForSuccess: 'Mention your capability with financial ratios, PowerBI dashboards, and SQL joins in your cover letter.'
  },
  {
    id: 'att-kengen-eng-2025',
    title: 'Geothermal & Electrical Power Systems Attachment',
    company: 'Kenya Electricity Generating Company (KenGen)',
    logoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=200&q=80',
    location: 'Olkaria Geothermal Complex, Naivasha / Nairobi',
    eligibleDisciplines: ['Electrical Engineering', 'Mechanical Engineering', 'Mechatronics', 'Geology'],
    stipend: 'KSh 20,000 / month + Transport from Naivasha',
    deadline: '20 May 2025',
    durationMonths: 3,
    status: 'Open',
    requirements: [
      'Engineering student (Year 3 or 4) registered with EBK Student Chapter',
      'Safety clearance & Personal Accident Insurance coverage (from University)',
      'Good academic transcript in Power Systems / Thermodynamics'
    ],
    duties: [
      'Observe steam turbine maintenance and high-voltage substation switchyards',
      'Record telemetry data from geothermal wellheads and cooling towers',
      'Participate in occupational health & safety (OHS) audits'
    ],
    applicationEmail: 'training@kengen.co.ke',
    applicationUrl: 'https://www.kengen.co.ke/careers',
    howToApply: 'Apply via KenGen Attachment Portal with your Insurance letter and Dean recommendation.',
    tipsForSuccess: 'KenGen places high emphasis on industrial safety; mention OSHA 2007 awareness in your CV.'
  },
  {
    id: 'att-kra-tax-2025',
    title: 'Tax Administration, Audit & Legal Affairs Attachment',
    company: 'Kenya Revenue Authority (KRA)',
    logoUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=200&q=80',
    location: 'Times Tower, Haile Selassie Ave, Nairobi',
    eligibleDisciplines: ['Commerce', 'Accounting', 'Law', 'Economics', 'Business Administration', 'IT'],
    stipend: 'KSh 20,000 / month',
    deadline: '10 May 2025',
    durationMonths: 3,
    status: 'Closing Soon',
    requirements: [
      'Second/Third year student in Law, Business, or IT',
      'Valid KRA Tax Compliance Certificate (TCC)',
      'University Attachment introduction letter'
    ],
    duties: [
      'Support iTax taxpayer ledger verifications and electronic invoice (eTIMS) audits',
      'Draft legal compliance memos and review tax dispute files',
      'Help taxpayers at the customer service desk'
    ],
    applicationEmail: 'eprecruitment@kra.go.ke',
    applicationUrl: 'https://erecruitment.kra.go.ke',
    howToApply: 'Create an account on the KRA e-recruitment portal and upload your certified credentials.',
    tipsForSuccess: 'Ensure you understand the eTIMS rollout and recent Finance Act tax changes.'
  }
];

export const SAMPLE_MOVIES: EntertainmentMovie[] = [
  {
    id: 'mov-nairobi-half-life',
    title: 'Nairobi Half Life',
    category: 'kenyan',
    year: 2012,
    duration: '1h 36m',
    rating: '8.4/10 IMDb',
    genres: ['Drama', 'Crime', 'Kenyan Cinema'],
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
    synopsis: 'A young aspiring actor from upcountry Kenya travels to the bustling metropolis of Nairobi to pursue his dreams, only to find himself quickly sucked into the gritty underworld of downtown car part gangs and theatrical redemption.',
    director: 'David "Tosh" Gitonga',
    trailerYoutubeId: 'v8w7q0J4lqk',
    streamProviders: [
      { name: 'Netflix', icon: '🍿', url: 'https://www.netflix.com' },
      { name: 'Showmax', icon: '🎬', url: 'https://www.showmax.com' }
    ],
    downloadAvailable: true
  },
  {
    id: 'mov-country-queen',
    title: 'Country Queen (Season 1)',
    category: 'kenyan',
    year: 2022,
    duration: '6 Episodes',
    rating: '7.8/10 IMDb',
    genres: ['Drama', 'Thriller', 'Kenyan Series'],
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    synopsis: 'A Nairobi event planner returns to her rural home village after 10 years, where she must confront a corrupt mining corporation threatening to destroy her ancestral land and her estranged family.',
    director: 'Vincent Mbaya',
    trailerYoutubeId: 'sKxU5H0K4dE',
    streamProviders: [
      { name: 'Netflix Original', icon: '🍿', url: 'https://www.netflix.com' }
    ],
    downloadAvailable: true
  },
  {
    id: 'mov-social-network',
    title: 'The Social Network',
    category: 'tech_doc',
    year: 2010,
    duration: '2h 00m',
    rating: '8.1/10 IMDb',
    genres: ['Biography', 'Drama', 'Tech & Coding'],
    posterUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    synopsis: 'The thrilling story of how a Harvard student programmed a revolutionary social network in his dorm room, leading to unexpected legal battles and redefining global communication.',
    director: 'David Fincher',
    trailerYoutubeId: 'lB95KLmpLR4',
    streamProviders: [
      { name: 'Prime Video', icon: '📺', url: 'https://www.primevideo.com' },
      { name: 'Apple TV', icon: '🍎', url: 'https://tv.apple.com' }
    ],
    downloadAvailable: true
  },
  {
    id: 'mov-interstellar',
    title: 'Interstellar (Sci-Fi Masterpiece)',
    category: 'blockbuster',
    year: 2014,
    duration: '2h 49m',
    rating: '8.7/10 IMDb',
    genres: ['Sci-Fi', 'Adventure', 'Physics & Space'],
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80',
    synopsis: 'When Earth becomes uninhabitable, a team of astronauts travels through a wormhole near Saturn in search of a new habitable planet for humanity across relativistic time dilations.',
    director: 'Christopher Nolan',
    trailerYoutubeId: 'zSWdZVtXT7E',
    streamProviders: [
      { name: 'Netflix', icon: '🍿', url: 'https://www.netflix.com' },
      { name: 'HBO Max', icon: '✨', url: 'https://www.max.com' }
    ],
    downloadAvailable: true
  }
];

export const SAMPLE_MUSIC_TRACKS: EntertainmentMusic[] = [
  {
    id: 'track-kenyan-01',
    title: 'Kula Nyama • Arbantone Campus Anthem',
    artist: 'Genge Vibez ft. Nairobi All-Stars',
    genre: 'gengetone_arbantone',
    genreName: 'Kenyan Arbantone & Drill',
    duration: '3:15',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
    audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3',
    bpm: 112,
    lyricsSnippet: 'Nairobi sherehe haishangi... Kula nyama choma na marafiki kwa ploti...',
    mood: 'High Energy & Party'
  },
  {
    id: 'track-lofi-01',
    title: 'Midnight Coding in Kilimani (Lo-Fi Study Beats)',
    artist: 'Nairobi Lo-Fi Beats',
    genre: 'lofi_study',
    genreName: 'Deep Focus & Study Lo-Fi',
    duration: '4:20',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
    audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3',
    bpm: 82,
    lyricsSnippet: '[Instrumental Chill Lo-Fi Piano & Soft Nairobi Rain]',
    mood: 'Deep Concentration & Revision'
  },
  {
    id: 'track-afro-01',
    title: 'City Lights Over Uhuru Highway (Afrobeats Chill)',
    artist: 'Afro-Kenya Collective',
    genre: 'afrobeats',
    genreName: 'Afrobeats & Amapiano Chills',
    duration: '3:45',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80',
    audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3',
    bpm: 104,
    lyricsSnippet: 'From Westlands to Mombasa road... Glowing under the Kenyan sky...',
    mood: 'Relaxing & Uplifting'
  },
  {
    id: 'track-gospel-01',
    title: 'Ushindi Wangu (Kenya Campus Worship)',
    artist: 'Grace & Praise Kenya',
    genre: 'gospel',
    genreName: 'Kenyan Gospel & Praise',
    duration: '4:50',
    coverUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=400&q=80',
    audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3',
    bpm: 78,
    lyricsSnippet: 'Mungu wetu ni mkuu, atatenda maajabu maishani mwetu...',
    mood: 'Peaceful & Encouraging'
  }
];

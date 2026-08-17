import { PastPaperItem, StudentClassifiedItem } from '../types';

export const INITIAL_PAST_PAPERS: PastPaperItem[] = [
  {
    id: 'pp_cbc_jss_math_2025',
    title: 'Grade 8 CBC Junior School Mathematics KPSEA / Endterm Assessment',
    level: 'CBC Junior School (Grade 7-9)',
    curriculumBody: 'KNEC',
    subject: 'Integrated Mathematics',
    year: 2025,
    termOrSemester: 'Term 2 Assessment',
    hasMarkingScheme: true,
    institutionOrSchool: 'National CBC Assessment Series',
    downloadUrl: 'https://enemind.co.ke/pastpapers/cbc-grade8-math-2025.pdf',
    tags: ['Grade 8', 'Algebra', 'Linear Equations', 'Marking Scheme Included'],
    downloadsCount: 1420,
    previewQuestions: [
      {
        questionNumber: '1',
        text: 'A water tank in a Juja secondary school has a capacity of 5,000 litres. If water flows out through two taps at 15 litres/min and 25 litres/min respectively, calculate the time in minutes taken to empty the full tank.',
        marks: 4,
        answerKey: 'Total rate = 15 + 25 = 40 L/min. Time = 5,000 / 40 = 125 minutes (2 hours 5 minutes).'
      },
      {
        questionNumber: '2',
        text: 'Simplify the algebraic expression: 3(2x - 4y) - 2(x + 5y).',
        marks: 3,
        answerKey: '6x - 12y - 2x - 10y = 4x - 22y.'
      },
      {
        questionNumber: '3',
        text: 'The perimeter of a rectangular CBC school garden is 72 metres. If the length is twice the width, calculate the area of the garden in square metres.',
        marks: 4,
        answerKey: '2(2w + w) = 72 => 6w = 72 => w = 12m, l = 24m. Area = 12 * 24 = 288 m².'
      }
    ]
  },
  {
    id: 'pp_kcse_physics_2024',
    title: 'KCSE 2024 Physics Paper 2 (Electricity, Magnetism & Waves)',
    level: 'KCSE (Form 1-4)',
    curriculumBody: 'KNEC',
    subject: 'Physics Paper 2',
    year: 2024,
    termOrSemester: 'National Final Exam',
    hasMarkingScheme: true,
    institutionOrSchool: 'KNEC National Examination',
    downloadUrl: 'https://enemind.co.ke/pastpapers/kcse-physics-p2-2024.pdf',
    tags: ['KCSE', 'Form 4', 'Electricity', 'Electromagnetic Induction', 'Waves'],
    downloadsCount: 3890,
    previewQuestions: [
      {
        questionNumber: '1',
        text: 'State Faraday\'s Law of Electromagnetic Induction and write the mathematical relationship.',
        marks: 3,
        answerKey: 'The induced electromotive force (e.m.f) in a conductor is directly proportional to the rate of change of magnetic flux linkage across it. E = -N(ΔΦ/Δt).'
      },
      {
        questionNumber: '2',
        text: 'A 240V, 1500W electric kettle in a Kenyatta University student hostel is operated for 20 minutes daily. Calculate the electrical energy in kWh consumed in 30 days.',
        marks: 4,
        answerKey: 'Power = 1.5 kW. Time per day = 20/60 = 1/3 hr. Daily energy = 1.5 * 1/3 = 0.5 kWh. Monthly energy = 0.5 * 30 = 15 kWh.'
      }
    ]
  },
  {
    id: 'pp_uon_cs_algorithms_2025',
    title: 'University of Nairobi (UoN) CSC 211: Data Structures & Algorithms',
    level: 'University Units',
    curriculumBody: 'University Exam Board',
    subject: 'Computer Science',
    year: 2025,
    termOrSemester: 'Semester 1 End of Semester Exam',
    hasMarkingScheme: true,
    institutionOrSchool: 'University of Nairobi (Chiromo Campus)',
    downloadUrl: 'https://enemind.co.ke/pastpapers/uon-csc211-algorithms-2025.pdf',
    tags: ['UoN', 'CSC 211', 'B-Trees', 'Graph Algorithms', 'Dijkstra', 'Big-O'],
    downloadsCount: 940,
    previewQuestions: [
      {
        questionNumber: '1',
        text: 'Compare the time complexity of QuickSort vs MergeSort in both average and worst-case scenarios. Explain how choosing a randomized pivot mitigates worst-case degradation in QuickSort.',
        marks: 6,
        answerKey: 'QuickSort: Avg O(n log n), Worst O(n²). MergeSort: Always O(n log n). Randomized pivot prevents already sorted inputs from causing unbalanced partitioning.'
      },
      {
        questionNumber: '2',
        text: 'Demonstrate Dijkstra\'s shortest path algorithm step-by-step for finding the lowest cost fiber-optic route between 5 campus server racks in Nairobi.',
        marks: 8,
        answerKey: 'Maintain distance priority queue, initialize source distance to 0, iteratively relax adjacent edges with lowest cumulative weight.'
      }
    ]
  },
  {
    id: 'pp_jkuat_mech_thermo_2024',
    title: 'JKUAT EMG 2301: Applied Thermodynamics & Power Plants',
    level: 'University Units',
    curriculumBody: 'University Exam Board',
    subject: 'Mechanical & Mechatronics Engineering',
    year: 2024,
    termOrSemester: 'Year 3 Sem 1 Final Exam',
    hasMarkingScheme: true,
    institutionOrSchool: 'JKUAT Main Campus Juja',
    downloadUrl: 'https://enemind.co.ke/pastpapers/jkuat-emg2301-thermo-2024.pdf',
    tags: ['JKUAT', 'Engineering', 'Rankine Cycle', 'Steam Tables', 'Juja'],
    downloadsCount: 620,
    previewQuestions: [
      {
        questionNumber: '1',
        text: 'An ideal reheat Rankine cycle operates between pressures of 8 MPa and 10 kPa. If the steam enters the high-pressure turbine at 500°C and is reheated to 500°C at 1.5 MPa, calculate the thermal efficiency using steam tables.',
        marks: 10,
        answerKey: 'Compute enthalpies h1 to h6 from tables. Thermal efficiency η = (W_turbine - W_pump) / Q_in ≈ 41.2%.'
      }
    ]
  },
  {
    id: 'pp_cbc_jss_science_2025',
    title: 'Grade 9 CBC Integrated Science & Agricultural Systems Model Assessment',
    level: 'CBC Junior School (Grade 7-9)',
    curriculumBody: 'KICD',
    subject: 'Integrated Science',
    year: 2025,
    termOrSemester: 'Term 1 National Model',
    hasMarkingScheme: true,
    institutionOrSchool: 'Kenya Institute of Curriculum Development (KICD)',
    downloadUrl: 'https://enemind.co.ke/pastpapers/cbc-grade9-integrated-science.pdf',
    tags: ['Grade 9', 'Clean Energy', 'Crop Protection', 'CBC Practical'],
    downloadsCount: 1180,
    previewQuestions: [
      {
        questionNumber: '1',
        text: 'Identify 3 sustainable clean energy sources suitable for powering a community irrigation pump in rural Machakos County, giving one advantage for each.',
        marks: 6,
        answerKey: '1. Solar Photovoltaic (Abundant sunlight in Kenya, zero fuel costs). 2. Small wind turbine (Good for open plains). 3. Biogas generator (Utilizes organic agricultural waste).'
      }
    ]
  }
];

export const INITIAL_STUDENT_CLASSIFIEDS: StudentClassifiedItem[] = [
  {
    id: 'sc_1',
    sellerId: 'student_kelvin_jkuat',
    sellerName: 'Kelvin Mwangi',
    sellerPhone: '+254 712 987 654',
    sellerUniversity: 'JKUAT Main Campus',
    campusGate: 'Gate C (Juja Havens Area)',
    title: 'Heavy Duty 4x6 Wooden Bed & High-Density Mattress',
    category: 'Furniture & Beds',
    condition: 'Gently Used',
    priceKes: 5500,
    isNegotiable: true,
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1540518614846-7ede433c4550?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Finished 4th year BSc IT at JKUAT and clearing out room at Gate C. Sturdy mahogany frame, no squeaks, clean medium-firm mattress included. Ready for immediate pickup.',
    postedDate: '2026-08-15',
    status: 'available'
  },
  {
    id: 'sc_2',
    sellerId: 'student_faith_ku',
    sellerName: 'Faith Wanjiku',
    sellerPhone: '+254 722 456 123',
    sellerUniversity: 'Kenyatta University (KU Main)',
    campusGate: 'KM Gate / Kahawa Sukari',
    title: '6kg Total ProGas Cylinder with Double Burner & Regulator',
    category: 'Cooking & Gas',
    condition: 'Like New',
    priceKes: 3200,
    isNegotiable: true,
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Bought 6 months ago, still has about 40% gas inside. Safety valve and heavy iron burner included. Meet up at KM Gate or Kahawa Sukari.',
    postedDate: '2026-08-16',
    status: 'available'
  },
  {
    id: 'sc_3',
    sellerId: 'student_brian_uon',
    sellerName: 'Brian Otieno',
    sellerPhone: '+254 733 112 233',
    sellerUniversity: 'University of Nairobi (UoN)',
    campusGate: 'Chiromo Science Campus Gate',
    title: 'Casio FX-991EX ClassWiz Scientific Calculator (Original)',
    category: 'Textbooks & Calculators',
    condition: 'Like New',
    priceKes: 2100,
    isNegotiable: false,
    images: [
      'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Genuine solar dual-power Casio calculator, suitable for engineering, statistics, and university exams with matrix and equation solvers. Screen is scratch-free.',
    postedDate: '2026-08-17',
    status: 'available'
  },
  {
    id: 'sc_4',
    sellerId: 'student_mercy_strathmore',
    sellerName: 'Mercy Achieng',
    sellerPhone: '+254 705 678 901',
    sellerUniversity: 'Strathmore University / Daystar',
    campusGate: 'Madaraka Phase 2 Estate',
    title: 'Compact 50L Ramtons Mini-Fridge for Hostel / Bedsitter',
    category: 'Hostel Appliances',
    condition: 'Good Condition',
    priceKes: 8900,
    isNegotiable: true,
    images: [
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Low power consumption (uses very few KPLC tokens per month). Freezer compartment works 100%. Moving back home to Kisumu after graduation.',
    postedDate: '2026-08-14',
    status: 'available'
  }
];

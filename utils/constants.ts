import { QuizQuestion, Course, ProgramAssessment } from './types';

/** Admin registration passcode (override via EXPO_PUBLIC_ADMIN_CODE in .env) */
export const ADMIN_REGISTRATION_CODE =
  process.env.EXPO_PUBLIC_ADMIN_CODE || 'wisepath-admin-2026';

/** Philippine senior high school tracks / strands (K-12) */
export const SENIOR_HIGH_STRANDS = [
  'STEM',
  'ABM',
  'HUMSS',
  'GAS',
  'TVL – ICT',
  'TVL – Home Economics',
  'TVL – Industrial Arts',
  'TVL – Agri-Fishery Arts',
  'Other / Undecided',
] as const;

/**
 * ============================================
 * WISEPATH - LIMITED TO 3 CORE COURSES ONLY
 * ============================================
 */

/** All programs scored on every question — options are trait-based, not single-program picks */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    text: 'Which activities energize you the most?',
    type: 'multipleChoice',
    options: [
      'Welcoming people and creating great guest experiences',
      'Building apps, fixing systems, or learning new tech',
      'Understanding rules, evidence, and how justice works',
      'Leading teams and keeping operations running smoothly',
    ],
    scoringWeights: [
      { hospitality: 3 },
      { it: 3 },
      { criminal_justice: 3 },
      { hospitality: 2, criminal_justice: 1 },
    ],
  },
  {
    id: 'q2',
    text: 'In group projects, you usually…',
    type: 'multipleChoice',
    options: [
      'Keep everyone aligned and communicating',
      'Handle the technical or analytical work',
      'Review accuracy, ethics, and follow-through',
      'Split tasks evenly across the team',
    ],
    scoringWeights: [
      { hospitality: 3 },
      { it: 3 },
      { criminal_justice: 3 },
      { hospitality: 1, it: 1, criminal_justice: 1 },
    ],
  },
  {
    id: 'q3',
    text: 'Which school subjects did you enjoy most?',
    type: 'multipleChoice',
    options: [
      'Business, tourism, home economics, or languages',
      'Math, science, or computer-related subjects',
      'Social studies, civics, debate, or current events',
      'A mix — I liked several different areas',
    ],
    scoringWeights: [
      { hospitality: 3 },
      { it: 3 },
      { criminal_justice: 3 },
      { hospitality: 1, it: 1, criminal_justice: 1 },
    ],
  },
  {
    id: 'q4',
    text: 'Your ideal workday would include…',
    type: 'multipleChoice',
    options: [
      'Meeting clients, guests, or customers in a lively setting',
      'Focused problem-solving with computers or data',
      'Field work, investigations, or community-facing duties',
      'A balance of desk work and working with people',
    ],
    scoringWeights: [
      { hospitality: 3 },
      { it: 3 },
      { criminal_justice: 3 },
      { hospitality: 2, it: 1 },
    ],
  },
  {
    id: 'q5',
    text: 'What matters most in your future career?',
    type: 'multipleChoice',
    options: [
      'Helping people feel valued every day',
      'Innovation, digital skills, and staying in demand',
      'Public service, integrity, and protecting others',
      'Stability with room to grow in any direction',
    ],
    scoringWeights: [
      { hospitality: 3, criminal_justice: 1 },
      { it: 3 },
      { criminal_justice: 3 },
      { hospitality: 1, it: 1, criminal_justice: 1 },
    ],
  },
  {
    id: 'q6',
    text: 'How do you feel about technology in your work?',
    type: 'multipleChoice',
    options: [
      'I love it — I want tech at the center of my career',
      'I use it comfortably when the job needs it',
      'I prefer people-first work over long screen time',
      'I like tech for research, records, or forensic tools',
    ],
    scoringWeights: [
      { it: 3 },
      { it: 1, hospitality: 1, criminal_justice: 1 },
      { hospitality: 3 },
      { criminal_justice: 2, it: 2 },
    ],
  },
];

/** Undergraduate programs available in WisePath (graduate and doctoral programs excluded). */
export const SAMPLE_COURSES: Course[] = [
  {
    id: 'computer_science',
    title: 'Bachelor of Science in Computer Science',
    description: 'Study algorithms, software engineering, artificial intelligence, and the theory behind modern computing systems.',
    difficulty: 'advanced',
    duration: '4 years',
    estimatedTuitionPerTerm: '₱30,000–₱45,000',
    skills: ['Programming', 'Algorithms', 'Software Engineering', 'Data Structures'],
    careerPaths: ['Software Engineer', 'Data Scientist', 'AI Engineer', 'Systems Analyst'],
    curriculum: ['Programming Fundamentals', 'Data Structures and Algorithms', 'Software Engineering', 'Artificial Intelligence'],
  },
  {
    id: 'it',
    title: 'Bachelor of Science in Information Technology',
    description: 'Build practical expertise in software development, cybersecurity, networks, databases, and enterprise technology.',
    difficulty: 'intermediate',
    duration: '4 years',
    estimatedTuitionPerTerm: '₱30,000–₱45,000',
    skills: ['Programming', 'Cybersecurity', 'Network Administration', 'Database Management'],
    careerPaths: ['Software Developer', 'Cybersecurity Specialist', 'Network Administrator', 'IT Project Manager'],
    curriculum: ['Introduction to Computing', 'Programming Fundamentals', 'Web Development', 'Database Systems', 'Network Administration', 'Cybersecurity Fundamentals'],
  },
  {
    id: 'civil_engineering',
    title: 'Bachelor of Science in Civil Engineering',
    description: 'Learn to plan, design, construct, and maintain safe infrastructure such as buildings, roads, bridges, and water systems.',
    difficulty: 'advanced',
    duration: '4 years',
    estimatedTuitionPerTerm: '₱30,000–₱45,000',
    skills: ['Structural Design', 'Surveying', 'Project Management', 'Engineering Mathematics'],
    careerPaths: ['Civil Engineer', 'Structural Engineer', 'Site Engineer', 'Project Manager'],
    curriculum: ['Engineering Mathematics', 'Surveying', 'Structural Analysis', 'Construction Management'],
  },
  {
    id: 'mechanical_engineering',
    title: 'Bachelor of Science in Mechanical Engineering',
    description: 'Develop mechanical systems and machines through engineering design, thermodynamics, manufacturing, and automation.',
    difficulty: 'advanced',
    duration: '4 years',
    estimatedTuitionPerTerm: '₱30,000–₱45,000',
    skills: ['Mechanical Design', 'Thermodynamics', 'CAD', 'Manufacturing'],
    careerPaths: ['Mechanical Engineer', 'Design Engineer', 'Plant Engineer', 'Maintenance Engineer'],
    curriculum: ['Engineering Mechanics', 'Thermodynamics', 'Machine Design', 'Manufacturing Processes'],
  },
  {
    id: 'electrical_engineering',
    title: 'Bachelor of Science in Electrical Engineering',
    description: 'Study electrical power, electronics, control systems, and the design of reliable electrical infrastructure.',
    difficulty: 'advanced',
    duration: '4 years',
    estimatedTuitionPerTerm: '₱30,000–₱45,000',
    skills: ['Circuit Design', 'Power Systems', 'Electronics', 'Control Systems'],
    careerPaths: ['Electrical Engineer', 'Power Systems Engineer', 'Controls Engineer', 'Project Engineer'],
    curriculum: ['Circuit Analysis', 'Electronics', 'Electrical Machines', 'Power Systems'],
  },
  {
    id: 'business_financial_management',
    title: 'Bachelor of Science in Business Administration – Major in Financial Management',
    description: 'Prepare to manage financial resources, investments, budgets, and business decisions in private and public organizations.',
    difficulty: 'intermediate',
    duration: '4 years',
    estimatedTuitionPerTerm: '₱25,000–₱40,000',
    skills: ['Financial Analysis', 'Budgeting', 'Investment Planning', 'Business Strategy'],
    careerPaths: ['Financial Analyst', 'Bank Officer', 'Investment Associate', 'Finance Manager'],
    curriculum: ['Financial Accounting', 'Corporate Finance', 'Investment Analysis', 'Risk Management'],
  },
  {
    id: 'business_marketing_management',
    title: 'Bachelor of Science in Business Administration – Major in Marketing Management',
    description: 'Learn consumer behavior, branding, market research, sales, and digital strategies that help organizations grow.',
    difficulty: 'intermediate',
    duration: '4 years',
    estimatedTuitionPerTerm: '₱25,000–₱40,000',
    skills: ['Marketing Strategy', 'Market Research', 'Branding', 'Digital Marketing'],
    careerPaths: ['Marketing Specialist', 'Brand Manager', 'Sales Manager', 'Market Researcher'],
    curriculum: ['Principles of Marketing', 'Consumer Behavior', 'Marketing Research', 'Digital Marketing'],
  },
  {
    id: 'accountancy',
    title: 'Bachelor of Science in Accountancy',
    description: 'Build expertise in accounting, auditing, taxation, and financial reporting for professional accounting careers.',
    difficulty: 'advanced',
    duration: '4 years',
    estimatedTuitionPerTerm: '₱30,000–₱45,000',
    skills: ['Accounting', 'Auditing', 'Taxation', 'Financial Reporting'],
    careerPaths: ['Certified Public Accountant', 'Auditor', 'Tax Associate', 'Accounting Manager'],
    curriculum: ['Financial Accounting', 'Cost Accounting', 'Auditing', 'Taxation'],
  },
  {
    id: 'management_accounting',
    title: 'Bachelor of Science in Management Accounting',
    description: 'Use accounting information, cost analysis, and performance measurement to support management decisions.',
    difficulty: 'intermediate',
    duration: '4 years',
    estimatedTuitionPerTerm: '₱25,000–₱40,000',
    skills: ['Cost Analysis', 'Budgeting', 'Performance Management', 'Business Analytics'],
    careerPaths: ['Management Accountant', 'Cost Accountant', 'Budget Analyst', 'Financial Controller'],
    curriculum: ['Management Accounting', 'Cost Accounting', 'Strategic Finance', 'Business Analytics'],
  },
  {
    id: 'hospitality',
    title: 'Bachelor of Science in Hospitality Management',
    description: 'Develop service, leadership, and operations skills for hotels, restaurants, events, resorts, and related industries.',
    difficulty: 'beginner',
    duration: '4 years',
    estimatedTuitionPerTerm: '₱25,000–₱40,000',
    skills: ['Customer Service', 'Operations Management', 'Leadership', 'Hospitality Operations'],
    careerPaths: ['Hotel Manager', 'Event Coordinator', 'Restaurant Manager', 'Resort Supervisor'],
    curriculum: ['Hospitality Industry Basics', 'Customer Service Excellence', 'Hotel Operations', 'Event Management', 'Food and Beverage Management'],
  },
  {
    id: 'communication',
    title: 'Bachelor of Arts in Communication',
    description: 'Build strong skills in media, journalism, broadcasting, public relations, and strategic communication.',
    difficulty: 'intermediate',
    duration: '4 years',
    skills: ['Writing', 'Public Speaking', 'Media Production', 'Public Relations'],
    careerPaths: ['Communications Officer', 'Journalist', 'Content Producer', 'Public Relations Specialist'],
    curriculum: ['Communication Theory', 'Media Writing', 'Broadcasting', 'Public Relations'],
  },
  {
    id: 'psychology',
    title: 'Bachelor of Science in Psychology',
    description: 'Understand human behavior and mental processes through psychological theory, assessment, and research.',
    difficulty: 'intermediate',
    duration: '4 years',
    estimatedTuitionPerTerm: '₱25,000–₱40,000',
    skills: ['Research', 'Behavioral Analysis', 'Communication', 'Psychological Assessment'],
    careerPaths: ['Human Resources Associate', 'Psychometrician', 'Research Assistant', 'Training Specialist'],
    curriculum: ['General Psychology', 'Developmental Psychology', 'Psychological Statistics', 'Assessment'],
  },
  {
    id: 'english_language',
    title: 'Bachelor of Arts in English Language',
    description: 'Develop advanced language, writing, literature, editing, and communication skills for diverse professional fields.',
    difficulty: 'intermediate',
    duration: '4 years',
    skills: ['Writing', 'Editing', 'Language Analysis', 'Communication'],
    careerPaths: ['Writer', 'Editor', 'Communications Specialist', 'Language Researcher'],
    curriculum: ['English Grammar', 'Linguistics', 'Creative Writing', 'Literary Studies'],
  },
  {
    id: 'mathematics',
    title: 'Bachelor of Science in Mathematics',
    description: 'Master mathematical reasoning, modeling, statistics, and analytical techniques used across science and industry.',
    difficulty: 'advanced',
    duration: '4 years',
    skills: ['Mathematical Modeling', 'Statistics', 'Logical Reasoning', 'Data Analysis'],
    careerPaths: ['Data Analyst', 'Statistician', 'Actuarial Analyst', 'Research Assistant'],
    curriculum: ['Calculus', 'Linear Algebra', 'Statistics', 'Mathematical Modeling'],
  },
  {
    id: 'physical_education',
    title: 'Bachelor of Physical Education',
    description: 'Prepare to promote fitness, sports development, wellness, and effective physical education instruction.',
    difficulty: 'intermediate',
    duration: '4 years',
    skills: ['Coaching', 'Fitness Instruction', 'Sports Management', 'Teaching'],
    careerPaths: ['Physical Education Teacher', 'Sports Coach', 'Fitness Instructor', 'Recreation Officer'],
    curriculum: ['Human Movement', 'Sports Science', 'Coaching Methods', 'Physical Education Teaching'],
  },
  {
    id: 'early_childhood_education',
    title: 'Bachelor of Early Childhood Education',
    description: 'Learn to support the development and learning of young children through inclusive, age-appropriate education.',
    difficulty: 'intermediate',
    duration: '4 years',
    skills: ['Child Development', 'Lesson Planning', 'Classroom Management', 'Communication'],
    careerPaths: ['Preschool Teacher', 'Early Childhood Educator', 'Learning Center Coordinator', 'Child Development Worker'],
    curriculum: ['Child Growth and Development', 'Play-Based Learning', 'Curriculum Design', 'Classroom Management'],
  },
  {
    id: 'elementary_education',
    title: 'Bachelor of Elementary Education',
    description: 'Prepare to teach foundational subjects and guide the academic and personal development of elementary learners.',
    difficulty: 'intermediate',
    duration: '4 years',
    skills: ['Teaching', 'Lesson Planning', 'Assessment', 'Classroom Management'],
    careerPaths: ['Elementary Teacher', 'Learning Facilitator', 'Curriculum Assistant', 'Education Program Officer'],
    curriculum: ['Foundations of Education', 'Teaching Methods', 'Child Development', 'Student Assessment'],
  },
  {
    id: 'secondary_education_english',
    title: 'Bachelor of Secondary Education – Major in English',
    description: 'Prepare to teach English language, communication, and literature effectively at the secondary level.',
    difficulty: 'intermediate',
    duration: '4 years',
    skills: ['English Teaching', 'Writing', 'Lesson Planning', 'Classroom Management'],
    careerPaths: ['Secondary English Teacher', 'Language Trainer', 'Curriculum Writer', 'Academic Coordinator'],
    curriculum: ['English Linguistics', 'Literature', 'Teaching English', 'Assessment of Learning'],
  },
  {
    id: 'secondary_education_filipino',
    title: 'Bachelor of Secondary Education – Major in Filipino',
    description: 'Prepare to teach Filipino language, literature, culture, and communication at the secondary level.',
    difficulty: 'intermediate',
    duration: '4 years',
    skills: ['Filipino Teaching', 'Writing', 'Cultural Studies', 'Classroom Management'],
    careerPaths: ['Secondary Filipino Teacher', 'Writer', 'Curriculum Developer', 'Language Program Coordinator'],
    curriculum: ['Wikang Filipino', 'Panitikang Filipino', 'Pagtuturo ng Filipino', 'Assessment of Learning'],
  },
  {
    id: 'tourism_management',
    title: 'Bachelor of Science in Tourism Management',
    description: 'Build knowledge in travel operations, destination management, events, tourism planning, and guest services.',
    difficulty: 'intermediate',
    duration: '4 years',
    estimatedTuitionPerTerm: '₱25,000–₱40,000',
    skills: ['Tourism Planning', 'Travel Operations', 'Customer Service', 'Event Management'],
    careerPaths: ['Tourism Officer', 'Travel Consultant', 'Tour Coordinator', 'Destination Marketing Specialist'],
    curriculum: ['Tourism Principles', 'Travel Operations', 'Destination Management', 'Tourism Marketing'],
  },
  {
    id: 'criminal_justice',
    title: 'Bachelor of Science in Criminology',
    description: 'Study criminology, law enforcement, criminal investigation, forensics, and public safety.',
    difficulty: 'intermediate',
    duration: '4 years',
    estimatedTuitionPerTerm: '₱25,000–₱40,000',
    skills: ['Law Enforcement', 'Criminology', 'Forensics', 'Legal Knowledge'],
    careerPaths: ['Police Officer', 'Investigator', 'Forensic Analyst', 'Corrections Officer'],
    curriculum: ['Criminology', 'Law Enforcement Operations', 'Criminal Law', 'Forensics', 'Criminal Investigation'],
  },
];

/** Legacy 1:1 option → course map (fallback for old Firestore questions) */
export const COURSE_SCORING_MAP: Record<string, Record<number, string>> = {
  q1: { 0: 'hospitality', 1: 'it', 2: 'criminal_justice' },
  q2: { 0: 'hospitality', 1: 'it', 2: 'criminal_justice' },
  q3: { 0: 'hospitality', 1: 'it', 2: 'criminal_justice' },
  q4: { 0: 'hospitality', 1: 'it', 2: 'criminal_justice' },
  q5: { 0: 'hospitality', 1: 'it', 2: 'criminal_justice' },
};

/** Weighted scores per question/option (built from QUIZ_QUESTIONS at runtime too) */
export const COURSE_SCORING_WEIGHTS: Record<
  string,
  Record<number, Partial<Record<string, number>>>
> = Object.fromEntries(
  QUIZ_QUESTIONS.filter((q) => q.scoringWeights?.length).map((q) => [
    q.id,
    Object.fromEntries(
      (q.scoringWeights || []).map((weights, index) => [index, weights])
    ),
  ])
);

export const PROGRAM_COURSE_IDS = [
  'computer_science',
  'it',
  'civil_engineering',
  'mechanical_engineering',
  'electrical_engineering',
  'business_financial_management',
  'business_marketing_management',
  'accountancy',
  'management_accounting',
  'hospitality',
  'communication',
  'psychology',
  'english_language',
  'mathematics',
  'physical_education',
  'early_childhood_education',
  'elementary_education',
  'secondary_education_english',
  'secondary_education_filipino',
  'tourism_management',
  'criminal_justice',
] as const;

/** Per-program assessments — each recommended program has its own set of 5 questions */
export const PROGRAM_ASSESSMENTS: ProgramAssessment[] = [
  {
    id: 'hosp_assessment',
    courseId: 'hospitality',
    title: 'Hospitality Management Assessment',
    description: 'Evaluate your fit for the Hospitality and Tourism industry.',
    questions: [
      {
        id: 'hosp_q1',
        text: 'How do you handle demanding or dissatisfied customers?',
        type: 'multipleChoice',
        options: [
          'Listen patiently, apologize, and find a solution',
          'Get defensive and argue back',
          'Pass them to someone else immediately',
          'Ignore the complaint'
        ],
        scoringWeights: [{ hospitality: 10 }, { hospitality: 0 }, { hospitality: 3 }, { hospitality: 0 }],
      },
      {
        id: 'hosp_q2',
        text: 'Are you comfortable working irregular hours (weekends, holidays, night shifts)?',
        type: 'multipleChoice',
        options: [
          'Yes, I prefer flexible or varied schedules',
          'No, I need a strict 9-to-5 schedule',
          'Sometimes, but not regularly',
          'Only if absolutely necessary'
        ],
        scoringWeights: [{ hospitality: 10 }, { hospitality: 0 }, { hospitality: 5 }, { hospitality: 2 }],
      },
      {
        id: 'hosp_q3',
        text: 'How would you describe your attention to detail regarding cleanliness and presentation?',
        type: 'multipleChoice',
        options: [
          'Highly meticulous and organized',
          'Average, I notice big issues',
          'I rarely notice the small details',
          'I don\'t care about presentation'
        ],
        scoringWeights: [{ hospitality: 10 }, { hospitality: 5 }, { hospitality: 0 }, { hospitality: 0 }],
      },
      {
        id: 'hosp_q4',
        text: 'When working in a diverse team from different cultural backgrounds, you:',
        type: 'multipleChoice',
        options: [
          'Embrace the diversity and learn from them',
          'Prefer working only with people similar to me',
          'Struggle to communicate',
          'Avoid group work'
        ],
        scoringWeights: [{ hospitality: 10 }, { hospitality: 0 }, { hospitality: 2 }, { hospitality: 0 }],
      },
      {
        id: 'hosp_q5',
        text: 'How do you feel about coordinating events or managing operations under pressure?',
        type: 'multipleChoice',
        options: [
          'I thrive under pressure and enjoy organizing',
          'I can handle it, but it stresses me out',
          'I prefer calm, predictable environments',
          'I freeze under pressure'
        ],
        scoringWeights: [{ hospitality: 10 }, { hospitality: 6 }, { hospitality: 2 }, { hospitality: 0 }],
      },
    ],
  },
  {
    id: 'it_assessment',
    courseId: 'it',
    title: 'Information Technology Assessment',
    description: 'Evaluate your technical aptitude and problem-solving skills.',
    questions: [
      {
        id: 'it_q1',
        text: 'When faced with a complex logic puzzle or a broken device, you usually:',
        type: 'multipleChoice',
        options: [
          'Break it down logically and try to fix it myself',
          'Ask someone else to fix it',
          'Give up quickly',
          'Ignore the problem'
        ],
        scoringWeights: [{ it: 10 }, { it: 3 }, { it: 0 }, { it: 0 }],
      },
      {
        id: 'it_q2',
        text: 'How comfortable are you with continuously learning new technologies and programming languages?',
        type: 'multipleChoice',
        options: [
          'Very comfortable, I love learning new tech',
          'I learn when required for a job',
          'I prefer sticking to what I already know',
          'I dislike having to learn new tools'
        ],
        scoringWeights: [{ it: 10 }, { it: 7 }, { it: 2 }, { it: 0 }],
      },
      {
        id: 'it_q3',
        text: 'When a program or system you are working on fails to run, what is your immediate reaction?',
        type: 'multipleChoice',
        options: [
          'Check the error logs and debug the issue',
          'Feel frustrated but keep trying randomly',
          'Ask for help immediately without looking',
          'Abandon the task'
        ],
        scoringWeights: [{ it: 10 }, { it: 5 }, { it: 2 }, { it: 0 }],
      },
      {
        id: 'it_q4',
        text: 'How do you prefer to approach a large, complex project?',
        type: 'multipleChoice',
        options: [
          'Plan the architecture first, then build components',
          'Start coding immediately and figure it out later',
          'Follow someone else\'s lead',
          'Procrastinate'
        ],
        scoringWeights: [{ it: 10 }, { it: 5 }, { it: 3 }, { it: 0 }],
      },
      {
        id: 'it_q5',
        text: 'How important is cybersecurity and data privacy to you?',
        type: 'multipleChoice',
        options: [
          'Crucial, I always consider security implications',
          'Important, but I let others handle it',
          'Not very important',
          'I don\'t know what that means'
        ],
        scoringWeights: [{ it: 10 }, { it: 6 }, { it: 0 }, { it: 0 }],
      },
    ],
  },
  {
    id: 'cj_assessment',
    courseId: 'criminal_justice',
    title: 'Criminal Justice Assessment',
    description: 'Evaluate your ethical standards and interest in law enforcement.',
    questions: [
      {
        id: 'cj_q1',
        text: 'If you witness a minor rule violation by a peer, what is your approach?',
        type: 'multipleChoice',
        options: [
          'Report it or address it according to protocol',
          'Ignore it if no one gets hurt',
          'Join in',
          'Let someone else deal with it'
        ],
        scoringWeights: [{ criminal_justice: 10 }, { criminal_justice: 3 }, { criminal_justice: 0 }, { criminal_justice: 2 }],
      },
      {
        id: 'cj_q2',
        text: 'How do you handle physical and mental stress in high-risk environments?',
        type: 'multipleChoice',
        options: [
          'I maintain composure and rely on my training',
          'I get anxious but try to manage',
          'I easily panic',
          'I avoid stressful situations entirely'
        ],
        scoringWeights: [{ criminal_justice: 10 }, { criminal_justice: 5 }, { criminal_justice: 0 }, { criminal_justice: 0 }],
      },
      {
        id: 'cj_q3',
        text: 'How important is strict adherence to rules and laws to you?',
        type: 'multipleChoice',
        options: [
          'Very important, laws must be upheld',
          'Important, but exceptions can be made',
          'I believe rules are meant to be bent',
          'I disagree with most rules'
        ],
        scoringWeights: [{ criminal_justice: 10 }, { criminal_justice: 5 }, { criminal_justice: 0 }, { criminal_justice: 0 }],
      },
      {
        id: 'cj_q4',
        text: 'When conducting an investigation or gathering facts, you usually:',
        type: 'multipleChoice',
        options: [
          'Are objective, thorough, and unbiased',
          'Rely heavily on intuition over facts',
          'Jump to conclusions quickly',
          'Struggle to pay attention to evidence'
        ],
        scoringWeights: [{ criminal_justice: 10 }, { criminal_justice: 4 }, { criminal_justice: 0 }, { criminal_justice: 0 }],
      },
      {
        id: 'cj_q5',
        text: 'What is your primary motivation for entering the criminal justice field?',
        type: 'multipleChoice',
        options: [
          'To protect society and seek justice',
          'The thrill and excitement',
          'Job security',
          'I don\'t have another option'
        ],
        scoringWeights: [{ criminal_justice: 10 }, { criminal_justice: 5 }, { criminal_justice: 3 }, { criminal_justice: 0 }],
      },
    ],
  },
];

export const getProgramAssessmentsForCourse = (
  courseId: string
): ProgramAssessment[] =>
  PROGRAM_ASSESSMENTS.filter((a) => a.courseId === courseId);

/**
 * ============================================
 * SAMPLE PROGRESS DATA
 * ============================================
 */
export const SAMPLE_PROGRESS_DATA = {
  hospitality: {
    currentYearLevel: 2 as const,
    currentSemester: 1 as const,
    completedSubjects: [
      'Hospitality Industry Basics',
      'Customer Service Excellence',
      'Hotel Operations & Management',
    ],
    ongoingSubjects: [
      'Event Planning & Management',
      'Food & Beverage Management',
    ],
    remainingSubjects: [
      'Tourism & Destination Management',
      'Leadership & Team Management',
      'Business Finance & Accounting',
    ],
    progressPercentage: 40,
    graduationReady: false,
    enrollmentDate: new Date('2023-09-01'),
    expectedGraduationDate: new Date('2027-06-30'),
  },
  it: {
    currentYearLevel: 2 as const,
    currentSemester: 2 as const,
    completedSubjects: [
      'Introduction to Computing',
      'Programming Fundamentals (Python, Java)',
      'Web Development (HTML, CSS, JavaScript)',
      'Database Systems & SQL',
    ],
    ongoingSubjects: [
      'Network Administration & Security',
      'Cybersecurity Fundamentals',
    ],
    remainingSubjects: [
      'Software Engineering Principles',
      'Cloud Computing & DevOps',
    ],
    progressPercentage: 50,
    graduationReady: false,
    enrollmentDate: new Date('2023-09-01'),
    expectedGraduationDate: new Date('2027-06-30'),
  },
  criminal_justice: {
    currentYearLevel: 3 as const,
    currentSemester: 1 as const,
    completedSubjects: [
      'Introduction to Criminal Justice System',
      'Criminology & Crime Prevention',
      'Law Enforcement Operations',
      'Criminal Law & Procedure',
      'Forensics & Evidence Collection',
    ],
    ongoingSubjects: [
      'Corrections & Rehabilitation',
      'Criminal Investigation Techniques',
    ],
    remainingSubjects: [
      'Professional Ethics & Public Safety',
    ],
    progressPercentage: 75,
    graduationReady: false,
    enrollmentDate: new Date('2022-09-01'),
    expectedGraduationDate: new Date('2026-06-30'),
  },
};

/**
 * ============================================
 * PROFILE INTAKE OPTIONS
 * Scope: college students + incoming college students only
 * ============================================
 */
export const STUDENT_STATUS_OPTIONS: { value: 'incoming' | 'current'; label: string }[] = [
  { value: 'incoming', label: 'Incoming college student' },
  { value: 'current', label: 'Current college student' },
];

export const SHS_STRANDS = [
  'STEM',
  'ABM',
  'HUMSS',
  'GAS',
  'TVL',
  'Arts and Design',
  'Sports',
  'N/A',
];

export const RESIDENCE_TYPE_OPTIONS: { value: 'urban' | 'rural'; label: string }[] = [
  { value: 'urban', label: 'Urban' },
  { value: 'rural', label: 'Rural' },
];

export const PARENTAL_INCOME_OPTIONS: {
  value:
    | 'below_10k'
    | '10k_20k'
    | '20k_40k'
    | '40k_70k'
    | 'above_70k'
    | 'prefer_not_to_say';
  label: string;
}[] = [
  { value: 'below_10k', label: 'Below ₱10,000' },
  { value: '10k_20k', label: '₱10,000 – ₱20,000' },
  { value: '20k_40k', label: '₱20,000 – ₱40,000' },
  { value: '40k_70k', label: '₱40,000 – ₱70,000' },
  { value: 'above_70k', label: 'Above ₱70,000' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

/** Expanded career interest areas (multi-select), broader than the 3 core programs */
export const CAREER_INTEREST_OPTIONS = [
  'Hospitality & Tourism',
  'Information Technology & Computing',
  'Law Enforcement & Public Safety',
  'Business & Entrepreneurship',
  'Healthcare & Wellness',
  'Education & Teaching',
  'Engineering & Technical Trades',
  'Arts, Media & Design',
  'Government & Public Service',
  'Science & Research',
];

export const LEARNING_GOALS_OPTIONS = [
  'Gain hands-on skills for immediate employment',
  'Prepare for advanced studies (e.g. Master\'s, Law, Med)',
  'Build a strong theoretical foundation',
  'Learn leadership and management skills',
  'Master technical or digital tools',
  'Improve communication and soft skills',
  'Understand industry standards and ethics',
  'Explore personal interests before committing',
];

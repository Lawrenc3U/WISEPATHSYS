import { QuizQuestion, Course } from './types';

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

/**
 * ============================================
 * THREE CORE COURSES ONLY
 * ============================================
 */
export const SAMPLE_COURSES: Course[] = [
  {
    id: 'hospitality',
    title: 'Hospitality Management',
    description:
      'Master the art of hospitality and tourism management. Learn to lead teams, manage operations, and create exceptional customer experiences in hotels, resorts, and tourism enterprises.',
    difficulty: 'beginner',
    duration: '4 years',
    skills: ['Customer Service', 'Operations Management', 'Leadership', 'Hospitality Operations'],
    careerPaths: [
      'Hotel Manager',
      'Event Coordinator',
      'Tourism Director',
      'Restaurant Manager',
      'Hospitality Director',
    ],
    curriculum: [
      'Hospitality Industry Basics',
      'Customer Service Excellence',
      'Hotel Operations & Management',
      'Event Planning & Management',
      'Food & Beverage Management',
      'Tourism & Destination Management',
      'Leadership & Team Management',
      'Business Finance & Accounting',
    ],
  },
  {
    id: 'it',
    title: 'Information Technology',
    description:
      'Transform your career in the digital world. Learn programming, cybersecurity, network administration, and software development. Build innovative solutions that power modern businesses.',
    difficulty: 'intermediate',
    duration: '4 years',
    skills: ['Programming', 'Cybersecurity', 'Network Administration', 'Database Management'],
    careerPaths: [
      'Software Developer',
      'Cybersecurity Specialist',
      'Network Administrator',
      'Database Administrator',
      'IT Project Manager',
      'Cloud Architect',
    ],
    curriculum: [
      'Introduction to Computing',
      'Programming Fundamentals (Python, Java)',
      'Web Development (HTML, CSS, JavaScript)',
      'Database Systems & SQL',
      'Network Administration & Security',
      'Cybersecurity Fundamentals',
      'Software Engineering Principles',
      'Cloud Computing & DevOps',
    ],
  },
  {
    id: 'criminal_justice',
    title: 'Criminal Justice',
    description:
      'Serve your community through criminal justice. Study law enforcement, criminology, forensics, and the legal system. Prepare for careers protecting and serving society.',
    difficulty: 'intermediate',
    duration: '4 years',
    skills: ['Law Enforcement', 'Criminology', 'Forensics', 'Legal Knowledge'],
    careerPaths: [
      'Police Officer',
      'Detective',
      'Forensic Analyst',
      'Corrections Officer',
      'Legal Analyst',
      'Crime Scene Investigator',
      'Criminal Justice Administrator',
    ],
    curriculum: [
      'Introduction to Criminal Justice System',
      'Criminology & Crime Prevention',
      'Law Enforcement Operations',
      'Criminal Law & Procedure',
      'Forensics & Evidence Collection',
      'Corrections & Rehabilitation',
      'Criminal Investigation Techniques',
      'Professional Ethics & Public Safety',
    ],
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

export const PROGRAM_COURSE_IDS = ['hospitality', 'it', 'criminal_justice'] as const;

<<<<<<< HEAD
=======
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

>>>>>>> 5f9ea0b26c12317ca925171c136617506373f5cf
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
<<<<<<< HEAD
=======

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
>>>>>>> 5f9ea0b26c12317ca925171c136617506373f5cf

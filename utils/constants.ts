import { QuizQuestion, Course, ProgramAssessment } from './types';

/** Admin registration passcode (override via EXPO_PUBLIC_ADMIN_CODE in .env) */
export const ADMIN_REGISTRATION_CODE =
  process.env.EXPO_PUBLIC_ADMIN_CODE || 'wisepath-admin-2026';

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

/** Per-program assessments — each recommended program has its own set */
export const PROGRAM_ASSESSMENTS: ProgramAssessment[] = [
  {
    id: 'hosp_orientation',
    courseId: 'hospitality',
    title: 'Hospitality Orientation',
    description: 'Explore guest service mindset and industry basics.',
    questions: [
      {
        id: 'hosp_o1',
        text: 'What excites you most about hospitality?',
        type: 'multipleChoice',
        options: [
          'Creating memorable guest experiences',
          'Managing events and operations',
          'Food and beverage leadership',
          'Tourism and destination marketing',
        ],
      },
      {
        id: 'hosp_o2',
        text: 'How comfortable are you leading a front-desk or service team?',
        type: 'multipleChoice',
        options: [
          'Very comfortable — I enjoy leading people',
          'Somewhat — I am building confidence',
          'Prefer supporting roles for now',
          'Not sure yet',
        ],
      },
    ],
  },
  {
    id: 'hosp_skills',
    courseId: 'hospitality',
    title: 'Service Skills Check',
    description: 'Gauge your customer service and operations readiness.',
    questions: [
      {
        id: 'hosp_s1',
        text: 'When a guest complaint arises, you typically…',
        type: 'multipleChoice',
        options: [
          'Listen calmly and resolve quickly',
          'Escalate to a supervisor',
          'Follow standard procedures step by step',
          'Feel unsure but want to learn',
        ],
      },
    ],
  },
  {
    id: 'hosp_career',
    courseId: 'hospitality',
    title: 'Career Fit — Hospitality',
    description: 'Match your goals with hospitality career paths.',
    questions: [
      {
        id: 'hosp_c1',
        text: 'Which hospitality career appeals to you most?',
        type: 'multipleChoice',
        options: [
          'Hotel or resort management',
          'Event coordination',
          'Restaurant or F&B management',
          'Tourism director',
        ],
      },
    ],
  },
  {
    id: 'it_orientation',
    courseId: 'it',
    title: 'IT Foundations',
    description: 'Check your interest in computing and problem solving.',
    questions: [
      {
        id: 'it_o1',
        text: 'Which IT area interests you most?',
        type: 'multipleChoice',
        options: [
          'Software development',
          'Cybersecurity',
          'Networks and infrastructure',
          'Data and databases',
        ],
      },
      {
        id: 'it_o2',
        text: 'How often do you practice coding or tech projects?',
        type: 'multipleChoice',
        options: [
          'Regularly — it is a hobby',
          'Sometimes for school or work',
          'Rarely but curious',
          'Just starting out',
        ],
      },
    ],
  },
  {
    id: 'it_skills',
    courseId: 'it',
    title: 'Technical Readiness',
    description: 'Assess comfort with logic, systems, and learning tech.',
    questions: [
      {
        id: 'it_s1',
        text: 'When learning a new tool or language, you prefer…',
        type: 'multipleChoice',
        options: [
          'Hands-on tutorials and projects',
          'Structured courses with assignments',
          'Pairing with mentors or peers',
          'Reading docs and experimenting alone',
        ],
      },
    ],
  },
  {
    id: 'it_career',
    courseId: 'it',
    title: 'Career Fit — IT',
    description: 'Align your strengths with IT career paths.',
    questions: [
      {
        id: 'it_c1',
        text: 'Your ideal first IT role would be…',
        type: 'multipleChoice',
        options: [
          'Developer or engineer',
          'Security analyst',
          'Network or cloud administrator',
          'IT project coordinator',
        ],
      },
    ],
  },
  {
    id: 'cj_orientation',
    courseId: 'criminal_justice',
    title: 'Criminal Justice Overview',
    description: 'Explore public service and justice system interest.',
    questions: [
      {
        id: 'cj_o1',
        text: 'What draws you to criminal justice?',
        type: 'multipleChoice',
        options: [
          'Protecting the community',
          'Investigations and forensics',
          'Legal and procedural work',
          'Corrections and rehabilitation',
        ],
      },
      {
        id: 'cj_o2',
        text: 'How do you handle high-pressure situations?',
        type: 'multipleChoice',
        options: [
          'Stay calm and follow protocol',
          'Think quickly and adapt',
          'Rely on team communication',
          'Still developing those skills',
        ],
      },
    ],
  },
  {
    id: 'cj_skills',
    courseId: 'criminal_justice',
    title: 'Ethics & Procedure Check',
    description: 'Reflect on integrity and attention to detail.',
    questions: [
      {
        id: 'cj_s1',
        text: 'Accuracy and ethics in documentation are…',
        type: 'multipleChoice',
        options: [
          'Essential — I am very detail-oriented',
          'Important — I double-check my work',
          'Something I am learning',
          'New to me but willing to learn',
        ],
      },
    ],
  },
  {
    id: 'cj_career',
    courseId: 'criminal_justice',
    title: 'Career Fit — Criminal Justice',
    description: 'Match your goals with justice careers.',
    questions: [
      {
        id: 'cj_c1',
        text: 'Which path interests you most?',
        type: 'multipleChoice',
        options: [
          'Law enforcement officer',
          'Detective or investigator',
          'Forensic analyst',
          'Legal or corrections specialist',
        ],
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

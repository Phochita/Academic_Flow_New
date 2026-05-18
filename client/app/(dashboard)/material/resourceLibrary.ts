export type ResourceType = 'materials' | 'recordings';

export type DriveResourceItem = {
  id: string;
  title: string;
  description: string;
  meta: string;
  driveHref: string;
  tag: string;
};

type CourseResourceMap = {
  materials: DriveResourceItem[];
  recordings: DriveResourceItem[];
};

export type DriveResourceCollection = {
  course: string;
  type: ResourceType;
  title: string;
  subtitle: string;
  folderHref: string;
  items: DriveResourceItem[];
};

function buildDriveSearchHref(query: string) {
  return `https://drive.google.com/drive/search?q=${encodeURIComponent(query)}`;
}

function createItem(
  id: string,
  title: string,
  description: string,
  meta: string,
  tag: string,
  query: string
): DriveResourceItem {
  return {
    id,
    title,
    description,
    meta,
    tag,
    driveHref: buildDriveSearchHref(query),
  };
}

const courseResourceLibrary: Record<string, CourseResourceMap> = {
  'Machine Learning': {
    materials: [
      createItem(
        'ml-week-1-slides',
        'Week 1 Lecture Slides',
        'Foundations of supervised learning, notation, and model intuition.',
        'PDF | Updated Apr 7',
        'LECTURE PDF',
        'Machine Learning Week 1 Lecture Slides PDF'
      ),
      createItem(
        'ml-lab-sheet',
        'Gradient Descent Lab Sheet',
        'Hands-on worksheet for optimization practice and loss analysis.',
        'DOCX | Updated Apr 8',
        'LAB SHEET',
        'Machine Learning Gradient Descent Lab Sheet DOCX'
      ),
      createItem(
        'ml-reading-pack',
        'Reading Pack: Neural Networks',
        'Curated notes and reference articles for the current unit.',
        'ZIP | Updated Apr 9',
        'READING PACK',
        'Machine Learning Neural Networks Reading Pack ZIP'
      ),
    ],
    recordings: [
      createItem(
        'ml-session-03',
        'Session 03 Recording',
        'Full classroom capture with model evaluation walkthrough.',
        'Video | 52 min',
        'CLASS VIDEO',
        'Machine Learning Session 03 Recording'
      ),
      createItem(
        'ml-demo-review',
        'Model Demo Review',
        'Short demo recap covering training results and discussion points.',
        'Video | 18 min',
        'DEMO REVIEW',
        'Machine Learning Model Demo Review Recording'
      ),
    ],
  },
  'Python Programming': {
    materials: [
      createItem(
        'python-control-flow',
        'Control Flow Notes',
        'Lecture notes on loops, functions, and structured problem solving.',
        'PDF | Updated Apr 5',
        'LECTURE PDF',
        'Python Programming Control Flow Notes PDF'
      ),
      createItem(
        'python-practice-set',
        'Practice Set 04',
        'Problem set for list processing and function decomposition.',
        'DOCX | Updated Apr 8',
        'PRACTICE SET',
        'Python Programming Practice Set 04 DOCX'
      ),
      createItem(
        'python-cheatsheet',
        'Python Syntax Cheat Sheet',
        'Quick reference guide for syntax used in this module.',
        'PDF | Updated Apr 9',
        'CHEAT SHEET',
        'Python Programming Syntax Cheat Sheet PDF'
      ),
    ],
    recordings: [
      createItem(
        'python-live-coding',
        'Live Coding Session',
        'Recorded debugging session from the latest class.',
        'Video | 47 min',
        'LIVE CODING',
        'Python Programming Live Coding Session Recording'
      ),
      createItem(
        'python-qa-recap',
        'Q&A Recap',
        'Short recap of common student questions and solutions.',
        'Video | 16 min',
        'Q&A RECAP',
        'Python Programming Q&A Recap Recording'
      ),
    ],
  },
  Cryptography: {
    materials: [
      createItem(
        'crypto-symmetric',
        'Symmetric Encryption Deck',
        'Slide deck explaining block ciphers, stream ciphers, and usage patterns.',
        'PPTX | Updated Apr 6',
        'SLIDE DECK',
        'Cryptography Symmetric Encryption Deck PPTX'
      ),
      createItem(
        'crypto-problem-set',
        'Problem Set: Key Exchange',
        'Exercise sheet for key exchange protocols and threat modelling.',
        'PDF | Updated Apr 8',
        'PROBLEM SET',
        'Cryptography Key Exchange Problem Set PDF'
      ),
    ],
    recordings: [
      createItem(
        'crypto-seminar',
        'Seminar Recording',
        'Lecture capture covering classical cryptography and attack models.',
        'Video | 49 min',
        'SEMINAR',
        'Cryptography Seminar Recording'
      ),
      createItem(
        'crypto-whiteboard',
        'Whiteboard Recap',
        'Short explainer on substitution and transposition techniques.',
        'Video | 14 min',
        'RECAP',
        'Cryptography Whiteboard Recap Recording'
      ),
    ],
  },
};

function createFallbackItems(course: string, type: ResourceType): DriveResourceItem[] {
  if (type === 'materials') {
    return [
      createItem(
        `${course}-lecture-notes`,
        'Lecture Notes',
        'Core notes shared by the lecturer for the current class topic.',
        'PDF | Updated this week',
        'LECTURE PDF',
        `${course} lecture notes PDF`
      ),
      createItem(
        `${course}-class-handout`,
        'Class Handout',
        'Supplementary handout, examples, and study references.',
        'DOCX | Updated this week',
        'HANDOUT',
        `${course} class handout DOCX`
      ),
    ];
  }

  return [
    createItem(
      `${course}-class-recording`,
      'Class Recording',
      'Recorded session shared by the lecturer for revision.',
      'Video | 45 min',
      'CLASS VIDEO',
      `${course} class recording`
    ),
    createItem(
      `${course}-discussion-recap`,
      'Discussion Recap',
      'Short recap recording for the latest discussion and announcements.',
      'Video | 15 min',
      'RECAP',
      `${course} discussion recap recording`
    ),
  ];
}

export function getDriveResourceCollection(courseParam: string | null, type: ResourceType): DriveResourceCollection {
  const course = courseParam?.trim() || 'Selected Course';
  const items = courseResourceLibrary[course]?.[type] ?? createFallbackItems(course, type);
  const title = type === 'materials' ? 'Materials' : 'Recordings';
  const subtitle =
    type === 'materials'
      ? `Open lecturer-shared study files for ${course} in Google Drive.`
      : `Open lecturer-shared class recordings for ${course} in Google Drive.`;

  return {
    course,
    type,
    title,
    subtitle,
    folderHref: buildDriveSearchHref(`${course} ${title}`),
    items,
  };
}

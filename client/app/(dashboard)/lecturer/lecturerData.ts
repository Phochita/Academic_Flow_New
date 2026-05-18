export type LecturerWorkflowStatus = 'assigned' | 'missing' | 'graded';

export type LecturerClassworkItem = {
  id: string;
  title: string;
  type: 'Assignment' | 'Quiz Assignment' | 'Material';
  topic: string;
  due: string;
  points: string;
  assignedTo: string;
  submissions: string;
  course: string;
  workflowStatus: LecturerWorkflowStatus;
  description: string;
  instructions: string[];
  isGradable: boolean;
};

export type LecturerStudentSubmissionStatus =
  | 'Ready to grade'
  | 'Needs review'
  | 'Graded'
  | 'Returned'
  | 'Missing';

export type LecturerStudentGrade = {
  id: string;
  student: string;
  submittedAt: string;
  status: LecturerStudentSubmissionStatus;
  score: string;
  submissionNote: string;
  feedback: string;
};

export type LecturerAssignmentGroup = {
  id: string;
  title: string;
  course: string;
  due: string;
  points: string;
  topic: string;
  assignmentSummary: string;
  students: LecturerStudentGrade[];
};

export const lecturerClassworkItems: LecturerClassworkItem[] = [
  {
    id: 'algorithm-design-lab-4',
    title: 'Algorithm Design Lab 4',
    type: 'Assignment',
    topic: 'Week 6',
    due: 'Tomorrow, 11:59 PM',
    points: '100 points',
    assignedTo: 'Assigned to 88 students',
    submissions: '74 turned in',
    course: 'Advanced Data Structures',
    workflowStatus: 'assigned',
    description: 'Students submit a complete lab walkthrough explaining the algorithm choice, time complexity, and test results.',
    instructions: [
      'Upload the final PDF report and source code archive.',
      'Explain at least two optimization decisions made in the solution.',
      'Include screenshots or console output from the final run.',
    ],
    isGradable: true,
  },
  {
    id: 'neural-network-midterm-study-guide',
    title: 'Neural Network Midterm Study Guide',
    type: 'Material',
    topic: 'Midterm Review',
    due: 'Posted today',
    points: 'Reference material',
    assignedTo: 'Shared with all students',
    submissions: '32 viewed in the last hour',
    course: 'Neural Network Architecture',
    workflowStatus: 'graded',
    description: 'A review packet covering model architecture, loss functions, activation layers, and evaluation techniques.',
    instructions: [
      'Use this guide before the midterm review session.',
      'Focus on the example backpropagation steps on page 5.',
      'Bring one question to class based on the reading.',
    ],
    isGradable: false,
  },
  {
    id: 'cloud-deployment-quiz',
    title: 'Cloud Deployment Quiz',
    type: 'Quiz Assignment',
    topic: 'Project Work',
    due: 'Friday, 5:00 PM',
    points: '25 points',
    assignedTo: 'Assigned to 130 students',
    submissions: '52 turned in',
    course: 'Cloud Computing Systems',
    workflowStatus: 'missing',
    description: 'Short quiz on deployment steps, cost planning, and rollback strategy for cloud application releases.',
    instructions: [
      'Complete the quiz individually.',
      'All answers must be submitted before the closing time.',
      'Review the deployment slides before you begin.',
    ],
    isGradable: true,
  },
  {
    id: 'database-optimization-slides',
    title: 'Database Optimization Slides',
    type: 'Material',
    topic: 'Week 6',
    due: 'Posted yesterday',
    points: 'Lecture material',
    assignedTo: 'Shared with all students',
    submissions: '61 viewed',
    course: 'Advanced Data Structures',
    workflowStatus: 'graded',
    description: 'Lecture slides for query planning, indexing, and performance tuning examples discussed in class.',
    instructions: [
      'Review the indexing examples before the next class.',
      'Prepare one optimization example to discuss in the workshop.',
      'Use this deck together with the worksheet shared in stream.',
    ],
    isGradable: false,
  },
];

export const lecturerAssignmentGroups: LecturerAssignmentGroup[] = [
  {
    id: 'algorithm-design-lab-4',
    title: 'Algorithm Design Lab 4',
    course: 'Advanced Data Structures',
    due: 'Tomorrow, 11:59 PM',
    points: '100 points',
    topic: 'Week 6',
    assignmentSummary: 'Grade the lab report, validate the submitted source code, and return feedback on optimization choices.',
    students: [
      {
        id: 'marcus-chen',
        student: 'Marcus Chen',
        submittedAt: 'Submitted 2 hours ago',
        status: 'Ready to grade',
        score: '78',
        submissionNote: 'Submitted report PDF and code archive. Complexity explanation is incomplete in section 3.',
        feedback: 'Add a clearer explanation of why the chosen optimization reduced runtime.',
      },
      {
        id: 'nika-sok',
        student: 'Nika Sok',
        submittedAt: 'Submitted yesterday',
        status: 'Graded',
        score: '88',
        submissionNote: 'Strong submission with complete explanation and correct sample output.',
        feedback: 'Good structure. Push your analysis deeper when comparing alternate approaches.',
      },
      {
        id: 'srey-leak',
        student: 'Srey Leak',
        submittedAt: 'Missing',
        status: 'Missing',
        score: '-',
        submissionNote: 'No files submitted yet.',
        feedback: 'Follow up needed.',
      },
    ],
  },
  {
    id: 'cloud-deployment-quiz',
    title: 'Cloud Deployment Quiz',
    course: 'Cloud Computing Systems',
    due: 'Friday, 5:00 PM',
    points: '25 points',
    topic: 'Project Work',
    assignmentSummary: 'Review quiz answers, confirm deployment planning decisions, and return quick score feedback.',
    students: [
      {
        id: 'jordan-smith',
        student: 'Jordan Smith',
        submittedAt: 'Submitted today',
        status: 'Needs review',
        score: '16',
        submissionNote: 'Completed the quiz but missed rollback and monitoring questions.',
        feedback: 'Revisit the deployment rollback checklist before the next lab.',
      },
      {
        id: 'dara-ngin',
        student: 'Dara Ngin',
        submittedAt: 'Submitted today',
        status: 'Ready to grade',
        score: '21',
        submissionNote: 'Mostly correct, with one weak answer around cost estimation.',
        feedback: 'Strong overall. Improve the budgeting justification in section 2.',
      },
      {
        id: 'phalla-hem',
        student: 'Phalla Hem',
        submittedAt: 'Missing',
        status: 'Missing',
        score: '-',
        submissionNote: 'Quiz not submitted.',
        feedback: 'Needs reminder.',
      },
    ],
  },
];

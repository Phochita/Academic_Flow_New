export type AdminMetric = {
  label: string;
  value: string;
  change: string;
  detail: string;
  tone: 'purple' | 'blue' | 'green' | 'amber' | 'rose';
};

export type AdminFeature = {
  title: string;
  description: string;
};

export type AdminNavStructure = {
  label: string;
  href: string;
  purpose: string;
};

export type AdminLayoutBlock = {
  title: string;
  detail: string;
};

export type AdminApiRoute = {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  summary: string;
};

export type AdminApiRouteGroup = {
  title: string;
  description: string;
  routes: AdminApiRoute[];
};

export type AdminChartPoint = {
  label: string;
  value: number;
  tone?: string;
};

export type AdminAlert = {
  title: string;
  status: string;
  detail: string;
};

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'lecturer' | 'admin';
  plan: 'Free' | 'Pro' | 'Campus';
  status: 'Active' | 'Pending Review' | 'Suspended';
  lastSeen: string;
  courses: number;
};

export type AdminCourseRow = {
  id: string;
  name: string;
  lecturer: string;
  enrolled: number;
  completion: number;
  status: 'Healthy' | 'Watchlist' | 'Archived';
  submissions: string;
};

export type AdminAssignmentRow = {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  submissionRate: number;
  flags: number;
  status: 'On Track' | 'Needs Review' | 'Overdue';
};

export type AdminAttendanceRow = {
  id: string;
  course: string;
  attendanceRate: number;
  missingLogs: number;
  trend: string;
  status: 'Healthy' | 'Needs Audit' | 'Critical';
};

export type AdminSubscriptionRow = {
  id: string;
  customer: string;
  plan: 'Monthly Pro' | 'Semester Pro' | 'Campus Bundle';
  status: 'Active' | 'Trial' | 'Past Due' | 'Cancelled';
  renewal: string;
  mrr: string;
};

export type AdminActivityRow = {
  id: string;
  actor: string;
  action: string;
  target: string;
  time: string;
  severity: 'Info' | 'Warning' | 'Critical';
};

export type AdminReportRow = {
  id: string;
  title: string;
  owner: string;
  category: 'Moderation' | 'Billing' | 'Academic Integrity' | 'Operations';
  status: 'Open' | 'In Review' | 'Resolved';
  updatedAt: string;
};

export const adminOverviewMetrics: AdminMetric[] = [
  { label: 'Total Users', value: '18,420', change: '+6.4%', detail: 'Across student, lecturer, and admin roles', tone: 'purple' },
  { label: 'Active Courses', value: '642', change: '+28', detail: 'Published this semester', tone: 'blue' },
  { label: 'Monthly Revenue', value: '$48.6k', change: '+9.1%', detail: 'Net recurring revenue', tone: 'green' },
  { label: 'Risk Alerts', value: '37', change: '-12%', detail: 'Attendance, billing, and moderation issues', tone: 'amber' },
];

export const adminFeatures: AdminFeature[] = [
  { title: 'Dashboard overview', description: 'Platform-wide KPIs, operational alerts, and growth snapshots for the whole academic system.' },
  { title: 'User management', description: 'Search, filter, suspend, restore, and audit students, lecturers, and administrators.' },
  { title: 'Course monitoring', description: 'Track enrollment, completion, and risk trends without entering lecturer workflows.' },
  { title: 'Assignment monitoring', description: 'Watch overdue work, low submission rates, and flagged assignments from one queue.' },
  { title: 'Attendance monitoring', description: 'Audit attendance health by course and identify missing records or abnormal absence spikes.' },
  { title: 'Subscription management', description: 'Review active plans, renewals, churn risk, payment issues, and revenue performance.' },
  { title: 'Analytics', description: 'Summaries, trend charts, cohort views, and operational funnel metrics for product health.' },
  { title: 'Activity logs', description: 'Read-only audit trails for permission changes, moderation actions, and system events.' },
  { title: 'Reports & moderation', description: 'Resolve escalations, publish admin reports, and queue platform interventions deliberately.' },
];

export const adminSidebarStructure: AdminNavStructure[] = [
  { label: 'Dashboard', href: '/admin', purpose: 'Cross-module overview and operating summary.' },
  { label: 'Users', href: '/admin/users', purpose: 'Identity, access, and account health management.' },
  { label: 'Courses', href: '/admin/courses', purpose: 'Monitor catalog quality, enrollment, and lifecycle status.' },
  { label: 'Assignments', href: '/admin/assignments', purpose: 'See deadline risk, low engagement, and flagged coursework.' },
  { label: 'Attendance', href: '/admin/attendance', purpose: 'Audit attendance integrity and anomaly trends.' },
  { label: 'Subscriptions', href: '/admin/subscriptions', purpose: 'Manage billing health, renewals, and plan mix.' },
  { label: 'Analytics', href: '/admin/analytics', purpose: 'Platform metrics, cohort charts, and business intelligence.' },
  { label: 'Activity', href: '/admin/activity', purpose: 'Audit logs for admin and system actions.' },
  { label: 'Reports', href: '/admin/reports', purpose: 'Moderation queue, exports, and leadership reports.' },
];

export const adminLayoutBlocks: AdminLayoutBlock[] = [
  { title: 'Sidebar navigation', detail: 'Persistent module navigation with a dedicated admin-only information architecture.' },
  { title: 'Global header', detail: 'Unified search, platform identity, notifications, and admin profile access.' },
  { title: 'Executive metric cards', detail: 'Fast snapshots for users, courses, revenue, incidents, and service health.' },
  { title: 'Operational tables', detail: 'Searchable and filterable entity monitoring for users, courses, assignments, attendance, and subscriptions.' },
  { title: 'Charts and trend views', detail: 'Visual comparison of growth, retention, churn risk, and attendance quality over time.' },
  { title: 'Confirmation dialogs', detail: 'Deliberate approval moments for suspensions, archival actions, cancellations, and report resolution.' },
];

export const adminApiRoutePlan: AdminApiRouteGroup[] = [
  {
    title: 'Overview & Analytics',
    description: 'Aggregated admin metrics and dashboard charts. Every route is protected by `requireAuth` and `requireRole(\'admin\')`.',
    routes: [
      { method: 'GET', path: '/api/admin/overview', summary: 'Return top-line KPIs, incidents, and operational counts.' },
      { method: 'GET', path: '/api/admin/analytics/platform', summary: 'Return growth, retention, and engagement chart series.' },
      { method: 'GET', path: '/api/admin/activity', summary: 'List recent admin and system audit events with filters.' },
    ],
  },
  {
    title: 'Users & Access',
    description: 'Admin-only account and role management built on `profiles` plus auth context syncing.',
    routes: [
      { method: 'GET', path: '/api/admin/users', summary: 'List users with search, role, plan, and status filters.' },
      { method: 'PATCH', path: '/api/admin/users/:userId/status', summary: 'Suspend or restore a platform user.' },
      { method: 'PATCH', path: '/api/admin/users/:userId/role', summary: 'Promote or demote a user role with audit logging.' },
    ],
  },
  {
    title: 'Courses, Assignments & Attendance',
    description: 'Monitoring endpoints joined from `courses`, `assignments`, `attendance`, `enrollments`, and `submissions`.',
    routes: [
      { method: 'GET', path: '/api/admin/courses', summary: 'Course health monitoring with enrollment, completion, and lecturer context.' },
      { method: 'GET', path: '/api/admin/assignments', summary: 'Assignment monitoring with overdue, flagged, and submission-rate filters.' },
      { method: 'GET', path: '/api/admin/attendance', summary: 'Attendance anomalies, missing logs, and course-level attendance summaries.' },
    ],
  },
  {
    title: 'Subscriptions & Reports',
    description: 'Billing oversight and platform moderation/reporting workflows.',
    routes: [
      { method: 'GET', path: '/api/admin/subscriptions', summary: 'List subscriptions with plan, renewal, status, and MRR metadata.' },
      { method: 'PATCH', path: '/api/admin/subscriptions/:subscriptionId/status', summary: 'Cancel, extend, or recover a subscription safely.' },
      { method: 'GET', path: '/api/admin/reports', summary: 'Fetch moderation queue items and generated report packs.' },
      { method: 'POST', path: '/api/admin/reports/:reportId/resolve', summary: 'Resolve a report or moderation case with audit notes.' },
    ],
  },
];

export const adminGrowthTrend: AdminChartPoint[] = [
  { label: 'Jan', value: 42, tone: 'bg-[#7a46ec]' },
  { label: 'Feb', value: 48, tone: 'bg-[#8658ef]' },
  { label: 'Mar', value: 56, tone: 'bg-[#946cf2]' },
  { label: 'Apr', value: 63, tone: 'bg-[#5d7cff]' },
  { label: 'May', value: 71, tone: 'bg-[#34b8aa]' },
  { label: 'Jun', value: 78, tone: 'bg-[#2ab56a]' },
];

export const adminRevenueMix: AdminChartPoint[] = [
  { label: 'Monthly Pro', value: 31, tone: 'bg-[#7a46ec]' },
  { label: 'Semester Pro', value: 44, tone: 'bg-[#5d7cff]' },
  { label: 'Campus Bundle', value: 25, tone: 'bg-[#2ab56a]' },
];

export const adminAlerts: AdminAlert[] = [
  { title: 'Spike in overdue assignments', status: 'Warning', detail: 'Cloud Computing Systems has 18 overdue submissions in the last 24 hours.' },
  { title: 'Billing recovery queue', status: 'Critical', detail: 'Seven subscriptions entered past-due status after the last payment cycle.' },
  { title: 'Attendance audit pending', status: 'Info', detail: 'Three courses have not posted attendance in more than 72 hours.' },
];

export const adminUsers: AdminUserRow[] = [
  { id: 'u1', name: 'Srey Neang', email: 'srey.neang@acaflow.edu', role: 'student', plan: 'Pro', status: 'Active', lastSeen: '5 min ago', courses: 6 },
  { id: 'u2', name: 'Dr. Lina Phan', email: 'lina.phan@acaflow.edu', role: 'lecturer', plan: 'Campus', status: 'Active', lastSeen: '19 min ago', courses: 4 },
  { id: 'u3', name: 'Marcus Yim', email: 'marcus.yim@acaflow.edu', role: 'student', plan: 'Free', status: 'Pending Review', lastSeen: '1 hour ago', courses: 3 },
  { id: 'u4', name: 'Ava Chen', email: 'ava.chen@acaflow.edu', role: 'admin', plan: 'Campus', status: 'Active', lastSeen: '2 hours ago', courses: 0 },
  { id: 'u5', name: 'Jordan Smith', email: 'jordan.smith@acaflow.edu', role: 'student', plan: 'Pro', status: 'Suspended', lastSeen: 'Yesterday', courses: 5 },
  { id: 'u6', name: 'Prof. Dara Sok', email: 'dara.sok@acaflow.edu', role: 'lecturer', plan: 'Campus', status: 'Active', lastSeen: 'Today, 07:40', courses: 7 },
];

export const adminCourses: AdminCourseRow[] = [
  { id: 'c1', name: 'Advanced Data Structures', lecturer: 'Dr. Lina Phan', enrolled: 124, completion: 82, status: 'Healthy', submissions: '92% on-time' },
  { id: 'c2', name: 'Cloud Computing Systems', lecturer: 'Prof. Dara Sok', enrolled: 130, completion: 63, status: 'Watchlist', submissions: '71% on-time' },
  { id: 'c3', name: 'Digital Ethics', lecturer: 'Dr. Sarah Mitchell', enrolled: 88, completion: 58, status: 'Watchlist', submissions: '68% on-time' },
  { id: 'c4', name: 'Intro to Programming', lecturer: 'Alex Rivera', enrolled: 210, completion: 94, status: 'Healthy', submissions: '96% on-time' },
  { id: 'c5', name: 'Legacy Java Lab', lecturer: 'Mara Quin', enrolled: 41, completion: 100, status: 'Archived', submissions: 'Archive locked' },
];

export const adminAssignments: AdminAssignmentRow[] = [
  { id: 'a1', title: 'Algorithm Design Lab 4', course: 'Advanced Data Structures', dueDate: 'Tomorrow, 11:59 PM', submissionRate: 84, flags: 1, status: 'On Track' },
  { id: 'a2', title: 'Cloud Deployment Quiz', course: 'Cloud Computing Systems', dueDate: 'Today, 5:00 PM', submissionRate: 39, flags: 6, status: 'Needs Review' },
  { id: 'a3', title: 'Digital Ethics Position Paper', course: 'Digital Ethics', dueDate: '2 days overdue', submissionRate: 54, flags: 8, status: 'Overdue' },
  { id: 'a4', title: 'Python Basics Worksheet', course: 'Intro to Programming', dueDate: 'Friday, 6:00 PM', submissionRate: 91, flags: 0, status: 'On Track' },
];

export const adminAttendanceRows: AdminAttendanceRow[] = [
  { id: 'at1', course: 'Advanced Data Structures', attendanceRate: 94, missingLogs: 0, trend: '+2%', status: 'Healthy' },
  { id: 'at2', course: 'Cloud Computing Systems', attendanceRate: 76, missingLogs: 2, trend: '-7%', status: 'Needs Audit' },
  { id: 'at3', course: 'Digital Ethics', attendanceRate: 69, missingLogs: 4, trend: '-9%', status: 'Critical' },
  { id: 'at4', course: 'Intro to Programming', attendanceRate: 96, missingLogs: 0, trend: '+1%', status: 'Healthy' },
];

export const adminSubscriptions: AdminSubscriptionRow[] = [
  { id: 's1', customer: 'Srey Neang', plan: 'Semester Pro', status: 'Active', renewal: '2026-06-01', mrr: '$20' },
  { id: 's2', customer: 'Jordan Smith', plan: 'Monthly Pro', status: 'Past Due', renewal: '2026-04-24', mrr: '$5' },
  { id: 's3', customer: 'KIT Faculty Bundle', plan: 'Campus Bundle', status: 'Active', renewal: '2026-08-12', mrr: '$1,250' },
  { id: 's4', customer: 'Marcus Yim', plan: 'Monthly Pro', status: 'Trial', renewal: '2026-04-28', mrr: '$0' },
  { id: 's5', customer: 'Legacy Promo Cohort', plan: 'Semester Pro', status: 'Cancelled', renewal: 'Ended', mrr: '$0' },
];

export const adminActivities: AdminActivityRow[] = [
  { id: 'log1', actor: 'Ava Chen', action: 'Updated user role', target: 'Marcus Yim -> lecturer', time: '5 min ago', severity: 'Info' },
  { id: 'log2', actor: 'Billing Worker', action: 'Marked subscription past due', target: 'Jordan Smith', time: '18 min ago', severity: 'Warning' },
  { id: 'log3', actor: 'Integrity Bot', action: 'Escalated plagiarism signal', target: 'Digital Ethics Position Paper', time: '44 min ago', severity: 'Critical' },
  { id: 'log4', actor: 'Ava Chen', action: 'Archived course', target: 'Legacy Java Lab', time: 'Today, 09:12', severity: 'Info' },
  { id: 'log5', actor: 'Attendance Monitor', action: 'Raised missing log audit', target: 'Digital Ethics', time: 'Today, 08:40', severity: 'Warning' },
];

export const adminReports: AdminReportRow[] = [
  { id: 'r1', title: 'Plagiarism escalation batch', owner: 'Integrity Bot', category: 'Academic Integrity', status: 'Open', updatedAt: '12 min ago' },
  { id: 'r2', title: 'Past due subscription recovery', owner: 'Billing Ops', category: 'Billing', status: 'In Review', updatedAt: '48 min ago' },
  { id: 'r3', title: 'Attendance anomaly summary', owner: 'Ops Monitor', category: 'Operations', status: 'Resolved', updatedAt: 'Today, 08:10' },
  { id: 'r4', title: 'Reported classroom conduct issue', owner: 'Support Queue', category: 'Moderation', status: 'Open', updatedAt: 'Today, 07:55' },
];

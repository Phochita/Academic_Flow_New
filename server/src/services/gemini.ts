type PlannerAssignmentInput = {
  title: string;
  dueDate?: string | undefined;
  estimatedHours?: number | undefined;
};

type PlannerRequest = {
  goal: string;
  deadline?: string | undefined;
  weeklyHours?: number | undefined;
  preferredSessionMinutes?: number | undefined;
  courses?: string[] | undefined;
  assignments?: PlannerAssignmentInput[] | undefined;
};

type PerformanceCourseInput = {
  courseName: string;
  attendancePercentage: number;
  totalRecords?: number | undefined;
};

type PerformanceAnalysisRequest = {
  currentGpa?: number | null | undefined;
  earnedCredits?: number | null | undefined;
  attendancePercentage: number;
  courses?: PerformanceCourseInput[] | undefined;
};

const clamp = (value: number, minimum: number, maximum: number) => Math.min(Math.max(value, minimum), maximum);

const buildSessionLabel = (index: number, totalSessions: number, goal: string) => {
  if (index === 0) {
    return `Clarify the scope for ${goal}`;
  }

  if (index === totalSessions - 1) {
    return `Final review and polish for ${goal}`;
  }

  return `Focused work session ${index + 1} for ${goal}`;
};

const generateStudyPlan = (input: PlannerRequest) => {
  const weeklyHours = clamp(Math.round(input.weeklyHours ?? 8), 1, 40);
  const sessionLengthMinutes = clamp(Math.round(input.preferredSessionMinutes ?? 90), 30, 180);
  const totalSessions = Math.max(3, Math.round((weeklyHours * 60) / sessionLengthMinutes));
  const normalizedAssignments = (input.assignments ?? []).slice(0, 5);
  const normalizedCourses = (input.courses ?? []).slice(0, 5);

  const focusAreas = [
    "Understand the requirements before deep work starts.",
    "Break large tasks into smaller deliverables that can be finished in one sitting.",
    "Leave time near the deadline for revision and submission checks.",
  ];

  if (normalizedAssignments.length > 0) {
    focusAreas.push(`Prioritize ${normalizedAssignments[0]?.title ?? "the nearest assignment"} first.`);
  }

  if (normalizedCourses.length > 0) {
    focusAreas.push(`Rotate revision across ${normalizedCourses.join(", ")} to avoid overload.`);
  }

  const sessions = Array.from({ length: totalSessions }, (_, index) => ({
    session: index + 1,
    title: buildSessionLabel(index, totalSessions, input.goal),
    durationMinutes: sessionLengthMinutes,
    outcome:
      index === 0
        ? "Create a checklist, identify blockers, and choose the first concrete task."
        : index === totalSessions - 1
          ? "Review progress, fix weak points, and prepare the final submission."
          : "Make measurable progress on the next highest-priority task.",
  }));

  const milestones = [
    {
      title: "Preparation",
      detail: "Gather materials, deadlines, and grading criteria before the first work session.",
    },
    {
      title: "Core progress",
      detail: "Finish the most demanding task by the midpoint of the plan.",
    },
    {
      title: "Review",
      detail: "Reserve the final session for checking quality, completeness, and submission readiness.",
    },
  ];

  return {
    provider: "local-planner",
    summary: `A ${weeklyHours}-hour study plan for ${input.goal} with ${totalSessions} focused sessions.`,
    deadline: input.deadline ?? null,
    weeklyHours,
    preferredSessionMinutes: sessionLengthMinutes,
    focusAreas,
    sessions,
    milestones,
    trackedAssignments: normalizedAssignments,
    trackedCourses: normalizedCourses,
  };
};

const getPerformanceBand = (score: number) => {
  if (score >= 90) {
    return "Excellent";
  }

  if (score >= 80) {
    return "Strong";
  }

  if (score >= 70) {
    return "Stable";
  }

  return "Needs attention";
};

const generatePerformanceAnalysis = (input: PerformanceAnalysisRequest) => {
  const normalizedGpa = input.currentGpa === null || input.currentGpa === undefined ? null : clamp(input.currentGpa, 0, 4);
  const gpaScore = normalizedGpa === null ? 0 : Math.round((normalizedGpa / 4) * 100);
  const attendanceScore = clamp(Math.round(input.attendancePercentage), 0, 100);
  const performanceScore = normalizedGpa === null
    ? attendanceScore
    : Math.round(gpaScore * 0.65 + attendanceScore * 0.35);
  const courses = (input.courses ?? []).slice(0, 8);
  const weakestAttendanceCourse = courses
    .filter((course) => course.totalRecords === undefined || course.totalRecords > 0)
    .sort((a, b) => a.attendancePercentage - b.attendancePercentage)[0];
  const strongestAttendanceCourse = courses
    .filter((course) => course.totalRecords === undefined || course.totalRecords > 0)
    .sort((a, b) => b.attendancePercentage - a.attendancePercentage)[0];
  const strengths = [];
  const improvements = [];

  if (normalizedGpa !== null && normalizedGpa >= 3.2) {
    strengths.push(`GPA is carrying performance well at ${normalizedGpa.toFixed(2)}.`);
  } else if (normalizedGpa !== null) {
    improvements.push(`Lift GPA from ${normalizedGpa.toFixed(2)} by targeting the next graded assignments.`);
  } else {
    improvements.push("Add GPA to the profile so academic performance can be scored more accurately.");
  }

  if (attendanceScore >= 90) {
    strengths.push(`Attendance is excellent at ${attendanceScore}%.`);
  } else if (attendanceScore >= 75) {
    strengths.push(`Attendance is usable at ${attendanceScore}%, but it can still improve the final trend.`);
  } else {
    improvements.push(`Attendance is the main risk at ${attendanceScore}%. Prioritize attending the next sessions.`);
  }

  if (strongestAttendanceCourse) {
    strengths.push(`${strongestAttendanceCourse.courseName} has the strongest attendance pattern.`);
  }

  if (weakestAttendanceCourse && weakestAttendanceCourse.attendancePercentage < 85) {
    improvements.push(`${weakestAttendanceCourse.courseName} needs attendance recovery first.`);
  }

  return {
    provider: "local-performance-ai",
    performanceScore,
    band: getPerformanceBand(performanceScore),
    summary: `Performance is ${getPerformanceBand(performanceScore).toLowerCase()} with a ${performanceScore}% blended score from GPA and attendance.`,
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
    recommendation:
      weakestAttendanceCourse && weakestAttendanceCourse.attendancePercentage < 85
        ? `Attend the next ${weakestAttendanceCourse.courseName} classes and pair that with one grade-focused study block.`
        : "Maintain attendance consistency and use upcoming graded work to protect the GPA trend.",
  };
};

export = { generatePerformanceAnalysis, generateStudyPlan };

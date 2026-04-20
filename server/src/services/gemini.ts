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

export = { generateStudyPlan };

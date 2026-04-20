const baseUrl = (process.env.API_BASE_URL || "http://localhost:4000").replace(/\/$/, "");
const email = process.env.SMOKE_EMAIL?.trim() || "";
const password = process.env.SMOKE_PASSWORD?.trim() || "";
const shouldRegister = /^(1|true|yes)$/i.test(process.env.SMOKE_REGISTER || "");
const firstName = process.env.SMOKE_FIRST_NAME?.trim() || "Smoke";
const lastName = process.env.SMOKE_LAST_NAME?.trim() || "Tester";
const role = (process.env.SMOKE_ROLE?.trim().toLowerCase() || "student");
const courseId = process.env.SMOKE_COURSE_ID?.trim() || "";
const assignmentId = process.env.SMOKE_ASSIGNMENT_ID?.trim() || "";

let failureCount = 0;

const printHeader = (message) => {
  console.log(`\n=== ${message} ===`);
};

const printPass = (label, details = "") => {
  console.log(`PASS ${label}${details ? ` -> ${details}` : ""}`);
};

const printFail = (label, details = "") => {
  failureCount += 1;
  console.log(`FAIL ${label}${details ? ` -> ${details}` : ""}`);
};

const toDisplayText = (value) => {
  if (value == null) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

const parseJsonSafely = (text) => {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const request = async (path, options = {}) => {
  const response = await fetch(`${baseUrl}${path}`, options);
  const text = await response.text();
  const json = parseJsonSafely(text);

  return {
    body: json ?? text,
    ok: response.ok,
    status: response.status,
  };
};

const expectStatus = async (label, path, expectedStatuses, options = {}) => {
  try {
    const headers = { ...(options.headers || {}) };
    let body = options.body;

    if (body && typeof body === "object" && !(body instanceof ArrayBuffer) && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(body);
    }

    const result = await request(path, {
      ...options,
      body,
      headers,
    });

    if (expectedStatuses.includes(result.status)) {
      printPass(label, `status ${result.status}`);
      return result;
    }

    printFail(label, `expected ${expectedStatuses.join(" or ")}, got ${result.status}. ${toDisplayText(result.body)}`);
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    printFail(label, message);
    return null;
  }
};

const buildAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

const run = async () => {
  printHeader("Smoke Test");
  console.log(`Base URL: ${baseUrl}`);

  await expectStatus("Health check", "/health", [200]);
  await expectStatus("Public subscription plans", "/api/subscriptions/plans", [200]);
  await expectStatus("Protected auth endpoint without token", "/api/auth/me", [401]);

  if (!email || !password) {
    console.log("\nNo SMOKE_EMAIL / SMOKE_PASSWORD provided, so only public checks were run.");
    console.log("Set those env vars to test login and protected routes.");
    process.exit(failureCount === 0 ? 0 : 1);
  }

  if (shouldRegister) {
    await expectStatus("Register account", "/api/auth/register", [201], {
      body: {
        email,
        firstName,
        lastName,
        password,
        role,
      },
      method: "POST",
    });
  }

  const loginResult = await expectStatus("Login", "/api/auth/login", [200], {
    body: {
      email,
      password,
    },
    method: "POST",
  });

  const accessToken = loginResult?.body?.session?.accessToken;

  if (!accessToken) {
    printFail("Access token returned from login", "Login succeeded but no access token was found.");
    process.exit(1);
  }

  const authHeaders = buildAuthHeaders(accessToken);
  const meResult = await expectStatus("Get current user", "/api/auth/me", [200], {
    headers: authHeaders,
  });

  await expectStatus("List courses", "/api/courses", [200], {
    headers: authHeaders,
  });
  await expectStatus("List assignments", "/api/assignments", [200], {
    headers: authHeaders,
  });
  await expectStatus("List attendance", "/api/attendance", [200], {
    headers: authHeaders,
  });
  await expectStatus("Attendance summary", "/api/attendance/summary", [200], {
    headers: authHeaders,
  });
  await expectStatus("Get subscriptions", "/api/subscriptions", [200], {
    headers: authHeaders,
  });

  const roleFromApi = meResult?.body?.user?.role;
  const isProFromApi = Boolean(meResult?.body?.user?.isPro);
  const expectedAiStatuses = roleFromApi === "student" && !isProFromApi ? [403] : [200];

  await expectStatus("AI study plan access", "/api/ai/study-plan", expectedAiStatuses, {
    body: {
      goal: "Prepare for final exams",
      weeklyHours: 6,
      preferredSessionMinutes: 90,
    },
    headers: authHeaders,
    method: "POST",
  });

  if (courseId) {
    await expectStatus("Get course by id", `/api/courses/${courseId}`, [200], {
      headers: authHeaders,
    });
    await expectStatus("List course materials", `/api/courses/${courseId}/materials`, [200], {
      headers: authHeaders,
    });
  }

  if (assignmentId) {
    await expectStatus("Get assignment by id", `/api/assignments/${assignmentId}`, [200], {
      headers: authHeaders,
    });
  }

  if (failureCount === 0) {
    console.log("\nSmoke test finished with no failures.");
    process.exit(0);
  }

  console.log(`\nSmoke test finished with ${failureCount} failure(s).`);
  process.exit(1);
};

run();

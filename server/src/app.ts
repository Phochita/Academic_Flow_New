import cors = require("cors");
import express = require("express");
import httpUtils = require("./utils/http");

const { HttpError, isHttpError, isZodError } = httpUtils;

const app = express();

const isJsonParseError = (error: unknown): error is { status?: number; type?: string } => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const candidate = error as { status?: number; type?: string };
  return candidate.status === 400 && candidate.type === "entity.parse.failed";
};

const isDatabaseQueryError = (
  error: unknown,
): error is { cause?: { code?: string; message?: string }; message?: string; name?: string } => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const candidate = error as { message?: string; name?: string; query?: string };
  return candidate.name === "DrizzleQueryError" || typeof candidate.query === "string";
};

const isMissingEnvironmentVariableError = (error: unknown): error is Error => {
  if (!(error instanceof Error)) {
    return false;
  }

  return /^Missing .+ environment variable\.$/.test(error.message);
};

app.use(
  cors({
    credentials: true,
    origin: true,
  }),
);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.status(200).json({
    service: "AcaFlow API",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

const authRoutes = require("./routes/auth");
const assignmentRoutes = require("./routes/assignments");
const attendanceRoutes = require("./routes/attendance");
const courseRoutes = require("./routes/courses");
const profileRoutes = require("./routes/profile");
const subscriptionRoutes = require("./routes/subscriptions");
const aiRoutes = require("./routes/ai");

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/ai", aiRoutes);

app.use((_req, _res, next) => {
  next(new HttpError(404, "Route not found."));
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (isZodError(error)) {
    return res.status(400).json({
      error: "Validation failed.",
      issues: error.issues.map((issue) => ({
        message: issue.message,
        path: issue.path.join("."),
      })),
    });
  }

  if (isHttpError(error)) {
    return res.status(error.statusCode).json({
      details: error.details ?? null,
      error: error.message,
    });
  }

  if (isJsonParseError(error)) {
    return res.status(400).json({
      error: "Invalid JSON body.",
    });
  }

  if (isDatabaseQueryError(error)) {
    const causeCode = error.cause?.code?.trim().toUpperCase();
    const causeMessage = error.cause?.message?.trim().toLowerCase() ?? "";
    const errorMessage = error.message?.trim().toLowerCase() ?? "";

    if (causeCode === "ENOTFOUND") {
      return res.status(503).json({
        error: "Database host could not be resolved. Check DATABASE_URL, DIRECT_URL, and DRIZZLE_DATABASE_URL in server/.env.",
      });
    }

    if (causeCode === "42P01" || causeMessage.includes("does not exist")) {
      return res.status(500).json({
        error: "Database schema is incomplete. Run the latest Drizzle migrations for this Supabase database.",
      });
    }

    if (causeCode === "42703" || causeMessage.includes("column") || errorMessage.includes("column")) {
      return res.status(500).json({
        error: "Database schema is out of date. Apply the latest migration SQL to this Supabase database.",
      });
    }

    return res.status(500).json({
      error: "Database query failed. Check the current Supabase database connection and make sure migrations have been applied.",
    });
  }

  if (isMissingEnvironmentVariableError(error)) {
    return res.status(500).json({
      error: `${error.message} Check the backend Vercel environment variables and redeploy.`,
    });
  }

  console.error(error);

  return res.status(500).json({
    error: "Internal server error.",
  });
});

export = app;

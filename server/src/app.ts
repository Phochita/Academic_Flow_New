import cors = require("cors");
import express = require("express");
import authRoutes = require("./routes/auth");
import assignmentRoutes = require("./routes/assignments");
import attendanceRoutes = require("./routes/attendance");
import courseRoutes = require("./routes/courses");
import subscriptionRoutes = require("./routes/subscriptions");
import aiRoutes = require("./routes/ai");
import httpUtils = require("./utils/http");

const { HttpError, isHttpError, isZodError } = httpUtils;

const app = express();

app.use(
  cors({
    credentials: true,
    origin: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.status(200).json({
    service: "AcaFlow API",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
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

  console.error(error);

  return res.status(500).json({
    error: "Internal server error.",
  });
});

export = app;

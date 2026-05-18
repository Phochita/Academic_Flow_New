# AcaFlow Admin API Plan

This document defines the backend route shape for the AcaFlow admin module.

Admin is a platform manager role.
Admin routes must never default to student or lecturer workflows.
Every admin endpoint should require both:

- `requireAuth`
- `requireRole('admin')`

Recommended mounting:

- `app.use('/api/admin', requireAuth, requireRole('admin'), adminRoutes)`

## Scope

The admin API covers:

- Dashboard overview
- User management
- Course monitoring
- Assignment monitoring
- Attendance monitoring
- Subscription management
- Analytics
- Activity logs
- Reports and moderation

The admin API does not cover:

- Submitting assignments
- Grading as a lecturer
- Taking attendance as a lecturer
- Acting as a student by default

## Route Groups

### 1. Overview

- `GET /api/admin/overview`
  Returns top-level cards for users, courses, subscriptions, alerts, and service health.

- `GET /api/admin/health`
  Returns platform health summary, queue counts, and operational warnings.

### 2. Users

Built on `profiles` plus auth context synchronization.

- `GET /api/admin/users`
  Query: `search`, `role`, `status`, `plan`, `page`, `limit`

- `GET /api/admin/users/:userId`
  Returns profile, subscription status, course counts, and recent activity.

- `PATCH /api/admin/users/:userId/status`
  Body: `{ status: 'active' | 'suspended' | 'pending_review', reason?: string }`

- `PATCH /api/admin/users/:userId/role`
  Body: `{ role: 'student' | 'lecturer' | 'admin' }`

### 3. Courses

Built on `courses`, `enrollments`, `profiles`, and aggregate assignment/attendance signals.

- `GET /api/admin/courses`
  Query: `search`, `status`, `lecturerId`, `page`, `limit`

- `GET /api/admin/courses/:courseId`
  Returns course detail, enrollment summary, assignment risk, and attendance trends.

- `PATCH /api/admin/courses/:courseId/status`
  Body: `{ status: 'healthy' | 'watchlist' | 'archived', note?: string }`

### 4. Assignments

Built on `assignments`, `submissions`, and course joins.

- `GET /api/admin/assignments`
  Query: `search`, `status`, `courseId`, `dueWindow`, `page`, `limit`

- `GET /api/admin/assignments/:assignmentId`
  Returns assignment detail, submission metrics, flagged count, and related course health.

- `PATCH /api/admin/assignments/:assignmentId/status`
  Body: `{ status: 'on_track' | 'needs_review' | 'overdue', note?: string }`

### 5. Attendance

Built on `attendance`, `courses`, and `profiles`.

- `GET /api/admin/attendance`
  Query: `status`, `courseId`, `dateFrom`, `dateTo`, `page`, `limit`

- `GET /api/admin/attendance/:courseId/summary`
  Returns attendance rate, missing logs, and anomaly windows for one course.

- `POST /api/admin/attendance/:courseId/audits`
  Body: `{ action: 'open' | 'close', note?: string }`

### 6. Subscriptions

Built on `subscriptions` and `profiles`.

- `GET /api/admin/subscriptions`
  Query: `status`, `plan`, `search`, `page`, `limit`

- `GET /api/admin/subscriptions/:subscriptionId`
  Returns billing status, renewal timing, and related user metadata.

- `PATCH /api/admin/subscriptions/:subscriptionId/status`
  Body: `{ status: 'active' | 'expired' | 'cancelled', note?: string }`

### 7. Analytics

Aggregated read models for charts and executive reporting.

- `GET /api/admin/analytics/platform`
  Returns growth, retention, engagement, and revenue series.

- `GET /api/admin/analytics/attendance`
  Returns attendance quality and anomaly trends.

- `GET /api/admin/analytics/subscriptions`
  Returns MRR, churn risk, and plan mix.

### 8. Activity Logs

This should be append-only and safe for audit review.

- `GET /api/admin/activity`
  Query: `severity`, `actorId`, `targetType`, `dateFrom`, `dateTo`, `page`, `limit`

- `POST /api/admin/activity/:activityId/acknowledge`
  Body: `{ note?: string }`

### 9. Reports and Moderation

- `GET /api/admin/reports`
  Query: `status`, `category`, `page`, `limit`

- `GET /api/admin/reports/:reportId`
  Returns full moderation or billing escalation context.

- `POST /api/admin/reports/:reportId/resolve`
  Body: `{ resolution: string, note?: string }`

- `POST /api/admin/reports/export`
  Body: `{ reportType: 'kpi' | 'billing' | 'attendance' | 'integrity', format: 'csv' | 'json' | 'pdf' }`

## RBAC Notes

- Admin-only routes should never trust client role claims directly.
- Role checks must use the normalized server-side auth context from `auth.ts`.
- Every write action should emit an audit log entry.
- Sensitive actions should store both `actorUserId` and a human-readable reason.

## Suggested Next Backend Steps

1. Create `server/src/routes/admin.ts` and mount it under `/api/admin`.
2. Add admin controller modules by concern: `overview`, `users`, `courses`, `assignments`, `attendance`, `subscriptions`, `analytics`, `activity`, `reports`.
3. Introduce admin service functions that aggregate existing schema tables.
4. Add an `activity_logs` table before implementing real audit endpoints.
5. Add request validation for every admin write route.

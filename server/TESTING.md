# Backend Testing Guide

This project did not have a real backend test flow yet, so the fastest way to verify the API is:

1. Run the server
2. Run the smoke test
3. If that passes, manually test write actions you care about

## 1. Start the backend

From `c:\AcaFlow\server`:

```powershell
npm run dev
```

The API should run at `http://localhost:4000`.

## 2. Quick smoke test

This checks the server is alive and that the main read endpoints respond.

```powershell
npm run smoke
```

What it tests without login:

- `GET /health`
- `GET /api/subscriptions/plans`
- `GET /api/auth/me` should return `401` without a token

## 3. Authenticated smoke test

If you already have a user account, set these environment variables in PowerShell:

```powershell
$env:SMOKE_EMAIL="your-email@example.com"
$env:SMOKE_PASSWORD="your-password"
npm run smoke
```

That will test:

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/courses`
- `GET /api/assignments`
- `GET /api/attendance`
- `GET /api/attendance/summary`
- `GET /api/subscriptions`
- `POST /api/ai/study-plan`

Notes:

- If the logged-in user is a normal student without Pro, `POST /api/ai/study-plan` is expected to return `403`
- If the user is Pro, lecturer, or admin, AI is expected to return `200`

## 4. Optional register-then-test flow

If you want the script to create an account first:

```powershell
$env:SMOKE_EMAIL="new-user@example.com"
$env:SMOKE_PASSWORD="password123"
$env:SMOKE_FIRST_NAME="Smoke"
$env:SMOKE_LAST_NAME="Tester"
$env:SMOKE_ROLE="student"
$env:SMOKE_REGISTER="true"
npm run smoke
```

Use a fresh email for this.

## 5. Optional course or assignment checks

If you already know a course id or assignment id, you can verify those too:

```powershell
$env:SMOKE_EMAIL="your-email@example.com"
$env:SMOKE_PASSWORD="your-password"
$env:SMOKE_COURSE_ID="1"
$env:SMOKE_ASSIGNMENT_ID="1"
npm run smoke
```

Extra checks:

- `GET /api/courses/:courseId`
- `GET /api/courses/:courseId/materials`
- `GET /api/assignments/:assignmentId`

## 6. Manual write testing checklist

The smoke test is mostly safe and read-only. For create/update actions, test them manually with Postman, Insomnia, or PowerShell.

Good manual tests:

- Register account
- Login
- Update profile
- Create course as lecturer/admin
- Enroll student in course
- Create assignment as lecturer/admin
- Submit assignment as student
- Grade submission as lecturer/admin
- Mark attendance as lecturer/admin
- Activate subscription
- Upload course material as lecturer/admin

## 7. Useful PowerShell examples

Login:

```powershell
$login = Invoke-RestMethod -Method Post `
  -Uri "http://localhost:4000/api/auth/login" `
  -ContentType "application/json" `
  -Body '{"email":"your-email@example.com","password":"your-password"}'

$token = $login.session.accessToken
```

Get current user:

```powershell
Invoke-RestMethod -Method Get `
  -Uri "http://localhost:4000/api/auth/me" `
  -Headers @{ Authorization = "Bearer $token" }
```

Create course:

```powershell
Invoke-RestMethod -Method Post `
  -Uri "http://localhost:4000/api/courses" `
  -Headers @{ Authorization = "Bearer $token" } `
  -ContentType "application/json" `
  -Body '{"code":"SE300","name":"Software Engineering","description":"Main course"}'
```

Upload course material:

```powershell
Invoke-RestMethod -Method Post `
  -Uri "http://localhost:4000/api/courses/1/materials" `
  -Headers @{ Authorization = "Bearer $token" } `
  -ContentType "application/json" `
  -Body '{"title":"Week 1 Slides","type":"slides","url":"https://example.com/week1.pdf"}'
```

## 8. What success looks like

Your backend is working if:

- The server starts without crashing
- `npm run smoke` passes
- Login returns a token
- Protected routes work with `Bearer <token>`
- Role restrictions behave correctly
- Write endpoints save data and you can read that data back

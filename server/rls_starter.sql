-- Conservative Row Level Security starter for AcaFlow.
-- Paste into the Supabase SQL Editor after your tables exist.
--
-- Assumptions:
-- 1. No anonymous/public access to academic data.
-- 2. Admin actions stay in the backend for now.
-- 3. Sensitive profile and subscription writes stay in the backend.
-- 4. Lecturer writes are limited to courses they own.
--
-- Important:
-- Do not base authorization on auth.users raw_user_meta_data.
-- Use public.profiles.role or app_metadata for authorization data instead.
--
-- Your current Express backend also uses a direct DATABASE_URL plus a service role key,
-- so RLS mainly protects browser/Data API access, not privileged backend access.

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.assignments enable row level security;
alter table public.submissions enable row level security;
alter table public.attendance enable row level security;
alter table public.materials enable row level security;
alter table public.subscriptions enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
on public.profiles
for select
to authenticated
using (id = (select auth.uid()));

drop policy if exists courses_select_owner_or_enrolled on public.courses;
create policy courses_select_owner_or_enrolled
on public.courses
for select
to authenticated
using (
  lecturer_id = (select auth.uid())
  or exists (
    select 1
    from public.enrollments e
    where e.course_id = courses.id
      and e.student_id = (select auth.uid())
  )
);

drop policy if exists courses_insert_own on public.courses;
create policy courses_insert_own
on public.courses
for insert
to authenticated
with check (lecturer_id = (select auth.uid()));

drop policy if exists courses_update_own on public.courses;
create policy courses_update_own
on public.courses
for update
to authenticated
using (lecturer_id = (select auth.uid()))
with check (lecturer_id = (select auth.uid()));

drop policy if exists courses_delete_own on public.courses;
create policy courses_delete_own
on public.courses
for delete
to authenticated
using (lecturer_id = (select auth.uid()));

drop policy if exists enrollments_select_own_or_course_lecturer on public.enrollments;
create policy enrollments_select_own_or_course_lecturer
on public.enrollments
for select
to authenticated
using (
  student_id = (select auth.uid())
  or exists (
    select 1
    from public.courses c
    where c.id = enrollments.course_id
      and c.lecturer_id = (select auth.uid())
  )
);

drop policy if exists enrollments_insert_course_lecturer on public.enrollments;
create policy enrollments_insert_course_lecturer
on public.enrollments
for insert
to authenticated
with check (
  exists (
    select 1
    from public.courses c
    where c.id = enrollments.course_id
      and c.lecturer_id = (select auth.uid())
  )
);

drop policy if exists enrollments_delete_course_lecturer on public.enrollments;
create policy enrollments_delete_course_lecturer
on public.enrollments
for delete
to authenticated
using (
  exists (
    select 1
    from public.courses c
    where c.id = enrollments.course_id
      and c.lecturer_id = (select auth.uid())
  )
);

drop policy if exists assignments_select_accessible_course on public.assignments;
create policy assignments_select_accessible_course
on public.assignments
for select
to authenticated
using (
  exists (
    select 1
    from public.courses c
    where c.id = assignments.course_id
      and c.lecturer_id = (select auth.uid())
  )
  or exists (
    select 1
    from public.enrollments e
    where e.course_id = assignments.course_id
      and e.student_id = (select auth.uid())
  )
);

drop policy if exists assignments_insert_course_lecturer on public.assignments;
create policy assignments_insert_course_lecturer
on public.assignments
for insert
to authenticated
with check (
  exists (
    select 1
    from public.courses c
    where c.id = assignments.course_id
      and c.lecturer_id = (select auth.uid())
  )
);

drop policy if exists assignments_update_course_lecturer on public.assignments;
create policy assignments_update_course_lecturer
on public.assignments
for update
to authenticated
using (
  exists (
    select 1
    from public.courses c
    where c.id = assignments.course_id
      and c.lecturer_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.courses c
    where c.id = assignments.course_id
      and c.lecturer_id = (select auth.uid())
  )
);

drop policy if exists assignments_delete_course_lecturer on public.assignments;
create policy assignments_delete_course_lecturer
on public.assignments
for delete
to authenticated
using (
  exists (
    select 1
    from public.courses c
    where c.id = assignments.course_id
      and c.lecturer_id = (select auth.uid())
  )
);

drop policy if exists submissions_select_owner_or_course_lecturer on public.submissions;
create policy submissions_select_owner_or_course_lecturer
on public.submissions
for select
to authenticated
using (
  student_id = (select auth.uid())
  or exists (
    select 1
    from public.assignments a
    join public.courses c on c.id = a.course_id
    where a.id = submissions.assignment_id
      and c.lecturer_id = (select auth.uid())
  )
);

drop policy if exists submissions_insert_own_for_enrolled_course on public.submissions;
create policy submissions_insert_own_for_enrolled_course
on public.submissions
for insert
to authenticated
with check (
  student_id = (select auth.uid())
  and exists (
    select 1
    from public.assignments a
    join public.enrollments e on e.course_id = a.course_id
    where a.id = submissions.assignment_id
      and e.student_id = (select auth.uid())
  )
);

drop policy if exists submissions_update_course_lecturer on public.submissions;
create policy submissions_update_course_lecturer
on public.submissions
for update
to authenticated
using (
  exists (
    select 1
    from public.assignments a
    join public.courses c on c.id = a.course_id
    where a.id = submissions.assignment_id
      and c.lecturer_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.assignments a
    join public.courses c on c.id = a.course_id
    where a.id = submissions.assignment_id
      and c.lecturer_id = (select auth.uid())
  )
);

drop policy if exists attendance_select_own_or_course_lecturer on public.attendance;
create policy attendance_select_own_or_course_lecturer
on public.attendance
for select
to authenticated
using (
  student_id = (select auth.uid())
  or exists (
    select 1
    from public.courses c
    where c.id = attendance.course_id
      and c.lecturer_id = (select auth.uid())
  )
);

drop policy if exists attendance_insert_course_lecturer on public.attendance;
create policy attendance_insert_course_lecturer
on public.attendance
for insert
to authenticated
with check (
  exists (
    select 1
    from public.courses c
    where c.id = attendance.course_id
      and c.lecturer_id = (select auth.uid())
  )
);

drop policy if exists attendance_update_course_lecturer on public.attendance;
create policy attendance_update_course_lecturer
on public.attendance
for update
to authenticated
using (
  exists (
    select 1
    from public.courses c
    where c.id = attendance.course_id
      and c.lecturer_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.courses c
    where c.id = attendance.course_id
      and c.lecturer_id = (select auth.uid())
  )
);

drop policy if exists attendance_delete_course_lecturer on public.attendance;
create policy attendance_delete_course_lecturer
on public.attendance
for delete
to authenticated
using (
  exists (
    select 1
    from public.courses c
    where c.id = attendance.course_id
      and c.lecturer_id = (select auth.uid())
  )
);

drop policy if exists materials_select_accessible_course on public.materials;
create policy materials_select_accessible_course
on public.materials
for select
to authenticated
using (
  exists (
    select 1
    from public.courses c
    where c.id = materials.course_id
      and c.lecturer_id = (select auth.uid())
  )
  or exists (
    select 1
    from public.enrollments e
    where e.course_id = materials.course_id
      and e.student_id = (select auth.uid())
  )
);

drop policy if exists materials_insert_course_lecturer on public.materials;
create policy materials_insert_course_lecturer
on public.materials
for insert
to authenticated
with check (
  exists (
    select 1
    from public.courses c
    where c.id = materials.course_id
      and c.lecturer_id = (select auth.uid())
  )
);

drop policy if exists materials_update_course_lecturer on public.materials;
create policy materials_update_course_lecturer
on public.materials
for update
to authenticated
using (
  exists (
    select 1
    from public.courses c
    where c.id = materials.course_id
      and c.lecturer_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.courses c
    where c.id = materials.course_id
      and c.lecturer_id = (select auth.uid())
  )
);

drop policy if exists materials_delete_course_lecturer on public.materials;
create policy materials_delete_course_lecturer
on public.materials
for delete
to authenticated
using (
  exists (
    select 1
    from public.courses c
    where c.id = materials.course_id
      and c.lecturer_id = (select auth.uid())
  )
);

drop policy if exists subscriptions_select_own on public.subscriptions;
create policy subscriptions_select_own
on public.subscriptions
for select
to authenticated
using (user_id = (select auth.uid()));


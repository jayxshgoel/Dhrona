-- ============================================================
-- Dhrona — Initial Schema
-- Run this once in the Supabase SQL editor.
-- ============================================================

-- ─── TABLES ─────────────────────────────────────────────────

create table if not exists profiles (
  id              uuid references auth.users(id) on delete cascade primary key,
  name            text not null default 'New User',
  phone           text,
  role            text not null default 'student' check (role in ('teacher', 'student', 'parent')),
  tier            text not null default 'free' check (tier in ('free', 'premium', 'institution')),
  institution     text,
  exam_type       text check (exam_type in ('JEE Mains', 'JEE Advanced', 'NEET', 'CBSE')),
  avatar_url      text,
  expo_push_token text,
  -- tracks daily AI generation quota (reset each day)
  ai_generations_today      integer not null default 0,
  ai_generations_reset_at   timestamptz not null default now(),
  created_at      timestamptz not null default now()
);

create table if not exists batches (
  id          uuid primary key default gen_random_uuid(),
  teacher_id  uuid not null references profiles(id) on delete cascade,
  name        text not null,
  exam_type   text not null,
  description text,
  created_at  timestamptz not null default now()
);

create table if not exists batch_students (
  batch_id    uuid not null references batches(id) on delete cascade,
  student_id  uuid not null references profiles(id) on delete cascade,
  joined_at   timestamptz not null default now(),
  primary key (batch_id, student_id)
);

create table if not exists parent_children (
  parent_id   uuid not null references profiles(id) on delete cascade,
  student_id  uuid not null references profiles(id) on delete cascade,
  primary key (parent_id, student_id)
);

create table if not exists questions (
  id             uuid primary key default gen_random_uuid(),
  teacher_id     uuid not null references profiles(id) on delete cascade,
  subject        text not null,
  chapter        text not null,
  difficulty     text not null check (difficulty in ('Easy', 'Medium', 'Hard', 'Previous Year')),
  type           text not null check (type in ('MCQ', 'Assertion-Reason', 'Match the Column', 'Integer Type', 'Short Answer')),
  exam_type      text not null,
  content        text not null,
  options        jsonb,
  correct_answer text not null,
  explanation    text not null,
  marks          integer not null default 4,
  created_at     timestamptz not null default now()
);

create table if not exists tests (
  id           uuid primary key default gen_random_uuid(),
  teacher_id   uuid not null references profiles(id) on delete cascade,
  title        text not null,
  exam_type    text not null,
  subject      text,
  config       jsonb not null default '{}',
  scheduled_at timestamptz,
  due_at       timestamptz,
  status       text not null default 'draft' check (status in ('draft', 'published', 'active', 'completed')),
  created_at   timestamptz not null default now()
);

create table if not exists test_questions (
  test_id     uuid not null references tests(id) on delete cascade,
  question_id uuid not null references questions(id) on delete cascade,
  position    integer not null,
  primary key (test_id, question_id)
);

create table if not exists test_assignments (
  id          uuid primary key default gen_random_uuid(),
  test_id     uuid not null references tests(id) on delete cascade,
  batch_id    uuid references batches(id) on delete cascade,
  student_id  uuid references profiles(id) on delete cascade,
  assigned_at timestamptz not null default now(),
  -- must be assigned to exactly one of batch or individual student
  constraint check_assignment_target check (
    (batch_id is not null and student_id is null) or
    (batch_id is null and student_id is not null)
  )
);

create table if not exists test_attempts (
  id           uuid primary key default gen_random_uuid(),
  test_id      uuid not null references tests(id) on delete cascade,
  student_id   uuid not null references profiles(id) on delete cascade,
  answers      jsonb not null default '{}',
  flagged      jsonb not null default '[]',
  score        integer,
  total_marks  integer,
  time_taken   integer, -- seconds
  rank         integer,
  percentile   numeric(5, 2),
  started_at   timestamptz not null default now(),
  submitted_at timestamptz,
  unique (test_id, student_id)
);

create table if not exists subscriptions (
  id                        uuid primary key default gen_random_uuid(),
  user_id                   uuid not null references profiles(id) on delete cascade,
  plan                      text not null check (plan in ('free', 'premium', 'institution')),
  razorpay_subscription_id  text,
  status                    text not null default 'active' check (status in ('active', 'cancelled', 'expired')),
  started_at                timestamptz not null default now(),
  expires_at                timestamptz
);

-- ─── INDEXES ────────────────────────────────────────────────

create index if not exists idx_batches_teacher on batches(teacher_id);
create index if not exists idx_batch_students_student on batch_students(student_id);
create index if not exists idx_questions_teacher on questions(teacher_id);
create index if not exists idx_questions_subject_chapter on questions(subject, chapter);
create index if not exists idx_tests_teacher on tests(teacher_id);
create index if not exists idx_test_assignments_test on test_assignments(test_id);
create index if not exists idx_test_attempts_student on test_attempts(student_id);

-- ─── AUTO-CREATE PROFILE ON SIGNUP ──────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, phone, name)
  values (
    new.id,
    new.phone,
    coalesce(new.raw_user_meta_data->>'name', 'New User')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── ROW LEVEL SECURITY ─────────────────────────────────────

alter table profiles         enable row level security;
alter table batches          enable row level security;
alter table batch_students   enable row level security;
alter table parent_children  enable row level security;
alter table questions        enable row level security;
alter table tests            enable row level security;
alter table test_questions   enable row level security;
alter table test_assignments enable row level security;
alter table test_attempts    enable row level security;
alter table subscriptions    enable row level security;

-- profiles
create policy "profiles: own read/write"
  on profiles for all using (auth.uid() = id);

create policy "profiles: teacher reads students in batches"
  on profiles for select using (
    exists (
      select 1 from batch_students bs
      join batches b on bs.batch_id = b.id
      where bs.student_id = profiles.id and b.teacher_id = auth.uid()
    )
  );

create policy "profiles: parent reads own children"
  on profiles for select using (
    exists (
      select 1 from parent_children
      where parent_id = auth.uid() and student_id = profiles.id
    )
  );

-- batches
create policy "batches: teacher full access"
  on batches for all using (teacher_id = auth.uid());

create policy "batches: student reads own"
  on batches for select using (
    exists (select 1 from batch_students where batch_id = batches.id and student_id = auth.uid())
  );

-- batch_students
create policy "batch_students: teacher manages"
  on batch_students for all using (
    exists (select 1 from batches where id = batch_students.batch_id and teacher_id = auth.uid())
  );

create policy "batch_students: student reads own"
  on batch_students for select using (student_id = auth.uid());

-- parent_children
create policy "parent_children: parent full access"
  on parent_children for all using (parent_id = auth.uid());

create policy "parent_children: student reads own"
  on parent_children for select using (student_id = auth.uid());

-- questions
create policy "questions: teacher full access"
  on questions for all using (teacher_id = auth.uid());

create policy "questions: student reads assigned"
  on questions for select using (
    exists (
      select 1 from test_questions tq
      join tests t on tq.test_id = t.id
      join test_assignments ta on ta.test_id = t.id
      left join batch_students bs on bs.batch_id = ta.batch_id
      where tq.question_id = questions.id
        and (bs.student_id = auth.uid() or ta.student_id = auth.uid())
    )
  );

-- tests
create policy "tests: teacher full access"
  on tests for all using (teacher_id = auth.uid());

create policy "tests: student reads assigned"
  on tests for select using (
    exists (
      select 1 from test_assignments ta
      left join batch_students bs on bs.batch_id = ta.batch_id
      where ta.test_id = tests.id
        and (bs.student_id = auth.uid() or ta.student_id = auth.uid())
    )
  );

-- test_questions
create policy "test_questions: teacher full access"
  on test_questions for all using (
    exists (select 1 from tests where id = test_questions.test_id and teacher_id = auth.uid())
  );

create policy "test_questions: student reads assigned"
  on test_questions for select using (
    exists (
      select 1 from tests t
      join test_assignments ta on ta.test_id = t.id
      left join batch_students bs on bs.batch_id = ta.batch_id
      where t.id = test_questions.test_id
        and (bs.student_id = auth.uid() or ta.student_id = auth.uid())
    )
  );

-- test_assignments
create policy "test_assignments: teacher manages own"
  on test_assignments for all using (
    exists (select 1 from tests where id = test_assignments.test_id and teacher_id = auth.uid())
  );

create policy "test_assignments: student reads own"
  on test_assignments for select using (
    student_id = auth.uid() or
    exists (select 1 from batch_students where batch_id = test_assignments.batch_id and student_id = auth.uid())
  );

-- test_attempts
create policy "test_attempts: student full access"
  on test_attempts for all using (student_id = auth.uid());

create policy "test_attempts: teacher reads for own tests"
  on test_attempts for select using (
    exists (select 1 from tests where id = test_attempts.test_id and teacher_id = auth.uid())
  );

create policy "test_attempts: parent reads children"
  on test_attempts for select using (
    exists (
      select 1 from parent_children
      where parent_id = auth.uid() and student_id = test_attempts.student_id
    )
  );

-- subscriptions
create policy "subscriptions: user full access"
  on subscriptions for all using (user_id = auth.uid());

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository status

This repository currently contains **only a product specification** — [dhrona-app-knowledge-base.md](dhrona-app-knowledge-base.md). No application code, `package.json`, or git history exists yet. The sections below describe the **planned** architecture so future work scaffolds and builds against a consistent design. Update this file with real commands once the codebase is scaffolded.

## What Dhrona is

Dhrona is an AI-powered education platform (mobile app) for Indian competitive-exam students (JEE / NEET / CBSE). It serves three distinct user roles — **Teacher**, **Student**, **Parent** — each with its own flows and dashboards. V0 launch target is July 16, 2026.

The full product spec, business model, roadmap, and feature breakdown live in [dhrona-app-knowledge-base.md](dhrona-app-knowledge-base.md). Read it before making product or scope decisions.

## Planned tech stack

- **Mobile app:** React Native + Expo (single codebase, Android + iOS). Expo manages store builds.
- **Backend:** Node.js + Express, RESTful API. Hosted on Railway or Render.
- **Database:** Supabase (PostgreSQL) with real-time subscriptions.
- **Auth:** Supabase Auth — Phone OTP (primary) + Google OAuth, with multi-role access control.
- **AI layer:** Vendor-agnostic "AI API" for question generation (Phase 1) and grading/OCR (Phase 2). Keep AI provider abstracted behind an interface.
- **Storage:** Supabase Storage (answer-sheet photos, exported PDFs).
- **Push:** Expo Push Notifications.
- **Payments:** Razorpay (UPI, cards, net banking, wallets).

## Architecture concepts that span multiple files

These are the cross-cutting designs a future instance must understand before it can be productive:

### Multi-role data isolation
Teacher / Student / Parent are not just UI variations — they are enforced data boundaries via **Supabase Row-Level Security (RLS)**. Teachers see only students in their batches; students see only their own data; parents see only linked children; institution admins see center-wide data. Any new table or query must respect RLS. Schema and policy changes go together.

### AI question generation flow (Phase 1 core)
Teacher input (subject + chapter + difficulty + format + count) → structured prompt to AI API (specifying exam format, syllabus boundaries, difficulty, and a JSON output schema) → AI returns structured JSON → backend **validates the JSON schema** before storing → teacher reviews/edits/regenerates → questions saved, tagged, and searchable in the question bank. The JSON schema is the contract between the AI layer, the backend, and the question bank — treat it as a shared, versioned artifact.

### Phase 2 grading pipeline (post-V0)
Answer upload (photo or typed) → Vision API OCR for handwriting → AI evaluation vs answer key → student topic-mastery profile update → all three dashboards refresh. Phase 2 is explicitly out of scope for V0; don't build it early.

### Exam-vertical extensibility
Subject/chapter taxonomy and AI prompt templates are designed so new exam verticals (state boards, UPSC, etc.) are added as data (taxonomy + prompt templates), **not code changes**. Keep exam formats data-driven rather than hardcoded.

## Scope discipline

- **Phase 1 (V0):** AI question generator, test builder/assignment, question bank, student test-taking experience, batch management, Razorpay subscriptions, Free/Premium gating, push notifications. This is the only scope until launch.
- **Phase 2 (post-V0):** Answer-sheet OCR, AI grading, student intelligence profiles, analytics dashboards. Do not implement Phase 2 features unless explicitly asked.
- Freemium tiers (Free / Student Premium / Institution) gate features — see the knowledge base §5 for exact limits (e.g. Free = 5 AI generations/day, 2 practice tests/week).

## Working in this repo

When scaffolding or adding code, prefer the planned stack above. If a decision is genuinely undecided, check the knowledge base "To Be Decided" list (§8) before inventing an answer. Once real build/lint/test commands exist, replace the "Repository status" note with them.

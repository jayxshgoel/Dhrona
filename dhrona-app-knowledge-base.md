# Dhrona — AI Education Platform
**Complete Knowledge Base & Product Specification**

---

## 1. Core Identity

**App Name:** Dhrona

**Tagline:** AI-powered learning ecosystem for India's next toppers

**Launch Date:** July 16, 2026 (Rath Yatra Day, Odisha)

**Client:** Asit (owns Aakash Institute centers in Odisha) — personal project, not officially Aakash-branded

**Development Team:** Sambhav + 1 friend, using AI tools (Claude, Antigravity, etc.)

**Target Market:** National scale, starting with Odisha. 1,000–2,000 active students in Year 1.

---

## 2. Platform & Technical Overview

### Platform
- **Mobile App:** Android + iOS (single codebase)
- **Language:** English only
- **Business Model:** Freemium (Free, Premium, Institution tiers)

### Tech Stack

**Frontend (Mobile)**
- React Native + Expo
- Single codebase for Android and iOS
- Expo handles App Store and Play Store builds

**Backend**
- Node.js + Express
- Hosted on Railway or Render (auto-scaling)
- RESTful API architecture

**Database**
- Supabase (PostgreSQL)
- Real-time subscriptions
- Row-level security for multi-role data isolation
- Free tier handles 2,000 students easily

**Authentication**
- Supabase Auth
- Phone OTP (critical for Indian students)
- Google OAuth as alternative
- Multi-role access control (Teacher/Student/Parent)

**AI Layer**
- AI API for question generation (structured prompts → JSON output)
- AI API for answer grading and feedback (Phase 2)
- Vision API for OCR on handwritten answers (Phase 2)

**File Storage**
- Supabase Storage
- Stores answer sheet photos, exported PDFs

**Push Notifications**
- Expo Push Notifications
- Test assignment alerts, result notifications, parent updates

**Payments**
- Razorpay
- UPI, cards, net banking, wallets
- Handles monthly and annual subscriptions

---

## 3. User Roles & Capabilities

### Three User Types

#### **Teacher** (Batch Owner · Content Creator)
- Generate AI question banks by subject/chapter/difficulty/format
- Build and assign complete tests (set time, marks, negative marking)
- Manage student batches (group by class, center, exam type)
- View class-wide performance analytics (Phase 2)
- Upload and manage answer keys for auto-grading

#### **Student** (Primary User · Learner)
- Self-generate practice questions on demand (any subject/chapter/difficulty)
- Take teacher-assigned tests (timed, exam-formatted)
- View scores and detailed solutions after submission
- Track personal progress and performance trends (Phase 2)
- Submit answers via typing or photograph (Phase 2)

#### **Parent** (Observer · Subscriber)
- View child's test history and scores
- See progress reports and improvement trends (Phase 2)
- Receive push notifications on test results
- Manage subscription and billing (upgrade to Premium)
- Link multiple children under one parent account

---

## 4. Features Breakdown

### Phase 1: Question & Test Engine (V0 — July 16, 2026)

#### F1: AI Question Generator
- **Input:** Subject, Chapter, Difficulty, Question Type, Count
- **Output:** Exam-quality questions in structured JSON format
- **Formats Supported:**
  - JEE Advanced / Mains
  - NEET
  - CBSE (Class 11/12)
  - Custom formats (future: all education verticals)
- **Question Types:** MCQ, Assertion-Reason, Match the Column, Integer Type, Short Answer, Long Answer
- **Difficulty Levels:** Easy, Medium, Hard, Previous Year Pattern
- **Subjects:** Physics, Chemistry, Mathematics, Biology + expandable to any subject
- **Volume:** Generate 5–50 questions per request

#### F2: Test Builder & Assignment
- Create complete test papers by combining questions
- Configure test rules:
  - Time limit (30 min to 3 hours)
  - Marks per question
  - Negative marking rules
  - Total marks
- Assign to:
  - Individual students
  - Full batch
  - Multiple batches
- Schedule tests for future date/time
- Preview test before publishing
- Students get push notification on assignment

#### F3: Question Bank Management
- Every AI-generated question auto-saved to bank
- Tag and organize by:
  - Subject
  - Chapter/Topic
  - Difficulty
  - Question Type
- Search functionality (keyword, subject, difficulty)
- Edit/delete individual questions
- Reuse questions across multiple tests
- Personal teacher library

#### F4: Student Test Experience
- Clean, distraction-free test interface
- Features:
  - Live countdown timer with auto-submit
  - Question navigation panel (attempted/skipped/flagged)
  - Mark for review functionality
  - Submit confirmation with warnings
- Post-submission:
  - Instant score calculation
  - Rank within batch
  - Detailed solutions for each question
  - Wrong answer explanations
  - Correct answer reveal

---

### Phase 2: Answer Analyzer & Intelligence Dashboard (Post-V0)

#### P1: Answer Sheet Submission
- **Two submission modes:**
  1. **Type answers directly in-app** (for digital tests)
  2. **Photograph answer sheet** (for paper-based tests)
- Multi-page upload support
- Automatic image enhancement before processing
- Submission status tracking in real-time

#### P2: AI Grading Engine
- **MCQ Grading:** Instant auto-scoring against answer key
- **Subjective Grading:**
  - OCR extraction from handwritten answers
  - AI evaluation of written responses
  - Partial marking support
  - Per-question feedback comments
- **Ambiguity Handling:** Flag unclear answers for teacher manual review
- **Output:** Full scorecard with marks breakdown

#### P3: Student Intelligence Profile
Over time, builds a deep learning profile for each student:
- **Topic-wise mastery score** (per chapter, 0-100%)
- **Weak area identification** with automated alerts
- **Time-per-question analysis** (speed vs accuracy)
- **Accuracy trend** over rolling 30-day window
- **Improvement velocity** (rate of progress tracking)
- **Personalized recommendations:** "Focus on Thermodynamics" / "Practice more Organic Chemistry"

#### P4: Analytics Dashboard
Tailored dashboards for each user role:

**Student Dashboard:**
- Score history (line chart over time)
- Topic-wise performance heatmap
- Batch rank and percentile
- Strengths and weaknesses summary
- Recent test results
- Upcoming assignments

**Teacher Dashboard:**
- Class-wide performance overview
- Weakest topics across batch
- Test completion rate
- Student-by-student breakdown
- Question difficulty analysis
- Time taken per question (batch average)

**Parent Dashboard:**
- Child's progress summary
- Score trends (improving/declining alerts)
- Test calendar
- Performance compared to batch average
- Exportable PDF report cards
- Notification history

---

## 5. Business Model — Freemium Structure

### Free Tier
**Price:** ₹0 forever  
**Target:** Students discovering the platform  
**Included:**
- 5 AI question generations per day
- 2 self-practice tests per week
- Basic score view after test
- Take all teacher-assigned tests (unlimited)

**Not Included:**
- Performance dashboard
- AI answer analysis
- Weak topic detection
- Progress history

---

### Student Premium
**Price:** ₹299/month **or** ₹2,499/year (save 30%)  
**Target:** Serious JEE/NEET/CBSE aspirants  
**Included:**
- **Everything in Free, plus:**
- Unlimited AI question generation
- Unlimited self-practice tests
- Full performance dashboard access
- AI answer sheet analysis (Phase 2)
- Weak topic detection with alerts
- Progress reports shared with parents
- Priority support

---

### Institution Tier
**Price:** Custom (per center, annual license)  
**Target:** Coaching centers like Aakash Institute, schools  
**Included:**
- **Everything in Student Premium for all students, plus:**
- Up to 10 teacher accounts per center
- Unlimited student accounts
- Batch and center management tools
- Center-wide analytics dashboard
- White-label option (future)
- Dedicated onboarding and support

---

### Pro Tier (Planned for V1)
**Price:** TBD  
**Target:** Power users between Premium and Institution  
**Features:** To be defined post-V0 based on user feedback and demand

---

## 6. Commercial Terms & Pricing

### Development Investment

| Milestone | Scope | Deliverable | Payment |
|-----------|-------|-------------|---------|
| **Milestone 1: Kickoff → Beta Demo** | Days 1–10 | Working Android + iOS app with AI question generator, test system, all three user flows, demo-ready with dummy data | **₹25,000** |
| **Milestone 2: Beta → V0 Launch** | Days 11–60 (July 16) | Production-ready app, real data flow, App Store + Play Store submission, all V0 features live | **₹1,15,000** |
| **Total Development** | 60 days | Full V0 launch on Rath Yatra | **₹1,40,000** |

---

### Post-Launch Maintenance

| Plan | Cost | What's Included |
|------|------|-----------------|
| **Monthly** | ₹10,800/month | Bug fixes, minor updates, server costs, and **all AI API token costs for up to 300 monthly active users** |
| **Annual (upfront)** | ₹1,14,048/year | Same as monthly for 12 months. **12% discount applied** (saves ₹15,552 vs paying monthly) |

**Discount Calculation:**
- Monthly: ₹10,800 × 12 = ₹1,29,600
- Less 12% discount: ₹1,29,600 × 0.12 = ₹15,552
- **Annual price: ₹1,14,048**

---

### Active User Scaling (Beyond Base 300)

| Monthly Active Users | Additional Monthly Cost |
|---------------------|------------------------|
| 0–300 (base) | ₹0 (included in maintenance) |
| 301–450 | +₹3,000/month |
| 451–600 | +₹6,000/month |
| 601–750 | +₹9,000/month |
| 751+ | +₹3,000 per additional 150 active users |

**Active User Definition:** A user who logs in and uses the app at least once within a calendar month. Total registered accounts that don't log in are not counted.

**Scaling charges apply on top of the base maintenance plan** (monthly or annual).

---

## 7. Development Roadmap

### Current Date: May 17, 2026
### V0 Launch Target: July 16, 2026 (Rath Yatra)
### Total Duration: 60 days

---

### **Week 1 (Days 1–7): Foundation Build**
- **Days 1–2:** Project setup, Expo app scaffold, Supabase schema design, Auth screens (Phone OTP + Google OAuth), Navigation skeleton for Teacher/Student/Parent flows
- **Days 3–5:** AI API integration — question generator with prompt engineering for JEE/NEET/CBSE output as structured JSON
- **Days 6–7:** Test builder UI, assignment flow, student test-taking screen (timer, navigation panel, submit, basic score view)

---

### **Week 1.5 (Days 8–10): Beta Demo Preparation**
**Milestone: Beta Demo on Day 10**

- **Day 8:** Teacher dashboard — list of tests, students, basic stats (dummy data acceptable)
- **Day 9:** Parent view — child's test history, score cards, account linking
- **Day 10:** UI polish, bug fixes, demo script preparation, generate sample JEE/NEET tests with dummy data, walkthrough prep

**Deliverable:** Working demo-ready app for client presentation

---

### **Weeks 2–5 (Days 11–35): V0 Core Features**
- **Days 11–18:** Real data flow — student answers saved to Supabase, scores computed and stored, result history implemented correctly
- **Days 19–25:** Batch management, Razorpay subscription integration, Free vs Premium feature gating, Phone-OTP registration flow
- **Days 26–35:** Push notifications (test assignment alerts, result notifications), question bank search and edit, performance optimization, real device QA

---

### **Weeks 6–9 (Days 36–60): V0 Launch Preparation**
- **Days 36–50:** App Store (iOS) and Play Store (Android) submission and review, signed builds, screenshots, store descriptions, privacy policy
- **Days 51–58:** Internal beta with Asit's first batch of real students (10–30 users), monitor Supabase logs, fix live bugs, fast iteration
- **Days 59–60:** Final QA pass, launch-day preparations

**Milestone: V0 Launch on July 16, 2026 (Rath Yatra Day)**

---

### **Post-Launch: Phase 2 Development**
Timeline TBD based on V0 feedback and usage data

- **Week 10+:** Answer sheet upload + Vision API OCR integration (handwriting to text pipeline)
- **Week 12+:** AI grading engine + student intelligence profiles (per-question feedback, weak topic detection)
- **Week 14+:** Full analytics dashboard for all three user roles (score history, topic heatmap, exportable report cards)

**Estimated Phase 2 Duration:** 6–8 weeks

---

## 8. Key Product Decisions & Constraints

### Decided
✅ **App name:** Dhrona  
✅ **Platform:** Android + iOS (React Native + Expo)  
✅ **Language:** English only (V0)  
✅ **Launch date:** July 16, 2026 (Rath Yatra)  
✅ **Business model:** Freemium with 3 tiers  
✅ **Target exams (V0):** JEE, NEET, CBSE  
✅ **Development team:** 2 people using AI tools  
✅ **Backend:** Node.js + Supabase  
✅ **AI provider:** Generic "AI API" (vendor-agnostic in documentation)  
✅ **Payment gateway:** Razorpay  

### To Be Decided (Post-V0)
🔲 Pro tier features and pricing (V1)  
🔲 Phase 2 exact timeline  
🔲 Subject expansion beyond Physics/Chemistry/Math/Biology  
🔲 Regional language support  
🔲 Offline mode support  
🔲 Desktop web version  

---

## 9. Architecture Notes

### AI Question Generation Flow
1. **INPUT:** Teacher selects Subject + Chapter + Difficulty + Format + Question Count
2. **PROMPT ENGINEERING:** Structured prompt sent to AI API specifying:
   - Exam format (JEE/NEET/CBSE/Custom)
   - Chapter context and syllabus boundaries
   - Difficulty calibration
   - Desired JSON output schema
3. **AI RESPONSE:** Returns structured JSON with questions, options, correct answers, explanations
4. **VALIDATION:** Backend validates JSON schema, stores to database
5. **REVIEW:** Teacher can edit, accept, or regenerate individual questions before adding to bank
6. **STORAGE:** All questions tagged and saved to searchable question bank

### Phase 2 AI Grading Pipeline
1. **UPLOAD:** Student submits answer (photo or typed text)
2. **OCR (if photo):** Vision API extracts text from handwritten answer sheet, handles multi-page, enhances image quality
3. **AI EVALUATION:** AI API compares extracted/typed answer vs answer key, assigns marks, generates per-question feedback
4. **PROFILE UPDATE:** Student's topic mastery profile updated based on performance pattern
5. **DASHBOARD SYNC:** All three dashboards (Student/Teacher/Parent) refresh with new data

### Multi-Role Data Isolation
- **Supabase Row-Level Security (RLS)** enforces access control
- Teachers can only see students in their assigned batches
- Students can only see their own data
- Parents can only see linked children's data
- Institution admins can see center-wide data

### Scaling Strategy
- **Database:** Supabase free tier → paid tier (handles 100K+ users)
- **Backend:** Railway/Render auto-scaling (horizontal scaling as traffic grows)
- **Storage:** Supabase Storage → CDN if needed for image delivery
- **AI API:** Rate limiting + caching to manage token costs
- **Active user-based billing** ensures predictable costs

---

## 10. Future Expansion Vision

### Beyond JEE/NEET/CBSE
While V0 launches with JEE, NEET, and CBSE focus, the platform architecture is designed for **all education verticals** from day one:

**Potential Verticals:**
- State board exams (all Indian states)
- University entrance exams (CUET, IPU CET, etc.)
- Competitive government exams (UPSC, SSC, Banking, Railways)
- Professional certifications (CA, CS, CMA, etc.)
- Skill-based assessments (coding, data science, design)
- Language proficiency tests (IELTS, TOEFL, etc.)
- School-level assessments (Class 6–10 across boards)

**Implementation Approach:**
- Subject and chapter taxonomy designed to be infinitely expandable
- AI prompt templates support custom exam patterns
- Question format engine handles any question type
- Each new vertical = new subject taxonomy + prompt templates (no code changes)

---

## 11. Competitive Positioning

### Key Differentiators
1. **AI-Powered Question Generation:** Teachers don't need to manually create questions — AI generates exam-quality questions in seconds
2. **Handwritten Answer Analysis (Phase 2):** Students can take physical tests and photograph them — AI grades handwritten answers
3. **Student Intelligence Profiles (Phase 2):** Deep learning analytics that identify weak areas and personalized focus recommendations
4. **Multi-Role Dashboard:** Distinct experiences for Teacher, Student, Parent — not a one-size-fits-all interface
5. **Freemium at Scale:** Free tier hooks students, Premium tier converts serious learners, Institution tier serves coaching centers
6. **Mobile-First:** Built for phone usage patterns of Indian students (not a desktop-first design forced onto mobile)

### Market Fit
- **Target:** Indian students aged 15–22 preparing for competitive exams
- **Pain Points Solved:**
  - Teachers spend hours creating question papers → AI generates them instantly
  - Students don't know their weak areas → Intelligence profile reveals them automatically
  - Parents have no visibility into progress → Dedicated parent dashboard with alerts
  - Manual answer checking is slow → AI grades in seconds (Phase 2)

---

## 12. Open Questions & Risks

### Technical Risks
- **AI API rate limits:** High usage could hit rate limits → Mitigation: caching, request batching
- **OCR accuracy on handwriting:** Indian student handwriting varies widely → Mitigation: Vision API pre-trained on diverse datasets
- **App Store approval delays:** Could delay launch → Mitigation: Submit early (Day 36), buffer time built in
- **Real-time dashboard performance:** Complex queries could slow down → Mitigation: pre-computed aggregates, indexing

### Business Risks
- **Free-to-Premium conversion rate:** If too low, revenue suffers → Mitigation: paywall after showing value (Phase 2 features)
- **Coaching center adoption:** Institutional tier is key revenue → Mitigation: Asit's Aakash centers as pilot customers
- **Market timing:** Launching mid-year (July) vs Jan/Feb academic start → Mitigation: Rath Yatra cultural hook, JEE/NEET prep is year-round

### Operational Risks
- **2-person team capacity:** Limited bandwidth for post-launch support → Mitigation: AI-assisted development, focus on V0 stability
- **API token costs scaling faster than revenue:** Could burn through budget → Mitigation: active user-based billing passed to client

---

## 13. Success Metrics (V0 Goals)

### Launch Day (July 16, 2026)
- ✅ App live on App Store and Play Store
- ✅ Zero critical bugs in core flows
- ✅ 10–30 real students onboarded from Asit's centers

### Month 1 (July 16 – Aug 16)
- **Active Users:** 50–100 students
- **Tests Taken:** 200+ total tests
- **Questions Generated:** 1,000+ AI-generated questions
- **Free → Premium Conversion:** 5–10% (5–10 paying students)

### Month 3 (July 16 – Oct 16)
- **Active Users:** 500–1,000 students
- **Coaching Center Partnerships:** 3–5 centers beyond Asit
- **Retention Rate:** 60%+ weekly active users
- **Revenue:** ₹50,000–₹1,00,000/month from Premium subscriptions

### Year 1 (July 2026 – July 2027)
- **Active Users:** 1,000–2,000 students (as per original target)
- **Institutional Clients:** 10+ coaching centers
- **Phase 2 Launched:** Answer analysis and dashboards live
- **Monthly Revenue:** ₹2,00,000–₹5,00,000/month

---

## 14. Brand Identity

### Name Origin
**Dhrona** (Dronacharya) — the legendary teacher from the Mahabharata, known as the greatest guru of archery and warfare. Symbolizes:
- Mastery and excellence in teaching
- Personalized training (Drona trained each student differently)
- Results-oriented (his students became the best warriors)
- Indian cultural resonance without regional specificity

### Visual Identity (TBD)
- **Color Palette:** Navy + Teal + Amber (from proposal design)
- **Logo:** To be designed (could incorporate bow/arrow or guru-shishya symbolism)
- **Typography:** Clean, modern, mobile-optimized
- **Tone:** Aspirational but accessible, motivational without pressure

### Messaging Pillars
1. **AI-Powered Learning:** Technology that adapts to you
2. **Results-Driven:** Built for students who want to ace exams
3. **Personalized Insights:** Know your weak areas, fix them faster
4. **Teacher-Empowered:** Give teachers superpowers with AI question generation

---

## 15. Contact & Stakeholders

**Development Team:**
- Sambhav (College Avenue founder, co-founder) — Technical lead, product
- Friend (name TBD) — Development partner

**Client:**
- Asit — Owns Aakash Institute centers in Odisha, funding the development

**Target Users:**
- Students (15–22 years old, JEE/NEET/CBSE aspirants)
- Teachers (coaching center faculty, school teachers)
- Parents (interested in child's academic progress)

---

## 16. Document Version Control

**Version:** 1.0  
**Last Updated:** May 17, 2026  
**Status:** Pre-launch (60 days to V0)  
**Next Review:** Post Beta Demo (Day 10) + Post V0 Launch (July 16)

---

**End of Knowledge Base**

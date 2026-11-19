# Salah Times — Multi-Mosque Prayer Timing Management Platform

A production-oriented, multi-tenant web application for managing daily prayer and Jummah timings for multiple mosques from a centralized platform. Built with Next.js 15 (App Router), TypeScript (strict mode), Tailwind CSS, and designed for Supabase PostgreSQL.

---

## 🌟 Key Features

### 🕌 Public Portal (No Login Required)
- **Prayer Times Near You:** Homepage with responsive search by mosque name, city, and address.
- **Dedicated Mosque Pages:** Unique shareable URLs (`/mosques/[slug]`) for every registered mosque.
- **Real-Time Prayer Countdown:** Live countdown displaying hours, minutes, and seconds until the next congregational Jamaat.
- **Comprehensive Timetable:** Clear Adhan (call to prayer) and Iqamah (congregational prayer) times for all 5 daily prayers (Fajr, Dhuhr, Asr, Maghrib, Isha).
- **Jummah Management:** Prominent display of multiple Friday congregational sessions with Khutbah and Jamaat timings.
- **Active Announcements:** Mosque-specific announcements for timing updates, Ramadan schedules, lectures, and emergency notices.
- **TV / Digital Signage Mode (`/mosques/[slug]/display`):** Fullscreen, high-contrast, distraction-free display board designed for television screens inside mosques with live digital clock, prayer highlight pulses, and announcement tickers.

### 🛡️ Administrative Portal (`/admin`)
- **Role-Based Access Control (RBAC):**
  - **Super Admin:** Full platform control across all mosques, registration, admin assignments, global settings, and audit logs.
  - **Mosque Admin:** Strict tenant isolation — can only access and modify their assigned mosque(s).
- **3-Layer Prayer Timing Engine:**
  1. *Priority 1 (Highest):* **Date-Specific Overrides** (e.g., Ramadan, Eid, emergency schedule shifts).
  2. *Priority 2:* **Monthly Timetable** (full 30-day timetable for specific months with bulk +/- minute shifts).
  3. *Priority 3:* **Default Baseline Schedule** (fallback times used when no override exists).
- **Interactive Timetable Editor:** Real-time validation, unsaved changes indicator, live card preview, and confirmation dialogs before publishing.
- **Jummah Manager:** Multi-session scheduling, Khutbah times, overflow notes.
- **Activity & Audit Logging:** Complete audit trail tracking who changed what prayer timing, announcement, or admin assignment with timestamps.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router with Server Components & Client Components) |
| **Language** | TypeScript (Strict Mode enabled) |
| **Styling** | Tailwind CSS with Islamic-inspired palette (Deep Emerald, Soft Cream, Muted Gold) |
| **Icons** | Lucide React |
| **Database** | Supabase (PostgreSQL with Row Level Security) |
| **Authentication** | Supabase Auth (Email/Password with RLS enforcement) |
| **Form Validation** | Zod + React Hook Form |
| **Test Runner** | Vitest (Automated test suite for RBAC isolation & 3-layer timing resolution) |
| **Deployment** | Vercel Ready |

---

## 📁 Project Structure

```
MosquePrayerApp/
├── src/
│   ├── app/
│   │   ├── (public)/                 # Public route group (Navbar + Footer)
│   │   │   ├── page.tsx              # Homepage with hero, search & features
│   │   │   ├── mosques/
│   │   │   │   ├── page.tsx          # Mosques directory
│   │   │   │   └── [slug]/
│   │   │   │       ├── page.tsx      # Mosque detail page
│   │   │   │       └── display/      # Fullscreen TV / Digital Signage mode
│   │   │   └── layout.tsx            # Public layout wrapper
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx        # Administrative login
│   │   │   └── layout.tsx            # Auth layout wrapper
│   │   ├── admin/                    # Admin portal
│   │   │   ├── page.tsx              # Admin dashboard & metrics
│   │   │   ├── mosques/              # Mosque directory & registration
│   │   │   ├── prayer-times/         # Default schedule, monthly & overrides
│   │   │   ├── jummah/               # Friday prayer session manager
│   │   │   ├── announcements/        # Mosque notices & broadcasts
│   │   │   ├── administrators/       # Admin assignment & RBAC
│   │   │   ├── activity-logs/        # Audit trails
│   │   │   ├── settings/             # System configurations
│   │   │   ├── profile/              # User profile
│   │   │   └── layout.tsx            # Admin layout with responsive sidebar
│   │   ├── globals.css               # Design system & CSS custom variables
│   │   └── layout.tsx                # Root layout
│   ├── components/
│   │   ├── public/                   # Public components (Cards, Timetable, Countdown, TV)
│   │   └── admin/                    # Admin components (Sidebar, Header, Forms)
│   ├── lib/
│   │   ├── supabase/                 # Supabase client, server, and service role admin
│   │   ├── constants.ts              # Canonical prayer names, nav links, statuses
│   │   ├── prayer-utils.ts           # 3-layer timing resolution algorithm & shiftTime
│   │   ├── sample-data.ts            # Development data & mock API helpers
│   │   └── utils.ts                  # Date, Hijri, slug, countdown & time formatters
│   └── types/
│       └── mosque.ts                 # Full TypeScript domain interfaces
├── supabase/
│   ├── migrations/
│   │   └── 00001_initial_schema.sql  # Normalized PostgreSQL schema, indexes, RLS, functions
│   └── seed.sql                      # Initial seed dataset
├── tests/
│   ├── authorization.test.ts         # Multi-tenant isolation & RBAC tests
│   ├── prayer-resolution.test.ts     # 3-layer precedence timing tests
│   └── timing-utils.test.ts          # Clock, slug, and countdown tests
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm (or pnpm / yarn)

### 1. Installation
```bash
git clone <repository-url>
cd MosquePrayerApp
npm install
```

### 2. Environment Variables
Copy the example environment configuration:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key
```

> **Note on Development Mode:** If external Supabase credentials are not yet configured, the application automatically runs in development mode using rich sample data, allowing complete frontend exploration, testing, and UI review.

### 3. Database Setup (Supabase)
To set up your PostgreSQL database in Supabase:
1. Open the **SQL Editor** in your Supabase dashboard.
2. Run the migration script at [`supabase/migrations/00001_initial_schema.sql`](supabase/migrations/00001_initial_schema.sql).
3. Run the seed script at [`supabase/seed.sql`](supabase/seed.sql) to populate initial sample mosques and timings.

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Running the Automated Test Suite
```bash
npm test
```
Runs 22 comprehensive unit tests verifying multi-tenant isolation, 3-layer prayer timing resolution, and formatting functions.

### 6. Production Build
```bash
npm run build
npm run start
```

---

## 🔒 Security Architecture & RLS

The database is built on **Supabase Row Level Security (RLS)**:

- **Public Visitors (`anon`):**
  - Can read published mosque details (`status = 'active'`).
  - Can read published prayer schedules and active announcements.
  - Zero write access.
- **Mosque Administrators:**
  - Can only read and update records where `mosque_id` matches their assignments in `mosque_admins`.
  - **Strictly isolated:** Cannot view, edit, or delete timings for another mosque.
- **Super Administrators:**
  - Bypass mosque isolation with global write privileges across all tables.
  - Protected against self-escalation through database check constraints and service-role enforcement.

---

## 🧪 Verification & QA Checklist

- [x] **Zero TypeScript Errors:** Verified with `npx tsc --noEmit`.
- [x] **Production Build Successful:** Verified with `npm run build` (all 21 static and dynamic routes compiled).
- [x] **Automated Tests Passing:** 22/22 unit tests passing in Vitest.
- [x] **Multi-Mosque Support:** Unique slug routes for each mosque.
- [x] **Live Timetable Resolution:** 3-tier fallback tested and working.
- [x] **TV Signage Mode:** Standalone high-visibility mode tested at `/mosques/[slug]/display`.

---

## 📄 License
MIT License. Built for mosques and Muslim communities worldwide.

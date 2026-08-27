# TaskManage — Frontend

TaskManage is a role-based task and project management web app. This repository is
the React single-page frontend that talks to the [TaskManage backend API](#backend).

- Full marketing homepage at `/` for signed-out visitors (hero, features,
  workflow, roles, pricing/CTA, etc.)
- Email/password login with token-based sessions
- Role-aware dashboard, sidebar navigation, and permissions (Admin, Project
  Manager, Team Leader, Team Member)
- Projects, tasks, calendar, reports, notifications, and user management

## Tech stack

| Layer         | Choice |
|---------------|--------|
| Framework     | React 19 + Vite |
| Routing       | React Router v7 |
| Styling       | Tailwind CSS v4 |
| Icons         | lucide-react |
| Charts        | Chart.js / react-chartjs-2, Recharts |
| Calendar      | FullCalendar (day grid, time grid, multimonth, interaction) |
| HTTP client   | Axios |
| UI components | MUI (date pickers) |

## Project structure

```
src/
├── api/
│   └── api.js                 # Axios instance: base URL, auth header, 401 handling
├── assets/
│   ├── logo.png                 # Full lockup (icon + wordmark + tagline) — Login, homepage hero
│   ├── logo-icon.png            # Icon mark only, square — Sidebar chip
│   └── logo-wordmark.png        # Icon + wordmark, no tagline — Nav bars, Footer
├── components/
│   ├── auth/
│   │   └── Login.jsx          # Email/password login form
│   ├── common/
│   │   ├── Layout.jsx         # Authenticated shell: sidebar + header + content
│   │   └── Sidebar.jsx        # Role-filtered nav, profile summary, logout
│   ├── dashboard/
│   │   ├── DashboardSection.jsx # Card wrapper: own loading/error/empty state
│   │   └── Badges.jsx          # StatusBadge / PriorityBadge (color + label)
│   ├── marketing/              # shared by pages/Home.jsx and pages/Pricing.jsx
│   │   ├── Nav.jsx, Footer.jsx  # sticky nav (shadow-on-scroll), 5-column footer
│   │   ├── Hero.jsx, SocialProof.jsx, ProblemSection.jsx
│   │   ├── ValueProposition.jsx, FeaturesShowcase.jsx, WorkflowSection.jsx
│   │   ├── CollaborationSection.jsx, NotificationsSection.jsx
│   │   ├── CalendarSection.jsx, SearchSection.jsx
│   │   ├── DashboardPreviewSection.jsx, ReportingSection.jsx
│   │   ├── RolesSection.jsx, WhySection.jsx, HowItWorksSection.jsx
│   │   ├── SecuritySection.jsx, FinalCta.jsx      # Home.jsx-only sections
│   │   ├── PricingHero.jsx, PricingTiers.jsx        # Pricing.jsx-only sections
│   │   ├── PricingComparison.jsx, PricingFaq.jsx
│   │   ├── SectionHeading.jsx  # shared eyebrow/title/subtitle block
│   │   ├── Reveal.jsx           # scroll-triggered fade/slide-up wrapper
│   │   ├── AnimatedBar.jsx      # bar that grows in on scroll (width/height)
│   │   ├── CountUp.jsx          # number that counts up on scroll
│   │   └── useHashScroll.js     # scrolls to `#id` after route/hash change
│   └── notifications/
│       ├── NotificationBell.jsx
│       ├── NotificationDropdown.jsx
│       └── NotificationItem.jsx
├── context/
│   ├── AuthContext.jsx        # Session state, login/logout, role helpers
│   └── NotificationContext.jsx# Notification list, unread count, polling
├── pages/
│   ├── Home.jsx                # Public marketing homepage ("/")
│   ├── Pricing.jsx             # Public pricing page ("/pricing")
│   ├── Dashboard.jsx
│   ├── Projects.jsx
│   ├── Tasks.jsx / TaskDetails.jsx
│   ├── Users.jsx
│   ├── Profile.jsx
│   ├── Reports.jsx
│   ├── Admin.jsx
│   ├── Notifications.jsx / NotificationPreferences.jsx
│   └── Calendar.jsx
├── App.jsx                    # Route table + ProtectedRoute guard
└── main.jsx                   # App entry point
```

## Getting started

### Prerequisites

- Node.js 18+
- The [TaskManage backend](#backend) running locally (or a deployed instance
  you have a URL for)

### Install

```bash
npm install
```

### Run in development

```bash
npm run dev
```

The dev server runs on `http://localhost:5173`. It proxies `/api` and
`/storage` requests to `http://localhost:8000` (see `vite.config.js`), so a
local backend running on port 8000 works with no extra configuration.

### Build for production

```bash
npm run build   # outputs to dist/
npm run preview # serve the production build locally
```

### Lint

```bash
npm run lint
```

> Note: the project currently has a number of pre-existing lint findings
> (mainly an unused `import React` in every component under the classic JSX
> runtime, plus a few `no-unused-vars` and hook-ordering warnings). None of
> them are build-breaking; fixing them is a good follow-up but was out of
> scope for this pass.

## Environment variables

See `.env.example`. The only variable the app reads is:

| Variable        | Purpose                                                | Default |
|-----------------|---------------------------------------------------------|---------|
| `VITE_API_URL`  | Base URL the Axios client (`src/api/api.js`) sends requests to | `/api` (relies on the Vite dev proxy) |

- **Local development:** leave it unset — the dev server proxy handles it.
- **Production:** `.env.production` sets it to the deployed backend's full
  API URL, since there's no dev-server proxy in a static production build.

## Authentication flow

1. `Login.jsx` posts `{ email, password }` to `/login` via `AuthContext.login`.
2. On success, the token and user object are stored in `localStorage` and the
   token is attached as `Authorization: Bearer <token>` on the Axios instance.
3. `AuthContext` restores the session from `localStorage` on app load.
4. Axios's response interceptor clears the session and redirects to `/login`
   on any `401`.
5. `ProtectedRoute` (in `App.jsx`) blocks access to authenticated pages and
   redirects to `/login`; `Home.jsx` and `Login.jsx` redirect an already
   signed-in user straight to `/dashboard`.

## Marketing homepage (`/`)

`Home.jsx` composes 19 section components from `src/components/marketing/`
into the public, signed-out homepage. It's entirely static content (no API
calls) built from a provided content spec — a few implementation notes:

- Stats ("10,000+ tasks managed", "500+ teams"), the five customer
  wordmarks (Acme, Nova, Vertex, Flow, Horizon), and the reporting/calendar
  chart mockups are **illustrative placeholder data**, not real figures —
  swap them for real numbers before this goes anywhere public-facing.
- The nav's in-page links (`Features`, `Solutions`, `How It Works`) and most
  footer links scroll to the matching section (`#features`, `#solutions`,
  `#how-it-works`, `#collaboration`, `#calendar`, `#reporting`,
  `#notifications`, `#security`) via `to="/#section-id"` — `useHashScroll`
  (`src/components/marketing/useHashScroll.js`) scrolls to the element on
  route change, since React Router doesn't do this itself for client-side
  navigation. The footer's `Resources` column has no dedicated page, so its
  link just lands on the footer column itself.
- Footer items with no backing page (`About`, `Contact`, `Careers`, `Blog`,
  `Help Center`, `Documentation`, `Guides`, `FAQ`, `Privacy Policy`,
  `Terms of Service`) render as plain (non-clickable) text rather than dead
  links.
- "Start Free" / "Get Started Free" / "Contact Sales" all route to `/login`
  — there's no public self-serve signup or sales-contact flow in this app
  (users are provisioned by an Admin via `/users`), so `/login` is the only
  real entry point.

## Pricing page (`/pricing`)

`Pricing.jsx` reuses the same `Nav`/`Footer`/`FinalCta` as the homepage,
plus `PricingHero` (monthly/annual toggle), `PricingTiers` (Free / Team /
Enterprise), `PricingComparison` (detailed feature table), and `PricingFaq`
(accordion). **The three tiers, prices, and the feature comparison table are
invented illustrative content** — there's no billing system in this app, so
every plan's CTA routes to `/login` like everything else. Replace with real
pricing before this goes anywhere public-facing.

## Login (`/login`)

Split-screen SaaS layout: a gradient brand panel (hidden below `lg`, reusing
the same gradient/`.floating-shape` treatment as the Home/Pricing heroes)
next to the actual sign-in form. No "forgot password" or "sign up" — the
backend only exposes `/login`, and accounts are Admin-provisioned, so the
form instead says "Need an account? Contact your workspace administrator."
rather than promising flows that don't exist.

## Dashboard (post-login home page)

`/dashboard` (`src/pages/Dashboard.jsx`) is the authenticated home page. It's
built from independent sections — each fetches and renders on its own, so one
failing request degrades gracefully instead of blanking the page:

| Section | Source | Notes |
|---|---|---|
| Welcome + Create Task | `AuthContext.user` | "Create Task" only shown to Admin/PM/Team Leader; links to `/tasks?new=1`, which auto-opens the create-task modal |
| Task Summary cards | `GET /dashboard` (`stats`) | Each card links to `/tasks?filter=...` (or `?filter=overdue`) for a pre-filtered list |
| My Tasks | `GET /tasks`, filtered to the signed-in user | Title, project, priority/status badges, due date |
| Project Progress | `GET /dashboard` (`project_progress`) | Progress bar + optional due date |
| Upcoming Deadlines | `GET /tasks` | Non-terminal tasks with a future due date, nearest first |
| Notifications | `NotificationContext` (already polls app-wide) | Latest 5, links to `/notifications` |
| Team Workload | `GET /dashboard` (`team_stats`) | Admin / Project Manager / Team Leader only |
| Overdue Project Tasks | `GET /tasks` | Admin / Project Manager only |
| Admin Shortcuts | — | Admin only: links to Users and Admin (settings/audit logs) |
| Recent Activity | `GET /admin/audit-logs` for Admins; derived from `GET /tasks` (`updated_at`) for everyone else | The backend has no general-purpose "my activity" endpoint, so non-admins get a best-effort feed built from recently-updated tasks in their scope |

`Tasks.jsx` supports two query params to back the dashboard's deep links:
`?new=1` opens the create-task modal on load, and `?filter=<status name>`
(or `?filter=overdue`) pre-filters the task list client-side.

## Roles & permissions

Role checks live on `AuthContext` (`isAdmin`, `isProjectManager`,
`isTeamLeader`, `isTeamMember`) and are used to filter sidebar navigation and
gate page content:

| Role            | Access |
|-----------------|--------|
| Admin           | Everything — Users, Admin settings, Reports, all projects/tasks |
| Project Manager | Projects, Tasks, Reports |
| Team Leader     | Projects, Tasks (their team) |
| Team Member     | Their own assigned Tasks |

Calendar and Notifications are available to every signed-in role.

## Routing

| Path                        | Access    | Page |
|------------------------------|-----------|------|
| `/`                           | Public    | `Home` — landing page, redirects to `/dashboard` if already signed in |
| `/pricing`                    | Public    | `Pricing` — same redirect-if-signed-in behavior |
| `/login`                      | Public    | `Login` |
| `/dashboard`                  | Protected | `Dashboard` |
| `/projects`                   | Protected | `Projects` |
| `/tasks`, `/tasks/:id`        | Protected | `Tasks`, `TaskDetails` |
| `/users`                      | Protected | `Users` |
| `/profile`                    | Protected | `Profile` |
| `/reports`                    | Protected | `Reports` |
| `/admin`                      | Protected | `Admin` |
| `/notifications`              | Protected | `Notifications` |
| `/notification-preferences`   | Protected | `NotificationPreferences` |
| `/calendar`                   | Protected | `Calendar` |
| any other path                | —         | redirects to `/` |

## Backend

This app expects a REST API exposing endpoints such as `/login`, `/logout`,
`/me`, `/dashboard`, `/projects`, `/tasks`, `/task-statuses`,
`/task-priorities`, `/users`, `/roles`, `/reports`, `/admin/*`,
`/notifications*`, and serving uploaded files under `/storage`. The deployed
instance this project points to by default is configured in
`.env.production`.

## Deployment

The app is a static SPA. `vercel.json` rewrites all routes to `index.html`
so client-side routing works on Vercel:

```bash
npm run build
# deploy the dist/ folder (e.g. via the Vercel CLI or dashboard)
```

Set `VITE_API_URL` in the hosting provider's environment variables (or via
`.env.production`) to point at your backend before building.

# TaskFlow — Frontend

TaskFlow is a role-based task and project management web app. This repository is
the React single-page frontend that talks to the [TaskFlow backend API](#backend).

- Public landing page at `/` for signed-out visitors
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
├── assets/                    # Static images
├── components/
│   ├── auth/
│   │   └── Login.jsx          # Email/password login form
│   ├── common/
│   │   ├── Layout.jsx         # Authenticated shell: sidebar + header + content
│   │   └── Sidebar.jsx        # Role-filtered nav, profile summary, logout
│   └── notifications/
│       ├── NotificationBell.jsx
│       ├── NotificationDropdown.jsx
│       └── NotificationItem.jsx
├── context/
│   ├── AuthContext.jsx        # Session state, login/logout, role helpers
│   └── NotificationContext.jsx# Notification list, unread count, polling
├── pages/
│   ├── Home.jsx                # Public landing page ("/")
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
- The [TaskFlow backend](#backend) running locally (or a deployed instance
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

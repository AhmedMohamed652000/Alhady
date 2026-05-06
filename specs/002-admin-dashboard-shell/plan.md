# Implementation Plan: Admin Dashboard Shell

**Branch**: `002-admin-dashboard-shell` | **Date**: 2026-05-06 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/002-admin-dashboard-shell/spec.md`

## Summary

Build the React admin dashboard shell — login page with JWT auth flow, `ProtectedRoute` guard, sidebar navigation, top bar with logout, and a dashboard overview page displaying live content counts — as a new `src/admin/**` section of the existing CRA application. TailwindCSS v3 + shadcn/ui are used exclusively inside `src/admin/**`, leaving Bootstrap-powered website components untouched. This phase establishes the routing skeleton and auth infrastructure that all Phase 3 CRUD pages depend on.

## Technical Context

**Language/Version**: JavaScript (React 17, Create React App)
**Primary Dependencies**: react-router-dom v5, TailwindCSS v3, shadcn/ui, Axios, jwt-decode
**Storage**: N/A — no new MongoDB models; reads from Phase 1 backend API
**Testing**: Manual browser testing (login flow, route protection, responsive layout at 768px+)
**Target Platform**: Browser (Chrome / Firefox / Edge), desktop viewport 768px and above
**Project Type**: web-application (React SPA admin subsection added to existing CRA project)
**Performance Goals**: Login + dashboard load in < 3s on standard broadband (SC-001)
**Constraints**: TailwindCSS scoped to `./src/admin/**/*.{js,jsx}` only; JWT stored under key `alhady_admin_token` in localStorage; no Bootstrap classes in any admin component; 768px+ minimum supported width
**Scale/Scope**: Single admin user; navigation covers 10 content types + settings = 11 sections

## Constitution Check

### Pre-Design Gate

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Static-to-Dynamic Migration Integrity | ✅ PASS | Existing website components are not touched; admin is a new `src/admin/**` subtree |
| II. Strict Style Isolation | ✅ PASS | TailwindCSS used only inside `src/admin/**`; Tailwind `content` config MUST be scoped to `./src/admin/**/*.{js,jsx}` |
| III. API-First Content Architecture | ✅ PASS | Dashboard overview reads live counts from `/api/*` — no hardcoded numbers |
| IV. Security-by-Default | ✅ PASS | `ProtectedRoute` validates JWT from localStorage on every `/admin/*` route except `/admin/login`; Axios interceptor injects `Authorization: Bearer` header; 401 responses trigger redirect to login |
| V. Phased Delivery Order | ✅ PASS | This is Phase 2; Phase 1 backend must be running on port 5000 |

**Gate result**: PASS — proceed to Phase 0.

### Post-Design Gate (re-check after Phase 1 design)

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Static-to-Dynamic Migration Integrity | ✅ PASS | No website components modified; admin routes added alongside existing routes in `router/index.js` without restructuring |
| II. Strict Style Isolation | ✅ PASS | Tailwind `content` config verified as `./src/admin/**/*.{js,jsx}`; shadcn/ui components in `src/components/ui/` consumed only from admin files |
| III. API-First Content Architecture | ✅ PASS | `DashboardPage` fetches all 10 counts from backend via Axios; no static fallback numbers |
| IV. Security-by-Default | ✅ PASS | `ProtectedRoute` reads and validates token presence on every render; `api.js` response interceptor redirects on 401 |
| V. Phased Delivery Order | ✅ PASS | Phase 3 CRUD pages are blocked until this shell (routing + auth + layout) passes acceptance scenarios |

**Gate result**: PASS — proceed to implementation.

## Project Structure

### Documentation (this feature)

```text
specs/002-admin-dashboard-shell/
├── plan.md              ← this file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output (client-side state model)
├── quickstart.md        ← Phase 1 output
├── contracts/
│   └── api.md           ← API calls this phase makes to the Phase 1 backend
└── tasks.md             ← Phase 2 output (/speckit-tasks — not created here)
```

### Source Code (repository root)

```text
src/
├── admin/
│   ├── pages/
│   │   ├── LoginPage.jsx           ← /admin/login (public)
│   │   ├── DashboardPage.jsx       ← /admin/dashboard (overview with content counts)
│   │   ├── BannersPage.jsx         ← /admin/banners (stub — "Coming in Phase 3")
│   │   ├── ServicesPage.jsx        ← /admin/services (stub)
│   │   ├── ToolsPage.jsx           ← /admin/tools (stub)
│   │   ├── ClientsPage.jsx         ← /admin/clients (stub)
│   │   ├── PartnersPage.jsx        ← /admin/partners (stub)
│   │   ├── TeamPage.jsx            ← /admin/team (stub)
│   │   ├── ReviewsPage.jsx         ← /admin/reviews (stub)
│   │   ├── PortfolioPage.jsx       ← /admin/portfolio (stub)
│   │   ├── ProjectsPage.jsx        ← /admin/projects (stub)
│   │   └── SettingsPage.jsx        ← /admin/settings (stub)
│   ├── components/
│   │   ├── AdminLayout.jsx         ← sidebar + main content wrapper with outlet
│   │   ├── Sidebar.jsx             ← navigation links list; active link highlight
│   │   ├── TopBar.jsx              ← header bar with "Al-Hady Admin" + logout button
│   │   └── ProtectedRoute.jsx      ← reads token from localStorage; redirects to /admin/login if absent
│   ├── hooks/
│   │   └── useAuth.js              ← getToken(), setToken(), clearToken() over localStorage key
│   └── services/
│       └── api.js                  ← Axios instance (baseURL: http://localhost:5000); request interceptor injects Bearer token; response interceptor redirects on 401
└── main-component/
    └── router/
        └── index.js                ← ADD /admin/* routes without touching existing website routes
```

**Structure Decision**: Option 2 (web application). Backend in `backend/` (Phase 1, unchanged). Frontend in `src/` — admin subsection added as `src/admin/**`. Existing website routes are untouched; admin routes are appended to `router/index.js` inside the existing `<Switch>`.

## Complexity Tracking

*No constitution violations — table omitted.*

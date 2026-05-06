# Tasks: Admin Dashboard Shell

**Input**: Design documents from `specs/002-admin-dashboard-shell/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/api.md ✅, quickstart.md ✅

**Tests**: Not requested — manual browser testing only per plan.md.

**Organization**: Tasks grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Exact file paths included in all descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and configure TailwindCSS so admin components can use utility classes without affecting Bootstrap-powered website components.

- [ ] T001 Install TailwindCSS v3 dev dependencies from project root: `npm install -D tailwindcss postcss autoprefixer`
- [ ] T002 Run `npx tailwindcss init -p` from project root to generate `tailwind.config.js` and `postcss.config.js`
- [ ] T003 Configure `tailwind.config.js` — set `content: ['./src/admin/**/*.{js,jsx}']`, extend theme with `colors: { gold: { DEFAULT: '#D4AF37', dark: '#c59c17' } }` and `fontFamily: { heading: ['Teko','sans-serif'], body: ['Rubik','sans-serif'] }`
- [ ] T004 Create `src/admin/admin.css` with three Tailwind directives: `@tailwind base`, `@tailwind components`, `@tailwind utilities` — this file must be imported ONLY from `AdminLayout.jsx`, never from `src/index.js` or `src/App.js`
- [ ] T005 [P] Install runtime dependencies from project root: `npm install axios jwt-decode lucide-react`

**Checkpoint**: Tailwind is installed and scoped to admin. `npm start` still runs without errors.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core auth helpers, Axios service layer, and shadcn/ui base components that every user story depends on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T006 Create `src/admin/hooks/useAuth.js` — export three functions: `getToken()` returns `localStorage.getItem('alhady_admin_token')`, `setToken(token)` calls `localStorage.setItem('alhady_admin_token', token)`, `clearToken()` calls `localStorage.removeItem('alhady_admin_token')`
- [ ] T007 [P] Create `src/admin/services/api.js` — Axios instance with `baseURL: 'http://localhost:5000'`; request interceptor reads token via `localStorage.getItem('alhady_admin_token')` and sets `config.headers.Authorization = 'Bearer <token>'` if present; response interceptor catches errors where `err.response?.status === 401`, calls `localStorage.removeItem('alhady_admin_token')`, sets `window.location.href = '/admin/login'`, then rejects
- [ ] T008 [P] Add shadcn/ui Button component to `src/components/ui/button.jsx` — manually copy and strip TypeScript types; variants: default (gold bg), outline, ghost
- [ ] T009 [P] Add shadcn/ui Card components (Card, CardHeader, CardTitle, CardContent) to `src/components/ui/card.jsx` — manually copy and strip TypeScript types
- [ ] T010 [P] Add shadcn/ui Input component to `src/components/ui/input.jsx` — manually copy and strip TypeScript types
- [ ] T011 [P] Add shadcn/ui Label component to `src/components/ui/label.jsx` — manually copy and strip TypeScript types

**Checkpoint**: Foundation ready — `useAuth.js`, `api.js`, and all four shadcn/ui components exist. User story implementation can now begin.

---

## Phase 3: User Story 1 — Admin Login (Priority: P1) 🎯 MVP

**Goal**: Admin can navigate to `/admin/login`, enter credentials, receive a JWT, persist it, and be redirected to the dashboard. Invalid credentials show an inline error. Session survives page refresh.

**Independent Test**: Navigate to `http://localhost:3000/admin/login`. Enter `admin@alhady-eg.com` / `admin123`. Verify redirect to `/admin/dashboard`. Refresh — verify still logged in. Enter wrong credentials — verify inline error message appears.

### Implementation for User Story 1

- [ ] T012 [US1] Create `src/admin/pages/LoginPage.jsx` — controlled form with email and password inputs (shadcn/ui Input + Label); on submit POST to `/api/auth/login` via `api.js`; on success call `setToken(data.data.token)` then `history.push('/admin/dashboard')` via `useHistory`; on failure display `error.response.data.message` (or generic fallback) inline beneath the form; if `getToken()` returns a token on mount redirect immediately to `/admin/dashboard`; styled with black background, gold accent (`text-gold`, `border-gold`), Teko heading font, Rubik body font; uses shadcn/ui Button for submit

**Checkpoint**: User Story 1 login flow is functional. Token is stored in localStorage. Redirect to dashboard occurs on success (route must exist — complete US2 to test end-to-end).

---

## Phase 4: User Story 2 — Protected Navigation (Priority: P2)

**Goal**: A logged-in admin sees a sidebar with all 11 section links and can navigate between them. Any unauthenticated attempt to reach a `/admin/*` URL (except `/admin/login`) redirects to `/admin/login`.

**Independent Test**: Clear `localStorage` in DevTools. Navigate directly to `http://localhost:3000/admin/dashboard` — verify redirect to `/admin/login`. Log in — verify sidebar shows 11 links. Click each link — verify routing works. Click logout — verify return to `/admin/login` and subsequent `/admin/dashboard` access redirects again.

### Implementation for User Story 2

- [ ] T013 [US2] Create `src/admin/components/ProtectedRoute.jsx` — React Router v5 render-prop pattern: `<Route {...rest} render={props => getToken() ? <Component {...props} /> : <Redirect to="/admin/login" />} />`; imports `getToken` from `useAuth.js`
- [ ] T014 [US2] Create `src/admin/components/TopBar.jsx` — renders a header bar with "Al-Hady Admin" text (Teko font, gold color) and a logout Button; logout handler calls `clearToken()` then `history.push('/admin/login')` via `useHistory`; black background, gold text
- [ ] T015 [US2] Create `src/admin/components/Sidebar.jsx` — define static `navItems` array of 11 entries `{ label, path, icon }` using lucide-react icons (LayoutDashboard, Image, Briefcase, Wrench, Building, Handshake, Users, MessageSquare, FolderOpen, FolderKanban, Settings); render NavLink list comparing `useLocation().pathname` to each `path` for active class (`text-gold font-semibold` when active, `text-gray-400` otherwise); black background sidebar
- [ ] T016 [US2] Create `src/admin/components/AdminLayout.jsx` — first line imports `'../admin.css'`; renders full-height black flex container with `<Sidebar />` on the left and a main column containing `<TopBar />` above `{children}`; layout must not produce horizontal scroll at 768px+
- [ ] T017 [P] [US2] Create stub page `src/admin/pages/BannersPage.jsx` — renders AdminLayout-compatible content: heading "Banners" and paragraph "Content management coming in Phase 3"
- [ ] T018 [P] [US2] Create stub page `src/admin/pages/ServicesPage.jsx` — same stub pattern as BannersPage with heading "Services"
- [ ] T019 [P] [US2] Create stub page `src/admin/pages/ToolsPage.jsx` — same stub pattern with heading "Tools"
- [ ] T020 [P] [US2] Create stub page `src/admin/pages/ClientsPage.jsx` — same stub pattern with heading "Clients"
- [ ] T021 [P] [US2] Create stub page `src/admin/pages/PartnersPage.jsx` — same stub pattern with heading "Partners"
- [ ] T022 [P] [US2] Create stub page `src/admin/pages/TeamPage.jsx` — same stub pattern with heading "Team"
- [ ] T023 [P] [US2] Create stub page `src/admin/pages/ReviewsPage.jsx` — same stub pattern with heading "Reviews"
- [ ] T024 [P] [US2] Create stub page `src/admin/pages/PortfolioPage.jsx` — same stub pattern with heading "Portfolio"
- [ ] T025 [P] [US2] Create stub page `src/admin/pages/ProjectsPage.jsx` — same stub pattern with heading "Projects"
- [ ] T026 [P] [US2] Create stub page `src/admin/pages/SettingsPage.jsx` — same stub pattern with heading "Settings"
- [ ] T027 [US2] Update `src/main-component/router/index.js` — append inside the existing `<Switch>` (after all website routes): `<Route exact path="/admin/login" component={LoginPage} />`, `<Route exact path="/admin"><Redirect to="/admin/login" /></Route>`, and 11 `<ProtectedRoute>` entries wrapping `<AdminLayout>` around each page component for paths `/admin/dashboard`, `/admin/banners`, `/admin/services`, `/admin/tools`, `/admin/clients`, `/admin/partners`, `/admin/team`, `/admin/reviews`, `/admin/portfolio`, `/admin/projects`, `/admin/settings`; note: DashboardPage used here is the stub until T028 replaces it

**Checkpoint**: User Stories 1 and 2 are fully testable end-to-end. Login redirects to dashboard, sidebar navigation works, logout clears session, unauthenticated access redirects to login.

---

## Phase 5: User Story 3 — Dashboard Overview (Priority: P3)

**Goal**: After login the dashboard page shows live content count cards for all 9 content types, with a loading state and graceful `—` fallback for any failed request.

**Independent Test**: Ensure backend is running and seeded (`node backend/seed.js`). Log in and verify the dashboard shows non-zero counts for services, team, projects etc. Open DevTools Network tab — verify 9 parallel GET requests fire on mount. Stop the backend and reload — verify cards show `—` without crashing.

### Implementation for User Story 3

- [ ] T028 [US3] Create `src/admin/pages/DashboardPage.jsx` — `useState` for `{ banners, services, tools, clients, partners, team, reviews, portfolio, projects, loading }` initialised to `{ ...nullsForAll, loading: true }`; `useEffect` on mount fires `Promise.all` of 9 `api.get()` calls (`/api/banners`, `/api/services`, `/api/tools`, `/api/clients`, `/api/partners`, `/api/team`, `/api/reviews`, `/api/portfolio`, `/api/projects`) wrapped in individual try/catch so one failure sets that count to `null` without rejecting the whole `Promise.all`; count derived as `response.data.data.length`; while `loading` render a spinner; after load render 9 shadcn/ui Cards each showing label and count (`null` renders as `—`); black background, gold card accents

**Checkpoint**: All three user stories are complete. Dashboard shows live counts. All features are independently testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verify style isolation, responsive layout, and session expiry edge case.

- [ ] T029 Verify TailwindCSS style isolation — open a website page (e.g., `http://localhost:3000/`) in the browser, inspect elements in DevTools, confirm no Tailwind utility classes appear on website component markup (should only see Bootstrap class names like `container`, `row`, `col-*`); also confirm `admin.css` import is only in `src/admin/components/AdminLayout.jsx`
- [ ] T030 [P] Verify 768px+ responsive layout — open any admin page in browser DevTools at 768px viewport width; confirm sidebar and main content are visible side-by-side with no horizontal scroll and no overlapping elements
- [ ] T031 [P] Verify 401 session expiry handling — manually set an invalid token in `localStorage.setItem('alhady_admin_token', 'invalid')` via DevTools console, navigate to the dashboard, trigger any API request; confirm Axios interceptor clears the token and redirects to `/admin/login`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — can start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 completion — **BLOCKS all user stories**
- **Phase 3 (US1)**: Depends on Phase 2 (needs `useAuth.js`, `api.js`, shadcn/ui Input/Label/Button)
- **Phase 4 (US2)**: Depends on Phase 2 (needs `useAuth.js`); depends on Phase 3 (LoginPage must exist before router update T027)
- **Phase 5 (US3)**: Depends on Phase 2 (needs `api.js`, shadcn/ui Card) and Phase 4 (AdminLayout must exist; router must reference DashboardPage)
- **Phase 6 (Polish)**: Depends on all phases being complete

### User Story Dependencies

- **US1 (P1)**: Requires Foundational complete. LoginPage is independent but redirect target (`/admin/dashboard`) requires US2 router update for end-to-end test.
- **US2 (P2)**: Requires Foundational complete and US1's LoginPage exists (T027 imports it). Stub DashboardPage can be created in T027 as a temporary placeholder until T028 replaces it.
- **US3 (P3)**: Requires Foundational complete and US2 AdminLayout exists (DashboardPage renders inside it).

### Within Each User Story

- Components before layout wrappers (T013–T015 before T016)
- Stub pages (T017–T026) and ProtectedRoute (T013) before router update (T027)
- Foundational api.js (T007) before DashboardPage (T028)

### Parallel Opportunities

- **Phase 1**: T005 can run in parallel with T001–T004 once T001 starts
- **Phase 2**: T007–T011 can all run in parallel once T006 is done (T006 has no deps on T007–T011; all are different files)
- **Phase 4**: Stub pages T017–T026 can all run in parallel after T016 (AdminLayout exists for reference); T013–T015 can run in parallel with each other

---

## Parallel Example: Phase 2 (Foundational)

```
# Run these in parallel (different files, no cross-dependencies):
T007: src/admin/services/api.js
T008: src/components/ui/button.jsx
T009: src/components/ui/card.jsx
T010: src/components/ui/input.jsx
T011: src/components/ui/label.jsx
```

## Parallel Example: Phase 4 (US2 Stub Pages)

```
# After T016 (AdminLayout), run stub pages in parallel:
T017: src/admin/pages/BannersPage.jsx
T018: src/admin/pages/ServicesPage.jsx
T019: src/admin/pages/ToolsPage.jsx
T020: src/admin/pages/ClientsPage.jsx
T021: src/admin/pages/PartnersPage.jsx
T022: src/admin/pages/TeamPage.jsx
T023: src/admin/pages/ReviewsPage.jsx
T024: src/admin/pages/PortfolioPage.jsx
T025: src/admin/pages/ProjectsPage.jsx
T026: src/admin/pages/SettingsPage.jsx
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: US1 (LoginPage)
4. Complete Phase 4: US2 (ProtectedRoute, Layout, Stubs, Router)
5. **STOP and VALIDATE**: Login flow, route protection, sidebar navigation all work
6. Demo or deploy the shell — admin panel is usable without live counts

### Incremental Delivery

1. Setup + Foundational → infrastructure ready
2. Add US1 (Login) + US2 (Navigation Shell) → admin panel is accessible and navigable (MVP!)
3. Add US3 (Dashboard Overview) → live content counts visible
4. Polish phase → style isolation verified, responsive confirmed

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks in the same phase
- [Story] label maps each task to a specific user story for traceability
- No automated tests — manual browser testing per quickstart.md acceptance scenarios
- T003 (tailwind.config.js) is critical for style isolation; wrong `content` glob will bleed Tailwind into Bootstrap website components
- T027 (router update) must append routes AFTER existing website routes to avoid any route conflicts
- Commit after each checkpoint to isolate partial progress

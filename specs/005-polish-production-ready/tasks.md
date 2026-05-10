# Tasks: Polish & Production Readiness

**Input**: Design documents from `/specs/005-polish-production-ready/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Not requested — no test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no cross-task dependency)
- **[Story]**: Which user story this task belongs to (US1–US4)

---

## Phase 1: Setup (Configuration Prerequisites)

**Purpose**: One-line environment configuration fix that must be in place before Phase 2.

- [X] T001 Fix hardcoded `http://localhost:5000` in `src/admin/services/api.js` — replace with `process.env.REACT_APP_API_URL || 'http://localhost:5000'`

**Checkpoint**: Admin Axios instance is now environment-configurable.

---

## Phase 2: Foundational (Shared Infrastructure — Blocks US1)

**Purpose**: Shared components that ALL user-story phases depend on. Must be complete before Phase 3.

**⚠️ CRITICAL**: No US1 page work can begin until T002 and T003 are done.

- [X] T002 Extend `src/admin/hooks/useCRUD.js` to add `notification` state (`{ type, message }`), `showNotification(type, msg)` helper (calls `setTimeout` to clear after 4500ms), and `clearNotification` — call `showNotification` on success and error inside `handleSave` and `confirmDelete`; expose `notification` and `clearNotification` in the return value
- [X] T003 Update `src/admin/components/crud/FormDialog.jsx` to accept an `errors` prop (`{ [fieldName]: string }`) and render `<p className="text-red-400 text-xs mt-1">{errors[name]}</p>` beneath each named form field (consult `contracts/validation-errors.md` for the field-error shape)

**Checkpoint**: Foundation ready — all US1 page tasks can now start in parallel.

---

## Phase 3: User Story 1 — Clear Admin Action Feedback (Priority: P1) 🎯 MVP

**Goal**: Every admin save and delete action immediately shows a success or error notification; required fields are highlighted with a field-level message before any API call is made.

**Independent Test**:
1. Open any content page → save a valid item → verify green notification appears and auto-disappears within 5 seconds.
2. Force an error (disconnect backend) → attempt save → verify red error notification appears.
3. Submit a form with the required name/title field blank → verify the field is highlighted with a message and no API call is made.
4. Click Delete → confirm in dialog → verify green "Deleted" notification appears.

### Implementation

- [X] T004 [P] [US1] Add `notification` render (`<Notification>` from `src/admin/components/Notification.jsx`), `formErrors` state, and a `validate(formData)` function (validates `title` is non-empty) to `src/admin/pages/ServicesPage.jsx`; call `validate()` before `handleSave`; pass `formErrors` to `FormDialog errors` prop
- [ ] T005 [P] [US1] Add `notification` render, `formErrors` state, and `validate(formData)` (validates required `name` field) to `src/admin/pages/ClientsPage.jsx`; call `validate()` before `handleSave`; pass `formErrors` to `FormDialog errors` prop
- [ ] T006 [P] [US1] Add `notification` render, `formErrors` state, and `validate(formData)` (validates required `name` field) to `src/admin/pages/PartnersPage.jsx`; call `validate()` before `handleSave`; pass `formErrors` to `FormDialog errors` prop
- [ ] T007 [P] [US1] Add `notification` render, `formErrors` state, and `validate(formData)` (validates required `name` field) to `src/admin/pages/TeamPage.jsx`; call `validate()` before `handleSave`; pass `formErrors` to `FormDialog errors` prop
- [ ] T008 [P] [US1] Add `notification` render, `formErrors` state, and `validate(formData)` (validates required `text`/`author` fields) to `src/admin/pages/ReviewsPage.jsx`; call `validate()` before `handleSave`; pass `formErrors` to `FormDialog errors` prop
- [ ] T009 [P] [US1] Add `notification` render, `formErrors` state, and `validate(formData)` (validates required `title` field) to `src/admin/pages/PortfolioPage.jsx`; call `validate()` before `handleSave`; pass `formErrors` to `FormDialog errors` prop
- [ ] T010 [P] [US1] Add `notification` render, `formErrors` state, and `validate(formData)` (validates required `title` field) to `src/admin/pages/ProjectsPage.jsx`; for `src/admin/pages/ProjectFormPage.jsx` add the same notification render and inline field-level error display next to each required field
- [ ] T011 [P] [US1] Add `notification` render, `formErrors` state, and `validate(formData)` (validates required `title` field) to `src/admin/pages/BannersPage.jsx`; call `validate()` before `handleSave`; pass `formErrors` to `FormDialog errors` prop
- [ ] T012 [P] [US1] Add `notification` render and inline field-level validation (validates required settings fields) to `src/admin/pages/SettingsPage.jsx` — note: SettingsPage may not use `useCRUD`; wire notification state and validate manually if needed
- [ ] T013 [P] [US1] Migrate `src/admin/pages/ToolsPage.jsx` from its manual notification state to use the `notification` and `clearNotification` values from `useCRUD` (T002 adds these); add `validate(formData)` that validates required `title` field; pass `formErrors` to `FormDialog errors` prop
- [X] T014 [US1] Update `src/admin/hooks/useCRUD.js` `handleSave` to parse `422` server responses — extract field-level errors from `error.response.data.errors` using the `parseApiError` pattern in `contracts/validation-errors.md`; expose `serverErrors` alongside `notification` so pages can pass them to `FormDialog errors` prop (depends on T002)

**Checkpoint**: Every admin page now shows notifications on save/delete and blocks submission with field-level errors. US1 fully functional.

---

## Phase 4: User Story 2 — Image Preview Before Upload (Priority: P2)

**Goal**: Every admin form that includes an image upload field shows a preview of the selected file immediately after selection, before form submission.

**Independent Test**: Open any content form with an image field → select an image file → verify the thumbnail preview renders in the form immediately, without submitting.

**Note**: `src/admin/components/crud/ImageField.jsx` and its preview functionality already exist. These tasks verify/wire `ImageField` to pages that may not yet use it.

### Implementation

- [ ] T015 [P] [US2] Verify `src/admin/pages/TeamPage.jsx` uses `ImageField` for the member photo field; if it uses a plain `<input type="file">`, replace with `<ImageField>` component
- [ ] T016 [P] [US2] Verify `src/admin/pages/ClientsPage.jsx` uses `ImageField` for the logo field; replace plain file input with `<ImageField>` if needed
- [ ] T017 [P] [US2] Verify `src/admin/pages/PartnersPage.jsx` uses `ImageField` for the logo field; replace plain file input with `<ImageField>` if needed
- [ ] T018 [P] [US2] Verify `src/admin/pages/BannersPage.jsx` uses `ImageField` for the banner image field; replace plain file input with `<ImageField>` if needed
- [ ] T019 [P] [US2] Verify `src/admin/pages/PortfolioPage.jsx` uses `ImageField` for the project thumbnail field; replace plain file input with `<ImageField>` if needed
- [ ] T020 [P] [US2] Verify `src/admin/pages/ReviewsPage.jsx` uses `ImageField` for any reviewer avatar/image field; replace plain file input with `<ImageField>` if needed

**Checkpoint**: All admin image upload fields show a live preview. US2 fully functional.

---

## Phase 5: User Story 3 — Backend Security Hardening (Priority: P2)

**Goal**: Backend API returns consistent validation error shapes; all write routes enforce express-validator with adequate field coverage; MongoDB performance indexes are in place.

**Independent Test**:
1. `POST /api/services` with empty body → verify `422` response with `{ errors: [{ field: "title", message: "..." }] }` shape.
2. `POST /api/auth/login` 11 times rapidly → verify `429 Too Many Requests` after 10 attempts.
3. `POST /api/upload` with a `.pdf` file → verify `400` rejection.

### Implementation

- [ ] T021 [P] [US3] Audit `backend/routes/banners.js` and `backend/routes/clients.js`: confirm POST/PUT routes return `res.status(422).json({ errors: errors.array().map(e => ({ field: e.path, message: e.msg })) })` shape per `contracts/validation-errors.md`; fix any routes that use a different error format
- [ ] T022 [P] [US3] Audit `backend/routes/partners.js` and `backend/routes/reviews.js` for the same validation error response shape; fix inconsistencies
- [ ] T023 [P] [US3] Audit `backend/routes/team.js` and `backend/routes/portfolio.js` for validation error shape consistency; fix inconsistencies
- [ ] T024 [P] [US3] Audit `backend/routes/projects.js` and `backend/routes/settings.js` for validation error shape consistency; also verify `backend/routes/tools.js`; fix inconsistencies
- [ ] T025 [US3] Standardize `backend/routes/services.js` and `backend/routes/auth.js` to confirm they also emit the canonical `422` shape (these were already using express-validator but may predate the contract); update if format differs (depends on T021–T024 audit findings)

**Checkpoint**: All 11 write routes return the agreed validation error shape. US3 security requirements verified.

---

## Phase 6: User Story 4 — Production Deployment Ready (Priority: P3)

**Goal**: A developer with no prior project knowledge can deploy the full system in a clean environment in under 30 minutes by following documentation.

**Independent Test**: Follow `quickstart.md` from a clean terminal (only Node.js + MongoDB installed); verify backend starts at port 5000, frontend builds without errors, admin panel is accessible at `/admin`.

### Implementation

- [ ] T026 [P] [US4] Add `{ active: 1, order: 1 }` compound index and `{ createdAt: -1 }` index to `backend/models/Service.js`, `backend/models/Tool.js`, `backend/models/Client.js`, `backend/models/Partner.js` per `data-model.md`
- [ ] T027 [P] [US4] Add `{ active: 1, order: 1 }` compound index and `{ createdAt: -1 }` index to `backend/models/Team.js`, `backend/models/Review.js`, `backend/models/Portfolio.js`, `backend/models/Project.js` per `data-model.md`
- [ ] T028 [P] [US4] Add `{ active: 1, order: 1 }` and `{ createdAt: -1 }` indexes to `backend/models/Banner.js` and `backend/models/SiteSettings.js`; add explicit `{ email: 1 }` unique index to `backend/models/Admin.js` per `data-model.md`
- [ ] T029 [US4] Create `.env.example` at repo root documenting `REACT_APP_API_URL=http://localhost:5000` and `REACT_APP_PRIMARY_COLOR=#D4AF37` with inline description comments
- [ ] T030 [US4] Create `docs/deployment.md` at repo root by copying content from `specs/005-polish-production-ready/quickstart.md`; update `README.md` (if present) or repo root to reference `docs/deployment.md`

**Checkpoint**: Indexes in place, environment variables documented, deployment guide accessible at repo root. US4 complete.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup, smoke test, and readiness verification across all stories.

- [ ] T031 [P] Search codebase for any remaining hardcoded `localhost:5000` references outside `src/admin/services/api.js` and replace with `process.env.REACT_APP_API_URL` (run `grep -r "localhost:5000" src/`)
- [ ] T032 Smoke-test the admin panel: login → create one item per content type → edit it → delete it → confirm notification, validation, and image preview all work end-to-end across ServicesPage, ToolsPage, ClientsPage, PartnersPage, TeamPage, ReviewsPage, PortfolioPage, ProjectsPage, BannersPage, SettingsPage
- [ ] T033 Verify `backend/.env.example` contains all five required variables (PORT, MONGO_URI, JWT_SECRET, JWT_EXPIRES_IN, UPLOAD_DIR) and that each has a descriptive inline comment

**Checkpoint**: All user stories verified end-to-end. Feature 005 production-ready.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — blocks all US1 page tasks
- **Phase 3 (US1)**: All tasks depend on Phase 2 completion; T014 depends on T002
- **Phase 4 (US2)**: Independent of Phase 3 — can run in parallel with Phase 3 after Phase 2 is done
- **Phase 5 (US3)**: Independent of Phases 3 and 4 — T021–T024 can run after Phase 1; T025 depends on T021–T024
- **Phase 6 (US4)**: T026–T028 independent of all; T029–T030 independent of Phases 3–5
- **Phase 7 (Polish)**: Depends on all user story phases completing

### User Story Dependencies

- **US1 (P1)**: Requires Phase 2 complete — no dependency on US2/US3/US4
- **US2 (P2)**: No dependency on US1/US3/US4 — can start right after Phase 1
- **US3 (P2)**: No dependency on US1/US2 — backend-only work
- **US4 (P3)**: T026–T029 independent; T030 (docs) independent

### Within Each Phase

- Models before service layers (not applicable here — no new models)
- Foundational infrastructure (T002, T003) before per-page wiring (T004–T013)
- Per-page tasks (T004–T013, T015–T020) are fully parallelizable once foundational phase is done
- Audit tasks (T021–T024) must complete before T025 standardization pass

---

## Parallel Opportunities

### After Phase 2 completes — launch all of these together:

```
[US1 pages — fully parallel]
T004  ServicesPage notification + validation
T005  ClientsPage notification + validation
T006  PartnersPage notification + validation
T007  TeamPage notification + validation
T008  ReviewsPage notification + validation
T009  PortfolioPage notification + validation
T010  ProjectsPage notification + validation
T011  BannersPage notification + validation
T012  SettingsPage notification + validation
T013  ToolsPage notification migration + validation

[US2 pages — fully parallel, independent of US1 tasks]
T015  TeamPage ImageField verification
T016  ClientsPage ImageField verification
T017  PartnersPage ImageField verification
T018  BannersPage ImageField verification
T019  PortfolioPage ImageField verification
T020  ReviewsPage ImageField verification

[US3 backend audits — fully parallel, no frontend dependency]
T021  banners + clients routes
T022  partners + reviews routes
T023  team + portfolio routes
T024  projects + settings + tools routes

[US4 index additions — fully parallel, no other dependency]
T026  Service, Tool, Client, Partner indexes
T027  Team, Review, Portfolio, Project indexes
T028  Banner, SiteSettings, Admin indexes
T029  Create root .env.example
```

---

## Implementation Strategy

### MVP First (US1 Only — Phase 1 → Phase 2 → Phase 3)

1. Complete Phase 1: Fix admin API URL (T001) — 5 minutes
2. Complete Phase 2: Extend useCRUD + update FormDialog (T002–T003) — 1 hour
3. Complete Phase 3: Wire all 10 admin pages (T004–T014) — 2–3 hours (parallelizable)
4. **STOP and VALIDATE**: Test all notifications and form validation in the browser
5. US1 complete and independently demonstrable

### Incremental Delivery

1. Setup + Foundational → Admin infrastructure ready
2. US1 → Every admin page gives clear action feedback (MVP!)
3. US2 → Image previews confirmed across all pages
4. US3 → Backend security contract locked down
5. US4 → System deployable by a new developer
6. Polish → End-to-end smoke test + final cleanup

### Solo Developer Strategy

Suggested order for a single developer:
1. T001 → T002 → T003 (sequential — each builds on the last)
2. T004–T013 in any order (all independent once T002/T003 done)
3. T014 (parseApiError in useCRUD — after T002)
4. T021–T025 (backend audit pass)
5. T015–T020 (ImageField verification pass)
6. T026–T030 (indexes + docs)
7. T031–T033 (final polish)

---

## Notes

- **[P]** tasks modify different files and have no dependency on other in-progress tasks
- **[Story]** labels map directly to user stories in `specs/005-polish-production-ready/spec.md`
- ToolsPage (T013) already has manual notification state — T002 adds it to the hook, then T013 migrates ToolsPage to use the hook version to remove duplication
- SettingsPage (T012) may not use `useCRUD` — read the file first; if it manages its own API calls, add local notification state instead of relying on hook
- All MongoDB index additions (T026–T028) are additive — safe to apply to a running database
- Commit after each phase checkpoint for clean rollback points

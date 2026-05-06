# Tasks: Backend Foundation & Content API

**Feature**: `001-backend-foundation`
**Input**: `specs/001-backend-foundation/` (plan.md, spec.md, data-model.md, research.md, quickstart.md)
**Generated**: 2026-05-06

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.
**Tests**: Not requested — test tasks omitted.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no blocking dependencies)
- **[Story]**: Which user story this task belongs to (US1–US4)
- Exact file paths are included in every task description

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the `backend/` Node.js project with all dependencies and base configuration files

- [X] T001 Initialize `backend/package.json` with `npm init -y` and add scripts: `"start": "node server.js"` and `"dev": "nodemon server.js"`
- [X] T002 Install npm dependencies in `backend/`: `express mongoose jsonwebtoken bcrypt multer cors dotenv helmet express-rate-limit express-validator` and devDependency `nodemon`
- [X] T003 [P] Create `backend/.env.example` with variables: `PORT=5000`, `MONGO_URI=mongodb://localhost:27017/alhady`, `JWT_SECRET=change_me_before_production`, `JWT_EXPIRES_IN=7d`, `UPLOAD_DIR=uploads`
- [X] T004 [P] Create `backend/.gitignore` excluding `.env`, `uploads/`, and `node_modules/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core Express server skeleton that MUST be complete before any user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Create `backend/server.js` with: `dotenv.config()`, Express app, `cors()`, `helmet()`, `express.json()`, `express.static(process.env.UPLOAD_DIR)` at `/uploads`, stub `app.use()` comments for each API route group (filled in per story), catch-all 404 handler returning `{ success: false, message: 'Not found' }`, global error handler returning `{ success: false, message: err.message }`, `mongoose.connect(process.env.MONGO_URI)` awaited before `app.listen(process.env.PORT)` — call `process.exit(1)` on connection failure

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 — Secure Admin Authentication (Priority: P1) 🎯 MVP

**Goal**: JWT-based authentication endpoint — admin logs in and receives a signed token; protected routes reject unauthorized requests

**Independent Test**: `POST /api/auth/login` with `{ email, password }` returns `{ success: true, data: { token } }` for valid credentials and 401 for invalid; `GET /api/auth/me` with `Authorization: Bearer <token>` returns admin profile; same request without token returns 401

### Implementation for User Story 1

- [X] T006 [P] [US1] Create `backend/models/Admin.js` Mongoose schema: `email` (String, required, unique, lowercase, trim), `passwordHash` (String, required), `createdAt` (Date, default: Date.now) — never return `passwordHash` in responses
- [X] T007 [P] [US1] Create `backend/middleware/auth.js`: extract `Authorization: Bearer <token>` header, call `jwt.verify(token, process.env.JWT_SECRET)`, attach decoded payload to `req.admin` on success, return `{ success: false, message: 'Unauthorized' }` with HTTP 401 on any failure (missing header, expired token, invalid signature)
- [X] T008 [US1] Create `backend/routes/auth.js` with two handlers: `POST /login` — find Admin by email, `bcrypt.compare()` password, on match call `jwt.sign({ id, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })` and return `{ success: true, data: { token } }`; `GET /me` — apply auth middleware, return admin via `.select('-passwordHash')` using `req.admin.id`
- [X] T009 [US1] Register auth route in `backend/server.js`: import `express-rate-limit` and create limiter (windowMs: 15 min, max: 10 per IP), apply limiter to `POST /api/auth/login` only, then `app.use('/api/auth', authRouter)`

**Checkpoint**: User Story 1 is fully functional — authentication and token validation work independently

---

## Phase 4: User Story 2 — Image & File Upload (Priority: P2)

**Goal**: Authenticated admins upload images up to 5MB; system validates MIME type, stores with timestamp-prefixed filename, returns stable public URL

**Independent Test**: `POST /api/upload` with valid Bearer token and `multipart/form-data` image field returns `{ success: true, data: { url: '/uploads/<filename>' } }`; same without token returns 401; non-image file returns 400; file exceeding 5MB returns 400

### Implementation for User Story 2

- [X] T010 [P] [US2] Create `backend/routes/upload.js`: multer `diskStorage` with `destination: process.env.UPLOAD_DIR`, `filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '-'))`, `fileFilter` rejecting non-`image/jpeg|image/png|image/gif|image/webp` MIME types with error "Only image files are allowed", `limits.fileSize: 5 * 1024 * 1024`; `POST /` handler: apply auth middleware, multer `.single('image')`, return `{ success: true, data: { url: '/uploads/' + req.file.filename } }`
- [X] T011 [US2] Register upload route in `backend/server.js`: `app.use('/api/upload', uploadRouter)`

**Checkpoint**: User Story 2 is fully functional — image upload with MIME validation and size limit works independently

---

## Phase 5: User Story 3 — Content Data Retrieval (Priority: P3)

**Goal**: All 11 content types are publicly readable; seeded data is available after running `node seed.js`

**Independent Test**: Run `node seed.js` (from `backend/`), then `curl http://localhost:5000/api/services` returns seeded services array; all 10 GET endpoints return `{ success: true, data: [...] }`; empty collections return empty array not an error

### Content Models (all parallelizable — separate files)

- [X] T012 [P] [US3] Create `backend/models/Banner.js`: `page` (String, required, unique, enum: `['home','about','service','project','portfolio','team','contact','faq']`), `title` (String, required), `subtitle` (String, default: ''), `backgroundImage` (String, default: ''), `updatedAt` (Date, default: Date.now)
- [X] T013 [P] [US3] Create `backend/models/Service.js`: `title` (String, required), `description/sliderImage/cardImage/icon/link` (String, default: ''), `order` (Number, default: 0), `active` (Boolean, default: true), `createdAt` (Date, default: Date.now)
- [X] T014 [P] [US3] Create `backend/models/Tool.js`: `title` (String, required), `icon` (String, default: ''), `order` (Number, default: 0), `active` (Boolean, default: true), `createdAt` (Date, default: Date.now)
- [X] T015 [P] [US3] Create `backend/models/Client.js`: `title` (String, required), `icon` (String, default: ''), `order` (Number, default: 0), `active` (Boolean, default: true), `createdAt` (Date, default: Date.now)
- [X] T016 [P] [US3] Create `backend/models/Partner.js`: `title` (String, required), `icon` (String, default: ''), `order` (Number, default: 0), `active` (Boolean, default: true), `createdAt` (Date, default: Date.now)
- [X] T017 [P] [US3] Create `backend/models/Team.js`: `name` (String, required), `position` (String, default: ''), `profileImage` (String, default: ''), `order` (Number, default: 0), `active` (Boolean, default: true), `createdAt` (Date, default: Date.now)
- [X] T018 [P] [US3] Create `backend/models/Review.js`: `name` (String, required), `jobTitle` (String, default: ''), `description` (String, default: ''), `image` (String, default: ''), `active` (Boolean, default: true), `createdAt` (Date, default: Date.now)
- [X] T019 [P] [US3] Create `backend/models/Portfolio.js`: `title` (String, required), `serviceCategory` (String, default: ''), `cardImage` (String, default: ''), `order` (Number, default: 0), `active` (Boolean, default: true), `createdAt` (Date, default: Date.now)
- [X] T020 [P] [US3] Create `backend/models/Project.js`: `title` (String, required), `serviceCategory/homeCardImage/projectImage/header/description` (String), nested `projectDetails` subdocument (projectType/client/year/location/projectSize/projectTime/peopleWorked/projectCost/statisticsIcon as String fields), `projectSamples` array `[{ image, title, description }]`, `order` (Number, default: 0), `active` (Boolean, default: true), `createdAt` (Date, default: Date.now)
- [X] T021 [P] [US3] Create `backend/models/SiteSettings.js`: `companyName/phone/email/address/aboutDescription/heroTitle/heroSubtitle` (String, default: ''), `yearsExperience/projectsCompleted/teamSize` (Number, default: 0), `updatedAt` (Date, default: Date.now)

### Seed Setup

- [X] T022 [US3] Create `backend/data/seed-data.js` as CommonJS module (`module.exports = { banners, services, tools, clients, partners, team, reviews, portfolio, projects, settings }`) with all static content manually extracted from `src/Dashboard/dashboard.js` — this becomes the canonical seed source
- [X] T023 [US3] Create `backend/seed.js`: `mongoose.connect()` → seed Admin with `findOneAndUpdate({ email }, { email, passwordHash: await bcrypt.hash('admin123', 10) }, { upsert: true })` → seed Banner by `page`, Service/Tool/Client/Partner/Portfolio/Project by `title`, Team by `name`, Review by `{ name, jobTitle }` composite — all via `findOneAndUpdate(filter, data, { upsert: true, new: true })` → SiteSettings via `updateOne({}, data, { upsert: true })` → log count per type → disconnect (requires T006 Admin model and T012–T021 content models)

### Read-only Route Handlers (all parallelizable — separate files)

- [X] T024 [P] [US3] Create `backend/routes/banners.js` with `GET /` (return all banners: `find({})`) and `GET /:page` (find by page enum, return 404 `{ success: false, message: 'Banner not found' }` if missing)
- [X] T025 [P] [US3] Create `backend/routes/services.js` with `GET /` returning `find({ active: true }).sort({ order: 1 })`
- [X] T026 [P] [US3] Create `backend/routes/tools.js` with `GET /` returning `find({ active: true }).sort({ order: 1 })`
- [X] T027 [P] [US3] Create `backend/routes/clients.js` with `GET /` returning `find({ active: true }).sort({ order: 1 })`
- [X] T028 [P] [US3] Create `backend/routes/partners.js` with `GET /` returning `find({ active: true }).sort({ order: 1 })`
- [X] T029 [P] [US3] Create `backend/routes/team.js` with `GET /` returning `find({ active: true }).sort({ order: 1 })`
- [X] T030 [P] [US3] Create `backend/routes/reviews.js` with `GET /` returning `find({ active: true })`
- [X] T031 [P] [US3] Create `backend/routes/portfolio.js` with `GET /` returning `find({ active: true }).sort({ order: 1 })`
- [X] T032 [P] [US3] Create `backend/routes/projects.js` with `GET /` (list: `find({ active: true }).sort({ order: 1 })`) and `GET /:id` (single full document via `findById`, 404 if not found)
- [X] T033 [P] [US3] Create `backend/routes/settings.js` with `GET /` returning `findOne()` (singleton — no active filter; return empty object `{}` wrapped in `{ success: true, data: {} }` if no document exists yet)
- [X] T034 [US3] Register all 10 content routes in `backend/server.js`: `app.use('/api/banners', bannersRouter)`, `app.use('/api/services', servicesRouter)`, `app.use('/api/tools', toolsRouter)`, `app.use('/api/clients', clientsRouter)`, `app.use('/api/partners', partnersRouter)`, `app.use('/api/team', teamRouter)`, `app.use('/api/reviews', reviewsRouter)`, `app.use('/api/portfolio', portfolioRouter)`, `app.use('/api/projects', projectsRouter)`, `app.use('/api/settings', settingsRouter)`

**Checkpoint**: User Story 3 is fully functional — all 11 content types readable; `node seed.js` populates data; GET endpoints return structured responses

---

## Phase 6: User Story 4 — Content Data Management (Priority: P4)

**Goal**: Authenticated admins can create, update, and delete all content types; reorder supported for services, team, portfolio

**Independent Test**: With valid Bearer token: `POST /api/services` creates and persists a record; `PUT /api/services/:id` updates it; `DELETE /api/services/:id` removes it; `PATCH /api/services/reorder` with `{ items: [{ id, order }] }` reorders items; same requests without token return 401

### Write Endpoints per Content Route (all parallelizable — separate files, depends on T007 auth middleware)

- [X] T035 [P] [US4] Add to `backend/routes/banners.js`: `PUT /:page` (auth middleware, `findOneAndUpdate({ page }, req.body, { upsert: true, new: true, runValidators: true })`, return updated doc)
- [X] T036 [P] [US4] Add to `backend/routes/services.js`: `POST /` (auth, `create(req.body)`), `PUT /:id` (auth, `findByIdAndUpdate(id, req.body, { new: true })`), `DELETE /:id` (auth, `findByIdAndDelete`), `PATCH /reorder` (auth, `Promise.all(req.body.items.map(({ id, order }) => findByIdAndUpdate(id, { order })))`)
- [X] T037 [P] [US4] Add to `backend/routes/tools.js`: `POST /` (auth, create), `PUT /:id` (auth, findByIdAndUpdate), `DELETE /:id` (auth, findByIdAndDelete)
- [X] T038 [P] [US4] Add to `backend/routes/clients.js`: `POST /` (auth, create), `PUT /:id` (auth, findByIdAndUpdate), `DELETE /:id` (auth, findByIdAndDelete)
- [X] T039 [P] [US4] Add to `backend/routes/partners.js`: `POST /` (auth, create), `PUT /:id` (auth, findByIdAndUpdate), `DELETE /:id` (auth, findByIdAndDelete)
- [X] T040 [P] [US4] Add to `backend/routes/team.js`: `POST /` (auth, create), `PUT /:id` (auth, findByIdAndUpdate), `DELETE /:id` (auth, findByIdAndDelete), `PATCH /reorder` (auth, `Promise.all(items.map(({ id, order }) => findByIdAndUpdate(id, { order })))`)
- [X] T041 [P] [US4] Add to `backend/routes/reviews.js`: `POST /` (auth, create), `PUT /:id` (auth, findByIdAndUpdate), `DELETE /:id` (auth, findByIdAndDelete)
- [X] T042 [P] [US4] Add to `backend/routes/portfolio.js`: `POST /` (auth, create), `PUT /:id` (auth, findByIdAndUpdate), `DELETE /:id` (auth, findByIdAndDelete), `PATCH /reorder` (auth, `Promise.all(items.map(({ id, order }) => findByIdAndUpdate(id, { order })))`)
- [X] T043 [P] [US4] Add to `backend/routes/projects.js`: `POST /` (auth, create), `PUT /:id` (auth, `findByIdAndUpdate(id, req.body, { new: true, runValidators: true })`), `DELETE /:id` (auth, findByIdAndDelete)
- [X] T044 [P] [US4] Add to `backend/routes/settings.js`: `PUT /` (auth, `updateOne({}, req.body, { upsert: true, runValidators: true })`, return updated singleton via `findOne()`)
- [X] T045 [US4] Add `express-validator` input validation to all write route handlers across `backend/routes/*.js`: `title`/`name` required on `POST`, `Banner.page` must be a valid enum value, password min 6 chars in `auth.js`; return HTTP 422 with `{ success: false, message: errors.array()[0].msg }` if validation fails

**Checkpoint**: User Story 4 is fully functional — complete CRUD plus reorder management for all content types

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency checks, static-file setup, and end-to-end quickstart validation

- [X] T046 [P] Create `backend/uploads/.gitkeep` placeholder; update `backend/.gitignore` to exclude `uploads/*` while tracking `uploads/.gitkeep` so the directory exists in the repo
- [X] T047 [P] Audit all `backend/routes/*.js` handlers and confirm every response uses `{ success: true, data: ... }` or `{ success: false, message: "..." }` envelope — patch any deviations found
- [X] T048 Verify `backend/package.json` scripts and `backend/.env.example` variable names exactly match the commands in `specs/001-backend-foundation/quickstart.md`
- [X] T049 Run quickstart.md validation end-to-end: `npm install` → `node server.js` (confirm startup log) → `node seed.js` (confirm idempotent, run twice) → `curl GET /api/services` → `curl POST /api/auth/login` → `curl POST /api/upload` with a test image

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Requires Phase 1 complete — **BLOCKS all user stories**
- **US1 (Phase 3)**: Requires Phase 2 — no dependencies on other stories
- **US2 (Phase 4)**: Requires Phase 2 AND T007 (auth middleware from US1)
- **US3 (Phase 5)**: Requires Phase 2 — T022/T023 (seed) additionally require T006 (Admin model from US1)
- **US4 (Phase 6)**: Requires T012–T021 (content models from US3) AND T007 (auth middleware from US1)
- **Polish (Phase 7)**: Requires all user stories complete

### User Story Dependencies

- **US1 (P1)**: Independent after Foundational
- **US2 (P2)**: Independent after Foundational; imports `auth` middleware from T007 (US1)
- **US3 (P3)**: Independent after Foundational for GET routes; `seed.js` (T023) depends on Admin model (T006, US1)
- **US4 (P4)**: Depends on US3 content models (T012–T021) for route expansion and T007 (US1) for auth middleware

### Within Each User Story

- Models before route handlers
- Auth middleware (T007) before any protected route handler
- Seed data file (T022) before seed script (T023)
- Route handlers before route registration in `server.js`

### Parallel Opportunities

- **Phase 1**: T003 and T004 can run in parallel
- **Phase 3**: T006 and T007 can run in parallel (different files, no interdependency)
- **Phase 5 models**: T012–T021 all run in parallel (10 separate files)
- **Phase 5 routes**: T024–T033 all run in parallel after models complete (10 separate files)
- **Phase 6**: T035–T044 all run in parallel (10 separate files)
- **Phase 7**: T046 and T047 can run in parallel

---

## Parallel Examples

### User Story 1 (Phase 3)

```bash
# Run Admin model and auth middleware creation together:
Task T006: Create backend/models/Admin.js
Task T007: Create backend/middleware/auth.js
```

### User Story 3 (Phase 5) — Maximum Parallelism

```bash
# Run all 10 model creation tasks together:
Task T012: Create backend/models/Banner.js
Task T013: Create backend/models/Service.js
Task T014: Create backend/models/Tool.js
Task T015: Create backend/models/Client.js
Task T016: Create backend/models/Partner.js
Task T017: Create backend/models/Team.js
Task T018: Create backend/models/Review.js
Task T019: Create backend/models/Portfolio.js
Task T020: Create backend/models/Project.js
Task T021: Create backend/models/SiteSettings.js

# After models complete, run all 10 read-route creation tasks together:
Task T024: Create backend/routes/banners.js
Task T025: Create backend/routes/services.js
Task T026: Create backend/routes/tools.js
Task T027: Create backend/routes/clients.js
Task T028: Create backend/routes/partners.js
Task T029: Create backend/routes/team.js
Task T030: Create backend/routes/reviews.js
Task T031: Create backend/routes/portfolio.js
Task T032: Create backend/routes/projects.js
Task T033: Create backend/routes/settings.js
```

### User Story 4 (Phase 6) — Maximum Parallelism

```bash
# Run all 10 write-handler additions together:
Task T035: Add write endpoints to backend/routes/banners.js
Task T036: Add write endpoints to backend/routes/services.js
Task T037: Add write endpoints to backend/routes/tools.js
Task T038: Add write endpoints to backend/routes/clients.js
Task T039: Add write endpoints to backend/routes/partners.js
Task T040: Add write endpoints to backend/routes/team.js
Task T041: Add write endpoints to backend/routes/reviews.js
Task T042: Add write endpoints to backend/routes/portfolio.js
Task T043: Add write endpoints to backend/routes/projects.js
Task T044: Add write endpoints to backend/routes/settings.js
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (Auth)
4. **STOP and VALIDATE**: `POST /api/auth/login` works; protected routes reject unauthenticated requests
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Running Express server connected to MongoDB
2. Add US1 → Secure JWT auth gateway (validate → demo)
3. Add US2 → Image upload capability (validate → demo)
4. Add US3 → Full content read API with seeded data (validate → demo)
5. Add US4 → Complete admin CRUD management (validate → final demo)

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 (Auth)
   - Developer B: US3 models (T012–T021) — can start immediately after Foundational
3. After T007 (auth middleware) done: Developer B adds US2 upload route (T010–T011)
4. After US3 models done: Developer A or B adds US4 write endpoints (T035–T044) in parallel
5. Polish phase completes together

---

## Notes

- [P] tasks use different files with no blocking dependencies — safe to run concurrently
- [Story] label maps each task to its user story for traceability
- No tests requested — test tasks omitted per spec
- `active: true` filter applied on all public GET reads except Banner (no active field) and SiteSettings (singleton)
- Reorder (`PATCH /reorder`) implemented for services, team, and portfolio only — per FR-011
- Response envelope is uniform: `{ success: true, data: ... }` or `{ success: false, message: "..." }`
- `passwordHash` must NEVER appear in API responses — always use `.select('-passwordHash')`
- SiteSettings has no `:id` route — singleton pattern using `updateOne({}, data, { upsert: true })`
- Seed script uses `findOneAndUpdate` with natural keys (upsert: true) — safe to re-run

# Al-Hady Engineering — Admin Dashboard & CMS Plan

## Project Overview

**Al-Hady Engineering & Consultation** is a React 17 + Bootstrap 5 static website for a BIM engineering firm in Cairo, Egypt. All content is hardcoded in `src/Dashboard/dashboard.js`. The goal is to replace that static data with a full CMS backed by Express + MongoDB, managed through a new admin dashboard built with React + TailwindCSS + shadcn/ui.

---

## Architecture

```
/                          ← existing React frontend (website)
/admin                     ← new React admin dashboard (same CRA app, separate routes)
/backend                   ← new Express + MongoDB server (separate folder)
```

### Tech Stack

| Layer | Technology |
|---|---|
| Website frontend | React 17, Bootstrap 5, existing stack (unchanged) |
| Admin dashboard | React, TailwindCSS, shadcn/ui, React Router v5 |
| Backend API | Node.js, Express.js, MongoDB, Mongoose |
| Auth | JWT (jsonwebtoken) + bcrypt |
| File uploads | Multer (disk storage, served as /uploads/static) |
| HTTP client | Axios (frontend → backend) |

---

## Data Models (MongoDB)

### 1. Admin User
```
email, passwordHash, createdAt
```

### 2. Banner
```
page (enum: home|about|service|project|portfolio|team|contact|faq),
title, subtitle, backgroundImage, updatedAt
```

### 3. Service
```
title, description, sliderImage, cardImage, icon, link, order, active
```

### 4. Tool
```
title, icon, order, active
```

### 5. Client
```
title, icon, order, active
```

### 6. Partner
```
title, icon, order, active
```

### 7. Team Member
```
name, position, profileImage, order, active
```

### 8. Review (Testimonial)
```
name, jobTitle, description, image, active
```

### 9. Portfolio Item
```
title, serviceCategory, cardImage, order, active
```

### 10. Project
```
title, serviceCategory, homeCardImage, projectImage,
projectDetails: { projectType, client, year, location, projectSize, projectTime, peopleWorked, projectCost, statisticsIcon },
header, description,
projectSamples: [{ image, title, description }],
order, active
```

### 11. SiteSettings (single document)
```
companyName, phone, email, address,
yearsExperience, projectsCompleted, teamSize,
aboutDescription, heroTitle, heroSubtitle
```

---

## REST API Endpoints

```
POST   /api/auth/login
POST   /api/auth/logout

GET    /api/banners
PUT    /api/banners/:page        (admin)

GET    /api/services
POST   /api/services             (admin)
PUT    /api/services/:id         (admin)
DELETE /api/services/:id         (admin)
PATCH  /api/services/reorder     (admin)

GET    /api/tools
POST   /api/tools                (admin)
PUT    /api/tools/:id            (admin)
DELETE /api/tools/:id            (admin)

GET    /api/clients
POST   /api/clients              (admin)
PUT    /api/clients/:id          (admin)
DELETE /api/clients/:id          (admin)

GET    /api/partners
POST   /api/partners             (admin)
PUT    /api/partners/:id         (admin)
DELETE /api/partners/:id         (admin)

GET    /api/team
POST   /api/team                 (admin)
PUT    /api/team/:id             (admin)
DELETE /api/team/:id             (admin)
PATCH  /api/team/reorder         (admin)

GET    /api/reviews
POST   /api/reviews              (admin)
PUT    /api/reviews/:id          (admin)
DELETE /api/reviews/:id          (admin)

GET    /api/portfolio
POST   /api/portfolio            (admin)
PUT    /api/portfolio/:id        (admin)
DELETE /api/portfolio/:id        (admin)
PATCH  /api/portfolio/reorder    (admin)

GET    /api/projects
GET    /api/projects/:id
POST   /api/projects             (admin)
PUT    /api/projects/:id         (admin)
DELETE /api/projects/:id         (admin)

GET    /api/settings
PUT    /api/settings             (admin)

POST   /api/upload               (admin, returns file URL)
```

---

## Admin Dashboard Pages

```
/admin/login
/admin                          → redirect to /admin/dashboard
/admin/dashboard                → overview stats
/admin/banners                  → manage per-page banners
/admin/services                 → list, add, edit, delete, reorder
/admin/tools                    → list, add, edit, delete
/admin/clients                  → list, add, edit, delete
/admin/partners                 → list, add, edit, delete
/admin/team                     → list, add, edit, delete, reorder
/admin/reviews                  → list, add, edit, delete
/admin/portfolio                → list, add, edit, delete, reorder
/admin/projects                 → list, add, edit, delete
/admin/projects/new
/admin/projects/:id/edit
/admin/settings                 → site-wide settings
```

---

## Implementation Phases

---

### Phase 1 — Backend Foundation
**Goal:** Working Express + MongoDB API with auth and file upload.

**Tasks:**
1. Create `backend/` folder with `package.json` (express, mongoose, jsonwebtoken, bcrypt, multer, cors, dotenv)
2. `backend/server.js` — Express app, CORS, JSON middleware, routes mount, error handler
3. `backend/.env` — MONGO_URI, JWT_SECRET, PORT, UPLOAD_DIR
4. `backend/models/` — all 11 Mongoose models (see Data Models above)
5. `backend/middleware/auth.js` — JWT verify middleware
6. `backend/routes/auth.js` — login endpoint, returns JWT
7. `backend/routes/upload.js` — Multer file upload, returns `/uploads/<filename>` URL
8. `backend/routes/` — one route file per resource (banners, services, tools, clients, partners, team, reviews, portfolio, projects, settings)
9. `backend/seed.js` — seed script that reads current `src/Dashboard/dashboard.js` data and inserts into MongoDB
10. `backend/uploads/` — folder for uploaded images (gitignored)
11. Serve `/uploads` as static files from Express

**Deliverables:** `npm start` in `/backend` runs server on port 5000, `node seed.js` populates DB.

---

### Phase 2 — Admin Dashboard UI Shell
**Goal:** Admin routing, auth flow, layout, and navigation working.

**Tasks:**
1. Install TailwindCSS v3 into existing CRA project (postcss config, tailwind.config.js)
2. Install shadcn/ui (via CLI), configure `components.json`, add base components: Button, Input, Card, Table, Dialog, Form, Toast, Badge, Avatar, Separator, Sheet, DropdownMenu
3. Create `src/admin/` folder structure:
   ```
   src/admin/
     context/AuthContext.js       ← JWT storage + axios default header
     hooks/useApi.js              ← generic fetch hook
     components/
       Layout.jsx                 ← sidebar + header wrapper
       Sidebar.jsx                ← nav links (shadcn)
       ProtectedRoute.jsx         ← redirects to login if no token
       ImageUploader.jsx          ← reusable upload widget
       DataTable.jsx              ← reusable table with actions
       ConfirmDialog.jsx          ← delete confirmation
     pages/
       LoginPage.jsx
       DashboardPage.jsx
       BannersPage.jsx
       ServicesPage.jsx
       ToolsPage.jsx
       ClientsPage.jsx
       PartnersPage.jsx
       TeamPage.jsx
       ReviewsPage.jsx
       PortfolioPage.jsx
       ProjectsPage.jsx
       ProjectFormPage.jsx
       SettingsPage.jsx
   ```
4. Add admin routes to `src/main-component/router/index.js` under `/admin/*`
5. `LoginPage.jsx` — email/password form, calls `POST /api/auth/login`, stores JWT in localStorage
6. `Layout.jsx` — black + gold sidebar matching site theme, responsive collapse
7. `ProtectedRoute.jsx` — wraps all `/admin/*` routes except `/admin/login`

**Deliverables:** Can navigate to `/admin/login`, log in, see sidebar layout.

---

### Phase 3 — CRUD Pages (Content Management)
**Goal:** All content types manageable from dashboard.

**Tasks (one per content type):**

#### 3a. Banners
- Page selector (tabs: Home, About, Services, Projects, Portfolio, Team, Contact, FAQ)
- Form: title, subtitle, backgroundImage (ImageUploader)
- Preview of current banner
- Save button calls `PUT /api/banners/:page`

#### 3b. Services
- DataTable: title, icon thumbnail, order, active toggle, Edit/Delete actions
- Add/Edit form: title, description, sliderImage, cardImage, icon (all ImageUploader), link, order
- Drag-to-reorder (or manual order field)

#### 3c. Tools
- DataTable: title, icon thumbnail, active toggle
- Add/Edit form: title, icon upload

#### 3d. Clients
- Same pattern as Tools

#### 3e. Partners
- Same pattern as Tools

#### 3f. Team
- DataTable: photo thumbnail, name, position, order, active toggle
- Add/Edit form: name, position, profileImage upload, order

#### 3g. Reviews
- DataTable: photo, name, jobTitle, excerpt, active toggle
- Add/Edit form: name, jobTitle, description, image upload

#### 3h. Portfolio
- DataTable: image thumbnail, title, category, order
- Add/Edit form: title, serviceCategory, cardImage upload, order

#### 3i. Projects
- DataTable: title, category, active
- Add form (multi-section): basic info, project details object, project samples (add/remove rows)
- Edit form: same as add, pre-filled
- Image upload for homeCardImage, projectImage, statisticsIcon, and per-sample images

#### 3j. Settings
- Single form: company name, phone, email, address, years experience, projects completed, team size, hero title, hero subtitle, about description

**Deliverables:** Full CRUD operational for all 10 content types.

---

### Phase 4 — Connect Website to Backend API
**Goal:** Replace all static `dashboard.js` imports with live API data.

**Tasks:**
1. Create `src/utils/api.js` — Axios instance pointing to `http://localhost:5000/api` (dev) or env var
2. Create React hooks: `useServices()`, `useTeam()`, `useProjects()`, `usePortfolio()`, `useReviews()`, `useTools()`, `useClients()`, `usePartners()`, `useBanner(page)`, `useSettings()`
3. Update components one by one:
   - `src/components/hero/index.js` → `useBanner('home')`
   - `src/components/ServiceSection` → `useServices()`
   - `src/components/ServiceList` → `useServices()`
   - `src/components/partners/index.js` → `useTools()`, `useClients()`, `usePartners()`
   - `src/components/ProjectSection` → `useProjects()`
   - `src/components/ProjectList` → `useProjects()`
   - `src/components/ProjectSingle` → `useProjects()` filtered by id
   - `src/components/team/index.js` → `useTeam()`
   - `src/components/TeamList/index.js` → `useTeam()`
   - `src/components/testimonial/index.js` → `useReviews()`
   - `src/components/portfolio/index.js` → `usePortfolio()`
   - Page title components → `useBanner(page)`
4. Add loading skeleton states (shadcn Skeleton component or CSS)
5. Add error boundaries

**Deliverables:** Website reads all content from MongoDB. Static `dashboard.js` becomes unused.

---

### Phase 5 — Polish & Production Readiness
**Goal:** Secure, deployable, production-ready system.

**Tasks:**
1. Admin dashboard:
   - Toast notifications on save/delete success/error
   - Form validation (react-hook-form + zod schemas)
   - Image preview before upload
   - Confirm dialogs before delete
   - Loading/saving states on all buttons
2. Backend security:
   - Helmet.js headers
   - Rate limiting (express-rate-limit) on auth routes
   - Input sanitization (express-validator)
   - File type validation on uploads (images only)
   - Max file size limit (5MB)
3. Environment config:
   - `REACT_APP_API_URL` env var for API base URL
   - Backend `.env.example` file
4. Database:
   - MongoDB indexes on frequently queried fields
   - Connection retry logic
5. Deployment docs: how to run backend + frontend together

**Deliverables:** Production-ready, secured, documented system.

---

## Folder Structure After Completion

```
d:\khaled\Alhady\
├── backend/
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Banner.js
│   │   ├── Service.js
│   │   ├── Tool.js
│   │   ├── Client.js
│   │   ├── Partner.js
│   │   ├── Team.js
│   │   ├── Review.js
│   │   ├── Portfolio.js
│   │   ├── Project.js
│   │   └── SiteSettings.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── banners.js
│   │   ├── services.js
│   │   ├── tools.js
│   │   ├── clients.js
│   │   ├── partners.js
│   │   ├── team.js
│   │   ├── reviews.js
│   │   ├── portfolio.js
│   │   ├── projects.js
│   │   ├── settings.js
│   │   └── upload.js
│   ├── middleware/
│   │   └── auth.js
│   ├── uploads/          (gitignored)
│   ├── seed.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
├── src/
│   ├── admin/
│   │   ├── context/AuthContext.js
│   │   ├── hooks/useApi.js
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ImageUploader.jsx
│   │   │   ├── DataTable.jsx
│   │   │   └── ConfirmDialog.jsx
│   │   └── pages/
│   │       ├── LoginPage.jsx
│   │       ├── DashboardPage.jsx
│   │       ├── BannersPage.jsx
│   │       ├── ServicesPage.jsx
│   │       ├── ToolsPage.jsx
│   │       ├── ClientsPage.jsx
│   │       ├── PartnersPage.jsx
│   │       ├── TeamPage.jsx
│   │       ├── ReviewsPage.jsx
│   │       ├── PortfolioPage.jsx
│   │       ├── ProjectsPage.jsx
│   │       ├── ProjectFormPage.jsx
│   │       └── SettingsPage.jsx
│   ├── utils/
│   │   └── api.js         (new — Axios instance)
│   ├── hooks/             (new — useServices, useTeam, etc.)
│   ├── Dashboard/
│   │   └── dashboard.js   (kept for reference / seed data)
│   └── ... (existing components, updated to use API)
│
├── tailwind.config.js     (new)
├── components.json        (new — shadcn config)
└── plan.md
```

---

## Running the Project

```bash
# Terminal 1 — Backend
cd backend
npm install
cp .env.example .env   # fill MONGO_URI and JWT_SECRET
node seed.js           # seed initial data
npm start              # runs on :5000

# Terminal 2 — Frontend
npm install
npm start              # runs on :3000

# Admin panel
open http://localhost:3000/admin/login
```

---

## Phase Execution Order

| Phase | Effort | Depends On |
|---|---|---|
| Phase 1 — Backend | Medium | Nothing |
| Phase 2 — Dashboard Shell | Medium | Phase 1 |
| Phase 3 — CRUD Pages | Large | Phase 2 |
| Phase 4 — Connect Website | Medium | Phase 3 |
| Phase 5 — Polish | Small | Phase 4 |

---

## Notes

- The existing Bootstrap-based website components are **not refactored** — only their data source changes (Phase 4).
- TailwindCSS is added **only for the `/admin/*` routes** to avoid conflicts with Bootstrap on the main site. Use `content: ['./src/admin/**/*.{js,jsx}']` in tailwind config.
- shadcn/ui components are installed in `src/components/ui/` as per shadcn convention.
- Images uploaded via admin are stored in `backend/uploads/` and served at `http://localhost:5000/uploads/<filename>`.
- JWT token stored in `localStorage` under key `alhady_admin_token`.
- Admin credentials seeded by `seed.js`: email `admin@alhady-eg.com`, password `admin123` (must be changed in production).

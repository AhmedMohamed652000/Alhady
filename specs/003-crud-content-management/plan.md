# Implementation Plan: CRUD Content Management Pages

**Branch**: `003-crud-content-management` | **Date**: 2026-05-06 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `/specs/003-crud-content-management/spec.md`

## Summary

Implement all 9 admin CRUD pages for the 10 Al-Hady content types (Banners, Services, Tools, Clients, Partners, Team, Reviews, Portfolio, Projects, Settings). The backend (models, routes, auth middleware, file upload) is fully implemented from Phase 1. This phase is entirely frontend work: replace placeholder page components with working list/form/delete UIs inside `src/admin/pages/`, backed by a set of 4 shared CRUD components in `src/admin/components/crud/`.

---

## Technical Context

**Language/Version**: JavaScript (React 17, Node.js 18+) — no TypeScript  
**Primary Dependencies**: React 17, TailwindCSS v3, shadcn/ui, Axios (`src/admin/services/api.js`); backend (Express, Mongoose, Multer, JWT) already complete  
**Storage**: MongoDB via Mongoose — all 11 schemas fully implemented in `backend/models/`  
**Testing**: Manual acceptance testing per user story scenarios; no automated test framework configured  
**Target Platform**: Web browsers (Chrome/Edge/Firefox), admin routes under `/admin/*` at port 3000  
**Project Type**: Web application — full-stack CMS (Phase 3 = admin frontend only)  
**Performance Goals**: CRUD ops < 3 min/op (SC-001), image upload + preview < 15s for files < 5 MB (SC-003), reorder save reflected < 5s (SC-004)  
**Constraints**: 5 MB image limit; MIME validation enforced server-side; JWT required on all writes; TailwindCSS scoped to `src/admin/**` only  
**Scale/Scope**: 10 content types → 9 list pages + 1 singleton form; 4 new shared components

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Design Check ✅ PASS

| Principle | Check | Status |
|-----------|-------|--------|
| **I — Static-to-Dynamic Migration Integrity** | Phase 3 touches only `src/admin/**`. Zero changes to website components. | ✅ PASS |
| **II — Strict Style Isolation** | All new JSX in `src/admin/pages/` and `src/admin/components/crud/` — TailwindCSS only; no Bootstrap. | ✅ PASS |
| **III — API-First Content Architecture** | Admin pages consume `/api/*` REST endpoints. No content hardcoded in components. Public website unchanged (Phase 4). | ✅ PASS |
| **IV — Security-by-Default** | All admin routes wrapped by existing `ProtectedRoute`. `src/admin/services/api.js` auto-attaches Bearer token. File uploads via `/api/upload` (server-enforced MIME + 5 MB). | ✅ PASS |
| **V — Phased Delivery Order** | Phase 1 ✅ complete. Phase 2 ✅ complete. Now Phase 3. | ✅ PASS |

### Post-Design Re-Check ✅ PASS

All new source code contained within `src/admin/**`. No principles violated.

---

## Project Structure

### Documentation (this feature)

```text
specs/003-crud-content-management/
├── plan.md              ← this file
├── research.md          ← Phase 0 decisions (complete)
├── data-model.md        ← all entity schemas (complete)
├── quickstart.md        ← dev setup + testing guide (complete)
├── contracts/
│   ├── api-endpoints.md ← REST endpoint contracts (complete)
│   └── shared-components.md ← shared component prop contracts (complete)
└── tasks.md             ← Phase 2 output (run /speckit-tasks next)
```

### Source Code (repository root)

```text
src/admin/
├── components/
│   ├── AdminLayout.jsx           (existing — unchanged)
│   ├── ProtectedRoute.jsx        (existing — unchanged)
│   ├── Sidebar.jsx               (existing — unchanged)
│   ├── TopBar.jsx                (existing — unchanged)
│   └── crud/                     (NEW — 4 shared components)
│       ├── DataTable.jsx
│       ├── FormDialog.jsx
│       ├── DeleteConfirm.jsx
│       └── ImageField.jsx
├── hooks/
│   └── useAuth.js                (existing — unchanged)
├── pages/
│   ├── DashboardPage.jsx         (existing — unchanged)
│   ├── LoginPage.jsx             (existing — unchanged)
│   ├── BannersPage.jsx           (REPLACE placeholder)
│   ├── ClientsPage.jsx           (REPLACE placeholder)
│   ├── PartnersPage.jsx          (REPLACE placeholder)
│   ├── PortfolioPage.jsx         (REPLACE placeholder)
│   ├── ProjectsPage.jsx          (REPLACE placeholder)
│   ├── ReviewsPage.jsx           (REPLACE placeholder)
│   ├── ServicesPage.jsx          (REPLACE placeholder)
│   ├── SettingsPage.jsx          (REPLACE placeholder)
│   └── TeamPage.jsx              (REPLACE placeholder)
└── services/
    └── api.js                    (existing — unchanged)

backend/                          (fully implemented — DO NOT MODIFY in Phase 3)
├── models/                       (11 schemas: Admin, Banner, Service, Tool, Client,
│                                   Partner, Team, Review, Portfolio, Project, SiteSettings)
├── routes/                       (12 route files; all CRUD + reorder endpoints active)
├── middleware/auth.js
└── server.js
```

**Structure Decision**: Web application pattern. Backend complete; all Phase 3 changes in `src/admin/**` only. The `crud/` directory is new; all 9 page files replace placeholder implementations in-place.

---

## Implementation Phases

### Phase A — Shared CRUD Components
New directory: `src/admin/components/crud/`

| Step | File | What to build |
|------|------|--------------|
| A1 | `DataTable.jsx` | Table with heading, "Add New" button, configurable columns, Edit/Delete per row, loading skeleton |
| A2 | `FormDialog.jsx` | shadcn/ui `Dialog` wrapper with title, children slot, Submit/Cancel, submitting spinner |
| A3 | `DeleteConfirm.jsx` | shadcn/ui `AlertDialog` — item name in message, Confirm/Cancel |
| A4 | `ImageField.jsx` | File input → `POST /api/upload` → preview; `onChange(url)` on success; handles existing URL on mount |

---

### Phase B — Pattern A Pages (Simple list, icon field, no reorder)
Pages: ToolsPage, ClientsPage, PartnersPage

Each page:
1. `GET /api/{type}` on mount → `DataTable` with columns: icon preview, title, order, active
2. Add/Edit → `FormDialog` with: title (required text), icon (`ImageField`), order (number), active (checkbox)
3. Delete → `DeleteConfirm` → `DELETE /api/{type}/:id`
4. Success/error inline notification (4s auto-dismiss)

| Step | File | Base API |
|------|------|---------|
| B1 | `ToolsPage.jsx` | `/api/tools` |
| B2 | `ClientsPage.jsx` | `/api/clients` |
| B3 | `PartnersPage.jsx` | `/api/partners` |

---

### Phase C — Pattern B Pages (List + image upload + optional reorder)

| Step | File | Base API | Extra fields | Reorder |
|------|------|---------|-------------|---------|
| C1 | `ReviewsPage.jsx` | `/api/reviews` | name (req), jobTitle, description (req), image (ImageField) | No |
| C2 | `PortfolioPage.jsx` | `/api/portfolio` | title (req), serviceCategory, cardImage (ImageField), order | `PATCH /api/portfolio/reorder` |
| C3 | `TeamPage.jsx` | `/api/team` | name (req), position, profileImage (ImageField), order | `PATCH /api/team/reorder` |

Reorder UX: `order` field in edit form + "Save Order" button that sends `PATCH /api/{type}/reorder` with `{ items: [{ id, order }] }`.

---

### Phase D — Pattern C Page (Rich form + 3 images + reorder)

| Step | File | Base API | Fields |
|------|------|---------|-------|
| D1 | `ServicesPage.jsx` | `/api/services` | title (req), description (textarea), sliderImage, cardImage, icon (3 × ImageField), link (text), order, active; `PATCH /api/services/reorder` |

---

### Phase E — Special Pages

#### E1 — BannersPage (`/admin/banners`)
- 8 tab buttons: `home | about | service | project | portfolio | team | contact | faq`
- Active tab → `GET /api/banners/:page` → pre-fill `title`, `subtitle`, `backgroundImage`
- Save → `PUT /api/banners/:page` (upsert — no list, no delete)
- `ImageField` for `backgroundImage`

#### E2 — SettingsPage (`/admin/settings`)
- No list — singleton document
- `GET /api/settings` on mount → pre-fill 10 fields
- Fields: companyName, phone, email, address, yearsExperience (number), projectsCompleted (number), teamSize (number), aboutDescription (textarea), heroTitle, heroSubtitle
- Save → `PUT /api/settings`

#### E3 — ProjectsPage (`/admin/projects`)
- `DataTable` with columns: homeCardImage (preview), title, serviceCategory, active
- Add/Edit form in 3 labelled sections:
  - **Basic**: title (req), serviceCategory, homeCardImage (ImageField), projectImage (ImageField), header, description (textarea)
  - **Project Details**: projectType, client, year, location, projectSize, projectTime, peopleWorked, projectCost, statisticsIcon (ImageField) — all text except icon
  - **Sample Images**: dynamic rows — each has image (ImageField), title (text), description (text); "+ Add Sample" button; × remove per row
- Delete → `DeleteConfirm` → `DELETE /api/projects/:id`

---

## Shared Page Pattern

```js
// State
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [formOpen, setFormOpen] = useState(false);
const [editItem, setEditItem] = useState(null);  // null = add mode
const [deleteTarget, setDeleteTarget] = useState(null);
const [submitting, setSubmitting] = useState(false);
const [notification, setNotification] = useState(null);  // { type, message } | null

// Load
const reload = () => api.get('/api/{type}').then(r => setData(r.data));
useEffect(() => { reload().finally(() => setLoading(false)); }, []);

// Notify
const notify = (type, message) => {
  setNotification({ type, message });
  setTimeout(() => setNotification(null), 4000);
};

// Submit
const handleSubmit = async () => {
  setSubmitting(true);
  try {
    if (editItem) await api.put(`/api/{type}/${editItem._id}`, form);
    else await api.post('/api/{type}', form);
    await reload();
    setFormOpen(false);
    notify('success', 'Saved successfully.');
  } catch { notify('error', 'Save failed. Please try again.'); }
  finally { setSubmitting(false); }
};

// Delete
const handleDelete = async () => {
  await api.delete(`/api/{type}/${deleteTarget._id}`);
  setDeleteTarget(null);
  await reload();
  notify('success', 'Deleted.');
};
```

---

## Design Tokens (admin UI)

| Token | Tailwind class |
|-------|---------------|
| Gold text | `text-gold` |
| Gold border | `border-gold/30` |
| Background | `bg-black` / `bg-zinc-900` |
| Section heading | `text-3xl font-heading text-gold uppercase tracking-widest` |
| Body text | `font-body` |

---

## Complexity Tracking

> No constitution violations — table not required.

---

## Artifact Status

| Artifact | Status |
|----------|--------|
| `research.md` | ✅ Complete |
| `data-model.md` | ✅ Complete |
| `quickstart.md` | ✅ Complete |
| `contracts/api-endpoints.md` | ✅ Complete |
| `contracts/shared-components.md` | ✅ Complete |
| `tasks.md` | ⏳ Next — run `/speckit-tasks` |

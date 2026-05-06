# Tasks: CRUD Content Management Pages

**Input**: Design documents from `/specs/003-crud-content-management/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/api-endpoints.md ✅, contracts/shared-components.md ✅

**Tests**: Manual acceptance testing only — no automated test framework configured per plan.md

**Organization**: Tasks grouped by user story. Shared components (Phase 2) are the critical foundation — no page can be implemented until all four components are complete.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1–US8)
- Exact file paths included in all task descriptions

---

## Phase 1: Setup (Verify Prerequisites)

**Purpose**: Confirm project is ready before implementing CRUD pages

- [x] T001 Verify backend is running at port 5000 (`cd backend && npm start`), confirm `GET http://localhost:5000/api/settings` returns JSON, and verify all 9 placeholder pages exist in `src/admin/pages/` (BannersPage.jsx, ClientsPage.jsx, PartnersPage.jsx, PortfolioPage.jsx, ProjectsPage.jsx, ReviewsPage.jsx, ServicesPage.jsx, SettingsPage.jsx, TeamPage.jsx)

---

## Phase 2: Foundational — Shared CRUD Components

**Purpose**: Four shared components used by every CRUD page. ALL must be complete before any user story page can be implemented.

**⚠️ CRITICAL**: No user story work can begin until T002–T005 are all complete

- [x] T002 [P] Create `src/admin/components/crud/DataTable.jsx` — accepts props: `title` (string, renders as `text-3xl font-heading text-gold uppercase tracking-widest` heading), `columns` (array of `{ key, label, render? }` where `render(value, row)` returns ReactNode), `data` (object[]), `onAdd` (() => void), `onEdit` ((item) => void), `onDelete` ((item) => void), `loading` (boolean — renders 3 skeleton rows when true), `addLabel` (string, default "Add New"); renders a `bg-zinc-900 border border-gold/30 rounded-lg` table with configured columns and Edit (gold outline button) / Delete (red outline button) action buttons on each row; when `loading` is true render 3 rows of animated `bg-zinc-800 rounded h-4` skeleton placeholders
- [x] T003 [P] Create `src/admin/components/crud/FormDialog.jsx` — wraps shadcn/ui `Dialog` imported from `src/components/ui/dialog`; accepts props: `open` (boolean), `onClose` (() => void), `title` (string), `onSubmit` (() => void), `submitting` (boolean — disables Submit button and shows a spinner icon when true), `children` (ReactNode), `submitLabel` (string, default "Save"); renders `DialogHeader` with title, a scrollable `DialogContent` children area, and `DialogFooter` with Submit and Cancel buttons; Cancel calls `onClose`
- [x] T004 [P] Create `src/admin/components/crud/DeleteConfirm.jsx` — wraps shadcn/ui `AlertDialog` imported from `src/components/ui/alert-dialog`; accepts props: `open` (boolean), `onClose` (() => void), `onConfirm` (() => void), `itemName` (string, optional); message body reads "Are you sure you want to delete {itemName}? This action cannot be undone." (fallback "this item" when `itemName` is undefined); renders Confirm button (destructive/red style) and Cancel button; Cancel calls `onClose`, Confirm calls `onConfirm`
- [x] T005 [P] Create `src/admin/components/crud/ImageField.jsx` — accepts props: `value` (string — current `/uploads/<file>` URL or empty string), `onChange` ((url: string) => void), `label` (string, default "Image"); on mount if `value` is non-empty show existing image as preview using `<img src={\`http://localhost:5000\${value}\`} className="h-24 w-24 object-cover rounded border border-gold/30" />`; on file input change POST to `/api/upload` using the Axios instance from `src/admin/services/api.js` as `multipart/form-data` with field name `"image"`, show uploading indicator; on success call `onChange(res.data.url)` and update preview; on failure show inline red error message without calling `onChange`; render a "Clear" button that calls `onChange('')` and removes preview

**Checkpoint**: All 4 shared components ready — user story page implementation can begin

---

## Phase 3: User Story 1 — Manage Simple Content Items (Priority: P1) 🎯 MVP

**Goal**: Replace placeholder pages for Tools, Clients, and Partners with working CRUD UIs using the 4 shared components. Each page: list loads on mount, add/edit via FormDialog, delete via DeleteConfirm, inline notifications.

**Independent Test**: Navigate to `/admin/tools`, add a new tool with a title and icon image, verify it appears in the table, click Edit and change the title, verify the updated title, then Delete it and confirm it is removed from the list.

- [x] T006 [P] [US1] Implement `src/admin/pages/ToolsPage.jsx` — replace placeholder with: state variables `data`, `loading`, `formOpen`, `editItem` (null = add mode), `deleteTarget`, `submitting`, `notification` ({ type, message } | null); `useEffect` calls `api.get('/api/tools')` on mount setting `data`; `reload` helper re-fetches and updates `data`; `notify(type, message)` sets notification and auto-dismisses after 4000ms; render inline notification banner at top (`bg-green-900/40 text-green-300` for success, `bg-red-900/40 text-red-300` for error); `DataTable` with title "Tools", columns `[{ key: 'icon', label: 'Icon', render: v => v ? <img src={\`http://localhost:5000\${v}\`} className="h-8 w-8 object-contain" /> : '—' }, { key: 'title', label: 'Title' }, { key: 'order', label: 'Order' }, { key: 'active', label: 'Active', render: v => v ? 'Yes' : 'No' }]`; Add button sets `editItem = null, formOpen = true`; Edit sets `editItem = item, formOpen = true`; Delete sets `deleteTarget = item`; `FormDialog` title "Add Tool"/"Edit Tool", form fields: `title` (required text, validates non-empty before submit), `icon` (ImageField label "Icon"), `order` (number input default 0), `active` (checkbox default true); `handleSubmit` calls `api.post('/api/tools', form)` (add) or `api.put(\`/api/tools/\${editItem._id}\`, form)` (edit), then `reload()`, `setFormOpen(false)`, `notify('success', ...)`; `handleDelete` calls `api.delete(\`/api/tools/\${deleteTarget._id}\`)`, then `reload()`, `setDeleteTarget(null)`, `notify('success', ...)`; `DeleteConfirm` with `itemName={deleteTarget?.title}`
- [x] T007 [P] [US1] Implement `src/admin/pages/ClientsPage.jsx` — identical pattern to T006 (ToolsPage) but using `/api/clients` as the base endpoint; DataTable title "Clients"; columns: icon (img preview), title, order, active; FormDialog title "Add Client"/"Edit Client"; form fields: title (required), icon (ImageField label "Logo"), order, active; required field `title`; full CRUD with inline notifications same as T006
- [x] T008 [P] [US1] Implement `src/admin/pages/PartnersPage.jsx` — identical pattern to T006 (ToolsPage) but using `/api/partners` as the base endpoint; DataTable title "Partners"; columns: icon (img preview), title, order, active; FormDialog title "Add Partner"/"Edit Partner"; form fields: title (required), icon (ImageField label "Logo"), order, active; full CRUD with inline notifications same as T006

**Checkpoint**: Tools, Clients, Partners pages are fully functional — US1 independently testable

---

## Phase 4: User Story 2 — Manage Page Banners (Priority: P2)

**Goal**: Replace BannersPage placeholder with an 8-tab upsert interface — no list table, no delete; each tab loads and saves the banner for one website page.

**Independent Test**: Navigate to `/admin/banners`, select the "Home" tab, change the title field, click Save, then call `GET http://localhost:5000/api/banners/home` and confirm the updated title is returned.

- [x] T009 [US2] Implement `src/admin/pages/BannersPage.jsx` — replace placeholder with: `PAGE_SLUGS` constant array `['home', 'about', 'service', 'project', 'portfolio', 'team', 'contact', 'faq']`; state: `selectedPage` (default `'home'`), `form` ({ title: '', subtitle: '', backgroundImage: '' }), `loading`, `submitting`, `notification`; `loadBanner(page)` calls `api.get(\`/api/banners/\${page}\`)` and sets `form` from response data (handle empty `{}` response by resetting form to empty strings); call `loadBanner(selectedPage)` on mount; 8 tab buttons rendered horizontally — clicking a tab sets `selectedPage` and calls `loadBanner(newPage)`; active tab styled with gold border/text; form section (no DataTable): `title` text input, `subtitle` text input, `backgroundImage` ImageField (label "Background Image"); Save button calls `api.put(\`/api/banners/\${selectedPage}\`, form)`, then `notify('success', 'Banner saved.')` or `notify('error', ...)`; inline notification banner (4s auto-dismiss); no delete button anywhere

**Checkpoint**: Banners page functional — admin can update any of the 8 page banners

---

## Phase 5: User Story 3 — Manage Services (Priority: P2)

**Goal**: Replace ServicesPage placeholder with a CRUD list + rich form including 3 separate ImageField components and a "Save Order" button for reordering.

**Independent Test**: Navigate to `/admin/services`, add a service with title, description, all three images, a link, and order=1; verify it appears; edit the order field to 2 and click "Save Order"; reload page and confirm the new order is reflected.

- [x] T010 [US3] Implement `src/admin/pages/ServicesPage.jsx` — replace placeholder with: standard state pattern (data, loading, formOpen, editItem, deleteTarget, submitting, notification); `DataTable` title "Services", columns: `[{ key: 'icon', label: 'Icon', render: v => img preview }, { key: 'title', label: 'Title' }, { key: 'order', label: 'Order' }, { key: 'active', label: 'Active', render: v => v ? 'Yes' : 'No' }]`; Add/Edit/Delete via standard pattern; `FormDialog` title "Add Service"/"Edit Service", form fields: `title` (required text), `description` (textarea), `sliderImage` (ImageField label "Slider Image"), `cardImage` (ImageField label "Card Image"), `icon` (ImageField label "Icon"), `link` (text input), `order` (number), `active` (checkbox); submit calls `api.post('/api/services', form)` or `api.put(\`/api/services/\${editItem._id}\`, form)`; DeleteConfirm calls `api.delete(\`/api/services/\${deleteTarget._id}\`)`; "Save Order" button rendered below DataTable calls `api.patch('/api/services/reorder', { items: data.map(item => ({ id: item._id, order: item.order })) })` then `notify('success', 'Order saved.')`; inline notification banner (4s auto-dismiss)

**Checkpoint**: Services page functional with image uploads and reorder — US3 independently testable

---

## Phase 6: User Story 4 — Manage Team Members (Priority: P3)

**Goal**: Replace TeamPage placeholder with a CRUD list + form with profile image upload and numeric reorder save.

**Independent Test**: Navigate to `/admin/team`, add a team member with name, position, and profile photo; verify entry appears; edit the order field and click "Save Order"; confirm new display order persists on reload.

- [x] T011 [US4] Implement `src/admin/pages/TeamPage.jsx` — replace placeholder with: standard state pattern; `DataTable` title "Team", columns: `[{ key: 'profileImage', label: 'Photo', render: v => v ? <img src={\`http://localhost:5000\${v}\`} className="h-8 w-8 object-cover rounded-full" /> : '—' }, { key: 'name', label: 'Name' }, { key: 'position', label: 'Position' }, { key: 'order', label: 'Order' }, { key: 'active', label: 'Active', render: v => v ? 'Yes' : 'No' }]`; `FormDialog` title "Add Team Member"/"Edit Team Member", form fields: `name` (required text), `position` (text), `profileImage` (ImageField label "Profile Photo"), `order` (number), `active` (checkbox); submit calls `api.post('/api/team', form)` or `api.put(\`/api/team/\${editItem._id}\`, form)`; DeleteConfirm calls `api.delete(\`/api/team/\${deleteTarget._id}\`)`; "Save Order" button calls `api.patch('/api/team/reorder', { items: data.map(item => ({ id: item._id, order: item.order })) })`; inline notification banner (4s auto-dismiss)

**Checkpoint**: Team page functional with reorder — US4 independently testable

---

## Phase 7: User Story 5 — Manage Reviews (Priority: P3)

**Goal**: Replace ReviewsPage placeholder with a CRUD list + form for client testimonials with optional author photo. No reorder endpoint for this entity.

**Independent Test**: Navigate to `/admin/reviews`, add a review with name, jobTitle, description, and author photo; verify it appears in the list; click Edit, update the description, save; confirm the updated text appears in the list.

- [x] T012 [US5] Implement `src/admin/pages/ReviewsPage.jsx` — replace placeholder with: standard state pattern; `DataTable` title "Reviews", columns: `[{ key: 'image', label: 'Photo', render: v => v ? <img src={\`http://localhost:5000\${v}\`} className="h-8 w-8 object-cover rounded-full" /> : '—' }, { key: 'name', label: 'Author' }, { key: 'jobTitle', label: 'Job Title' }, { key: 'active', label: 'Active', render: v => v ? 'Yes' : 'No' }]`; `FormDialog` title "Add Review"/"Edit Review", form fields: `name` (required text), `jobTitle` (text), `description` (required textarea), `image` (ImageField label "Author Photo"), `active` (checkbox); submit calls `api.post('/api/reviews', form)` or `api.put(\`/api/reviews/\${editItem._id}\`, form)`; DeleteConfirm calls `api.delete(\`/api/reviews/\${deleteTarget._id}\`)`; no "Save Order" button (Reviews has no reorder endpoint); inline notification banner (4s auto-dismiss)

**Checkpoint**: Reviews page functional — US5 independently testable

---

## Phase 8: User Story 6 — Manage Portfolio Items (Priority: P3)

**Goal**: Replace PortfolioPage placeholder with a CRUD list + form with card image upload and numeric reorder save.

**Independent Test**: Navigate to `/admin/portfolio`, add a portfolio item with title, serviceCategory, and card image; verify it appears; edit the order field and click "Save Order"; confirm new display order persists on reload.

- [x] T013 [US6] Implement `src/admin/pages/PortfolioPage.jsx` — replace placeholder with: standard state pattern; `DataTable` title "Portfolio", columns: `[{ key: 'cardImage', label: 'Image', render: v => v ? <img src={\`http://localhost:5000\${v}\`} className="h-8 w-8 object-cover rounded" /> : '—' }, { key: 'title', label: 'Title' }, { key: 'serviceCategory', label: 'Category' }, { key: 'order', label: 'Order' }, { key: 'active', label: 'Active', render: v => v ? 'Yes' : 'No' }]`; `FormDialog` title "Add Portfolio Item"/"Edit Portfolio Item", form fields: `title` (required text), `serviceCategory` (text), `cardImage` (ImageField label "Card Image"), `order` (number), `active` (checkbox); submit calls `api.post('/api/portfolio', form)` or `api.put(\`/api/portfolio/\${editItem._id}\`, form)`; DeleteConfirm calls `api.delete(\`/api/portfolio/\${deleteTarget._id}\`)`; "Save Order" button calls `api.patch('/api/portfolio/reorder', { items: data.map(item => ({ id: item._id, order: item.order })) })`; inline notification banner (4s auto-dismiss)

**Checkpoint**: Portfolio page functional with reorder — US6 independently testable

---

## Phase 9: User Story 7 — Manage Projects (Priority: P3)

**Goal**: Replace ProjectsPage placeholder with a CRUD list + complex three-section form with nested statistics object and a dynamic variable-length sample image gallery.

**Independent Test**: Navigate to `/admin/projects`, create a project filling all three form sections with at least two sample images; verify all data saves; edit the project and add a third sample image; confirm the gallery updates correctly on save.

- [x] T014 [US7] Implement `src/admin/pages/ProjectsPage.jsx` list scaffold and CRUD orchestration — replace placeholder with: state variables `data`, `loading`, `formOpen`, `editItem`, `deleteTarget`, `submitting`, `notification`; initial `form` shape: `{ title: '', serviceCategory: '', homeCardImage: '', projectImage: '', header: '', description: '', projectDetails: { projectType: '', client: '', year: '', location: '', projectSize: '', projectTime: '', peopleWorked: '', projectCost: '', statisticsIcon: '' }, projectSamples: [] }`; `useEffect` calls `api.get('/api/projects')` on mount; on Edit click call `api.get(\`/api/projects/\${item._id}\`)` to load full document including nested fields, then set `editItem` and `form` from response data, then `setFormOpen(true)`; `DataTable` title "Projects", columns: `[{ key: 'homeCardImage', label: 'Image', render: v => img preview }, { key: 'title', label: 'Title' }, { key: 'serviceCategory', label: 'Category' }, { key: 'active', label: 'Active', render: v => v ? 'Yes' : 'No' }]`; `handleSubmit` validates `form.title` non-empty then calls `api.post('/api/projects', form)` or `api.put(\`/api/projects/\${editItem._id}\`, form)` with the complete nested form object; `handleDelete` calls `api.delete(\`/api/projects/\${deleteTarget._id}\`)`; `DeleteConfirm` with `itemName={deleteTarget?.title}`; inline notification banner (4s auto-dismiss); `FormDialog` title "Add Project"/"Edit Project" wraps Phases T015–T017 form sections
- [x] T015 [US7] Add Basic Information section to ProjectsPage FormDialog in `src/admin/pages/ProjectsPage.jsx` — inside `FormDialog` children, render section with `<h3 className="text-sm font-heading text-gold uppercase tracking-widest mb-3">Basic Information</h3>` containing: `title` required text input (show red error text "Title is required" and block submit if empty), `serviceCategory` text input, `homeCardImage` ImageField (label "Home Card Image"), `projectImage` ImageField (label "Project Image"), `header` text input, `description` textarea (4 rows); all fields update via `setForm(f => ({ ...f, [field]: value }))`
- [x] T016 [US7] Add Project Details section to ProjectsPage FormDialog in `src/admin/pages/ProjectsPage.jsx` — below Basic Information section, render section with heading "Project Details" containing 9 fields that read/write to `form.projectDetails` via `setForm(f => ({ ...f, projectDetails: { ...f.projectDetails, [field]: value } }))`: `projectType` (text, label "Project Type"), `client` (text), `year` (text), `location` (text), `projectSize` (text, label "Project Size"), `projectTime` (text, label "Project Time"), `peopleWorked` (text, label "People Worked"), `projectCost` (text, label "Project Cost"), `statisticsIcon` (ImageField, label "Statistics Icon")
- [x] T017 [US7] Add Sample Images section to ProjectsPage FormDialog in `src/admin/pages/ProjectsPage.jsx` — below Project Details section, render section with heading "Sample Images"; `samples` is `form.projectSamples` array (each item: `{ image, title, description }`); helpers: `addSample` appends `{ image: '', title: '', description: '' }` to array via `setForm`; `removeSample(i)` filters out index i; `updateSample(i, field, value)` maps to update that row; render each row as a bordered card with: ImageField (label "Sample Image", value `row.image`, onChange `url => updateSample(i, 'image', url)`), title text input, description text input, "×" remove button (calls `removeSample(i)`); render "+ Add Sample" button below rows (calls `addSample`); ensure `form.projectSamples` is included in the submit payload (already part of form state from T014)

**Checkpoint**: Projects page fully functional including nested details and dynamic gallery — US7 independently testable

---

## Phase 10: User Story 8 — Manage Site Settings (Priority: P4)

**Goal**: Replace SettingsPage placeholder with a singleton form — loads current settings on mount, saves all 10 fields in a single PUT request. No list table, no delete.

**Independent Test**: Navigate to `/admin/settings`, verify all fields are pre-filled; change the phone field value; click Save; call `GET http://localhost:5000/api/settings` and confirm the new phone value is returned.

- [x] T018 [US8] Implement `src/admin/pages/SettingsPage.jsx` — replace placeholder with: state: `form` ({ companyName: '', phone: '', email: '', address: '', yearsExperience: 0, projectsCompleted: 0, teamSize: 0, aboutDescription: '', heroTitle: '', heroSubtitle: '' }), `loading`, `submitting`, `notification`; `useEffect` calls `api.get('/api/settings')` on mount and sets `form` from response data; no DataTable (singleton, no list or delete); render a single form with labelled fields: `companyName` (text), `phone` (text), `email` (text), `address` (text), `yearsExperience` (number input), `projectsCompleted` (number input), `teamSize` (number input), `aboutDescription` (textarea, 4 rows), `heroTitle` (text), `heroSubtitle` (text); Save button calls `api.put('/api/settings', form)`, then `notify('success', 'Settings saved.')` or `notify('error', 'Save failed. Please try again.')`; inline notification banner (4s auto-dismiss)

**Checkpoint**: Settings page functional — all 10 content types now fully manageable via admin (SC-006 satisfied)

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and style compliance

- [ ] T019 Run manual acceptance test for all 10 content types per `specs/003-crud-content-management/quickstart.md` testing checklist — for each page verify: list loads on open, Add form opens empty, required field shows error on blank submit (FR-003), image upload preview before save (FR-005), success notification after add (FR-012), Edit form opens pre-filled, success notification after edit, Delete confirmation dialog appears before executing (FR-006), success notification after confirmed delete, error notification on network failure (FR-012); additionally for reorder pages (Services, Team, Portfolio): editing order and clicking Save Order updates sequence; for Banners: tab switch loads correct data; for Projects: dynamic gallery add/remove rows work and nested projectDetails fields save/load correctly; for Settings: form pre-fills and saves all fields
- [ ] T020 [P] Verify TailwindCSS style isolation in `src/admin/**` — confirm no Bootstrap classes (`col-`, `row`, `btn`, `container`, `navbar`, etc.) appear in any file under `src/admin/`; confirm no TailwindCSS utility classes appear in website components outside `src/admin/`; confirm all 4 shared components in `src/admin/components/crud/` and all 9 replaced page files use only TailwindCSS and shadcn/ui imports from `src/components/ui/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — BLOCKS all user story pages; T002–T005 can all run in parallel (all different files)
- **Phases 3–10 (User Stories)**: All depend on Phase 2 (shared components) completion
  - US1 (Phase 3): Establishes the pattern; its 3 tasks can run in parallel
  - US2 (Phase 4) and US3 (Phase 5): Both P2 — can start after Phase 2 independently of US1
  - US4–US6 (Phases 6–8): All P3 — independent of each other; can run in parallel if team allows
  - US7 (Phase 9): T014 → T015 → T016 → T017 are strictly sequential (all same file)
  - US8 (Phase 10): P4 — simplest page, natural last step
- **Phase 11 (Polish)**: Depends on all desired stories complete

### User Story Dependencies

- **US1 (P1)**: No story dependencies — all 3 pages (Tools, Clients, Partners) are independent of each other
- **US2 (P2)**: No story dependencies — Banners page is completely independent
- **US3 (P2)**: No story dependencies — Services page is independent
- **US4 (P3)**: No story dependencies — Team page is independent
- **US5 (P3)**: No story dependencies — Reviews page is independent
- **US6 (P3)**: No story dependencies — Portfolio page is independent
- **US7 (P3)**: No story dependencies — Projects page is independent (complex but self-contained)
- **US8 (P4)**: No story dependencies — Settings singleton is fully independent

### Within Each User Story

- Phase 2 components must be complete before any page implementation begins
- For US7 (Projects): T014 → T015 → T016 → T017 strictly sequential (layering one file)
- All other user stories are single tasks — no intra-story sequencing

---

## Parallel Execution Examples

### Phase 2: All 4 Shared Components (run together)

```
Task: "Create DataTable.jsx in src/admin/components/crud/DataTable.jsx"
Task: "Create FormDialog.jsx in src/admin/components/crud/FormDialog.jsx"
Task: "Create DeleteConfirm.jsx in src/admin/components/crud/DeleteConfirm.jsx"
Task: "Create ImageField.jsx in src/admin/components/crud/ImageField.jsx"
```

### Phase 3: US1 Simple Pages (run together)

```
Task: "Implement ToolsPage.jsx in src/admin/pages/ToolsPage.jsx"
Task: "Implement ClientsPage.jsx in src/admin/pages/ClientsPage.jsx"
Task: "Implement PartnersPage.jsx in src/admin/pages/PartnersPage.jsx"
```

### Phases 6–8: P3 User Stories (if multiple developers)

```
Developer A: TeamPage.jsx (T011, US4)
Developer B: ReviewsPage.jsx (T012, US5)
Developer C: PortfolioPage.jsx (T013, US6)
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1: Prerequisite verification
2. Complete Phase 2: All 4 shared components (parallelize T002–T005)
3. Complete Phase 3: ToolsPage, ClientsPage, PartnersPage (parallelize T006–T008)
4. **STOP and VALIDATE**: Test all three US1 pages per quickstart.md checklist
5. Deploy/demo if ready — admin can manage Tools, Clients, Partners

### Incremental Delivery

1. Phase 1 + Phase 2 → Shared components ready (foundation)
2. Phase 3 → US1 complete → Test → Demo (MVP!)
3. Phase 4 + 5 → US2 + US3 complete → Test → Demo
4. Phases 6–8 → US4 + US5 + US6 complete → Test → Demo
5. Phase 9 → US7 complete (most complex) → Test → Demo
6. Phase 10 → US8 complete → Test → Demo
7. Phase 11 → Manual validation + style check → Ship

### Parallel Team Strategy

With multiple developers, once Phase 2 is complete:
- **Developer A**: US1 pages — Tools, Clients, Partners (Phase 3)
- **Developer B**: US2 Banners + US3 Services (Phases 4–5)
- **Developer C**: US4 Team + US5 Reviews + US6 Portfolio (Phases 6–8)
- **Developer D**: US7 Projects (Phase 9, all 4 tasks sequential)
- **All**: US8 Settings + Polish (Phases 10–11, simplest work last)

---

## Notes

- **No automated tests**: Manual acceptance testing per `specs/003-crud-content-management/quickstart.md` only
- **Backend is complete and read-only**: Do NOT modify anything under `backend/` — all models, routes, and auth middleware are fully implemented from Phase 1
- **TailwindCSS isolation**: All new JSX goes in `src/admin/**` — no Tailwind outside this directory (conflicts with Bootstrap on public website)
- **shadcn/ui imports**: Always import from `src/components/ui/` (already initialized in Phase 2 of the project)
- **Axios instance**: Always import and use `api` from `src/admin/services/api.js` — it auto-attaches the JWT Bearer token from `localStorage.alhady_admin_token`
- **Image display**: Always render stored URLs as `http://localhost:5000{url}` where `url` = `/uploads/<filename>`
- **Required field validation**: Client-side only — show inline error text and block form submit; required fields per entity in `specs/003-crud-content-management/data-model.md`
- **[P] tasks**: Different files — safe to run concurrently
- **[USN] labels**: Map each task to its user story for traceability
- Each user story is independently completable and testable without other stories being complete

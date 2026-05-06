# Tasks: CRUD Content Management Pages

**Input**: Design documents from `/specs/003-crud-content-management/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Manual acceptance testing only — no automated test framework configured (per plan.md Technical Context).

**Organization**: Tasks grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no blocking dependencies between them)
- **[Story]**: User story label (US1–US8) — maps to spec.md priorities
- Exact file paths included in all task descriptions

---

## Phase 1: Setup

**Purpose**: Confirm all prerequisites are in place before building any components.

- [ ] T001 Verify Phase 1+2 infrastructure is ready: confirm backend starts at port 5000 (`GET http://localhost:5000/api/settings` returns JSON), frontend starts at port 3000, all 9 placeholder page files exist in `src/admin/pages/`, and shadcn/ui `Dialog` + `AlertDialog` components exist in `src/components/ui/`

---

## Phase 2: Foundational — Shared CRUD Components

**Purpose**: Build the 4 shared components that ALL 9 admin pages depend on. No user story work can begin until T002–T005 are all complete.

**⚠️ CRITICAL**: All user stories block on these four components. T002–T005 have no dependencies on each other and can run in parallel.

- [ ] T002 Create `src/admin/components/crud/DataTable.jsx`: props — `title`(string), `columns`(Column[]), `data`(object[]), `onAdd`(() => void), `onEdit`((item) => void), `onDelete`((item) => void), `loading`(bool default false), `addLabel`(string default "Add New"); Column type: `{ key, label, render?(value, row) => ReactNode }`; render a TailwindCSS table with `text-3xl font-heading text-gold uppercase tracking-widest` section heading, "Add New" gold button top-right, column headers from `label`, cells using `render(row[key], row)` if provided else raw value, Edit (gold outline) and Delete (red outline) buttons per row; when `loading=true` render 5 skeleton rows with animated `bg-zinc-800 rounded h-4` placeholders; overall container `bg-zinc-900 border border-gold/30 rounded-lg p-4`
- [ ] T003 [P] Create `src/admin/components/crud/FormDialog.jsx`: wraps shadcn/ui `Dialog` from `src/components/ui/dialog`; props — `open`(bool), `onClose`(() => void), `title`(string), `onSubmit`(() => void), `submitting`(bool default false), `children`(ReactNode), `submitLabel`(string default "Save")` ; renders `DialogHeader` with title, scrollable `DialogContent` containing `children`, `DialogFooter` with Submit and Cancel; Submit is disabled and shows a spinner when `submitting=true`; Cancel calls `onClose`
- [ ] T004 [P] Create `src/admin/components/crud/DeleteConfirm.jsx`: wraps shadcn/ui `AlertDialog` from `src/components/ui/alert-dialog`; props — `open`(bool), `onClose`(() => void), `onConfirm`(() => void), `itemName`(string optional); message body: "Are you sure you want to delete **{itemName || 'this item'}**? This action cannot be undone."; Confirm button destructive style (red), Cancel calls `onClose`, Confirm calls `onConfirm`; satisfies FR-006
- [ ] T005 [P] Create `src/admin/components/crud/ImageField.jsx`: props — `value`(string, `/uploads/<file>` URL or `''`), `onChange`((url: string) => void), `label`(string default "Image"); on mount if `value` is non-empty show existing image preview `<img src={\`http://localhost:5000\${value}\`} className="h-24 w-24 object-cover rounded border border-gold/30" />`; on file input change POST to `/api/upload` via `api` from `src/admin/services/api.js` as `multipart/form-data` field `"image"`, show uploading indicator; on success call `onChange(res.data.url)` and update preview; on failure show inline red error; render "Clear" button that calls `onChange('')` and removes preview; satisfies FR-004 and FR-005

**Checkpoint**: Render all 4 components in isolation and verify props/callbacks fire correctly before proceeding to user story pages.

---

## Phase 3: User Story 1 — Manage Simple Content Items (Priority: P1) 🎯 MVP

**Goal**: Full CRUD (list + add + edit + delete) for Tools, Clients, and Partners — each with title and icon/logo image. Establishes the shared page state pattern used by all subsequent pages.

**Independent Test**: Navigate to `/admin/tools`, add a new tool with a title and icon image, verify it appears in the table, edit its title, verify the change, then delete it and confirm it is removed from the list.

- [ ] T006 [P] [US1] Implement `src/admin/pages/ToolsPage.jsx` replacing placeholder: state — `data[]`, `loading`, `formOpen`, `editItem`(null = add mode), `deleteTarget`, `submitting`, `notification`({type,message}|null); `reload` helper: `api.get('/api/tools').then(r => setData(r.data))`; `useEffect(() => { reload().finally(() => setLoading(false)); }, [])`; `notify(type, message)` sets notification then `setTimeout(() => setNotification(null), 4000)`; render inline notification banner (`bg-green-900/40 text-green-300 border border-green-700` for success, `bg-red-900/40 text-red-300 border border-red-700` for error); `DataTable` title="Tools" columns: icon preview (h-8 w-8 object-contain), title, order, active ("Yes"/"No"); `onAdd` → `setEditItem(null); setFormOpen(true)`; `onEdit` → `setEditItem(item); setFormOpen(true)`; `onDelete` → `setDeleteTarget(item)`; `FormDialog` title "Add Tool"/"Edit Tool" with form inputs: `title` (required text — show inline "Title is required" and block submit if blank), `icon` (ImageField label "Icon"), `order` (number), `active` (checkbox); `handleSubmit`: `setSubmitting(true)` → `editItem ? api.put(\`/api/tools/\${editItem._id}\`, form) : api.post('/api/tools', form)` → `reload()` → `setFormOpen(false)` → `notify('success', 'Saved.')` catch `notify('error', 'Save failed.')` finally `setSubmitting(false)`; `handleDelete`: `api.delete(\`/api/tools/\${deleteTarget._id}\`)` → `setDeleteTarget(null)` → `reload()` → `notify('success', 'Deleted.')`; `DeleteConfirm` `itemName={deleteTarget?.title}`
- [ ] T007 [P] [US1] Implement `src/admin/pages/ClientsPage.jsx` replacing placeholder: identical pattern to T006 using `/api/clients`; `DataTable` title "Clients" columns: icon (logo preview), title, order, active; `FormDialog` title "Add Client"/"Edit Client" fields: `title`(req), `icon`(ImageField label "Logo"), `order`, `active`; required field: `title`; full CRUD with inline notification banner; POST/PUT/DELETE `/api/clients`
- [ ] T008 [P] [US1] Implement `src/admin/pages/PartnersPage.jsx` replacing placeholder: identical pattern to T006 using `/api/partners`; `DataTable` title "Partners" columns: icon (logo preview), title, order, active; `FormDialog` title "Add Partner"/"Edit Partner" fields: `title`(req), `icon`(ImageField label "Logo"), `order`, `active`; full CRUD with inline notification banner; POST/PUT/DELETE `/api/partners`

**Checkpoint**: All three simple list pages are fully functional. Run the quickstart.md testing checklist for Tools, Clients, and Partners before proceeding to P2 stories.

---

## Phase 4: User Story 2 — Manage Page Banners (Priority: P2)

**Goal**: Replace BannersPage placeholder with an 8-tab upsert interface. No list table, no delete — one form per page, GET then PUT.

**Independent Test**: Navigate to `/admin/banners`, select the "home" tab, change the title field, click Save, then call `GET http://localhost:5000/api/banners/home` and confirm the updated title is returned.

- [ ] T009 [US2] Implement `src/admin/pages/BannersPage.jsx` replacing placeholder: `PAGE_SLUGS` constant `['home','about','service','project','portfolio','team','contact','faq']`; state — `selectedPage`(default `'home'`), `form`({title:'', subtitle:'', backgroundImage:''}), `loading`, `submitting`, `notification`; `loadBanner(page)`: `setLoading(true)` → `api.get(\`/api/banners/\${page}\`)` → `setForm(res.data || {title:'',subtitle:'',backgroundImage:''})` → `setLoading(false)`; call `loadBanner('home')` on mount; render 8 tab buttons (horizontal row): clicking any tab calls `setSelectedPage(slug); loadBanner(slug)`; active tab styled `border-b-2 border-gold text-gold`; below tabs: notification banner, then form with `title` text input, `subtitle` text input, `backgroundImage` ImageField (label "Background Image"); Save button → `setSubmitting(true)` → `api.put(\`/api/banners/\${selectedPage}\`, form)` → `notify('success', 'Banner saved.')` catch `notify('error', 'Save failed.')` finally `setSubmitting(false)`; no `DataTable`, no `DeleteConfirm`

**Checkpoint**: Switch tabs, edit and save each, reload page, confirm data persists per tab.

---

## Phase 5: User Story 3 — Manage Services (Priority: P2)

**Goal**: Replace ServicesPage placeholder with full CRUD including 3 ImageField inputs and a "Save Order" button sending PATCH to the reorder endpoint.

**Independent Test**: Add a service with title and all 3 images, verify it appears, change its order value in the form, click "Save Order", reload and confirm the order value persists.

- [ ] T010 [US3] Implement `src/admin/pages/ServicesPage.jsx` replacing placeholder: standard state pattern (data, loading, formOpen, editItem, deleteTarget, submitting, notification); `useEffect` → `api.get('/api/services')` → `setData`; `DataTable` title "Services" columns: icon (img preview), title, order, active; Add/Edit/Delete via standard openForm/setDeleteTarget pattern; `FormDialog` title "Add Service"/"Edit Service" fields: `title`(req text), `description`(textarea rows=3), `sliderImage`(ImageField label "Slider Image"), `cardImage`(ImageField label "Card Image"), `icon`(ImageField label "Icon"), `link`(text), `order`(number), `active`(checkbox); `handleSubmit` → `api.post('/api/services', form)` or `api.put(\`/api/services/\${editItem._id}\`, form)` → reload → notify; `DeleteConfirm` → `api.delete(\`/api/services/\${deleteTarget._id}\`)` → reload → notify; "Save Order" button below `DataTable` → `api.patch('/api/services/reorder', { items: data.map(i => ({ id: i._id, order: i.order })) })` → `notify('success', 'Order saved.')`; inline notification banner (4s)

**Checkpoint**: Add a service with all 3 images, reorder via Save Order, delete — all operations produce correct notifications.

---

## Phase 6: User Story 4 — Manage Team Members (Priority: P3)

**Goal**: Replace TeamPage placeholder with CRUD list + form including profile photo and numeric reorder save.

**Independent Test**: Add a team member with name, position, and profile photo; verify the entry appears; edit the order field and click "Save Order"; reload and confirm the new order persists.

- [ ] T011 [US4] Implement `src/admin/pages/TeamPage.jsx` replacing placeholder: standard state pattern; `useEffect` → `api.get('/api/team')` → `setData`; `DataTable` title "Team" columns: profileImage (circular preview h-8 w-8 rounded-full), name, position, order, active; `FormDialog` title "Add Team Member"/"Edit Team Member" fields: `name`(req text), `position`(text), `profileImage`(ImageField label "Profile Photo"), `order`(number), `active`(checkbox); `handleSubmit` → `api.post('/api/team', form)` or `api.put(\`/api/team/\${editItem._id}\`, form)` → reload → notify; `DeleteConfirm` → `api.delete(\`/api/team/\${deleteTarget._id}\`)` → reload → notify; "Save Order" button → `api.patch('/api/team/reorder', { items: data.map(i => ({ id: i._id, order: i.order })) })` → notify; inline notification banner (4s)

**Checkpoint**: Add team member with photo, use Save Order, delete — all operations work with notifications.

---

## Phase 7: User Story 5 — Manage Reviews (Priority: P3)

**Goal**: Replace ReviewsPage placeholder with CRUD for client testimonials. Two required fields (name, description). No reorder endpoint for this entity.

**Independent Test**: Add a review with all fields including a photo, verify it appears in the list, edit the description, save, and confirm the updated text is shown.

- [ ] T012 [US5] Implement `src/admin/pages/ReviewsPage.jsx` replacing placeholder: standard state pattern; `useEffect` → `api.get('/api/reviews')` → `setData`; `DataTable` title "Reviews" columns: image (circular preview h-8 w-8 rounded-full), name, jobTitle, active; `FormDialog` title "Add Review"/"Edit Review" fields: `name`(req text), `jobTitle`(text), `description`(req textarea rows=3), `image`(ImageField label "Author Photo"), `active`(checkbox); validate both `name` and `description` non-empty before submit; `handleSubmit` → `api.post('/api/reviews', form)` or `api.put(\`/api/reviews/\${editItem._id}\`, form)` → reload → notify; `DeleteConfirm` → `api.delete(\`/api/reviews/\${deleteTarget._id}\`)` → reload → notify; no "Save Order" button (Reviews has no reorder endpoint); inline notification banner (4s)

**Checkpoint**: Add review with photo, edit description, delete — required-field validation fires correctly, all operations succeed with notifications.

---

## Phase 8: User Story 6 — Manage Portfolio Items (Priority: P3)

**Goal**: Replace PortfolioPage placeholder with CRUD list + form with card image and numeric reorder save.

**Independent Test**: Add a portfolio item with category and card image, verify it appears, change the order value and click "Save Order", reload and confirm the order persists.

- [ ] T013 [US6] Implement `src/admin/pages/PortfolioPage.jsx` replacing placeholder: standard state pattern; `useEffect` → `api.get('/api/portfolio')` → `setData`; `DataTable` title "Portfolio" columns: cardImage (preview h-8 w-8 rounded object-cover), title, serviceCategory, order, active; `FormDialog` title "Add Portfolio Item"/"Edit Portfolio Item" fields: `title`(req text), `serviceCategory`(text), `cardImage`(ImageField label "Card Image"), `order`(number), `active`(checkbox); `handleSubmit` → `api.post('/api/portfolio', form)` or `api.put(\`/api/portfolio/\${editItem._id}\`, form)` → reload → notify; `DeleteConfirm` → `api.delete(\`/api/portfolio/\${deleteTarget._id}\`)` → reload → notify; "Save Order" button → `api.patch('/api/portfolio/reorder', { items: data.map(i => ({ id: i._id, order: i.order })) })` → notify; inline notification banner (4s)

**Checkpoint**: Add portfolio item, reorder, delete — all operations succeed with notifications.

---

## Phase 9: User Story 7 — Manage Projects (Priority: P3)

**Goal**: Replace ProjectsPage placeholder with CRUD list + complex three-section form — Basic Info, Project Details (nested sub-object), and dynamic Sample Images gallery (add/remove rows). Most complex page in the feature.

**Independent Test**: Create a project filling all 3 form sections with at least 2 sample images, save, verify all data reloads on edit, then add a 3rd sample image and confirm it persists after save.

- [ ] T014 [US7] Build ProjectsPage.jsx list scaffold and delete in `src/admin/pages/ProjectsPage.jsx`: state — `data[]`, `loading`, `formOpen`, `editItem`, `deleteTarget`, `submitting`, `notification`; initial form shape: `{ title: '', serviceCategory: '', homeCardImage: '', projectImage: '', header: '', description: '', projectDetails: { projectType: '', client: '', year: '', location: '', projectSize: '', projectTime: '', peopleWorked: '', projectCost: '', statisticsIcon: '' }, projectSamples: [] }`; `useEffect` → `api.get('/api/projects')` → `setData`; on Edit click: fetch `api.get(\`/api/projects/\${item._id}\`)` to get full document (list API returns summary), set `form` from response then `setEditItem(fullItem); setFormOpen(true)`; `DataTable` title "Projects" columns: homeCardImage (preview), title, serviceCategory, active; `handleDelete` → `api.delete(\`/api/projects/\${deleteTarget._id}\`)` → reload → notify; `DeleteConfirm` `itemName={deleteTarget?.title}`; `FormDialog` children will contain sections from T015–T017
- [ ] T015 [US7] Add Basic Info and Project Details sections to ProjectsPage.jsx `FormDialog` in `src/admin/pages/ProjectsPage.jsx`: Section 1 heading "Basic Information" — `title`(req text, inline error if blank on submit), `serviceCategory`(text), `homeCardImage`(ImageField label "Home Card Image"), `projectImage`(ImageField label "Project Image"), `header`(text), `description`(textarea rows=4); all update via `setForm(f => ({ ...f, [field]: value }))`; Section 2 heading "Project Details" — 8 text inputs reading/writing to `form.projectDetails` via `setForm(f => ({ ...f, projectDetails: { ...f.projectDetails, [field]: value } }))`: `projectType`, `client`, `year`, `location`, `projectSize`, `projectTime`, `peopleWorked`, `projectCost`; plus `statisticsIcon`(ImageField label "Statistics Icon" in projectDetails); wire `handleSubmit` → `api.post('/api/projects', form)` or `api.put(\`/api/projects/\${editItem._id}\`, form)` → reload → notify
- [ ] T016 [US7] Add Sample Images section to ProjectsPage.jsx `FormDialog` in `src/admin/pages/ProjectsPage.jsx`: Section 3 heading "Sample Images" — `samples` is `form.projectSamples`; helpers via `setForm`: `addSample` appends `{image:'',title:'',description:''}`, `removeSample(i)` filters by index, `updateSample(i, field, value)` maps over array; on `openForm(editItem)` populate `form.projectSamples` from `editItem.projectSamples || []`; render each row as a `border border-gold/30 rounded p-3` card with: ImageField (`value=row.image`, `onChange={url => updateSample(i,'image',url)}`, label "Sample Image"), `title` text input, `description` text input, "×" remove button calling `removeSample(i)`; "+ Add Sample" button below rows calls `addSample`; `projectSamples` is already in form state and included in POST/PUT payload from T015

**Checkpoint**: Create a project with all 3 sections and 2+ samples, edit to add a 3rd sample, delete a project — verify all nested data saves and reloads correctly.

---

## Phase 10: User Story 8 — Manage Site Settings (Priority: P4)

**Goal**: Replace SettingsPage placeholder with a singleton settings form — pre-fills from GET on mount, saves all 10 fields on PUT. No list table, no delete, no FormDialog wrapper.

**Independent Test**: Navigate to `/admin/settings`, verify all fields are pre-filled, change the phone field, click Save, call `GET http://localhost:5000/api/settings` and confirm the updated phone is returned.

- [ ] T017 [US8] Implement `src/admin/pages/SettingsPage.jsx` replacing placeholder: state — `form`({companyName:'', phone:'', email:'', address:'', yearsExperience:0, projectsCompleted:0, teamSize:0, aboutDescription:'', heroTitle:'', heroSubtitle:''}), `loading`, `submitting`, `notification`; `useEffect` → `api.get('/api/settings')` → `setForm(res.data || initialForm)` → `setLoading(false)`; render always-visible form (no `formOpen` toggle, no `DataTable`): labelled inputs for all 10 fields — `companyName`(text), `phone`(text), `email`(text), `address`(text), `yearsExperience`(number), `projectsCompleted`(number), `teamSize`(number), `aboutDescription`(textarea rows=3), `heroTitle`(text), `heroSubtitle`(text); Save button → `setSubmitting(true)` → `api.put('/api/settings', form)` → `notify('success', 'Settings saved.')` catch `notify('error', 'Save failed.')` finally `setSubmitting(false)`; inline notification banner (4s auto-dismiss); all 10 content types are now manageable (SC-006)

**Checkpoint**: Load settings page, update 3 fields, save, hard-reload, confirm all changes persisted.

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and style compliance across all 10 implemented pages.

- [ ] T018 [P] Audit all `src/admin/pages/` files for TailwindCSS design token consistency: section headings use `text-3xl font-heading text-gold uppercase tracking-widest`; body text uses `font-body`; table/card containers use `bg-zinc-900`; borders use `border-gold/30`; fix any deviations across all 9 replaced pages plus the 4 shared components in `src/admin/components/crud/`; also confirm no TailwindCSS classes appear in any file outside `src/admin/**`
- [ ] T019 Run the full quickstart.md testing checklist for all 10 content types: for each page verify — list loads on open, Add form opens empty, required-field error shown before submit reaches server (FR-003), image upload preview shown before save (FR-005), successful add shows success notification + list updates (FR-012), Edit form pre-fills all existing data, successful edit reflects change in list, Delete shows confirmation dialog before executing (FR-006), confirmed delete removes item + success notification, network error shows error notification; additional checks — reorder pages (Services, Team, Portfolio): Save Order persists; Banners: tab switch loads correct banner data, save persists; Projects: add/remove sample rows work, all nested projectDetails fields save/load; Settings: form pre-fills and saves all 10 fields

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — **BLOCKS all user stories**; T002–T005 can run in parallel (4 different files)
- **Phases 3–10 (User Stories)**: All depend on Phase 2 completion
  - Phase 3 (US1 P1): T006, T007, T008 can run in parallel (3 different files)
  - Phase 4 (US2 P2) and Phase 5 (US3 P2): Independent of each other, can run concurrently
  - Phases 6–8 (US4–US6 P3): T011, T012, T013 fully independent of each other
  - Phase 9 (US7 P3): T014 → T015 → T016 strictly sequential (all same file)
  - Phase 10 (US8 P4): Independent singleton, simplest page — implement last
- **Final Phase**: Depends on all desired stories complete

### User Story Dependencies

| Story | Priority | Can parallel with |
|-------|----------|------------------|
| US1 — Tools, Clients, Partners | P1 | T006/T007/T008 each other |
| US2 — Banners | P2 | US3 |
| US3 — Services | P2 | US2 |
| US4 — Team | P3 | US5, US6, US7 |
| US5 — Reviews | P3 | US4, US6, US7 |
| US6 — Portfolio | P3 | US4, US5, US7 |
| US7 — Projects | P3 | US4, US5, US6 (but T014→T015→T016 internal) |
| US8 — Settings | P4 | None needed — implement last |

---

## Parallel Execution Examples

### Phase 2 — All 4 shared components simultaneously

```
Parallel: T002  Create DataTable.jsx in src/admin/components/crud/DataTable.jsx
Parallel: T003  Create FormDialog.jsx in src/admin/components/crud/FormDialog.jsx
Parallel: T004  Create DeleteConfirm.jsx in src/admin/components/crud/DeleteConfirm.jsx
Parallel: T005  Create ImageField.jsx in src/admin/components/crud/ImageField.jsx
```

### Phase 3 — US1 simple pages simultaneously

```
Parallel: T006  Implement ToolsPage.jsx
Parallel: T007  Implement ClientsPage.jsx
Parallel: T008  Implement PartnersPage.jsx
```

### Phases 6–8 — P3 stories (multi-developer)

```
Developer A: T011  TeamPage.jsx     (US4)
Developer B: T012  ReviewsPage.jsx  (US5)
Developer C: T013  PortfolioPage.jsx (US6)
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1 (verify prerequisites)
2. Complete Phase 2 (4 shared components — parallelize T002–T005)
3. Complete Phase 3 (3 simple pages — parallelize T006–T008)
4. **STOP and VALIDATE** — run quickstart.md checklist for Tools, Clients, Partners
5. Deploy/demo — admin can now manage Tools, Clients, Partners

### Incremental Delivery

1. Phases 1–2: Shared components ready
2. Phase 3 → US1 (3 pages) → Test → Demo (MVP)
3. Phases 4–5 → US2 + US3 → Test → Demo
4. Phases 6–8 → US4 + US5 + US6 → Test → Demo
5. Phase 9 → US7 (most complex) → Test → Demo
6. Phase 10 → US8 → Test → Demo
7. Final Phase → Polish and full checklist → Ship

### Parallel Team Strategy (after Phase 2 complete)

- **Dev A**: T006 + T007 + T008 (US1, 3 pages)
- **Dev B**: T009 + T010 (US2 Banners + US3 Services)
- **Dev C**: T011 + T012 + T013 (US4 Team + US5 Reviews + US6 Portfolio)
- **Dev D**: T014 → T015 → T016 (US7 Projects, sequential)
- **All**: T017 + Final Phase (US8 Settings + polish)

---

## Notes

- **No automated tests**: Manual acceptance testing per `specs/003-crud-content-management/quickstart.md` only
- **Backend is complete and read-only**: Do NOT modify anything under `backend/` — all models, routes, auth middleware fully implemented
- **TailwindCSS isolation**: All new JSX goes in `src/admin/**` only — Tailwind conflicts with Bootstrap on the public website
- **shadcn/ui imports**: Always import from `src/components/ui/` (already initialized in Phase 2 of the project)
- **Axios instance**: Always use `api` from `src/admin/services/api.js` — it auto-attaches JWT Bearer token from `localStorage.alhady_admin_token`
- **Image display**: Prefix all stored paths with `http://localhost:5000` (e.g. `<img src={\`http://localhost:5000\${item.icon}\`} />`)
- **[P] tasks**: Different files — safe to run concurrently with no conflicts
- **[USN] labels**: Map each task to its user story for full traceability
- Each user story is independently completable and testable without other stories being complete

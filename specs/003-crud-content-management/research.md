# Phase 0 Research: CRUD Content Management Pages

**Feature**: `003-crud-content-management`  
**Date**: 2026-05-06  
**Status**: Complete — all NEEDS CLARIFICATION resolved

---

## Context Summary

Phase 3 is a **frontend-only** implementation. The backend is fully implemented:
- All 11 Mongoose models exist in `backend/models/`
- All REST API endpoints exist in `backend/routes/` (CRUD + reorder where needed)
- JWT auth middleware (`backend/middleware/auth.js`) guards all write endpoints
- Image upload endpoint (`POST /api/upload`) enforces 5 MB limit and image-only MIME types
- Axios instance with auth interceptor exists at `src/admin/services/api.js`
- All 9 admin page shells exist as placeholders in `src/admin/pages/`

This phase replaces the placeholder content in all 9 pages with working CRUD UIs.

---

## Decision 1: Shared Component Architecture

**Decision**: Extract 4 reusable admin CRUD components into `src/admin/components/crud/`:

| Component | Purpose |
|-----------|---------|
| `DataTable.jsx` | Reusable table with title, columns config, action buttons (Edit / Delete) |
| `FormDialog.jsx` | Modal dialog wrapping any form; handles open/close/title/submit |
| `DeleteConfirm.jsx` | shadcn/ui `AlertDialog` for single-step delete confirmation |
| `ImageField.jsx` | Image upload field: select → upload to `/api/upload` → show preview → return URL |

**Rationale**: 9 of the 10 pages share the same list → add → edit → delete loop. Extracting these components eliminates 90%+ code duplication and ensures FR-012 (notifications), FR-005 (preview), and FR-006 (delete confirmation) are enforced consistently.

**Alternatives considered**: Building each page independently — rejected because it would require implementing delete confirmation, image preview, and notification logic 9 separate times, creating divergent behavior.

---

## Decision 2: Form State Management

**Decision**: Controlled local state (`useState`) per form, no form library.

**Rationale**: All forms are shallow except Projects. Adding React Hook Form or Formik would be a dependency for minimal gain given the project's simple validation requirements (FR-003: required fields only). Controlled inputs with a single `handleChange` pattern are sufficient and consistent with the existing admin code style.

**Alternatives considered**: React Hook Form — rejected (extra dependency, not justified by form complexity). Formik — rejected (same reason).

---

## Decision 3: Image Upload Flow

**Decision**: Two-step upload — upload file immediately on selection, then reference returned URL in form submission.

Flow:
1. User selects file in `ImageField`
2. `ImageField` calls `POST /api/upload` (multipart/form-data)
3. Backend returns `{ url: '/uploads/<filename>' }`
4. `ImageField` sets preview from URL and calls `onChange(url)` to pass URL to parent form
5. Parent form submits URL string as part of form payload

**Rationale**: The backend `upload.js` route is a dedicated upload endpoint that returns a URL. This pattern avoids sending base64 data inline (Constitution §Content Model & File Handling: "Files MUST NOT be stored inline in the database"). The URL is stored directly in MongoDB as a relative path.

**Alternatives considered**: Base64 inline upload — explicitly prohibited by constitution. Uploading on form submit — rejected because it complicates error handling (upload failure mid-submit).

---

## Decision 4: Reorder UX

**Decision**: Numeric `order` field on the edit form (not drag-and-drop).

**Rationale**: The feature spec explicitly states: "Reordering is handled via a numeric order field in the form, not drag-and-drop (drag-and-drop is a stretch goal)." The backend reorder endpoints (`PATCH /api/services/reorder`, `/api/team/reorder`, `/api/portfolio/reorder`) accept an array of `{ id, order }` pairs. The admin page will read the current `order` value, allow the admin to edit it, and on save call the reorder endpoint with all items sorted by their new `order` values.

**Alternatives considered**: Drag-and-drop with `react-beautiful-dnd` — explicitly out of scope for v1.

---

## Decision 5: Notifications (FR-012)

**Decision**: Inline toast-style notification using a simple local state banner (no external toast library).

Implementation: A `Notification` component that accepts `{ type: 'success'|'error', message }` and auto-dismisses after 4 seconds. Rendered inside `AdminLayout` content area at the top of each page.

**Rationale**: The project already uses shadcn/ui. A simple controlled-state notification avoids requiring `sonner` or `react-toastify`. Consistent with the minimal-dependency preference.

**Alternatives considered**: `shadcn/ui` Toaster (sonner) — viable but requires additional setup not yet present. Accepted as a stretch upgrade.

---

## Decision 6: Page-by-Page Implementation Pattern

Pages are grouped by implementation complexity into 4 patterns:

| Pattern | Pages | Complexity |
|---------|-------|------------|
| A — Simple CRUD list | Tools, Clients, Partners | Low |
| B — CRUD list + image upload | Team, Reviews, Portfolio | Medium |
| C — CRUD list + multiple images + reorder | Services | Medium-High |
| D — Unique | Banners (tabs/upsert), Projects (nested form), Settings (singleton) | High |

**Rationale**: Building Pattern A pages first validates the shared components. Pattern B/C extend them. Pattern D pages (Banners, Projects, Settings) are unique enough to require custom page-level logic.

---

## Decision 7: Projects Form Structure

**Decision**: Single-page multi-section form (no wizard), with:
- Section 1: Basic fields (title, category, images, header, description)
- Section 2: Project details (9 fixed fields from `projectDetails` subdocument)
- Section 3: Sample images — dynamic rows, each with image + title + description, add/remove buttons

**Rationale**: The spec requires "a variable-length gallery of sample images with titles and descriptions" (User Story 7). An array-state approach (`projectSamples: [{ image, title, description }]`) with `Add Row` / `Remove` buttons is the simplest correct implementation. A wizard would add navigation complexity without improving usability.

**Alternatives considered**: Wizard/stepper — rejected (unnecessary complexity). Accordion sections — viable enhancement for later.

---

## Resolved Clarifications

All items are now resolved. No NEEDS CLARIFICATION items remain.

| Item | Resolution |
|------|-----------|
| Are backend routes complete? | Yes — all 10 content types fully implemented |
| Is auth middleware in place? | Yes — `backend/middleware/auth.js` guards all writes |
| Do shadcn/ui components exist? | Yes — `src/components/ui/` initialized in Phase 2 |
| Is Axios configured? | Yes — `src/admin/services/api.js` with Bearer token interceptor |
| Do page shell files exist? | Yes — all 9 placeholder pages in `src/admin/pages/` |
| What is the upload endpoint? | `POST /api/upload` returns `{ url }` |
| Which pages need reorder? | Services, Team, Portfolio (PATCH reorder endpoints exist) |
| Is there a reorder endpoint for Team? | Yes — `PATCH /api/team/reorder` |

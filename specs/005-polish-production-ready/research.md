# Research: Polish & Production Readiness

**Feature**: 005-polish-production-ready
**Date**: 2026-05-06

## Current Implementation Audit

| Area | Status | Gap |
|------|--------|-----|
| Helmet security headers | ✅ Done | — |
| Rate limiting on `/api/auth/login` | ✅ Done (10 req/15min per IP) | — |
| Upload MIME + size validation | ✅ Done (jpeg/png/gif/webp, 5MB) | — |
| Delete confirmation dialogs | ✅ Done (all pages via `DeleteConfirm`) | — |
| Image preview before upload | ✅ Done (`ImageField` component) | — |
| Loading/submitting states on buttons | ✅ Done (`FormDialog` submitting prop) | — |
| Express-validator in backend routes | ✅ Done (all 11 routes) | Depth varies; audit needed |
| Notifications on save/delete | ⚠️ Partial | Only `ToolsPage` wires Notification — 9 other pages silent |
| Client-side form validation | ❌ Missing | No required-field checks before submit |
| Field-level error display in forms | ❌ Missing | Errors not surfaced per-field in UI |
| Admin API base URL configurable | ❌ Missing | `src/admin/services/api.js` hardcodes `localhost:5000` |
| MongoDB indexes | ❌ Missing | No indexes on any of the 11 schemas |
| Root-level `.env.example` | ❌ Missing | Frontend env vars undocumented |
| Deployment documentation | ❌ Missing | No setup guide for new developers |

---

## Research Decision Log

### 1. Notification Architecture

**Decision**: Centralize notification state in `useCRUD` hook.

**Why**: `handleSave` and `confirmDelete` already return `{ success, message }`. Adding
`notification` state + auto-dismiss timeout to the hook exposes notifications to all 10 pages
that use it without per-page wiring. The `Notification` component already exists and is styled.

**How to apply**: Add `notification`, `showNotification` internals to `useCRUD`; expose
`notification` and `clearNotification` in the return value. Each page renders
`<Notification type={notification.type} message={notification.message} onClose={clearNotification} />`
at the top of its content area.

**Alternatives considered**: React Context toast provider (overkill for single-admin app),
per-page state (current ToolsPage approach — doesn't scale).

---

### 2. Client-Side Form Validation

**Decision**: Lightweight per-page `validate(formData)` function returning `{ fieldName: 'msg' }`;
no new library.

**Why**: react-hook-form + zod would require refactoring all FormDialog inputs to use Controller
wrappers, changing every onChange handler, and full re-testing. The spec only requires required-
field highlighting and field-level messages before submit — achievable with plain React state.
express-validator on the server remains the authoritative validation layer.

**How to apply**: Each page defines a `validate` function. On submit, run validation; if errors
exist, set `formErrors` state and return without calling `handleSave`. Pass `formErrors` to
`FormDialog` as an `errors` prop. `FormDialog` renders the error message beneath each field
slot using the field's `name` attribute as the lookup key.

**Alternatives considered**: Server-only validation (violates FR-003), react-hook-form (scope
too large for Phase 5).

---

### 3. MongoDB Index Strategy

**Decision**: Add `{ active: 1, order: 1 }` compound index and `{ createdAt: -1 }` index to all
content-type schemas; add explicit `{ email: 1 }` unique index to `Admin`.

**Why**: Public website endpoints filter on `active` and sort on `order`. Admin endpoints sort by
`createdAt`. These are the two most common query shapes. Compound index on `(active, order)` is
more efficient than separate indexes for the filtered-then-sorted query.

**How to apply**: Use `ServiceSchema.index({ active: 1, order: 1 })` and
`ServiceSchema.index({ createdAt: -1 })` after schema definition in each model file. Mongoose
creates these on connection startup if they do not yet exist (idempotent).

**Alternatives considered**: Text search indexes (out of scope v1), Atlas Search (out of scope v1).

---

### 4. Admin API Base URL

**Decision**: Replace hardcoded `'http://localhost:5000'` in `src/admin/services/api.js` with
`process.env.REACT_APP_API_URL || 'http://localhost:5000'`.

**Why**: `src/utils/api.js` already uses `REACT_APP_API_URL`; the admin Axios instance doesn't.
Both must be configurable before production deployment.

**How to apply**: Single-line change to `baseURL` in `src/admin/services/api.js`. Fallback keeps
local dev working with no `.env` file.

---

### 5. Environment Variables

**Decision**: Create `/env.example` at repo root documenting `REACT_APP_API_URL` and
`REACT_APP_PRIMARY_COLOR`.

**Why**: `backend/.env.example` already exists; frontend equivalent is missing.

**How to apply**: New file at repo root. Does not contain real values.

---

### 6. Deployment Documentation Scope

**Decision**: Write `quickstart.md` as a step-by-step deployment guide covering prerequisites,
local dev, env config, seeding, and production deployment checklist.

**Why**: FR-014 + User Story 4 (SC-006: new developer deploys in <30 min from docs alone).

**How to apply**: Document lives in `specs/005-polish-production-ready/quickstart.md` during
development; to be moved to `docs/deployment.md` or repo root `DEPLOYMENT.md` when accepted.

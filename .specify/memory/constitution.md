<!--
SYNC IMPACT REPORT
==================
Version change: (none) → 1.0.0
Modified principles: N/A (initial authoring from blank template)
Added sections:
  - Core Principles (I–V)
  - Technology Stack Constraints
  - Content Model & File Handling
  - Governance
Removed sections: N/A (initial authoring)
Templates reviewed:
  - .specify/templates/plan-template.md    ✅ Constitution Check section is generic; compatible
  - .specify/templates/spec-template.md    ✅ No constitution-specific constraints; compatible
  - .specify/templates/tasks-template.md   ✅ Phase structure aligns with 5-phase plan order
  - .specify/templates/commands/           ✅ No command files present; nothing to update
Follow-up TODOs:
  - None; all fields resolved from plan.md and CLAUDE.md
-->

# Al-Hady Engineering & Consultation Constitution

## Core Principles

### I. Static-to-Dynamic Migration Integrity
The existing website's visual and UX behavior MUST remain unchanged during the migration
from static `dashboard.js` data to MongoDB-backed API content. Bootstrap-based components,
page layouts, routing, and styles on the main site are frozen — only the data source changes.
Code introduced in Phase 4 MUST NOT refactor, reskin, or restructure existing components
beyond replacing a static data import with an API hook call.

**Rationale**: The client has an approved, production-deployed design. Regressions in layout
or behavior are unacceptable; all change risk MUST be isolated to the data layer.

### II. Strict Style Isolation (Bootstrap vs. TailwindCSS)
TailwindCSS v3 MUST only be used inside `src/admin/**`. Bootstrap classes MUST NOT appear
in any admin component. Tailwind's `content` config MUST be scoped to
`./src/admin/**/*.{js,jsx}` to prevent style bleed into website routes. `shadcn/ui`
base components reside in `src/components/ui/` but MUST be consumed exclusively from admin
pages and admin components — never from website components.

**Rationale**: Bootstrap and TailwindCSS produce conflicting utility class names. Mixing
them in the same render tree causes unpredictable style overrides that cannot be reliably
fixed at runtime. Hard file-path isolation is the only reliable solution.

### III. API-First Content Architecture
All content rendered on the public-facing website MUST be sourced from the Express/MongoDB
backend via REST API. No hardcoded content is permitted in production-path components.
`src/Dashboard/dashboard.js` is retained only as a seed data reference and MUST NOT be
imported by any component after Phase 4 completes. Every content type MUST have a dedicated
React hook (e.g., `useServices()`, `useBanner(page)`) that fetches from the corresponding
`/api/*` endpoint.

**Rationale**: A CMS is only useful if the website actually reads from it. Residual static
imports silently bypass the CMS and cause stale, uneditable content in production.

### IV. Security-by-Default (Admin Access & File Uploads)
All `/admin/*` routes except `/admin/login` MUST be wrapped by `ProtectedRoute`, which
validates the JWT stored in `localStorage` under the key `alhady_admin_token`. The backend
MUST enforce JWT verification middleware on every write endpoint (POST / PUT / PATCH /
DELETE). File uploads MUST validate MIME type (images only: jpeg, png, gif, webp) and
enforce a 5 MB maximum size. Auth endpoints MUST apply rate limiting via
`express-rate-limit`. The backend MUST use `helmet` security headers and sanitize request
inputs with `express-validator`.

**Rationale**: The admin panel controls all public content. An unprotected panel or
unrestricted file upload is a critical vulnerability for a client-facing production system.

### V. Phased Delivery Order (Non-Skippable)
Implementation MUST follow the five phases in sequence:
1. **Phase 1** — Backend Foundation (Express + MongoDB + auth + file upload)
2. **Phase 2** — Admin Dashboard Shell (routing, auth flow, layout, navigation)
3. **Phase 3** — CRUD Pages (all 10 content types fully manageable)
4. **Phase 4** — Website API Integration (all static imports replaced with API hooks)
5. **Phase 5** — Polish & Production Readiness (security hardening, validation, docs)

No phase may be skipped or reordered. Each phase has a defined deliverable that gates the
next. Partial-phase delivery is acceptable for iterative progress, but sequencing is fixed.

**Rationale**: Later phases have hard technical dependencies on earlier ones (e.g., the
website cannot consume an API that does not exist). Skipping phases creates untestable,
broken intermediate states.

## Technology Stack Constraints

The following stack is locked for the duration of this project. Changes require a
constitution amendment (MAJOR or MINOR version bump, depending on scope).

| Layer | Technology | Notes |
|---|---|---|
| Website frontend | React 17, Bootstrap 5, React Router v5, AOS, react-slick | Frozen — no upgrades during CMS migration |
| Admin dashboard | React (CRA), TailwindCSS v3, shadcn/ui, React Router v5 | Admin-only; scoped Tailwind `content` config is mandatory |
| Backend API | Node.js, Express.js, MongoDB, Mongoose | REST endpoints only; no GraphQL |
| Authentication | JWT (jsonwebtoken) + bcrypt | Token stored under key `alhady_admin_token` in localStorage |
| File uploads | Multer (disk storage) | Files served at `/uploads/<filename>` from port 5000 |
| HTTP client | Axios | Frontend → Backend only |
| Package manager | npm | Yarn and pnpm are not permitted |

Design tokens (non-negotiable for admin UI):
- Primary gold: `#D4AF37` / `#c59c17`
- Background: `#000000`
- Headings font: Teko
- Body font: Rubik

## Content Model & File Handling

The system manages 11 content types persisted in MongoDB: Admin, Banner, Service, Tool,
Client, Partner, Team, Review, Portfolio, Project, SiteSettings.

Schemas are defined in `plan.md` (Data Models section) and MUST be implemented exactly as
specified in `backend/models/`. Adding fields to a model is permitted without a constitution
amendment. Removing or renaming existing fields requires a data migration script and a note
in the Sync Impact Report of the next amendment.

File upload rules (all MUST be enforced):
- Files MUST be stored in `backend/uploads/` (gitignored; never committed)
- Files MUST be served as Express static assets at `/uploads/<filename>`
- MongoDB documents MUST reference files as relative paths (`/uploads/<filename>`)
- Files MUST NOT be stored inline (base64) in the database

Seeding rules:
- `backend/seed.js` MUST be idempotent — safe to re-run without creating duplicates
- Default admin credentials seeded: email `admin@alhady-eg.com`, password `admin123`
- Default credentials MUST be changed before any public or client-facing deployment

## Governance

This constitution supersedes any conflicting guidance in `CLAUDE.md`, `plan.md`, or
informal team conventions. When conflicts arise, this document is authoritative.

**Amendment procedure**:
1. Edit this file with the proposed change.
2. Bump `CONSTITUTION_VERSION` according to semantic rules below.
3. Update `LAST_AMENDED_DATE` to the ISO date of the change.
4. Propagate changes to affected templates in `.specify/templates/`.
5. Record the change in the Sync Impact Report HTML comment at the top of this file.

**Versioning policy**:
- MAJOR: Principle removal, redefinition, or stack technology replacement.
- MINOR: New principle, section added, or materially expanded guidance.
- PATCH: Wording clarifications, typo fixes, non-semantic refinements.

**Compliance review**: All PRs MUST reference the affected principle(s) in the PR
description. The "Constitution Check" gate in `plan-template.md` MUST be completed before
any feature plan is approved and implementation begins. Re-check is required after Phase 1
(design) of each feature plan.

**Version**: 1.0.0 | **Ratified**: 2026-05-06 | **Last Amended**: 2026-05-06

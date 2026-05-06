# Implementation Plan: Backend Foundation & Content API

**Branch**: `001-backend-foundation` | **Date**: 2026-05-06 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/001-backend-foundation/spec.md`

## Summary

Build a fully-functional Express.js + MongoDB REST API that provides authenticated CRUD access to all 11 content types, single-file image upload with MIME and size validation, and an idempotent seed script. This is the data and access foundation that gates all subsequent phases (admin dashboard, website API integration, and production hardening).

## Technical Context

**Language/Version**: Node.js 18 LTS, Express 4.x  
**Primary Dependencies**: express, mongoose, jsonwebtoken, bcrypt, multer, cors, dotenv, helmet, express-rate-limit, express-validator  
**Storage**: MongoDB — Atlas cluster for production; local `mongod` for development  
**Testing**: Manual via HTTP client (REST Client / curl / Postman); Jest + supertest available for regression coverage  
**Target Platform**: Node.js process, Windows development / Linux production, port 5000  
**Project Type**: web-service (REST API backend only — no frontend assets in this phase)  
**Performance Goals**: < 500ms p95 read latency (SC-001), < 2s auth (SC-002), < 10s for 5MB upload (SC-003)  
**Constraints**: 5MB max upload, images only (jpeg/png/gif/webp), JWT TTL configurable via env, seed MUST be idempotent  
**Scale/Scope**: Single admin user, 11 content types, hundreds of records at launch

## Constitution Check

### Pre-Design Gate

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Static-to-Dynamic Migration Integrity | ✅ PASS | Backend only — no website components are touched in this phase |
| II. Strict Style Isolation | ✅ PASS | Backend only — no frontend files exist in `backend/` |
| III. API-First Content Architecture | ✅ PASS | This phase establishes the `/api/*` endpoints all content flows through |
| IV. Security-by-Default | ✅ PASS | JWT middleware, helmet, rate-limit on auth, MIME + size validation all specified in FR-002–FR-006 |
| V. Phased Delivery Order | ✅ PASS | This is Phase 1 — correct first step |

**Gate result**: PASS — proceed to Phase 0.

### Post-Design Gate (re-check after Phase 1 design)

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Static-to-Dynamic Migration Integrity | ✅ PASS | Data models match dashboard.js structure exactly; no website code changed |
| II. Strict Style Isolation | ✅ PASS | No CSS/Tailwind in backend |
| III. API-First Content Architecture | ✅ PASS | All 11 content types have GET public + write protected endpoints |
| IV. Security-by-Default | ✅ PASS | Auth middleware covers every write route; upload validates MIME + size; helmet + rate-limit in server.js |
| V. Phased Delivery Order | ✅ PASS | Phase 2 is blocked until `npm start` in `backend/` passes and `node seed.js` succeeds |

**Gate result**: PASS — proceed to implementation.

## Project Structure

### Documentation (this feature)

```text
specs/001-backend-foundation/
├── plan.md              ← this file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
├── contracts/
│   └── api.md           ← REST API contract
└── tasks.md             ← Phase 2 output (/speckit-tasks — not created here)
```

### Source Code (repository root)

```text
backend/
├── package.json
├── server.js                 ← Express app entry: CORS, helmet, rate-limit, routes, static /uploads, error handler
├── .env                      ← MONGO_URI, JWT_SECRET, JWT_EXPIRES_IN, PORT, UPLOAD_DIR (gitignored)
├── .env.example              ← committed template (no secrets)
├── seed.js                   ← idempotent seed from src/Dashboard/dashboard.js
├── middleware/
│   └── auth.js               ← JWT verify middleware (rejects missing/expired/invalid tokens)
├── models/
│   ├── Admin.js
│   ├── Banner.js
│   ├── Service.js
│   ├── Tool.js
│   ├── Client.js
│   ├── Partner.js
│   ├── Team.js
│   ├── Review.js
│   ├── Portfolio.js
│   ├── Project.js
│   └── SiteSettings.js
├── routes/
│   ├── auth.js
│   ├── upload.js
│   ├── banners.js
│   ├── services.js
│   ├── tools.js
│   ├── clients.js
│   ├── partners.js
│   ├── team.js
│   ├── reviews.js
│   ├── portfolio.js
│   ├── projects.js
│   └── settings.js
└── uploads/                  ← served at /uploads/<filename>; gitignored

src/Dashboard/dashboard.js    ← read-only seed source; never imported by backend routes
```

**Structure Decision**: Option 2 (web application) — `backend/` is the isolated Express API. Frontend (`src/`) is untouched in this phase. The `src/Dashboard/dashboard.js` file is read only by `seed.js` via CommonJS `require()` (after a one-time conversion shim or direct data extraction).

## Complexity Tracking

*No constitution violations — table omitted.*

# Research: Backend Foundation & Content API

**Feature**: 001-backend-foundation  
**Date**: 2026-05-06  
**Status**: Complete — all NEEDS CLARIFICATION resolved

---

## 1. MongoDB Connection Strategy

**Decision**: Use Mongoose with Atlas URI via `MONGO_URI` env variable; fall back to local `mongodb://localhost:27017/alhady` for development.

**Rationale**: Mongoose's schema enforcement + middleware hooks are valuable for the `active` flag defaults and `order` field auto-assignment. Atlas is free-tier compatible for this scope.

**Alternatives considered**:
- Native `mongodb` driver — rejected; Mongoose's model abstraction reduces boilerplate across 11 models
- Prisma — rejected; no MongoDB schema migration support at parity with Mongoose

**Startup behavior on failed connection**: `mongoose.connect()` is awaited before `app.listen()`. If the connection fails, the process exits with code 1 and logs the error. This is the correct behavior — an API that cannot reach its database must not accept requests silently.

---

## 2. JWT Implementation

**Decision**: `jsonwebtoken` with `HS256` algorithm. Secret from `JWT_SECRET` env var. TTL from `JWT_EXPIRES_IN` (default `7d`). Token carries `{ id, email }` payload.

**Rationale**: Simple, stateless, fits single-admin use case. HS256 is sufficient for this scope; RS256 adds key management complexity without benefit here.

**Token storage**: Client stores token in `localStorage` under key `alhady_admin_token` (per constitution). Logout is client-side token deletion — no server-side blacklist needed for v1.

**Middleware behavior**: `auth.js` middleware extracts `Authorization: Bearer <token>`, verifies with `jwt.verify()`, attaches `req.admin` on success, returns `401` on any failure (missing, expired, invalid). Applied to all write routes.

**Alternatives considered**:
- Session + cookie — rejected; requires session store, complicates CORS; localStorage JWT is already the team's convention
- Refresh tokens — deferred to Phase 5; adds complexity without v1 requirement

---

## 3. File Upload Strategy

**Decision**: Multer with `diskStorage`. Files land in `backend/uploads/` with a filename sanitized to `Date.now() + '-' + originalname.replace(/\s/g, '-')`. Express serves `backend/uploads/` as static at `/uploads`.

**Filename conflict handling**: Timestamp prefix (`Date.now()`) makes collisions astronomically unlikely without a full UUID. If an exact duplicate timestamp is hit (sub-millisecond), the file is overwritten — acceptable for admin use.

**MIME validation**: Multer `fileFilter` checks `file.mimetype` against `['image/jpeg','image/png','image/gif','image/webp']`. Rejected files return `400` with message "Only image files are allowed."

**Size limit**: Multer `limits.fileSize` set to `5 * 1024 * 1024` (5MB). Oversized requests return `400`.

**Alternatives considered**:
- Cloud storage (S3/Cloudinary) — deferred to Phase 5; adds SDK dependency and account setup
- Base64 inline in MongoDB — rejected by constitution (IV)

---

## 4. Seeding Strategy (idempotency)

**Decision**: For each content type, `seed.js` uses Mongoose `Model.findOneAndUpdate(filter, data, { upsert: true, new: true })` with a unique natural key as the filter. This is safe to re-run.

**Natural keys per type**:
- Admin: `email`
- Banner: `page`
- Service: `title`
- Tool: `title`
- Client: `title`
- Partner: `title`
- Team: `name`
- Review: `name + jobTitle` (composite)
- Portfolio: `title`
- Project: `title`
- SiteSettings: singleton — `updateOne({}, data, { upsert: true })`

**dashboard.js import**: `seed.js` lives in `backend/` and cannot import ES module syntax from `src/Dashboard/dashboard.js`. Solution: `seed.js` uses a local `data/seed-data.js` (CommonJS) that is a manual one-time copy of the data from `dashboard.js`. This file is committed and becomes the canonical seed source.

**Alternatives considered**:
- Mongoose `insertMany` with `ordered: false` — rejected; not idempotent
- Dropping and re-inserting — rejected; destroys any admin-edited data on re-seed

---

## 5. Rate Limiting

**Decision**: `express-rate-limit` applied only to `POST /api/auth/login`. Window: 15 minutes, max: 10 requests per IP.

**Rationale**: Brute-force protection for the single attack surface on the auth endpoint. Other endpoints are either public reads (no auth required) or already protected by JWT.

**Alternatives considered**:
- Global rate limit — rejected; would throttle legitimate bulk content reads from the website

---

## 6. Error Response Format

**Decision**: All error responses use `{ success: false, message: "..." }`. All success responses use `{ success: true, data: ... }` for single items or `{ success: true, data: [...] }` for lists.

**Rationale**: Consistent envelope makes frontend handling uniform across all 11 content types.

---

## 7. Reorder Endpoints

**Decision**: `PATCH /api/:resource/reorder` accepts `{ items: [{ id, order }] }` array. Runs `Promise.all()` of individual `findByIdAndUpdate()` calls.

**Rationale**: Simple and explicit. Avoids complex sort-index recalculation.

**Resources supporting reorder**: services, team, portfolio (per FR-011).

---

## 8. SiteSettings Singleton Pattern

**Decision**: `SiteSettings` model uses `updateOne({}, data, { upsert: true })` everywhere — `GET /api/settings` returns the single document, `PUT /api/settings` upserts it. No `:id` in route.

**Rationale**: There is only ever one document. Treating it as a singleton simplifies client and server logic.

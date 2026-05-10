# Data Model: Polish & Production Readiness

**Feature**: 005-polish-production-ready
**Date**: 2026-05-06

> Phase 5 does not introduce new schemas. This document specifies the **index additions**
> to the 11 existing Mongoose schemas.

---

## Index Strategy

All content-type schemas receive two indexes:

| Index | Fields | Type | Purpose |
|-------|--------|------|---------|
| active_order | `{ active: 1, order: 1 }` | Compound | Covers the most common query: filter active=true, sort by order (used by public website API) |
| created_desc | `{ createdAt: -1 }` | Single-field | Covers admin list view sorting by newest first |

The `Admin` schema receives one index:

| Index | Fields | Type | Purpose |
|-------|--------|------|---------|
| email_unique | `{ email: 1 }` | Unique | Makes the unique constraint explicit at the index level (field-level `unique: true` is currently in place but an explicit index is more reliable) |

---

## Per-Schema Index Additions

### Service (`backend/models/Service.js`)

```js
ServiceSchema.index({ active: 1, order: 1 });
ServiceSchema.index({ createdAt: -1 });
```

### Tool (`backend/models/Tool.js`)

```js
ToolSchema.index({ active: 1, order: 1 });
ToolSchema.index({ createdAt: -1 });
```

### Client (`backend/models/Client.js`)

```js
ClientSchema.index({ active: 1, order: 1 });
ClientSchema.index({ createdAt: -1 });
```

### Partner (`backend/models/Partner.js`)

```js
PartnerSchema.index({ active: 1, order: 1 });
PartnerSchema.index({ createdAt: -1 });
```

### Team (`backend/models/Team.js`)

```js
TeamSchema.index({ active: 1, order: 1 });
TeamSchema.index({ createdAt: -1 });
```

### Review (`backend/models/Review.js`)

```js
ReviewSchema.index({ active: 1, order: 1 });
ReviewSchema.index({ createdAt: -1 });
```

### Portfolio (`backend/models/Portfolio.js`)

```js
PortfolioSchema.index({ active: 1, order: 1 });
PortfolioSchema.index({ createdAt: -1 });
```

### Project (`backend/models/Project.js`)

```js
ProjectSchema.index({ active: 1, order: 1 });
ProjectSchema.index({ createdAt: -1 });
```

### Banner (`backend/models/Banner.js`)

```js
BannerSchema.index({ active: 1, order: 1 });
BannerSchema.index({ createdAt: -1 });
```

### SiteSettings (`backend/models/SiteSettings.js`)

```js
SiteSettingsSchema.index({ createdAt: -1 });
// No order or active fields on SiteSettings (singleton document pattern)
```

### Admin (`backend/models/Admin.js`)

```js
AdminSchema.index({ email: 1 }, { unique: true });
// Reinforces existing field-level unique: true with an explicit index
```

---

## Migration Notes

- Mongoose creates indexes on application startup if they do not yet exist (`autoIndex: true` is
  the default).
- For an Atlas cluster with large existing collections, set `{ background: true }` in the index
  options to avoid blocking the connection during index creation. For this project's scale
  (hundreds of documents), foreground creation is acceptable.
- No data migration required — indexes are additive.
- Re-running `node seed.js` is safe; seed is already idempotent.

---

## No New Schemas

Phase 5 adds no new Mongoose schemas. All 11 content types were finalized in Phase 3.

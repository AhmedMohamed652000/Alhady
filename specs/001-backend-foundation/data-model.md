# Data Model: Backend Foundation & Content API

**Feature**: 001-backend-foundation  
**Date**: 2026-05-06  
**Database**: MongoDB via Mongoose  
**File location**: `backend/models/`

---

## 1. Admin

**File**: `backend/models/Admin.js`  
**Purpose**: Single admin user — credentials for CMS login

```js
{
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },   // bcrypt hash, never returned in responses
  createdAt:    { type: Date, default: Date.now }
}
```

**Seed default**: `email: "admin@alhady-eg.com"`, password `"admin123"` (bcrypt-hashed by seed.js)  
**Notes**: `passwordHash` field must be excluded from all GET responses via `.select('-passwordHash')`. No multi-user or role support in v1.

---

## 2. Banner

**File**: `backend/models/Banner.js`  
**Purpose**: Per-page header image and text

```js
{
  page:            { type: String, required: true, unique: true,
                     enum: ['home','about','service','project','portfolio','team','contact','faq'] },
  title:           { type: String, required: true },
  subtitle:        { type: String, default: '' },
  backgroundImage: { type: String, default: '' },   // /uploads/<filename>
  updatedAt:       { type: Date, default: Date.now }
}
```

**Notes**: 8 fixed pages → 8 documents. `PUT /api/banners/:page` upserts by `page` enum value.

---

## 3. Service

**File**: `backend/models/Service.js`  
**Purpose**: Company service offering with images and display order

```js
{
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  sliderImage: { type: String, default: '' },   // /uploads/<filename>
  cardImage:   { type: String, default: '' },   // /uploads/<filename>
  icon:        { type: String, default: '' },   // /uploads/<filename>
  link:        { type: String, default: '' },
  order:       { type: Number, default: 0 },
  active:      { type: Boolean, default: true },
  createdAt:   { type: Date, default: Date.now }
}
```

**Seed key**: `title`  
**Supports reorder**: yes (`PATCH /api/services/reorder`)

---

## 4. Tool

**File**: `backend/models/Tool.js`  
**Purpose**: Software tool entry shown on the website

```js
{
  title:     { type: String, required: true },
  icon:      { type: String, default: '' },   // /uploads/<filename>
  order:     { type: Number, default: 0 },
  active:    { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}
```

**Seed key**: `title`

---

## 5. Client

**File**: `backend/models/Client.js`  
**Purpose**: Client company logo entry

```js
{
  title:     { type: String, required: true },
  icon:      { type: String, default: '' },   // /uploads/<filename>
  order:     { type: Number, default: 0 },
  active:    { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}
```

**Seed key**: `title`

---

## 6. Partner

**File**: `backend/models/Partner.js`  
**Purpose**: Business partner logo entry

```js
{
  title:     { type: String, required: true },
  icon:      { type: String, default: '' },   // /uploads/<filename>
  order:     { type: Number, default: 0 },
  active:    { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}
```

**Seed key**: `title`

---

## 7. Team

**File**: `backend/models/Team.js`  
**Purpose**: Employee profile

```js
{
  name:         { type: String, required: true },
  position:     { type: String, default: '' },
  profileImage: { type: String, default: '' },   // /uploads/<filename>
  order:        { type: Number, default: 0 },
  active:       { type: Boolean, default: true },
  createdAt:    { type: Date, default: Date.now }
}
```

**Seed key**: `name`  
**Supports reorder**: yes (`PATCH /api/team/reorder`)

---

## 8. Review

**File**: `backend/models/Review.js`  
**Purpose**: Client testimonial

```js
{
  name:        { type: String, required: true },
  jobTitle:    { type: String, default: '' },
  description: { type: String, default: '' },
  image:       { type: String, default: '' },   // /uploads/<filename>
  active:      { type: Boolean, default: true },
  createdAt:   { type: Date, default: Date.now }
}
```

**Seed key**: `name + jobTitle` (composite — `{ name, jobTitle }` filter in seed.js)

---

## 9. Portfolio

**File**: `backend/models/Portfolio.js`  
**Purpose**: Portfolio card shown in portfolio grid

```js
{
  title:           { type: String, required: true },
  serviceCategory: { type: String, default: '' },
  cardImage:       { type: String, default: '' },   // /uploads/<filename>
  order:           { type: Number, default: 0 },
  active:          { type: Boolean, default: true },
  createdAt:       { type: Date, default: Date.now }
}
```

**Seed key**: `title`  
**Supports reorder**: yes (`PATCH /api/portfolio/reorder`)

---

## 10. Project

**File**: `backend/models/Project.js`  
**Purpose**: Detailed project record with variable-length sample gallery

```js
{
  title:           { type: String, required: true },
  serviceCategory: { type: String, default: '' },
  homeCardImage:   { type: String, default: '' },   // /uploads/<filename>
  projectImage:    { type: String, default: '' },   // /uploads/<filename>
  header:          { type: String, default: '' },
  description:     { type: String, default: '' },
  projectDetails: {
    projectType:    { type: String, default: '' },
    client:         { type: String, default: '' },
    year:           { type: String, default: '' },
    location:       { type: String, default: '' },
    projectSize:    { type: String, default: '' },
    projectTime:    { type: String, default: '' },
    peopleWorked:   { type: String, default: '' },
    projectCost:    { type: String, default: '' },
    statisticsIcon: { type: String, default: '' }   // /uploads/<filename>
  },
  projectSamples: [{
    image:       { type: String, default: '' },   // /uploads/<filename>
    title:       { type: String, default: '' },
    description: { type: String, default: '' }
  }],
  order:  { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}
```

**Seed key**: `title`

---

## 11. SiteSettings

**File**: `backend/models/SiteSettings.js`  
**Purpose**: Singleton — global company information

```js
{
  companyName:       { type: String, default: '' },
  phone:             { type: String, default: '' },
  email:             { type: String, default: '' },
  address:           { type: String, default: '' },
  yearsExperience:   { type: Number, default: 0 },
  projectsCompleted: { type: Number, default: 0 },
  teamSize:          { type: Number, default: 0 },
  aboutDescription:  { type: String, default: '' },
  heroTitle:         { type: String, default: '' },
  heroSubtitle:      { type: String, default: '' },
  updatedAt:         { type: Date, default: Date.now }
}
```

**Notes**: Always exactly one document. `GET /api/settings` returns it (or empty defaults). `PUT /api/settings` upserts it with `updateOne({}, data, { upsert: true })`.

---

## State Transitions

`active` flag is supported on all content types except Admin, Banner, and SiteSettings. When `active: false`, the public GET endpoints filter these records out by default.

**Filter applied on public reads**: `.find({ active: true })` — admin reads receive all records (both active and inactive) to enable toggling.

---

## Validation Rules Summary

| Field | Rule |
|-------|------|
| Admin email | required, unique, valid email format |
| Admin password (input) | min 6 characters (validated by express-validator before hashing) |
| Banner page | required, must be one of the 8 enum values |
| File paths | stored as relative URL strings (`/uploads/filename.ext`), not absolute paths |
| Upload MIME | jpeg, png, gif, webp only |
| Upload size | max 5MB |
| order fields | integer ≥ 0, default 0 |

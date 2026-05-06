# Data Model: CRUD Content Management Pages

**Feature**: `003-crud-content-management`  
**Date**: 2026-05-06  
**Source**: `backend/models/` — all schemas are fully implemented

> All entities below are already persisted in MongoDB via Mongoose. This document is the authoritative reference for form field design and API payload structure.

---

## Entity Overview

| Entity | Collection | Pattern | Reorder? | Active Flag? | Singleton? |
|--------|-----------|---------|---------|-------------|-----------|
| Banner | `banners` | Upsert per page | No | No | Per page (8 pages) |
| Service | `services` | List | Yes | Yes | No |
| Tool | `tools` | List | Yes | Yes | No |
| Client | `clients` | List | Yes | Yes | No |
| Partner | `partners` | List | Yes | Yes | No |
| Team | `team` | List | Yes | Yes | No |
| Review | `reviews` | List | No | Yes | No |
| Portfolio | `portfolio` | List | Yes | Yes | No |
| Project | `projects` | List | No | Yes | No |
| SiteSettings | `sitesettings` | Singleton | No | No | Yes (global) |

---

## Entity Schemas

### Banner
**File**: `backend/models/Banner.js`  
**Endpoint**: `PUT /api/banners/:page` (upsert)  
**Page values**: `home | about | service | project | portfolio | team | contact | faq`

| Field | Type | Required | Notes |
|-------|------|---------|-------|
| `page` | String (enum) | Yes | One of 8 page slugs; unique index |
| `title` | String | No | Banner heading |
| `subtitle` | String | No | Banner subheading |
| `backgroundImage` | String | No | Relative path `/uploads/<file>` |
| `updatedAt` | Date | Auto | Set on every save |

**Form fields**: `title`, `subtitle`, `backgroundImage` (image upload)

---

### Service
**File**: `backend/models/Service.js`  
**Endpoints**: `GET /api/services`, `POST /api/services`, `PUT /api/services/:id`, `DELETE /api/services/:id`, `PATCH /api/services/reorder`

| Field | Type | Required | Notes |
|-------|------|---------|-------|
| `title` | String | Yes | Service name |
| `description` | String | No | Long text |
| `sliderImage` | String | No | `/uploads/<file>` — used in sliders |
| `cardImage` | String | No | `/uploads/<file>` — used in cards |
| `icon` | String | No | `/uploads/<file>` — SVG/icon |
| `link` | String | No | External URL |
| `order` | Number | Default: 0 | Display sequence |
| `active` | Boolean | Default: true | Visibility flag |
| `createdAt` | Date | Auto | |

**Reorder payload**: `PATCH /api/services/reorder` → `{ items: [{ id, order }] }`

---

### Tool
**File**: `backend/models/Tool.js`  
**Endpoints**: `GET /api/tools`, `POST /api/tools`, `PUT /api/tools/:id`, `DELETE /api/tools/:id`

| Field | Type | Required | Notes |
|-------|------|---------|-------|
| `title` | String | Yes | Tool/technology name |
| `icon` | String | No | `/uploads/<file>` |
| `order` | Number | Default: 0 | |
| `active` | Boolean | Default: true | |
| `createdAt` | Date | Auto | |

---

### Client
**File**: `backend/models/Client.js`  
**Endpoints**: `GET /api/clients`, `POST /api/clients`, `PUT /api/clients/:id`, `DELETE /api/clients/:id`

| Field | Type | Required | Notes |
|-------|------|---------|-------|
| `title` | String | Yes | Client/company name |
| `icon` | String | No | `/uploads/<file>` — logo |
| `order` | Number | Default: 0 | |
| `active` | Boolean | Default: true | |
| `createdAt` | Date | Auto | |

---

### Partner
**File**: `backend/models/Partner.js`  
**Endpoints**: `GET /api/partners`, `POST /api/partners`, `PUT /api/partners/:id`, `DELETE /api/partners/:id`

| Field | Type | Required | Notes |
|-------|------|---------|-------|
| `title` | String | Yes | Partner/company name |
| `icon` | String | No | `/uploads/<file>` — logo |
| `order` | Number | Default: 0 | |
| `active` | Boolean | Default: true | |
| `createdAt` | Date | Auto | |

---

### Team
**File**: `backend/models/Team.js`  
**Endpoints**: `GET /api/team`, `POST /api/team`, `PUT /api/team/:id`, `DELETE /api/team/:id`, `PATCH /api/team/reorder`

| Field | Type | Required | Notes |
|-------|------|---------|-------|
| `name` | String | Yes | Full name |
| `position` | String | No | Job title / role |
| `profileImage` | String | No | `/uploads/<file>` |
| `order` | Number | Default: 0 | |
| `active` | Boolean | Default: true | |
| `createdAt` | Date | Auto | |

**Reorder payload**: `PATCH /api/team/reorder` → `{ items: [{ id, order }] }`

---

### Review
**File**: `backend/models/Review.js`  
**Endpoints**: `GET /api/reviews`, `POST /api/reviews`, `PUT /api/reviews/:id`, `DELETE /api/reviews/:id`

| Field | Type | Required | Notes |
|-------|------|---------|-------|
| `name` | String | Yes | Author name |
| `jobTitle` | String | No | Author's job title |
| `description` | String | Yes | Testimonial body text |
| `image` | String | No | `/uploads/<file>` — optional photo |
| `active` | Boolean | Default: true | |
| `createdAt` | Date | Auto | |

---

### Portfolio
**File**: `backend/models/Portfolio.js`  
**Endpoints**: `GET /api/portfolio`, `POST /api/portfolio`, `PUT /api/portfolio/:id`, `DELETE /api/portfolio/:id`, `PATCH /api/portfolio/reorder`

| Field | Type | Required | Notes |
|-------|------|---------|-------|
| `title` | String | Yes | Portfolio item title |
| `serviceCategory` | String | No | Category label |
| `cardImage` | String | No | `/uploads/<file>` |
| `order` | Number | Default: 0 | |
| `active` | Boolean | Default: true | |
| `createdAt` | Date | Auto | |

**Reorder payload**: `PATCH /api/portfolio/reorder` → `{ items: [{ id, order }] }`

---

### Project
**File**: `backend/models/Project.js`  
**Endpoints**: `GET /api/projects`, `GET /api/projects/:id`, `POST /api/projects`, `PUT /api/projects/:id`, `DELETE /api/projects/:id`

| Field | Type | Required | Notes |
|-------|------|---------|-------|
| `title` | String | Yes | Project title |
| `serviceCategory` | String | No | Category label |
| `homeCardImage` | String | No | `/uploads/<file>` — card on home page |
| `projectImage` | String | No | `/uploads/<file>` — hero on project page |
| `header` | String | No | Project page header |
| `description` | String | No | Full project description |
| `projectDetails` | Object | No | See sub-fields below |
| `projectSamples` | Array | No | See sub-fields below |
| `order` | Number | Default: 0 | |
| `active` | Boolean | Default: true | |
| `createdAt` | Date | Auto | |

**projectDetails** sub-object:

| Field | Type |
|-------|------|
| `projectType` | String |
| `client` | String |
| `year` | String |
| `location` | String |
| `projectSize` | String |
| `projectTime` | String |
| `peopleWorked` | String |
| `projectCost` | String |
| `statisticsIcon` | String (`/uploads/<file>`) |

**projectSamples** array item:

| Field | Type |
|-------|------|
| `image` | String (`/uploads/<file>`) |
| `title` | String |
| `description` | String |

---

### SiteSettings
**File**: `backend/models/SiteSettings.js`  
**Endpoints**: `GET /api/settings`, `PUT /api/settings` (upsert singleton)

| Field | Type | Required | Notes |
|-------|------|---------|-------|
| `companyName` | String | No | |
| `phone` | String | No | |
| `email` | String | No | |
| `address` | String | No | |
| `yearsExperience` | Number | No | Statistic |
| `projectsCompleted` | Number | No | Statistic |
| `teamSize` | Number | No | Statistic |
| `aboutDescription` | String | No | |
| `heroTitle` | String | No | Homepage hero heading |
| `heroSubtitle` | String | No | Homepage hero subheading |
| `updatedAt` | Date | Auto | |

---

## Shared Frontend State Shapes

### Standard List Item
```js
{
  _id: string,
  title: string,
  icon: string,       // URL or empty string
  order: number,
  active: boolean,
  createdAt: string
}
```

### Form Empty State (example: Client)
```js
{
  title: '',
  icon: '',
  order: 0,
  active: true
}
```

### reorderPayload
```js
// Sent to PATCH /api/*/reorder after user edits order values
{ items: [{ id: string, order: number }] }
```

---

## Validation Rules (Client-side, FR-003)

| Entity | Required Fields |
|--------|----------------|
| Banner | None (all optional; page determined by tab) |
| Service | `title` |
| Tool | `title` |
| Client | `title` |
| Partner | `title` |
| Team | `name` |
| Review | `name`, `description` |
| Portfolio | `title` |
| Project | `title` |
| SiteSettings | None (all optional; singleton always exists) |

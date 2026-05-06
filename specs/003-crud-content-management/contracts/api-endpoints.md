# API Contracts: CRUD Content Management

**Feature**: `003-crud-content-management`  
**Base URL**: `http://localhost:5000`  
**Auth**: All write endpoints require `Authorization: Bearer <jwt_token>`  
**Axios instance**: `src/admin/services/api.js` (auto-attaches token from `localStorage.alhady_admin_token`)

---

## Authentication

### POST /api/auth/login
Returns JWT token.

**Request**:
```json
{ "email": "admin@alhady-eg.com", "password": "admin123" }
```
**Response 200**:
```json
{ "token": "<jwt>" }
```

---

## Image Upload

### POST /api/upload *(auth required)*
Uploads a single image file. Used by `ImageField` component before form submission.

**Request**: `multipart/form-data` with field `image`  
**Constraints**: MIME type jpeg/png/gif/webp; max 5 MB  
**Response 200**:
```json
{ "url": "/uploads/1714987654321-filename.jpg" }
```
**Response 400** (type/size violation):
```json
{ "error": "Only image files are allowed" }
```

---

## Banners

### GET /api/banners
Returns all banner documents.

**Response 200**: `Banner[]`

### GET /api/banners/:page
Returns single banner for a page slug.  
`page` values: `home | about | service | project | portfolio | team | contact | faq`

**Response 200**: `Banner | {}`

### PUT /api/banners/:page *(auth required)*
Upserts the banner for a page.

**Request**:
```json
{
  "title": "string",
  "subtitle": "string",
  "backgroundImage": "/uploads/<file>"
}
```
**Response 200**: Updated `Banner`

---

## Services

### GET /api/services → `Service[]`

### POST /api/services *(auth required)*
```json
{
  "title": "string (required)",
  "description": "string",
  "sliderImage": "/uploads/<file>",
  "cardImage": "/uploads/<file>",
  "icon": "/uploads/<file>",
  "link": "https://...",
  "order": 0,
  "active": true
}
```
**Response 201**: Created `Service`

### PUT /api/services/:id *(auth required)*
Same body as POST. **Response 200**: Updated `Service`

### DELETE /api/services/:id *(auth required)*
**Response 200**: `{ "message": "Deleted" }`

### PATCH /api/services/reorder *(auth required)*
```json
{ "items": [{ "id": "<id>", "order": 0 }, { "id": "<id>", "order": 1 }] }
```
**Response 200**: `{ "message": "Reordered" }`

---

## Tools

### GET /api/tools → `Tool[]`
### POST /api/tools *(auth required)* → `{ title, icon, order, active }`
### PUT /api/tools/:id *(auth required)*
### DELETE /api/tools/:id *(auth required)*

---

## Clients

### GET /api/clients → `Client[]`
### POST /api/clients *(auth required)* → `{ title, icon, order, active }`
### PUT /api/clients/:id *(auth required)*
### DELETE /api/clients/:id *(auth required)*

---

## Partners

### GET /api/partners → `Partner[]`
### POST /api/partners *(auth required)* → `{ title, icon, order, active }`
### PUT /api/partners/:id *(auth required)*
### DELETE /api/partners/:id *(auth required)*

---

## Team

### GET /api/team → `Team[]`
### POST /api/team *(auth required)* → `{ name, position, profileImage, order, active }`
### PUT /api/team/:id *(auth required)*
### DELETE /api/team/:id *(auth required)*
### PATCH /api/team/reorder *(auth required)* → `{ items: [{ id, order }] }`

---

## Reviews

### GET /api/reviews → `Review[]`
### POST /api/reviews *(auth required)* → `{ name, jobTitle, description, image, active }`
### PUT /api/reviews/:id *(auth required)*
### DELETE /api/reviews/:id *(auth required)*

---

## Portfolio

### GET /api/portfolio → `Portfolio[]`
### POST /api/portfolio *(auth required)* → `{ title, serviceCategory, cardImage, order, active }`
### PUT /api/portfolio/:id *(auth required)*
### DELETE /api/portfolio/:id *(auth required)*
### PATCH /api/portfolio/reorder *(auth required)* → `{ items: [{ id, order }] }`

---

## Projects

### GET /api/projects → `Project[]` (summary list)
### GET /api/projects/:id → `Project` (full detail)

### POST /api/projects *(auth required)*
```json
{
  "title": "string (required)",
  "serviceCategory": "string",
  "homeCardImage": "/uploads/<file>",
  "projectImage": "/uploads/<file>",
  "header": "string",
  "description": "string",
  "projectDetails": {
    "projectType": "string",
    "client": "string",
    "year": "string",
    "location": "string",
    "projectSize": "string",
    "projectTime": "string",
    "peopleWorked": "string",
    "projectCost": "string",
    "statisticsIcon": "/uploads/<file>"
  },
  "projectSamples": [
    { "image": "/uploads/<file>", "title": "string", "description": "string" }
  ],
  "order": 0,
  "active": true
}
```
**Response 201**: Created `Project`

### PUT /api/projects/:id *(auth required)*
Same body. **Response 200**: Updated `Project`

### DELETE /api/projects/:id *(auth required)*
**Response 200**: `{ "message": "Deleted" }`

---

## Settings (Singleton)

### GET /api/settings → `SiteSettings`
### PUT /api/settings *(auth required)*
```json
{
  "companyName": "string",
  "phone": "string",
  "email": "string",
  "address": "string",
  "yearsExperience": 0,
  "projectsCompleted": 0,
  "teamSize": 0,
  "aboutDescription": "string",
  "heroTitle": "string",
  "heroSubtitle": "string"
}
```
**Response 200**: Updated `SiteSettings`

---

## Common Error Responses

| Status | Body | When |
|--------|------|------|
| 400 | `{ "error": "..." }` | Validation failure / bad request |
| 401 | `{ "error": "Unauthorized" }` | Missing or invalid JWT |
| 404 | `{ "error": "Not found" }` | Resource not found |
| 500 | `{ "error": "Internal server error" }` | Unexpected server error |

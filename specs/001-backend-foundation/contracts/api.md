# REST API Contract: Al-Hady Backend

**Base URL**: `http://localhost:5000` (dev) / `https://api.alhady-eg.com` (prod)  
**Feature**: 001-backend-foundation  
**Date**: 2026-05-06

---

## Conventions

### Authentication
Protected endpoints require:
```
Authorization: Bearer <jwt_token>
```
Token is obtained from `POST /api/auth/login`. Any missing, expired, or invalid token returns `401`.

### Response Envelope
```json
// Success
{ "success": true, "data": <object|array> }

// Error
{ "success": false, "message": "<human-readable message>" }
```

### File URLs
All image fields in responses are root-relative strings: `/uploads/<filename>`  
Full URL: `http://localhost:5000/uploads/<filename>`

---

## Authentication

### POST /api/auth/login
Login and receive a JWT.

**Rate limit**: 10 requests / 15 min per IP

**Request**
```json
{ "email": "admin@alhady-eg.com", "password": "admin123" }
```

**Response 200**
```json
{ "success": true, "data": { "token": "<jwt>", "email": "admin@alhady-eg.com" } }
```

**Response 401**
```json
{ "success": false, "message": "Invalid credentials" }
```

---

## File Upload

### POST /api/upload — *protected*
Upload a single image file.

**Request**: `multipart/form-data`  
Field name: `image`  
Accepted MIME types: `image/jpeg`, `image/png`, `image/gif`, `image/webp`  
Max size: 5 MB

**Response 200**
```json
{ "success": true, "data": { "url": "/uploads/1717000000000-photo.jpg" } }
```

**Response 400 — wrong type**
```json
{ "success": false, "message": "Only image files are allowed" }
```

**Response 400 — too large**
```json
{ "success": false, "message": "File too large. Maximum size is 5MB" }
```

**Response 401 — not authenticated**
```json
{ "success": false, "message": "No token provided" }
```

---

## Banners

### GET /api/banners
Returns all 8 banner records.

**Response 200**
```json
{ "success": true, "data": [
  { "_id": "...", "page": "home", "title": "...", "subtitle": "...", "backgroundImage": "/uploads/..." }
]}
```

### PUT /api/banners/:page — *protected*
Update a banner by page slug. Creates if not found (upsert).

`:page` must be one of: `home | about | service | project | portfolio | team | contact | faq`

**Request**
```json
{ "title": "...", "subtitle": "...", "backgroundImage": "/uploads/..." }
```

**Response 200**
```json
{ "success": true, "data": { "_id": "...", "page": "home", "title": "...", ... } }
```

---

## Services

### GET /api/services
Returns all active services ordered by `order`.

### POST /api/services — *protected*
Create a service.

**Request**
```json
{ "title": "...", "description": "...", "sliderImage": "...", "cardImage": "...", "icon": "...", "link": "...", "order": 0 }
```

### PUT /api/services/:id — *protected*
Update a service by MongoDB `_id`.

### DELETE /api/services/:id — *protected*
Delete a service.

**Response 200**
```json
{ "success": true, "data": { "message": "Deleted" } }
```

### PATCH /api/services/reorder — *protected*
Bulk update display order.

**Request**
```json
{ "items": [ { "id": "<_id>", "order": 0 }, { "id": "<_id>", "order": 1 } ] }
```

**Response 200**
```json
{ "success": true, "data": { "message": "Reordered" } }
```

---

## Tools

### GET /api/tools
### POST /api/tools — *protected*
### PUT /api/tools/:id — *protected*
### DELETE /api/tools/:id — *protected*

**Tool shape**:
```json
{ "title": "...", "icon": "/uploads/..." }
```

---

## Clients

### GET /api/clients
### POST /api/clients — *protected*
### PUT /api/clients/:id — *protected*
### DELETE /api/clients/:id — *protected*

**Client shape**:
```json
{ "title": "...", "icon": "/uploads/..." }
```

---

## Partners

### GET /api/partners
### POST /api/partners — *protected*
### PUT /api/partners/:id — *protected*
### DELETE /api/partners/:id — *protected*

**Partner shape**:
```json
{ "title": "...", "icon": "/uploads/..." }
```

---

## Team

### GET /api/team
### POST /api/team — *protected*
### PUT /api/team/:id — *protected*
### DELETE /api/team/:id — *protected*

### PATCH /api/team/reorder — *protected*

**Team member shape**:
```json
{ "name": "...", "position": "...", "profileImage": "/uploads/..." }
```

---

## Reviews

### GET /api/reviews
### POST /api/reviews — *protected*
### PUT /api/reviews/:id — *protected*
### DELETE /api/reviews/:id — *protected*

**Review shape**:
```json
{ "name": "...", "jobTitle": "...", "description": "...", "image": "/uploads/..." }
```

---

## Portfolio

### GET /api/portfolio
### POST /api/portfolio — *protected*
### PUT /api/portfolio/:id — *protected*
### DELETE /api/portfolio/:id — *protected*

### PATCH /api/portfolio/reorder — *protected*

**Portfolio item shape**:
```json
{ "title": "...", "serviceCategory": "...", "cardImage": "/uploads/..." }
```

---

## Projects

### GET /api/projects
Returns list with abbreviated fields (no `projectSamples` gallery to keep list responses small).

### GET /api/projects/:id
Returns full project including `projectSamples` array.

### POST /api/projects — *protected*
### PUT /api/projects/:id — *protected*
### DELETE /api/projects/:id — *protected*

**Project shape**:
```json
{
  "title": "...",
  "serviceCategory": "...",
  "homeCardImage": "/uploads/...",
  "projectImage": "/uploads/...",
  "header": "...",
  "description": "...",
  "projectDetails": {
    "projectType": "...", "client": "...", "year": "2024",
    "location": "...", "projectSize": "...", "projectTime": "...",
    "peopleWorked": "...", "projectCost": "...", "statisticsIcon": "/uploads/..."
  },
  "projectSamples": [
    { "image": "/uploads/...", "title": "...", "description": "..." }
  ]
}
```

---

## Site Settings

### GET /api/settings
Returns the singleton settings document.

### PUT /api/settings — *protected*
Upserts the singleton.

**Settings shape**:
```json
{
  "companyName": "Al-Hady Engineering",
  "phone": "+20 ...",
  "email": "info@alhady-eg.com",
  "address": "...",
  "yearsExperience": 10,
  "projectsCompleted": 150,
  "teamSize": 20,
  "aboutDescription": "...",
  "heroTitle": "...",
  "heroSubtitle": "..."
}
```

---

## Common Error Responses

| Status | Scenario |
|--------|----------|
| 400 | Validation failure, bad request body, wrong file type, file too large |
| 401 | Missing or invalid JWT on a protected route |
| 404 | Resource not found by ID |
| 500 | Unhandled server error (always returns JSON, never crashes) |

All 500 responses return:
```json
{ "success": false, "message": "Internal server error" }
```

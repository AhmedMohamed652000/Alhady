# API Contract: Admin Dashboard Shell (Consumer View)

**Feature**: 002-admin-dashboard-shell
**Date**: 2026-05-06
**Role**: This phase is an API **consumer**, not a producer. All endpoints listed below are defined by `specs/001-backend-foundation/contracts/api.md` and served by the Phase 1 backend on `http://localhost:5000`.

---

## Axios Instance Configuration

All requests from this phase use the shared Axios instance in `src/admin/services/api.js`:

```
baseURL: http://localhost:5000
Content-Type: application/json (default)
Authorization: Bearer <token>   (injected by request interceptor when token exists)
```

---

## Endpoints Called by This Phase

### 1. Login

**Used by**: `LoginPage.jsx`

```
POST /api/auth/login
Content-Type: application/json

Body:
{
  "email":    string,   // admin email
  "password": string    // plaintext password (HTTPS in production)
}

Success 200:
{
  "success": true,
  "data": {
    "token": string     // JWT; stored in localStorage as 'alhady_admin_token'
  }
}

Failure 401:
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Client handling**: On success, call `setToken(data.token)` then redirect to `/admin/dashboard`. On failure, display `message` inline beneath the form.

---

### 2. Dashboard Content Counts

**Used by**: `DashboardPage.jsx` — fires all requests in parallel via `Promise.all`

Each endpoint returns the full array for that content type. The count is derived as `response.data.data.length`.

| Request | Endpoint | Count Label |
|---------|----------|-------------|
| `GET /api/banners` | Public, no auth required | Banners |
| `GET /api/services` | Public | Services |
| `GET /api/tools` | Public | Tools |
| `GET /api/clients` | Public | Clients |
| `GET /api/partners` | Public | Partners |
| `GET /api/team` | Public | Team Members |
| `GET /api/reviews` | Public | Reviews |
| `GET /api/portfolio` | Public | Portfolio Items |
| `GET /api/projects` | Public | Projects |

**Response shape** (identical for all list endpoints):
```
200:
{
  "success": true,
  "data": [ ...array of documents... ]
}
```

**Error handling**: If any individual request fails (network error or non-200 status), catch the error silently and show `—` for that count. Do not block the dashboard render.

---

## Endpoints NOT Called by This Phase

The following endpoints exist in the Phase 1 backend but are NOT used until Phase 3 (CRUD pages):

- `POST /api/:resource` — create
- `PUT /api/:resource/:id` — update
- `DELETE /api/:resource/:id` — delete
- `PATCH /api/:resource/reorder` — reorder
- `POST /api/upload` — file upload
- `GET /api/settings` — site settings (consumed in Phase 3 `SettingsPage`)

---

## Error Response Contract

All backend error responses follow:
```json
{
  "success": false,
  "message": "Human-readable error description"
}
```

The Axios response interceptor in `api.js` handles the 401 case globally. All other error statuses are handled locally by each component that makes the request.

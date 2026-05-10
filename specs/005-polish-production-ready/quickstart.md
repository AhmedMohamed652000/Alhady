# Deployment Guide — Al-Hady Engineering & Consultation CMS

**Version**: Phase 5 | **Date**: 2026-05-06

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | 18+ | Backend and frontend build |
| npm | 9+ | Bundled with Node |
| MongoDB | 6+ | Local or Atlas cluster |
| Git | 2+ | Source checkout |

---

## 1. Clone and Install

```bash
git clone <repo-url> alhady
cd alhady

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..
```

---

## 2. Configure Environment Variables

### Backend (`backend/.env`)

Copy the example file and fill in your values:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

| Variable | Example | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Port the Express server listens on |
| `MONGO_URI` | `mongodb+srv://...` | MongoDB connection string |
| `JWT_SECRET` | *(random 32+ chars)* | Secret used to sign JWT tokens — CHANGE THIS |
| `JWT_EXPIRES_IN` | `7d` | Token expiry duration |
| `UPLOAD_DIR` | `uploads` | Directory under `backend/` where uploaded files are stored |

> **Security note**: `JWT_SECRET` MUST be a long, random string. Never commit `.env` to git.
> Default admin credentials (`admin@alhady-eg.com` / `admin123`) MUST be changed before
> any public deployment.

### Frontend (`.env` at repo root)

```bash
cp .env.example .env
```

Edit `.env`:

| Variable | Example | Description |
|----------|---------|-------------|
| `REACT_APP_API_URL` | `http://localhost:5000` (dev) or `https://api.yourdomain.com` (prod) | Backend API base URL used by both website hooks and admin panel |
| `REACT_APP_PRIMARY_COLOR` | `#D4AF37` | Brand accent color (optional — falls back to default) |

---

## 3. Seed the Database

```bash
cd backend
node seed.js
```

The seed script is idempotent — safe to re-run without creating duplicates. It creates:
- Default admin: `admin@alhady-eg.com` / `admin123`
- Sample records for all 11 content types

> **Action required**: Log into `/admin/settings` and update the default admin password
> immediately after seeding on any non-local environment.

---

## 4. Start in Development

```bash
# Terminal 1 — backend
cd backend && npm start   # :5000

# Terminal 2 — frontend
npm start                 # :3000
```

Admin panel: `http://localhost:3000/admin`
Public website: `http://localhost:3000`

Uploaded files are served from: `http://localhost:5000/uploads/<filename>`

---

## 5. Production Build

### Frontend

```bash
npm run build
```

Produces a static build in `build/`. Deploy this to:
- Netlify / Vercel: drag-and-drop or connect the repo
- Nginx: serve `build/` as the document root with a catch-all `try_files` for React Router
- S3 + CloudFront: upload `build/` contents; set error page to `index.html`

**Set environment variables on your static host** before building:
- `REACT_APP_API_URL` must point to your production backend URL

> CRA embeds environment variables at build time. If you change `REACT_APP_API_URL`,
> you must rebuild and redeploy the frontend.

### Backend

```bash
cd backend
NODE_ENV=production npm start  # or: node server.js
```

For production, use a process manager:

```bash
npm install -g pm2
pm2 start server.js --name alhady-api
pm2 save
pm2 startup
```

Set `NODE_ENV=production` and configure `backend/.env` with your production values.

---

## 6. Nginx Reverse Proxy (Optional)

To serve both frontend and backend on a single domain:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Serve React build
    root /var/www/alhady/build;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    # Proxy API requests to Express
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Serve uploaded files directly from Express
    location /uploads/ {
        proxy_pass http://localhost:5000;
    }
}
```

---

## 7. Production Checklist

Before going live, verify each item:

- [ ] `JWT_SECRET` is a long random string (not the default)
- [ ] Default admin password has been changed via admin panel
- [ ] `MONGO_URI` points to a secured Atlas cluster (IP whitelist configured)
- [ ] `REACT_APP_API_URL` in the deployed frontend points to production backend
- [ ] `backend/uploads/` is NOT committed to git (`.gitignore` covers it)
- [ ] HTTPS is configured (Let's Encrypt via Certbot or host-provided SSL)
- [ ] Backend is running under pm2 or equivalent process manager
- [ ] Rate limiting is active (default: 10 login attempts per 15 minutes per IP)
- [ ] Security headers are active (helmet is enabled by default in `server.js`)

---

## 8. Uploaded Files

Files uploaded through the admin panel are stored at `backend/uploads/<filename>`.

- **Backup**: Include `backend/uploads/` in your backup strategy — these files are not in git
- **CDN**: For production performance, consider proxying `/uploads/` through a CDN
- **Migration**: If you move the backend server, copy the `uploads/` directory and update
  `UPLOAD_DIR` in `.env` if the path changes

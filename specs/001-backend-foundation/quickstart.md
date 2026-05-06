# Quickstart: Backend Foundation

**Feature**: 001-backend-foundation  
**Prerequisite**: MongoDB running locally (`mongod`) or an Atlas URI ready

---

## 1. Initialize the backend folder

```bash
mkdir backend
cd backend
npm init -y
```

## 2. Install dependencies

```bash
npm install express mongoose jsonwebtoken bcrypt multer cors dotenv helmet express-rate-limit express-validator
npm install --save-dev nodemon
```

## 3. Create environment file

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

`.env.example` content:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/alhady
JWT_SECRET=change_me_before_production
JWT_EXPIRES_IN=7d
UPLOAD_DIR=uploads
```

> **Security**: Never commit `.env`. It is gitignored.

## 4. Create the uploads folder

```bash
mkdir uploads
```

Add `backend/uploads/` to `.gitignore` (the contents are not committed).

## 5. Start the server

```bash
# development (auto-reload)
npx nodemon server.js

# production
node server.js
```

Server starts on `http://localhost:5000`. Verify:
```bash
curl http://localhost:5000/api/services
# → { "success": true, "data": [] }
```

## 6. Seed the database

```bash
# from backend/ folder
node seed.js
```

Expected output:
```
Connected to MongoDB
Seeding admin...
Seeding services (10 items)...
Seeding tools...
...
Seed complete.
```

Safe to re-run — existing records are updated in place, not duplicated.

## 7. Test authentication

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@alhady-eg.com","password":"admin123"}'
```

Copy the returned token. Use it for protected routes:

```bash
TOKEN="<paste token here>"

# Test protected route
curl -X POST http://localhost:5000/api/services \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Service","description":"Test"}'
```

## 8. Test file upload

```bash
curl -X POST http://localhost:5000/api/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@/path/to/photo.jpg"
# → { "success": true, "data": { "url": "/uploads/1717000000000-photo.jpg" } }
```

Verify the file is accessible:
```bash
curl http://localhost:5000/uploads/1717000000000-photo.jpg
# → binary image data
```

---

## Folder structure after setup

```
backend/
├── .env              ← not committed
├── .env.example      ← committed
├── package.json
├── server.js
├── seed.js
├── middleware/
│   └── auth.js
├── models/           ← 11 Mongoose model files
├── routes/           ← 12 route files (auth, upload, + 10 content types)
└── uploads/          ← not committed; served at /uploads/*
```

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan

## Project
Al-Hady Engineering & Consultation — BIM engineering company website + admin CMS.

## Stack
- Website: React 17, Bootstrap 5, React Router v5, AOS, react-slick
- Admin Dashboard: React, TailwindCSS v3, shadcn/ui
- Backend: Node.js, Express.js, MongoDB, Mongoose, JWT, Multer
- Package manager: npm

## Key Files
- `plan.md` — full implementation plan (phases 1–5)
- `specs/001-backend-foundation/plan.md` — active feature plan (backend foundation)
- `src/Dashboard/dashboard.js` — current static data (seed source)
- `src/main-component/router/index.js` — all routes
- `src/main-component/App/App.js` — app entry

## Commands
```bash
# Frontend (existing website + admin)
npm start          # :3000
npm run build

# Backend
cd backend
npm start          # :5000
node seed.js       # seed MongoDB from dashboard.js
```

## Design Tokens
- Primary gold: #D4AF37 / #c59c17
- Background: #000000
- Font headings: Teko
- Font body: Rubik

## Important Rules
- TailwindCSS is ONLY used inside `src/admin/**` — never in website components (Bootstrap conflict)
- shadcn/ui components go in `src/components/ui/`
- Admin routes are all under `/admin/*`
- Images uploaded via admin go to `backend/uploads/`, served at `/uploads/<file>`
- JWT stored in localStorage key: `alhady_admin_token`
<!-- SPECKIT END -->

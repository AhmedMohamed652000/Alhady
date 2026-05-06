# Quickstart: Admin Dashboard Shell

**Feature**: 002-admin-dashboard-shell
**Prerequisites**:
- Phase 1 backend running on port 5000 (`cd backend && npm start`)
- Node.js 18+ and npm installed
- Frontend dependencies installed (`npm install` at project root)

---

## 1. Install TailwindCSS (if not already installed)

Run from the **project root** (not `backend/`):

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

This creates `tailwind.config.js` and `postcss.config.js` at the project root.

## 2. Configure Tailwind content scope

Edit `tailwind.config.js` — set `content` to admin files only (mandatory per Constitution II):

```js
module.exports = {
  content: ['./src/admin/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: { DEFAULT: '#D4AF37', dark: '#c59c17' },
      },
      fontFamily: {
        heading: ['Teko', 'sans-serif'],
        body: ['Rubik', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

> **Why scoped content?** Bootstrap and TailwindCSS share some class names. Scoping `content` to `src/admin/**` means Tailwind only generates classes referenced in admin files, preventing style bleed into website components.

## 3. Create the Tailwind CSS entry file

```bash
mkdir -p src/admin
```

Create `src/admin/admin.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Import this file at the top of `src/admin/components/AdminLayout.jsx` (not in `index.js` or `App.js`).

## 4. Install additional dependencies

```bash
npm install axios jwt-decode lucide-react
```

For shadcn/ui base components (Button, Card, Input, Label), copy or generate them into `src/components/ui/`. Minimum components needed for this phase:

```bash
# If using shadcn CLI (adjust for CRA):
npx shadcn@latest add button card input label
# Or manually copy component files from shadcn's GitHub into src/components/ui/
```

## 5. Start the frontend

```bash
npm start
```

Application starts on `http://localhost:3000`. Admin panel is available at `http://localhost:3000/admin`.

## 6. Verify the login flow

1. Navigate to `http://localhost:3000/admin/login`
2. Enter credentials: `admin@alhady-eg.com` / `admin123` (seeded by Phase 1)
3. Verify redirect to `http://localhost:3000/admin/dashboard`
4. Verify dashboard shows content counts (non-zero after `node backend/seed.js`)
5. Refresh the page — verify session persists without re-login
6. Click logout — verify redirect to `/admin/login`
7. Attempt to navigate to `http://localhost:3000/admin/dashboard` without logging in — verify redirect to `/admin/login`

## 7. Verify route protection

```bash
# Direct URL access test (unauthenticated)
# Clear localStorage in browser DevTools first: localStorage.removeItem('alhady_admin_token')
# Then navigate to: http://localhost:3000/admin/services
# Expected: redirect to /admin/login
```

## 8. Verify style isolation

Open browser DevTools on any **website** page (e.g., `http://localhost:3000/`). Confirm no Tailwind utility classes appear in website component markup. Website components should only use Bootstrap class names (`container`, `row`, `col-*`, etc.).

---

## Folder structure after setup

```
src/
├── admin/
│   ├── admin.css                ← Tailwind directives (imported only in AdminLayout)
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   └── [10 stub pages].jsx
│   ├── components/
│   │   ├── AdminLayout.jsx
│   │   ├── Sidebar.jsx
│   │   ├── TopBar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── hooks/
│   │   └── useAuth.js
│   └── services/
│       └── api.js
└── components/
    └── ui/
        ├── button.jsx
        ├── card.jsx
        ├── input.jsx
        └── label.jsx
```

---

## Troubleshooting

**Tailwind styles not applying in admin components**
- Verify `tailwind.config.js` `content` includes `./src/admin/**/*.{js,jsx}`
- Verify `admin.css` is imported in `AdminLayout.jsx`
- Restart the dev server after changing `tailwind.config.js`

**Login succeeds but stays on login page**
- Check browser console for errors
- Verify the backend is running on port 5000
- Check that `localStorage.getItem('alhady_admin_token')` is set after login (DevTools > Application > Local Storage)

**Dashboard counts all show `—`**
- Verify the backend is running and seeded (`node backend/seed.js`)
- Check the Network tab for 401 or CORS errors on the GET requests
- Confirm the backend has CORS configured to allow `http://localhost:3000`

**Bootstrap styles broken on website pages after adding Tailwind**
- Verify `tailwind.config.js` `content` is scoped to `./src/admin/**` only
- Verify `admin.css` is NOT imported in `src/index.js` or `src/App.js`

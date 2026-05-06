# Research: Admin Dashboard Shell

**Feature**: 002-admin-dashboard-shell
**Date**: 2026-05-06
**Status**: Complete — all NEEDS CLARIFICATION resolved

---

## 1. ProtectedRoute Pattern with React Router v5

**Decision**: Implement `ProtectedRoute` as a wrapper component that reads the token from `localStorage` synchronously on render. If the token is absent, it renders a `<Redirect to="/admin/login" />` instead of the protected component. No async token validation is performed client-side — the next API call that returns 401 handles expired tokens.

**Implementation**:
```jsx
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem('alhady_admin_token');
  return (
    <Route {...rest} render={props =>
      token ? <Component {...props} /> : <Redirect to="/admin/login" />
    } />
  );
};
```

**Rationale**: React Router v5 does not have an `Outlet`-based nested routing model (that is v6). The render-prop pattern on `<Route>` is the canonical v5 approach. Synchronous localStorage read on every render is acceptable — it is < 1ms and the session expiry case is handled by the Axios 401 interceptor.

**Alternatives considered**:
- React Context for auth state — useful for derived UI (showing username), but not required for basic route protection; added complexity without v1 requirement
- Cookie-based session — not applicable; JWT in localStorage is the project convention

---

## 2. TailwindCSS v3 in Create React App (No Eject)

**Decision**: Install TailwindCSS v3 with PostCSS via `npm install -D tailwindcss postcss autoprefixer` and initialize with `npx tailwindcss init -p`. This generates `tailwind.config.js` and `postcss.config.js` at the project root. CRA 5.x supports PostCSS config out of the box via `react-scripts`.

**Content scoping** (mandatory per Constitution II):
```js
// tailwind.config.js
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

**CSS entry point**: Create `src/admin/admin.css` with the Tailwind directives. Import it only from admin entry files (e.g., `AdminLayout.jsx`). This keeps Tailwind styles out of the main `index.css` / `App.css`.

```css
/* src/admin/admin.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Rationale**: Scoping `content` to `./src/admin/**` means Tailwind's JIT mode only generates classes referenced in admin files. Bootstrap utility classes in website files are never purged or interfered with.

**Alternatives considered**:
- TailwindCSS with CSS Modules — unnecessary; JIT purge with scoped `content` achieves the same isolation
- Ejecting CRA — rejected; adds maintenance burden; PostCSS config without ejecting is sufficient

---

## 3. shadcn/ui Integration in CRA

**Decision**: shadcn/ui components are manually copied (or generated via `npx shadcn@latest add <component>`) into `src/components/ui/`. Because CRA does not support the Next.js server-component model, only the React client components from shadcn are used. The CLI works with CRA if `tsconfig.json` or `jsconfig.json` includes path aliases — but since the project uses plain JavaScript, components are copied manually and adjusted to remove TypeScript types.

**Components needed for this phase**:
- `Button` — login form submit, logout
- `Card` — dashboard overview count cards
- `Input` + `Label` — login form fields

**Rationale**: Manual copy-in avoids the CLI's Next.js-specific assumptions and keeps the project free of TypeScript. Components are placed in `src/components/ui/` per the constitution.

**Alternatives considered**:
- Headless UI — rejected; shadcn/ui is already the project's chosen component library
- Radix UI primitives directly — shadcn wraps Radix; starting with shadcn is simpler

---

## 4. Axios Instance + Interceptors

**Decision**: Create a single Axios instance in `src/admin/services/api.js` with `baseURL: 'http://localhost:5000'`. Use a request interceptor to inject `Authorization: Bearer <token>` if a token exists in localStorage. Use a response interceptor to catch 401 errors and redirect to `/admin/login`.

```js
const api = axios.create({ baseURL: 'http://localhost:5000' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('alhady_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('alhady_admin_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);
```

**Rationale**: A single shared instance means auth header injection is not duplicated across every API call. The response interceptor handles expired tokens automatically (spec edge case: "session token expires during active use").

**Alternatives considered**:
- Per-request manual header attachment — rejected; error-prone, duplicated code
- React Query + custom fetcher — deferred to Phase 5 polish; not required for the shell

---

## 5. Dashboard Overview — Content Counts

**Decision**: `DashboardPage` fires parallel `GET` requests to all 10 content-type endpoints using `Promise.all`. Each request returns `{ success: true, data: [...] }` — the count is `data.length`. Errors are caught per-request; a failed count shows `—` rather than crashing the page.

**Endpoints polled for counts** (all from Phase 1 backend):
`/api/banners`, `/api/services`, `/api/tools`, `/api/clients`, `/api/partners`, `/api/team`, `/api/reviews`, `/api/portfolio`, `/api/projects`, `/api/settings`

**Rationale**: The backend returns full arrays for all public GET endpoints; `data.length` is a cheap client-side count without a dedicated `/api/:resource/count` endpoint. This avoids adding new backend routes in this phase.

**Alternatives considered**:
- Dedicated `/count` endpoints — deferred to Phase 5 if performance becomes a concern; current dataset sizes make full-array reads negligible
- React Query caching — deferred; not required for the shell

---

## 6. Routing Integration

**Decision**: Admin routes are added at the end of the existing `<Switch>` in `src/main-component/router/index.js`. A catch-all `/admin` redirect routes to `/admin/login`. The `AdminLayout` component wraps all protected admin routes and renders the sidebar + top bar.

**Route list**:
| Path | Component | Protected |
|------|-----------|-----------|
| `/admin/login` | `LoginPage` | No |
| `/admin` | Redirect → `/admin/login` | No |
| `/admin/dashboard` | `AdminLayout` > `DashboardPage` | Yes |
| `/admin/banners` | `AdminLayout` > `BannersPage` | Yes |
| `/admin/services` | `AdminLayout` > `ServicesPage` | Yes |
| `/admin/tools` | `AdminLayout` > `ToolsPage` | Yes |
| `/admin/clients` | `AdminLayout` > `ClientsPage` | Yes |
| `/admin/partners` | `AdminLayout` > `PartnersPage` | Yes |
| `/admin/team` | `AdminLayout` > `TeamPage` | Yes |
| `/admin/reviews` | `AdminLayout` > `ReviewsPage` | Yes |
| `/admin/portfolio` | `AdminLayout` > `PortfolioPage` | Yes |
| `/admin/projects` | `AdminLayout` > `ProjectsPage` | Yes |
| `/admin/settings` | `AdminLayout` > `SettingsPage` | Yes |

**Rationale**: Placing admin routes after all website routes means the existing website is unaffected. The `/admin` base redirect covers direct navigation to the base path.

---

## 7. Design Token Application

**Decision**: Design tokens are applied via Tailwind's `theme.extend` (in `tailwind.config.js`) and via CSS custom properties in `admin.css`. This avoids hardcoding hex values in every component.

**Token mapping**:
- Background: `bg-black` (Tailwind default) — admin layout wrapper
- Primary gold: `text-gold` / `bg-gold` via custom color `gold: '#D4AF37'`
- Headings: `font-heading` via custom font family `Teko`
- Body: `font-body` via custom font family `Rubik`

Fonts are already loaded via the website's `index.html` (Google Fonts import assumed from existing site). No additional font loading needed.

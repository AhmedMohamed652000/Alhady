# Data Model: Admin Dashboard Shell

**Feature**: 002-admin-dashboard-shell
**Date**: 2026-05-06
**Storage**: Client-side only (localStorage + React component state)
**Note**: This phase introduces no new MongoDB models. All backend models are defined in `specs/001-backend-foundation/data-model.md`.

---

## Client-Side State Model

### 1. AdminSession

**Storage**: `localStorage` key `alhady_admin_token`
**Purpose**: Persists the JWT returned by `POST /api/auth/login` across page refreshes; presence signals an active authenticated session.

```
AdminSession {
  token: string          // raw JWT string; absence means unauthenticated
                         // decoded payload: { id, email, iat, exp }
}
```

**Lifecycle**:
| Event | Action |
|-------|--------|
| Successful login | `localStorage.setItem('alhady_admin_token', token)` |
| Logout button clicked | `localStorage.removeItem('alhady_admin_token')` |
| API response 401 | `localStorage.removeItem('alhady_admin_token')` + redirect to `/admin/login` |
| Page load (ProtectedRoute) | `localStorage.getItem('alhady_admin_token')` — redirect if null |

**Notes**: No in-memory auth context store is created in this phase. All reads are direct `localStorage` calls via `useAuth.js` helpers. Adding React Context for derived auth state (e.g., displaying the logged-in email) is deferred to Phase 5.

---

### 2. NavigationItem

**Storage**: Static JavaScript array (not persisted)
**Purpose**: Configuration-driven sidebar link list; avoids hardcoding the same route data in both the sidebar and the router.

```
NavigationItem {
  label: string          // display text (e.g., "Services")
  path:  string          // /admin/<resource> (e.g., "/admin/services")
  icon:  ReactComponent  // lucide-react icon component
}
```

**Static definition** (defined in `Sidebar.jsx` or a `navItems.js` config file):

| label | path | icon |
|-------|------|------|
| Dashboard | /admin/dashboard | LayoutDashboard |
| Banners | /admin/banners | Image |
| Services | /admin/services | Briefcase |
| Tools | /admin/tools | Wrench |
| Clients | /admin/clients | Building |
| Partners | /admin/partners | Handshake |
| Team | /admin/team | Users |
| Reviews | /admin/reviews | MessageSquare |
| Portfolio | /admin/portfolio | FolderOpen |
| Projects | /admin/projects | FolderKanban |
| Settings | /admin/settings | Settings |

**Active link detection**: Compare `NavigationItem.path` against `useLocation().pathname` to apply active styles.

---

### 3. DashboardCounts (transient component state)

**Storage**: `useState` inside `DashboardPage`
**Purpose**: Holds live content counts fetched from the backend on mount.

```
DashboardCounts {
  banners:   number | null    // null while loading or on error
  services:  number | null
  tools:     number | null
  clients:   number | null
  partners:  number | null
  team:      number | null
  reviews:   number | null
  portfolio: number | null
  projects:  number | null
  loading:   boolean
}
```

**Fetch behavior**: `useEffect` on mount fires `Promise.all` of 9 GET requests. Loading spinner shown while `loading: true`. Individual null values render as `—` to avoid crashing the card if one endpoint fails.

---

## Validation Rules

| Input | Rule |
|-------|------|
| Login email | Required; non-empty string; format validated server-side |
| Login password | Required; non-empty string; length validated server-side |
| Token in localStorage | Presence checked synchronously; expiry detected only via 401 response |

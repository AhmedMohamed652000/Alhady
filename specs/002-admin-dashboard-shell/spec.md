# Feature Specification: Admin Dashboard Shell

**Feature Branch**: `002-admin-dashboard-shell`
**Created**: 2026-05-06
**Status**: Draft
**Input**: Phase 2 of Al-Hady Engineering CMS plan — Admin routing, auth flow, layout, and navigation

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Admin Login (Priority: P1)

An admin visits the login page, enters their credentials, and gains access to the management panel. The session persists across page refreshes so the admin does not need to log in repeatedly.

**Why this priority**: Login is the gateway to the entire admin panel. Nothing else is accessible without it.

**Independent Test**: Navigate to /admin/login, enter valid credentials, verify redirection to the dashboard, and confirm the session persists on page refresh.

**Acceptance Scenarios**:

1. **Given** a user on the login page, **When** they enter valid credentials and submit, **Then** they are redirected to the admin dashboard
2. **Given** a user on the login page, **When** they enter invalid credentials, **Then** an error message is shown and they remain on the login page
3. **Given** a logged-in admin who refreshes the page, **When** the page loads, **Then** they remain logged in without re-entering credentials
4. **Given** a logged-in admin, **When** they log out, **Then** they are returned to the login page and cannot access any admin page without logging in again

---

### User Story 2 - Protected Navigation (Priority: P2)

A logged-in admin can navigate between all content management sections using a sidebar. Unauthenticated users who attempt to access any admin page are automatically redirected to the login page.

**Why this priority**: Navigation structure and access protection are the foundation that all content management pages depend on.

**Independent Test**: Verify that direct URL access to /admin/dashboard redirects unauthenticated users to /admin/login, and that a logged-in user sees all navigation links and can use them.

**Acceptance Scenarios**:

1. **Given** a logged-in admin, **When** they view any admin page, **Then** a sidebar displays navigation links to all content sections
2. **Given** an unauthenticated user, **When** they navigate to any /admin/* URL except /admin/login, **Then** they are redirected to /admin/login
3. **Given** a logged-in admin on the login page, **When** the page loads, **Then** they are redirected to the dashboard automatically
4. **Given** a logged-in admin, **When** they click a sidebar link, **Then** they are taken to the corresponding management page

---

### User Story 3 - Dashboard Overview (Priority: P3)

A logged-in admin sees a dashboard home page that provides a quick summary of site content counts, giving them an at-a-glance overview of the managed content.

**Why this priority**: Provides useful orientation but does not block any other functionality. Can be built after navigation is stable.

**Independent Test**: Log in and verify the dashboard page displays content summary cards without errors or blank panels.

**Acceptance Scenarios**:

1. **Given** a logged-in admin on the dashboard, **When** the page loads, **Then** they see summary counts for key content types (services, team members, projects, etc.)
2. **Given** a logged-in admin on the dashboard, **When** the page loads, **Then** no errors are displayed and all summary cards are visible

---

### Edge Cases

- What happens if the session token expires while the admin is actively using the panel?
- What happens when the sidebar is viewed on a small/narrow screen?
- What happens if the backend is unreachable when the admin loads the dashboard?
- What happens if the admin navigates to a /admin/* URL that does not exist?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a login page accessible at `/admin/login` without authentication
- **FR-002**: System MUST authenticate admins by verifying credentials against the backend API
- **FR-003**: System MUST store the session token client-side so it persists across page refreshes
- **FR-004**: System MUST redirect unauthenticated users from any `/admin/*` page to `/admin/login`
- **FR-005**: System MUST redirect already-authenticated users away from `/admin/login` to the dashboard
- **FR-006**: System MUST provide a sidebar with navigation links to all content management sections
- **FR-007**: System MUST provide a dashboard home page showing an overview summary of site content
- **FR-008**: System MUST allow admins to log out, clearing the session token
- **FR-009**: The admin panel MUST visually reflect the Al-Hady brand identity (black background, gold accent colors)
- **FR-010**: The admin panel layout MUST be usable on screens 768px wide and above without horizontal scrolling
- **FR-011**: All backend requests from the admin panel MUST include the session token automatically

### Key Entities

- **Admin Session**: Active authenticated state persisted client-side; grants access to all management functions
- **Navigation Section**: A labeled sidebar link grouping that routes to a content management page

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admin can log in and reach the dashboard in under 3 seconds on a standard broadband connection
- **SC-002**: 100% of unauthenticated attempts to access protected admin URLs are redirected to the login page
- **SC-003**: All sidebar navigation links correctly route to their corresponding management pages
- **SC-004**: The layout renders correctly (no overlap, no broken elements) on screens 768px wide and above

## Assumptions

- A single admin account is sufficient for v1; no user management UI is needed
- The admin panel is a section of the same web application as the public website, not a separate deployment
- Mobile phone screen sizes (below 768px) are not a target for the admin panel in v1
- When a session token expires during active use, the next API call that fails due to expiry redirects the admin to the login page
- The admin panel navigation structure maps one-to-one with the content types defined in Phase 1

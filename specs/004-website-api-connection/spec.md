# Feature Specification: Website API Connection

**Feature Branch**: `004-website-api-connection`
**Created**: 2026-05-06
**Status**: Draft
**Input**: Phase 4 of Al-Hady Engineering CMS plan — Replace all static dashboard.js imports with live API data

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Live Content on the Public Website (Priority: P1)

Website visitors see content that reflects the latest data managed through the admin panel. Any update an admin makes to a content item is visible on the website without a code deployment or manual file change.

**Why this priority**: This is the core purpose of the CMS — making website content live and editable without developer involvement.

**Independent Test**: Update a service title via the admin panel, then visit the public services page and verify the updated title appears without any code change or redeployment.

**Acceptance Scenarios**:

1. **Given** content updated in the admin panel, **When** a visitor loads the corresponding website page, **Then** the updated content is displayed
2. **Given** a visitor loading the home page, **When** the page renders, **Then** the hero banner, services section, and all other data-driven sections show live content from the backend
3. **Given** a content item marked as inactive in the admin, **When** the website renders the relevant section, **Then** that item is not displayed to visitors

---

### User Story 2 - Graceful Loading States (Priority: P2)

While the website is fetching content from the backend, visitors see a placeholder layout indicating the page is loading. This prevents blank sections or layout jumps that degrade the user experience.

**Why this priority**: Loading states significantly affect perceived performance and trust. Avoids showing broken or empty layouts to visitors.

**Independent Test**: Simulate a slow network connection, visit any content-heavy page, and verify a visible loading placeholder appears in each content section before content renders.

**Acceptance Scenarios**:

1. **Given** a visitor loading a page with dynamic content, **When** the content is not yet retrieved, **Then** a visible loading placeholder occupies the content area
2. **Given** content that has finished loading, **When** rendered, **Then** the placeholder is replaced smoothly by the actual content without a jarring layout shift

---

### User Story 3 - Graceful Error Handling (Priority: P3)

If the backend is unavailable or returns an error for a content section, that section shows a user-friendly fallback rather than a broken layout, JavaScript error, or blank space.

**Why this priority**: Error resilience improves robustness; lower priority than core functionality but important for production stability.

**Independent Test**: Stop the backend server, visit the public website, and verify that affected sections display a friendly message instead of errors or blank areas, and that other sections still load normally.

**Acceptance Scenarios**:

1. **Given** the backend is unreachable, **When** the website tries to load a content section, **Then** a user-friendly message is shown in place of the content area
2. **Given** one section's content fetch returns an error, **When** the page renders, **Then** other sections on the same page continue to load and display normally
3. **Given** a visitor navigating to a project detail page for a deleted project, **When** the page loads, **Then** a clear "not found" message is shown rather than a crash

---

### User Story 4 - Environment-Configurable API (Priority: P3)

A developer can switch the website's backend target (development, staging, production) by changing a configuration value without modifying any source code.

**Why this priority**: Required for multi-environment deployments; enables safe testing against different backends.

**Independent Test**: Change the API base URL configuration value, rebuild the frontend, and verify all content fetches target the new URL.

**Acceptance Scenarios**:

1. **Given** a different API base URL set in environment configuration, **When** the frontend is built, **Then** all API requests target the configured URL
2. **Given** no environment override, **When** the frontend is built, **Then** a sensible default URL is used

---

### Edge Cases

- What happens when only some content sections on a page fail to load while others succeed?
- What happens if the API returns an unexpected data structure due to a future backend change?
- What happens when a visitor navigates to a project detail page via a direct URL?
- What happens if content is empty (zero items) for a section that previously had items?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Every website component that currently displays hardcoded static data MUST fetch its content from the backend API
- **FR-002**: The API base URL MUST be configurable via an environment variable, without requiring source code changes
- **FR-003**: All website components MUST display a loading state while content is being retrieved on the initial fetch
- **FR-004**: All website components MUST handle fetch errors gracefully without crashing the page or leaving blank unstyled areas
- **FR-005**: Content items marked as inactive MUST be excluded from public display
- **FR-006**: The project detail page MUST fetch the specific project by its unique identifier
- **FR-007**: Banner content MUST be fetched per page — each page fetches only its own banner data
- **FR-008**: The existing visual design, layout, and behavior of all website components MUST be preserved after migration
- **FR-009**: The static source data file MUST remain in place as a reference but no longer be the active data source for any component

### Key Entities

- **Content Hook**: A reusable data-fetching abstraction per content type that components subscribe to for live data
- **Loading Placeholder**: A UI element shown in place of content while data is being retrieved
- **Error Fallback**: A user-friendly message shown when a data fetch fails for a content section

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All website pages display content sourced exclusively from the backend API; no hardcoded static content remains in active use
- **SC-002**: Content updates made in the admin panel are visible on the public website within 5 seconds (no manual intervention or redeploy required)
- **SC-003**: Every content section shows a loading placeholder during the initial fetch on a fresh page load
- **SC-004**: No page produces a visible JavaScript error or a completely blank section when the backend is unreachable
- **SC-005**: The visual appearance of all website pages matches the pre-migration baseline for identical content

## Assumptions

- All content fetching is client-side; no server-side rendering or static site generation is added in this phase
- Standard browser-level caching is acceptable; no custom caching layer is built in v1
- The API base URL is configured at build time via an environment variable
- The existing website component file structure is preserved; only data sources change (no visual redesign)
- The static dashboard.js file is retained as a seed data reference but is not imported by any active component after this phase
- No pagination is required in v1; all content items for a section are fetched in a single request

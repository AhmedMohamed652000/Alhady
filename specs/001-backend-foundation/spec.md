# Feature Specification: Backend Foundation & Content API

**Feature Branch**: `001-backend-foundation`
**Created**: 2026-05-06
**Status**: Draft
**Input**: Phase 1 of Al-Hady Engineering CMS plan — Working Express + MongoDB API with auth and file upload

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Secure Admin Authentication (Priority: P1)

The admin system needs to verify that only authorized personnel can modify website content. An admin provides their credentials and receives a secure session token that grants access to all management functions.

**Why this priority**: Without authentication, no other management function is safe to expose. This is the foundational access gate for the entire CMS.

**Independent Test**: Can be fully tested by attempting to log in with valid and invalid credentials, verifying a token is issued for valid credentials and rejected for invalid ones.

**Acceptance Scenarios**:

1. **Given** valid admin credentials, **When** submitted, **Then** a secure token is returned and valid for subsequent protected requests
2. **Given** invalid credentials, **When** submitted, **Then** access is denied with an appropriate error message
3. **Given** a valid token, **When** a protected resource is requested with it, **Then** the resource is returned successfully
4. **Given** no token or an expired token, **When** a protected resource is requested, **Then** access is denied with an authorization error

---

### User Story 2 - Image & File Upload (Priority: P2)

Admin users need to upload images for content items (banners, team photos, project images). The system stores these files and provides a stable URL that the website can use to display them.

**Why this priority**: Image management is required by almost every content type in the system. Needed before any content management UI can be built.

**Independent Test**: Can be fully tested by uploading a valid image file and confirming the returned URL resolves to the stored image.

**Acceptance Scenarios**:

1. **Given** an authenticated admin, **When** they upload a valid image file, **Then** the file is stored and a stable public URL is returned
2. **Given** an unauthenticated upload request, **When** received, **Then** the request is rejected
3. **Given** a non-image file type, **When** upload is attempted, **Then** the upload is rejected with a clear error
4. **Given** a file exceeding the size limit, **When** upload is attempted, **Then** the upload is rejected with a size error

---

### User Story 3 - Content Data Retrieval (Priority: P3)

The public website and admin dashboard must retrieve all content types (services, projects, team members, etc.) to display to visitors or present to admins for management.

**Why this priority**: Public read access enables the website to function. Depends on data storage being established.

**Independent Test**: Can be tested by seeding the database and requesting each content type endpoint, verifying correctly structured data is returned.

**Acceptance Scenarios**:

1. **Given** content exists in the system, **When** the public website requests it, **Then** complete, correctly structured content is returned
2. **Given** no content exists for a type, **When** it is requested, **Then** an empty list is returned (not an error)
3. **Given** initial site launch, **When** the seed process runs, **Then** all existing static content is available via the API

---

### User Story 4 - Content Data Management (Priority: P4)

Authenticated admins can create, update, and delete all content types through the API, enabling the dashboard UI to manage website content.

**Why this priority**: Write operations build on authentication (P1) and retrieval (P3). Foundational to the admin dashboard.

**Independent Test**: Can be tested by creating, editing, and deleting a content item and verifying changes persist and are reflected in subsequent reads.

**Acceptance Scenarios**:

1. **Given** an authenticated admin, **When** they create a new content item, **Then** it is persisted and retrievable
2. **Given** an authenticated admin, **When** they update an existing item, **Then** changes are saved and reflected in reads
3. **Given** an authenticated admin, **When** they delete an item, **Then** it is permanently removed
4. **Given** an unauthenticated request, **When** any write operation is attempted, **Then** the request is rejected

---

### Edge Cases

- What happens when the database connection is unavailable at startup?
- What happens when an uploaded image filename conflicts with an existing file?
- How does the system respond when a request references a non-existent content item?
- What happens if the seed process is run more than once?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST authenticate admin users via email and password credentials
- **FR-002**: System MUST issue a time-limited access token upon successful authentication
- **FR-003**: System MUST reject all write and upload requests that do not include a valid, unexpired token
- **FR-004**: System MUST accept image file uploads from authenticated admins and return a stable public URL
- **FR-005**: System MUST reject upload requests for non-image file types
- **FR-006**: System MUST reject upload requests for files exceeding 5MB
- **FR-007**: System MUST expose read endpoints for all 11 content types, accessible without authentication
- **FR-008**: System MUST expose create, update, and delete endpoints for all 11 content types, restricted to authenticated admins
- **FR-009**: System MUST support an initial data seeding process that imports all existing static content
- **FR-010**: System MUST serve uploaded image files at a stable, publicly accessible URL path
- **FR-011**: System MUST support reordering for services, team members, and portfolio items
- **FR-012**: System MUST return appropriate error responses (not crashes) when requests are malformed or reference missing items

### Key Entities

- **Admin User**: Authenticated operator with full content management access; identified by email
- **Banner**: Page-specific header image and text; one record per page type (home, about, service, project, portfolio, team, contact, faq)
- **Service**: Company service offering with multiple images, description, link, and display order
- **Tool**: Software tool entry with title and icon image
- **Client**: Company client entry with title and logo image
- **Partner**: Business partner entry with title and logo image
- **Team Member**: Employee profile with photo, name, position, and display order
- **Review**: Client testimonial with author name, job title, content text, and photo
- **Portfolio Item**: Project portfolio entry with category, card image, and display order
- **Project**: Detailed project record with statistics, full description, and a variable-length sample image gallery
- **Site Settings**: Singleton record for global company information (contact details, statistics, hero text)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 11 content types are retrievable within 500ms under normal single-user conditions
- **SC-002**: Admin authentication completes in under 2 seconds
- **SC-003**: Image uploads of up to 5MB complete within 10 seconds
- **SC-004**: The seed process imports all existing static content without manual intervention in a single run
- **SC-005**: 100% of unauthenticated write and upload requests are rejected
- **SC-006**: The backend runs stably for at least 24 hours of normal usage without requiring a restart

## Assumptions

- A single admin user account is sufficient for v1; multi-user or role-based access is out of scope
- Uploaded images are stored on the local server filesystem; cloud storage is out of scope for v1
- The database is hosted and accessible from the server environment before launch
- Initial admin credentials are set via the seed script and must be changed manually before production use
- All content types support an `active` flag to control public visibility where applicable
- The seed data source is the existing static file at `src/Dashboard/dashboard.js`
- Running the seed process a second time should not create duplicate entries

# Feature Specification: CRUD Content Management Pages

**Feature Branch**: `003-crud-content-management`
**Created**: 2026-05-06
**Status**: Draft
**Input**: Phase 3 of Al-Hady Engineering CMS plan — All content types manageable from the admin dashboard

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Manage Simple Content Items (Priority: P1)

An admin can view a list of simple content items (tools, clients, partners), add new entries, edit existing ones, and remove entries no longer needed. Each item has a title and an icon/logo image.

**Why this priority**: Basic list/add/edit/delete establishes the core content management pattern repeated across all content types.

**Independent Test**: Add a new tool entry with a title and icon image, verify it appears in the list, edit its title, verify the change, then delete it and confirm it is removed.

**Acceptance Scenarios**:

1. **Given** an admin on a content list page, **When** the page loads, **Then** all existing items are displayed in a table with their key fields
2. **Given** an admin clicking Add, **When** they fill the form and submit, **Then** the new item appears in the list
3. **Given** an admin clicking Edit on an item, **When** the form opens, **Then** it is pre-filled with the item's current data
4. **Given** an admin who edits and saves an item, **When** the save completes, **Then** the updated values are reflected in the list
5. **Given** an admin clicking Delete on an item, **When** prompted, **Then** they must confirm before the item is permanently removed
6. **Given** a confirmed delete, **When** complete, **Then** the item no longer appears in the list

---

### User Story 2 - Manage Page Banners (Priority: P2)

An admin can select any page of the website and update its banner title, subtitle, and background image. The change is immediately available when the website fetches the banner data.

**Why this priority**: Banners are unique (one per page, not a list) and are a high-visibility element needing a distinct management interface.

**Independent Test**: Select the Home page banner tab, change the title, save, and verify the updated title is returned by the banner data endpoint.

**Acceptance Scenarios**:

1. **Given** an admin on the Banners page, **When** they select a page tab, **Then** the current banner data for that page is shown pre-filled in the form
2. **Given** an admin who updates banner fields and saves, **When** the save completes, **Then** the changes are persisted
3. **Given** an admin selecting a new banner image, **When** the upload completes, **Then** a preview of the image is shown in the form before saving

---

### User Story 3 - Manage Services (Priority: P2)

An admin can manage service entries which include multiple images, a description, and a link. Services can be reordered to control their display sequence on the public website.

**Why this priority**: Services are a primary content category with richer fields and ordering requirements.

**Independent Test**: Add a service with all fields including multiple images, verify it appears, reorder it relative to another service, and confirm the new order persists.

**Acceptance Scenarios**:

1. **Given** an admin adding a service, **When** they fill all fields including image uploads and submit, **Then** all data is saved correctly
2. **Given** an admin who reorders services, **When** they save the new order, **Then** the sequence is persisted and reflected in public website display order
3. **Given** an admin toggling a service's active status, **When** saved, **Then** inactive services are excluded from public website display

---

### User Story 4 - Manage Team Members (Priority: P3)

An admin can manage team member profiles including their photo, name, position, and display order on the team page.

**Why this priority**: Follows the same ordered-list-with-image pattern as services; straightforward once that pattern is established.

**Independent Test**: Add a team member with a profile photo, verify the entry appears, reorder relative to another member, and confirm order persists.

**Acceptance Scenarios**:

1. **Given** an admin adding a team member, **When** a profile photo is uploaded, **Then** a preview is shown and the photo is saved with the record
2. **Given** an admin who reorders team members, **When** saved, **Then** the new display order is persisted

---

### User Story 5 - Manage Reviews (Priority: P3)

An admin can manage client testimonials, each with an author name, job title, description text, and optional photo.

**Why this priority**: Similar to simple items but with text content; standard form pattern.

**Independent Test**: Add a review with all fields, verify it appears in the list, edit the description, and confirm the change persists.

**Acceptance Scenarios**:

1. **Given** an admin adding a review, **When** they fill all fields and submit, **Then** the review appears in the list with correct content
2. **Given** an admin editing a review, **When** they update the description and save, **Then** the new description is persisted

---

### User Story 6 - Manage Portfolio Items (Priority: P3)

An admin can manage portfolio gallery entries, each with a title, category, card image, and display order.

**Why this priority**: Portfolio follows the ordered image-item pattern; standard implementation.

**Independent Test**: Add a portfolio item with category and image, verify it appears, reorder it, and confirm the order persists.

**Acceptance Scenarios**:

1. **Given** an admin adding a portfolio item, **When** they fill all fields and submit, **Then** the item appears in the portfolio list
2. **Given** an admin who reorders portfolio items, **When** saved, **Then** the new display order is persisted

---

### User Story 7 - Manage Projects (Priority: P3)

An admin can create and edit complex project records containing full descriptions, detailed statistics, and a variable-length gallery of sample images with titles and descriptions.

**Why this priority**: Projects are the most complex content type due to nested structure and dynamic gallery; lower priority than simpler types.

**Independent Test**: Create a project with all fields populated including at least two sample images, verify all data saves correctly, then edit it by adding a third sample image and confirm the change persists.

**Acceptance Scenarios**:

1. **Given** an admin creating a project, **When** they fill all form sections and submit, **Then** all data including nested statistics and sample images is saved
2. **Given** an admin editing a project, **When** they add or remove sample images, **Then** the gallery updates accordingly on save
3. **Given** an admin deleting a project, **When** confirmed, **Then** it is removed with all associated data

---

### User Story 8 - Manage Site Settings (Priority: P4)

An admin can update company-wide information such as contact details, headline statistics, and homepage hero text through a single settings form.

**Why this priority**: A single-record form with no list management; important but the simplest content type.

**Independent Test**: Update the company phone number in settings, save, and verify the new value is returned by the settings data endpoint.

**Acceptance Scenarios**:

1. **Given** an admin on the Settings page, **When** the page loads, **Then** all current settings values are pre-filled in the form
2. **Given** an admin who updates any settings field and saves, **When** the save completes, **Then** the new value is persisted and reflected in the public website

---

### Edge Cases

- What happens when an image upload fails mid-form submission?
- What happens if a required field is left blank on form submission?
- What happens when saving if the network connection drops?
- What happens if an admin tries to submit a form with a file that exceeds the size limit?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display all existing items for each content type in a data table on the list page
- **FR-002**: System MUST provide add and edit forms for all 10 content types
- **FR-003**: System MUST validate required fields before allowing form submission
- **FR-004**: System MUST provide image upload capability within forms for all image fields
- **FR-005**: System MUST show a preview of a selected image before the form is submitted
- **FR-006**: System MUST require a confirmation step before permanently deleting any content item
- **FR-007**: System MUST support active/inactive toggling for content items that have this flag
- **FR-008**: System MUST support manual reordering for services, team members, and portfolio items
- **FR-009**: System MUST manage per-page banners via page-selector tabs, one form per page
- **FR-010**: System MUST support complex project forms with nested statistics fields and a dynamic sample image gallery (add/remove rows)
- **FR-011**: System MUST provide a single settings form for company-wide information
- **FR-012**: System MUST display a clear success or error notification after every save or delete operation

### Key Entities

- **Banner**: One per page type; contains display text fields and a background image
- **Service**: Ordered content item with multiple images, description text, and an external link
- **Tool / Client / Partner**: Simple ordered items with title and a single icon/logo image
- **Team Member**: Ordered profile record with photo, name, and position
- **Review**: Testimonial record with author name, job title, description, and optional photo
- **Portfolio Item**: Ordered gallery entry with title, category, and a card image
- **Project**: Complex record with full description, statistics object, and a variable-length sample image gallery
- **Site Settings**: Singleton record for global company contact information and statistics

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An admin can create, edit, or delete any content item in under 3 minutes per operation
- **SC-002**: All client-side form validation errors are visible before the request reaches the server
- **SC-003**: Image uploads complete and previews are shown within 15 seconds for files under 5MB
- **SC-004**: Reordering changes are saved and reflected on the public website within 5 seconds
- **SC-005**: 100% of delete operations require explicit confirmation before execution
- **SC-006**: All 10 content types are fully manageable (create, read, update, delete) through the admin panel

## Assumptions

- Each form field accepts at most one image at a time; bulk image upload is out of scope for v1
- Reordering is handled via a numeric order field in the form, not drag-and-drop (drag-and-drop is a stretch goal)
- Portfolio items do not have a dedicated detail page on the public website; they are gallery cards only
- Client testimonials (reviews) are created by admins only; no public submission form exists
- Bulk import or export of any content type is out of scope for v1
- The Services, Team, and Portfolio reorder operation saves the full order in one request, not item-by-item

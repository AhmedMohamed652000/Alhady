# Quickstart: CRUD Content Management Pages

**Feature**: `003-crud-content-management`  
**Date**: 2026-05-06

---

## Prerequisites

Phase 1 (backend) and Phase 2 (admin shell) must be complete. Verify:

```bash
# Check that models/routes exist
ls backend/models/   # should show 11 .js files
ls backend/routes/   # should show 12 .js files

# Check admin shell exists
ls src/admin/pages/  # should show 11 .jsx page files (including placeholders)
```

---

## Development Setup

### 1. Start backend (port 5000)

```bash
cd backend
npm start
```

Verify at: `http://localhost:5000/api/settings` (should return `{}` or settings JSON)

### 2. Start frontend (port 3000)

```bash
# From repo root
npm start
```

Navigate to: `http://localhost:3000/admin/login`

### 3. Login

Default credentials:
- Email: `admin@alhady-eg.com`
- Password: `admin123`

---

## Page URLs

| Page | URL |
|------|-----|
| Dashboard | `/admin` |
| Banners | `/admin/banners` |
| Services | `/admin/services` |
| Tools | `/admin/tools` |
| Clients | `/admin/clients` |
| Partners | `/admin/partners` |
| Team | `/admin/team` |
| Reviews | `/admin/reviews` |
| Portfolio | `/admin/portfolio` |
| Projects | `/admin/projects` |
| Settings | `/admin/settings` |

---

## Implementation Order

Build in this sequence to maximize component reuse:

1. **Shared components** (`src/admin/components/crud/`)
   - `DataTable.jsx`
   - `FormDialog.jsx`
   - `DeleteConfirm.jsx`
   - `ImageField.jsx`

2. **Pattern A — Simple list pages** (no image, no reorder)
   - `ToolsPage.jsx` — title + icon
   - `ClientsPage.jsx` — title + icon
   - `PartnersPage.jsx` — title + icon

3. **Pattern B — List + image upload**
   - `ReviewsPage.jsx` — name, jobTitle, description, optional image
   - `PortfolioPage.jsx` — title, category, image, reorder
   - `TeamPage.jsx` — name, position, image, reorder

4. **Pattern C — Rich form + multiple images + reorder**
   - `ServicesPage.jsx` — title, description, 3 image fields, link, reorder

5. **Pattern D — Unique pages**
   - `BannersPage.jsx` — 8-tab page selector, upsert form per tab
   - `SettingsPage.jsx` — singleton form, no list table
   - `ProjectsPage.jsx` — list + complex form (nested details + dynamic gallery rows)

---

## Key Implementation Notes

### Image upload flow

```js
// In ImageField.jsx
const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const formData = new FormData();
  formData.append('image', file);
  const res = await api.post('/api/upload', formData);  // api instance auto-adds auth header
  onChange(res.data.url);  // e.g. '/uploads/1714987654321-photo.jpg'
};

// Display image:
<img src={`http://localhost:5000${value}`} />
```

### Reorder save

```js
// After user edits order fields, collect all items:
const handleReorder = async () => {
  const items = data.map(item => ({ id: item._id, order: item.order }));
  await api.patch('/api/services/reorder', { items });
  setNotification({ type: 'success', message: 'Order saved.' });
};
```

### Banner upsert (no ID needed)

```js
// Page slug from active tab:
await api.put(`/api/banners/${selectedPage}`, { title, subtitle, backgroundImage });
```

### Projects dynamic gallery rows

```js
const [samples, setSamples] = useState([{ image: '', title: '', description: '' }]);

const addSample = () => setSamples(s => [...s, { image: '', title: '', description: '' }]);
const removeSample = (i) => setSamples(s => s.filter((_, idx) => idx !== i));
const updateSample = (i, field, value) =>
  setSamples(s => s.map((row, idx) => idx === i ? { ...row, [field]: value } : row));
```

---

## Testing Checklist (per page)

For each content type, verify:

- [ ] List loads on page open
- [ ] Add form opens empty
- [ ] Required field shows error when blank on submit (FR-003)
- [ ] Image field shows preview before save (FR-005)
- [ ] Successful add → item appears in list + success toast (FR-012)
- [ ] Edit form opens pre-filled with existing data
- [ ] Successful edit → list reflects change + success toast
- [ ] Delete shows confirmation dialog before executing (FR-006)
- [ ] Confirmed delete → item removed from list + success toast
- [ ] Network error → error notification shown (FR-012)

Additional checks for reorder pages (Services, Team, Portfolio):
- [ ] Editing order field and saving updates display sequence

Additional checks for Banners:
- [ ] Tab switch loads correct banner data
- [ ] Save on any tab succeeds

Additional checks for Projects:
- [ ] Add/remove sample image rows works
- [ ] All nested `projectDetails` fields save and load correctly

Additional checks for Settings:
- [ ] Form loads with existing settings pre-filled
- [ ] Save updates all fields

---

## Seed Data

Run seed script to populate MongoDB with sample data for testing:

```bash
cd backend
node seed.js
```

This populates all 10 content types from `src/Dashboard/dashboard.js` without creating duplicates (idempotent).

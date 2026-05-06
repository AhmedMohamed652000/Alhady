# Shared Component Contracts

**Feature**: `003-crud-content-management`  
**Location**: `src/admin/components/crud/`

These four components are used by all 9 CRUD admin pages.

---

## DataTable

**File**: `src/admin/components/crud/DataTable.jsx`

Renders a styled table with column configuration and per-row Edit/Delete action buttons.

### Props

| Prop | Type | Required | Description |
|------|------|---------|-------------|
| `title` | string | Yes | Page heading (uppercase gold) |
| `columns` | `Column[]` | Yes | Column definitions (see below) |
| `data` | `object[]` | Yes | Array of row data objects |
| `onAdd` | `() => void` | Yes | Called when Add button clicked |
| `onEdit` | `(item) => void` | Yes | Called with row object when Edit clicked |
| `onDelete` | `(item) => void` | Yes | Called with row object when Delete clicked |
| `loading` | boolean | No | Shows skeleton rows when true |
| `addLabel` | string | No | Button label (default: `"Add New"`) |

### Column Definition

```js
{
  key: string,        // field name on the data object
  label: string,      // column header
  render?: (value, row) => ReactNode  // optional custom renderer (e.g., image preview)
}
```

### Usage example

```jsx
<DataTable
  title="Clients"
  columns={[
    { key: 'icon', label: 'Logo', render: (v) => v ? <img src={`http://localhost:5000${v}`} className="h-8 w-8 object-contain" /> : '—' },
    { key: 'title', label: 'Name' },
    { key: 'order', label: 'Order' },
    { key: 'active', label: 'Active', render: (v) => v ? 'Yes' : 'No' },
  ]}
  data={clients}
  onAdd={() => openForm(null)}
  onEdit={(item) => openForm(item)}
  onDelete={(item) => setDeleteTarget(item)}
  loading={loading}
/>
```

---

## FormDialog

**File**: `src/admin/components/crud/FormDialog.jsx`

Modal dialog wrapper. Renders any form content passed as `children`. Handles open/close and submit button.

### Props

| Prop | Type | Required | Description |
|------|------|---------|-------------|
| `open` | boolean | Yes | Controls dialog visibility |
| `onClose` | `() => void` | Yes | Called when dialog is dismissed |
| `title` | string | Yes | Dialog heading |
| `onSubmit` | `() => void` | Yes | Called when form Submit button clicked |
| `submitting` | boolean | No | Disables submit button and shows spinner |
| `children` | ReactNode | Yes | Form fields |
| `submitLabel` | string | No | Submit button text (default: `"Save"`) |

### Usage example

```jsx
<FormDialog
  open={formOpen}
  onClose={() => setFormOpen(false)}
  title={editItem ? 'Edit Client' : 'Add Client'}
  onSubmit={handleSubmit}
  submitting={submitting}
>
  <input ... />
  <ImageField ... />
</FormDialog>
```

---

## DeleteConfirm

**File**: `src/admin/components/crud/DeleteConfirm.jsx`

Wraps shadcn/ui `AlertDialog`. Shows "Are you sure?" and calls `onConfirm` when confirmed (FR-006).

### Props

| Prop | Type | Required | Description |
|------|------|---------|-------------|
| `open` | boolean | Yes | Controls dialog visibility |
| `onClose` | `() => void` | Yes | Called when cancelled |
| `onConfirm` | `() => void` | Yes | Called when "Delete" confirmed |
| `itemName` | string | No | Name of the item being deleted (shown in message) |

### Usage example

```jsx
<DeleteConfirm
  open={!!deleteTarget}
  onClose={() => setDeleteTarget(null)}
  onConfirm={handleDelete}
  itemName={deleteTarget?.title}
/>
```

---

## ImageField

**File**: `src/admin/components/crud/ImageField.jsx`

File input that immediately uploads on selection and exposes a preview (FR-004, FR-005).

### Props

| Prop | Type | Required | Description |
|------|------|---------|-------------|
| `value` | string | Yes | Current image URL (`/uploads/…` or `''`) |
| `onChange` | `(url: string) => void` | Yes | Called with uploaded URL after successful upload |
| `label` | string | No | Field label (default: `"Image"`) |

### Behaviour

1. User selects a file → component calls `POST /api/upload`
2. On success → sets preview from returned URL, calls `onChange(url)`
3. On failure → shows inline error, does not call `onChange`
4. If `value` is non-empty on mount → shows existing image as preview
5. A "Clear" button sets `onChange('')` and removes preview

### Usage example

```jsx
<ImageField
  label="Logo / Icon"
  value={form.icon}
  onChange={(url) => setForm(f => ({ ...f, icon: url }))}
/>
```

---

## Notification Banner (inline, not a shared file)

Each page uses local state for success/error notifications (FR-012):

```jsx
const [notification, setNotification] = useState(null); // { type, message } | null

// After save:
setNotification({ type: 'success', message: 'Client saved successfully.' });
setTimeout(() => setNotification(null), 4000);

// Render (inside AdminLayout):
{notification && (
  <div className={`mb-4 px-4 py-3 rounded text-sm font-body ${
    notification.type === 'success'
      ? 'bg-green-900/40 text-green-300 border border-green-700'
      : 'bg-red-900/40 text-red-300 border border-red-700'
  }`}>
    {notification.message}
  </div>
)}
```

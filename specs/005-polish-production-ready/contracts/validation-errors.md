# Contract: Validation Error Response Shape

**Feature**: 005-polish-production-ready
**Date**: 2026-05-06

## Overview

All backend routes use `express-validator`. When request validation fails, the API returns a
structured error response. This document specifies that shape so the frontend can parse
field-level errors and display them next to the correct form field.

---

## Error Response Shape

### HTTP Status: `422 Unprocessable Entity`

Used for validation failures (required fields missing, format invalid, etc.).

```json
{
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    },
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

| Key | Type | Description |
|-----|------|-------------|
| `errors` | Array | One entry per failing validation rule |
| `errors[].field` | string | The request body field name that failed |
| `errors[].message` | string | Human-readable reason for the failure |

### HTTP Status: `400 Bad Request`

Used for structural request errors (body missing entirely, unsupported content type).

```json
{
  "message": "Request body is missing or malformed"
}
```

### HTTP Status: `401 Unauthorized`

Used when the JWT token is missing, expired, or invalid.

```json
{
  "message": "Not authorized, no token"
}
```

### HTTP Status: `500 Internal Server Error`

```json
{
  "message": "Server error"
}
```

---

## Express-Validator Integration Pattern

All write routes (POST/PUT) MUST follow this pattern:

```js
const { body, validationResult } = require('express-validator');

router.post('/',
  authMiddleware,
  [
    body('title').notEmpty().withMessage('Title is required'),
    // ... more rules
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
      });
    }
    // ... handler logic
  }
);
```

---

## Frontend Parsing Pattern

The admin frontend reads `error.response.data` from a failed Axios request. The frontend
handles both the `422` validation shape and the generic `{ message }` shape:

```js
const parseApiError = (err) => {
  const data = err.response?.data;
  if (data?.errors) {
    // Field-level errors from express-validator
    const fieldErrors = {};
    data.errors.forEach(e => { fieldErrors[e.field] = e.message; });
    return { fieldErrors, message: null };
  }
  return { fieldErrors: {}, message: data?.message || 'An error occurred' };
};
```

`fieldErrors` is passed to `FormDialog` as the `errors` prop. Each field renders its error
by looking up `errors[fieldName]`.

---

## Client-Side Validation (Pre-Submit)

Client-side validation runs before the API call and uses the same `fieldErrors` shape. This
means the frontend field-error display code is reused for both client-side and server-side
errors:

```js
// Client validate function (per page)
const validate = (data) => {
  const errors = {};
  if (!data.title?.trim()) errors.title = 'Title is required';
  return errors;
};
```

If `Object.keys(validate(formData)).length > 0`, the form displays errors and does not submit.
If the server returns a `422`, `parseApiError` populates the same `errors` object.

---

## FormDialog `errors` Prop Interface

```jsx
// FormDialog.jsx — errors prop shape:
// errors: { [fieldName: string]: string }  (empty object = no errors)

// Usage inside FormDialog for a field:
<input name="title" ... />
{errors?.title && (
  <p className="text-red-400 text-xs mt-1">{errors.title}</p>
)}
```

---
title: Advanced Usage
description: Explore advanced features and customization options for Next Form.
---

## Advanced Usage

### Custom Field Types with Unique Schemas

Create specialized field types that are distinct from their underlying Zod type:

```tsx
// lib/unique-fields.ts
import { z } from "zod";
import { createUniqueFieldSchema } from "@karnak19/next-form/client";

// Create a select field that's different from a regular string
export const zSelect = createUniqueFieldSchema(z.string(), "select");
export const zTextarea = createUniqueFieldSchema(z.string(), "textarea");
```

```tsx
// components/SelectField.tsx
import { useField } from "@karnak19/next-form/client";

export function SelectField() {
  const { field, label, error } = useField<string>();

  return (
    <div>
      <label>{label}</label>
      <select {...field}>
        <option value="">Choose an option</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </select>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
```

```tsx
// Update your mapping
import { zSelect } from "../lib/unique-fields";
import { SelectField } from "../components/SelectField";

const mapping = [
  [z.string(), TextField],
  [z.boolean(), CheckboxField],
  [zSelect, SelectField], // Unique field mapping
] as const;
```

### Server Actions with Middleware (Procedures)

Create reusable middleware for authentication, logging, etc:

```tsx
// lib/procedures.ts
"use server";

import { createProcedure } from "@karnak19/next-form/server";

// Authentication middleware
const authProcedure = createProcedure(() => {
  // Your auth logic here
  return {
    user: {
      id: "user-123",
      name: "John Doe",
    },
  };
});

// Chain middleware
const adminProcedure = authProcedure.pipe((ctx) => {
  // Check if user is admin
  return {
    ...ctx,
    isAdmin: true,
  };
});

// Create actions with context
export const createAdminAction = adminProcedure
  .createAction()
  .input(someSchema)
  .handler(async ({ input, ctx }) => {
    // ctx contains user and isAdmin
    console.log(`User ${ctx.user.name} is creating:`, input);
    return { success: true };
  });
```

### Custom Field with Props

Field components can accept additional props:

```tsx
// components/SelectField.tsx
interface SelectFieldProps {
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export function SelectField({ options = [], placeholder }: SelectFieldProps) {
  const { field, label, error } = useField<string>();

  return (
    <div>
      <label>{label}</label>
      <select {...field}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
```

### Handling Form Events

```tsx
export default function UserFormPage() {
  const handleSuccess = (data: any) => {
    console.log("Form submitted successfully:", data);
    // Redirect, show toast, etc.
  };

  const handleError = (error: Error) => {
    console.error("Form submission failed:", error);
    // Show error message
  };

  return (
    <Form
      schema={userSchema}
      action={createUserAction}
      initialValues={{ name: "", email: "", isActive: false }}
      onSuccess={handleSuccess}
      onError={handleError}
      renderSubmit={({ isSubmitting, submit }) => (
        <button type="button" onClick={submit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      )}
    />
  );
}
```

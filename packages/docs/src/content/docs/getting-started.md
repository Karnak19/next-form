---
title: Getting Started with Next Form
description: Learn how to install and set up Next Form in your Next.js project.
---

## Installation

You can install Next Form and its peer dependencies using your preferred package manager. We recommend using `bun`:

```bash
bun add @karnak19/next-form zod react-hook-form @hookform/resolvers
```

Alternatively, you can use npm, yarn, or pnpm:

```bash
# npm
npm install @karnak19/next-form zod react-hook-form @hookform/resolvers

# yarn
yarn add @karnak19/next-form zod react-hook-form @hookform/resolvers

# pnpm
pnpm add @karnak19/next-form zod react-hook-form @hookform/resolvers
```

## Quick Start

### 1. Create Your Field Components

```tsx
// components/TextField.tsx
import { useField } from "@karnak19/next-form/client";

export default function TextField() {
  const { field, label, error } = useField<string>();

  return (
    <div>
      <label>{label}</label>
      <input type="text" {...field} />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
```

```tsx
// components/CheckboxField.tsx
import { useField } from "@karnak19/next-form/client";

export function CheckboxField() {
  const { field, label, error } = useField<boolean>();

  return (
    <div>
      <label>
        <input type="checkbox" {...field} />
        {label}
      </label>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
```

### 2. Create Schema-to-Component Mapping

```tsx
// lib/form-mapping.ts
import { z } from "zod";
import { createForm } from "@karnak19/next-form/client";
import TextField from "../components/TextField";
import { CheckboxField } from "../components/CheckboxField";

const mapping = [
  [z.string(), TextField],
  [z.boolean(), CheckboxField],
] as const;

export const Form = createForm({ mapping });
```

### 3. Define Your Schema

```tsx
// lib/schema.ts
import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  isActive: z.boolean(),
});

export type UserFormData = z.infer<typeof userSchema>;
```

### 4. Create a Server Action

```tsx
// actions/user-action.ts
"use server";

import { createAction } from "@karnak19/next-form/server";
import { userSchema } from "../lib/schema";

export const createUserAction = createAction()
  .input(userSchema)
  .handler(async ({ input }) => {
    // Input is automatically validated and type-safe
    console.log("Creating user:", input);

    // Your database logic here
    // const user = await db.user.create(input);

    return { success: true, user: input };
  });
```

### 5. Use the Form

```tsx
// app/user-form/page.tsx
import { Form } from "../../lib/form-mapping";
import { createUserAction } from "../../actions/user-action";
import { userSchema } from "../../lib/schema";

export default function UserFormPage() {
  return (
    <Form
      schema={userSchema}
      action={createUserAction}
      initialValues={{
        name: "",
        email: "",
        isActive: false,
      }}
      renderSubmit={({ isSubmitting, submit }) => (
        <button type="button" onClick={submit} disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create User"}
        </button>
      )}
    />
  );
}
```

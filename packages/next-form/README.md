# @karnak19/next-form

A lightweight, type-safe library for building full-stack forms in Next.js with automatic field generation, Zod validation, and seamless server action integration.

## Features

- 🎯 **Type-safe** - Full TypeScript support with Zod schema inference
- 🚀 **Automatic field generation** - Forms generate themselves based on your schema
- 🔧 **Flexible mapping** - Map Zod types to your custom field components
- 🌐 **Server actions** - Built-in integration with Next.js server actions
- 🎨 **Custom fields** - Support for unique field types and custom components
- 📦 **Minimal setup** - Get started with just a few lines of code
- 🔍 **Built on react-hook-form** - Leverages the power of react-hook-form under the hood

## Installation

```bash
npm install @karnak19/next-form zod react-hook-form @hookform/resolvers
# or
yarn add @karnak19/next-form zod react-hook-form @hookform/resolvers
# or
pnpm add @karnak19/next-form zod react-hook-form @hookform/resolvers
```

## Quick Start

### 1. Create Your Field Components

```tsx
// components/TextField.tsx
import { useField } from "next-form/client";

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
import { useField } from "next-form/client";

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
import { createForm } from "next-form/client";
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

import { createAction } from "next-form/server";
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

## Advanced Usage

### Custom Field Types with Unique Schemas

Create specialized field types that are distinct from their underlying Zod type:

```tsx
// lib/unique-fields.ts
import { z } from "zod";
import { createUniqueFieldSchema } from "next-form/client";

// Create a select field that's different from a regular string
export const zSelect = createUniqueFieldSchema(z.string(), "select");
export const zTextarea = createUniqueFieldSchema(z.string(), "textarea");
```

```tsx
// components/SelectField.tsx
import { useField } from "next-form/client";

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

import { createProcedure } from "next-form/server";

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

## API Reference

### Client-side (`next-form/client`)

#### `createForm({ mapping })`

Creates a Form component with automatic field generation based on schema-to-component mapping.

**Parameters:**

- `mapping`: Array of tuples mapping Zod schemas to React components

**Returns:** Form component

#### `useField<T>(name?)`

Hook for connecting field components to form state.

**Parameters:**

- `name`: Field name (optional if used within FieldProvider context)

**Returns:**

```tsx
{
  field: {
    name: string;
    value: T;
    onChange: (value: T) => void;
    onBlur: () => void;
    ref: RefCallback;
  };
  label: string; // Auto-generated from field name
  error?: string;
}
```

#### `createUniqueFieldSchema<T>(schema, id)`

Creates a unique field schema for specialized field types.

**Parameters:**

- `schema`: Base Zod schema
- `id`: Unique identifier string

**Returns:** Unique field schema

### Server-side (`next-form/server`)

#### `createAction()`

Creates a basic action builder for form submission.

**Returns:** Action builder with `input()` and `handler()` methods

#### `createProcedure(middleware)`

Creates a procedure with middleware that can be chained.

**Parameters:**

- `middleware`: Function that processes context

**Returns:** Chainable procedure builder

### Form Props

```tsx
interface FormProps<TFieldValues, TOutput> {
  schema: z.ZodTypeAny;
  action: ActionDefinition<TFieldValues, TOutput>;
  initialValues?: Partial<TFieldValues>;
  onSuccess?: (data: TOutput) => void;
  onError?: (error: Error) => void;
  renderSubmit: (props: SubmitRenderProps) => ReactElement;
}
```

## Examples

Check out the `/src/examples` directory for complete working examples including:

- Basic text and checkbox fields
- Custom select fields with unique schemas
- Server actions with and without middleware
- Form integration examples

## Requirements

- Next.js 15+
- React 19+
- TypeScript
- Zod 3.25+
- react-hook-form 7+

## License

MIT

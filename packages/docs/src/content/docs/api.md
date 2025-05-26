---
title: API Reference
description: Detailed API documentation for Next Form client and server modules.
---

## API Reference

### Client-side (`@karnak19/next-form/client`)

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

### Server-side (`@karnak19/next-form/server`)

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

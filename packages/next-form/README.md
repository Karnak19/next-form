# Next Form

A lightweight library for building full-stack forms in Next.js with Zod validation.

## Features

- Type-safe form handling with Zod validation
- Server actions integration
- Custom field components support
- Automatic field generation based on schema

## Installation

```bash
npm install next-form
# or
yarn add next-form
# or
pnpm add next-form
# or
bun add next-form
```

## Quick Start

### 1. Create Your Custom Fields

Create the field components that you want to use in your forms:

```tsx
import { useField } from "next-form";

function TextField({
  name,
  placeholder,
}: {
  name: string;
  placeholder?: string;
}) {
  const { field, label, error } = useField<string>(name);

  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        type="text"
        id={name}
        placeholder={placeholder}
        value={field.value || ""}
        onChange={(e) => field.onChange(e.target.value)}
        onBlur={field.onBlur}
      />
      {error && <p>{error}</p>}
    </div>
  );
}
```

### 2. Define Your Mapping

Create a mapping between Zod schema types and your field components:

```tsx
import { z } from "zod";
import { createForm } from "next-form";

// You can define branded types for special fields
const zSelect = z.string().brand<"select">();

// Define the mapping
const mapping = [
  [z.string(), TextField],
  [z.number(), NumberField],
  [z.boolean(), CheckboxField],
  [zSelect, SelectField],
] as const;

// Create a Form component with your mapping
const Form = createForm({ mapping });
```

### 3. Create a Server Action

Define an action to handle form submission:

```tsx
import { createAction } from "next-form";

const userAction = createAction({
  schema: z.object({
    name: z.string().min(2, "Name is too short"),
    age: z.number().min(18, "Must be at least 18"),
    isActive: z.boolean(),
  }),
  handler: async ({ input }) => {
    "use server";

    // Your server-side logic here
    const result = await db.users.create(input);

    return result;
  },
});
```

### 4. Use the Form in Your Component

```tsx
export default function UserForm() {
  return (
    <Form
      action={userAction}
      initialValues={{
        name: "",
        age: 18,
        isActive: true,
      }}
      onSuccess={(data) => {
        console.log("Success:", data);
      }}
      onError={(error) => {
        console.error("Error:", error);
      }}
    >
      <TextField name="name" placeholder="Enter your name" />
      <NumberField name="age" min={1} max={120} />
      <CheckboxField name="isActive" />

      <button type="submit">Submit</button>
    </Form>
  );
}
```

## Advanced Usage

### Automatic Field Generation

If you don't provide children to the Form component, it will automatically generate fields based on your schema:

```tsx
<Form
  action={userAction}
  initialValues={initialValues}
  onSuccess={handleSuccess}
  onError={handleError}
/>
```

### Custom Field Props

Your field components can accept additional props beyond the required `name` prop:

```tsx
function SelectField({ name, options, disabled }) {
  const { field, label, error } = useField<string>(name);

  return (
    <div>
      <label>{label}</label>
      <select
        value={field.value || ""}
        onChange={(e) => field.onChange(e.target.value)}
        onBlur={field.onBlur}
        disabled={disabled}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p>{error}</p>}
    </div>
  );
}
```

## API Reference

### `createForm({ mapping })`

Creates a Form component with the specified mapping between schema types and field components.

### `createAction({ schema, handler })`

Creates an action for form submission with validation.

### `useField<T>(name)`

Hook for connecting field components to the form state.

### `useFormContext()`

Hook for accessing the form context from any component.

## License

MIT

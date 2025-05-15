# Next Form

Library for building full-stack forms in Next.js

## Api design:

### Step 1: Define the form fields mapping

```ts
// mapping.ts

const mapping = [
  [z.string(), TextField],
  [z.number(), NumberField],
  [z.boolean(), CheckboxField],
] as const;

export const Form = createForm({ mapping }); // createForm is a function that creates a form from the mapping
```

<!-- We need to be able to define branded fields to avoid collisions.

```ts
// example branded field
const zSelect = z.string().brand<"select">();

const mapping = [
  [z.string(), TextField],
  [z.number(), NumberField],
  [z.boolean(), CheckboxField],
  [zSelect, SelectField],
] as const;
``` -->

### Step 2: Define the form fields

```ts
// example field definition

export function TextField() {
  const { field, label, error } = useField<string>();
  return (
    <div>
      <label>{label}</label>
      <input type="text" {...field} />
      {error && <p>{error}</p>}
    </div>
  );
}
```

### Step 3: Define a form schema

This schema will be used to validate the form data. Both on the client and the server.

```ts
// example-schema.ts

import { z } from "zod";

export const schema = z.object({
  name: z.string(),
  age: z.number(),
  isActive: z.boolean(),
});

export type Schema = z.infer<typeof schema>;
```

### Step 4: Define a form action

```ts
// example-action.ts
"use server";

import { schema } from "./schema";

export const action = createAction()
  .input(schema)
  .handler(async ({ input }) => {
    // input has been validated, we are safe to use it.
    // example db call
    const data = await db.user.create({
      name: input.name,
      age: input.age,
      isActive: input.isActive,
    });

    return data;
  });
```

### Step 4: Use the form

```ts
// Form usage
import { Form } from "./mapping";
import { action } from "./action";
import { schema } from "./schema";

function Page(props) {
  return <Form initialValues={{ ...props }} schema={schema} action={action} />;
}
```

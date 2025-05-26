import { Form } from "./mapping";
import { exampleAction } from "./action";
import { exampleSchema } from "./schema";

export function PageTest() {
  return (
    <Form
      initialValues={{
        name: "John Doe",
        select: "hello",
      }}
      schema={exampleSchema}
      action={exampleAction}
      renderSubmit={({ isSubmitting, submit }) => (
        <button type="button" onClick={submit} disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create User"}
        </button>
      )}
    />
  );
}

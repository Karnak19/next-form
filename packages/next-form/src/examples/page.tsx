import { Form } from "./mapping";
import { exampleAction } from "./action";
import { exampleSchema } from "./schema";

export function PageTest() {
  return (
    <Form
      initialValues={{
        name: "John Doe",
      }}
      schema={exampleSchema}
      action={exampleAction}
    />
  );
}

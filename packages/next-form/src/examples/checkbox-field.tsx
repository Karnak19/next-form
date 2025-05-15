import { useField } from "next-form/client";

export function CheckboxField() {
  const { field } = useField();
  return <input type="checkbox" {...field} />;
}

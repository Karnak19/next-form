import { useField } from "../client";

export function CheckboxField() {
  const { field } = useField();
  return <input type="checkbox" {...field} />;
}

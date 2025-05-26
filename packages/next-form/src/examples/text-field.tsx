import { useField } from "../client";

export default function TextField() {
  const { field, label, error } = useField();

  return (
    <div>
      <label>{label}</label>
      <input {...field} />
      {error && <p>{error}</p>}
    </div>
  );
}

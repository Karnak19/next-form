import type { ChangeEvent } from "react";
import { useFormContext } from "./FormContext";
import { useFieldContext } from "./FieldContext";
import type { FieldHookReturn } from "../types";

export function useField<T = any>(name?: string): FieldHookReturn<T> {
  const form = useFormContext();
  const contextName = useFieldContext();

  // Get the field name from props or context
  const fieldName = name || contextName;

  // If name isn't provided and we couldn't find it in context
  if (!fieldName) {
    throw new Error("Field name is required for useField");
  }

  // Get field properties from react-hook-form
  const { getValues, setValue, register, formState } = form;
  const { errors } = formState;

  // Get field value
  const value = getValues(fieldName) as T;

  // Create a formatted label from the field name
  const label = fieldName
    .split(/(?=[A-Z])/)
    .join(" ")
    .replace(/^\w/, (c: string) => c.toUpperCase());

  // Get field error if exists
  const error = errors[fieldName]?.message as string | undefined;

  // Register the field with react-hook-form
  const { onChange: registerOnChange, onBlur, ref } = register(fieldName);

  // Return field props, label and error message
  return {
    field: {
      name: fieldName,
      value,
      onChange: (event: any) => {
        // Handle both direct value changes and React synthetic events
        const newValue = event && event.target ? event.target.value : event;

        // Update the form value
        setValue(fieldName, newValue, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });

        // Also trigger the register onChange for complete integration
        if (event && event.target) {
          registerOnChange(event as ChangeEvent<any>);
        }
      },
      onBlur,
      ref,
    },
    label,
    error,
  };
}

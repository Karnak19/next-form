import { createContext, useContext } from "react";
import { FieldValues } from "react-hook-form";
import { FormContextValue } from "../types";

// Create the form context with null as default value and generic parameter
export const FormContext = createContext<FormContextValue<any> | null>(null);

// Hook to use form context with type safety
export function useFormContext<
  TFieldValues extends FieldValues = FieldValues
>(): FormContextValue<TFieldValues> {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }

  return context as FormContextValue<TFieldValues>;
}

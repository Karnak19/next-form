import React, { createContext, useContext } from "react";

interface FieldContextType {
  name: string;
}

// Create context with a default empty name
export const FieldContext = createContext<FieldContextType | null>(null);

// Custom hook to use the field context
export function useFieldContext(): string | undefined {
  const context = useContext(FieldContext);
  return context?.name;
}

// Provider component to wrap field components with the context
export function FieldProvider({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  return (
    <FieldContext.Provider value={{ name }}>{children}</FieldContext.Provider>
  );
}

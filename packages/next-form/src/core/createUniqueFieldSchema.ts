import type { z } from "zod/v4";

// Symbol to mark unique field schemas
const UNIQUE_FIELD_SYMBOL = Symbol("uniqueField");

// Create a unique field schema with a string identifier
export function createUniqueFieldSchema<T extends z.ZodTypeAny>(
  schema: T,
  id: string
): T {
  // Create a copy of the schema that preserves all functionality
  const uniqueSchema = Object.create(Object.getPrototypeOf(schema));

  // Copy all properties from the original schema
  Object.assign(uniqueSchema, schema);

  // Add the unique identifier and inner schema reference
  uniqueSchema[UNIQUE_FIELD_SYMBOL] = id;
  uniqueSchema._innerSchema = schema;

  // Use type assertion to tell TypeScript this is the original type
  return uniqueSchema as T;
}

// Type for unique field schemas
export type UniqueFieldSchema<T extends z.ZodTypeAny = z.ZodTypeAny> = T & {
  [UNIQUE_FIELD_SYMBOL]: string;
  _innerSchema: T;
};

// Type guard to check if a schema is a unique field schema
export function isUniqueFieldSchema(schema: any): schema is UniqueFieldSchema {
  return schema && typeof schema === "object" && UNIQUE_FIELD_SYMBOL in schema;
}

// Get the unique ID from a unique field schema
export function getUniqueFieldId(schema: UniqueFieldSchema): string {
  return schema[UNIQUE_FIELD_SYMBOL];
}

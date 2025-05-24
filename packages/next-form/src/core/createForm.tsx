import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldValues, DefaultValues } from "react-hook-form";
import { z } from "zod/v4";

import { FormContext } from "./FormContext";
import { FieldProvider } from "./FieldContext";
import {
  CreateFormOptions,
  FormProps,
  FormContextValue,
  SubmitRenderProps,
} from "../types";
import {
  isUniqueFieldSchema,
  getUniqueFieldId,
} from "./createUniqueFieldSchema";

export function createForm({ mapping }: CreateFormOptions) {
  // Function to find the appropriate component for a schema definition
  function findComponentForSchema(schema: z.ZodTypeAny) {
    // Check if it's a unique field schema first
    if (isUniqueFieldSchema(schema)) {
      const uniqueId = getUniqueFieldId(schema);

      // Look for a mapping entry that matches this unique schema
      const entry = mapping.find(([schemaType]) => {
        return (
          isUniqueFieldSchema(schemaType) &&
          getUniqueFieldId(schemaType) === uniqueId
        );
      });

      if (entry) {
        return entry[1];
      }
    }

    // Handle optionals - unwrap and try to match the inner type
    if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
      const innerSchema = schema._def.innerType;
      return findComponentForSchema(innerSchema as z.ZodTypeAny);
    }

    // Look through the mapping to find a matching schema type
    const entry = mapping.find(([schemaType]) => {
      // Skip unique field schemas in this pass
      if (isUniqueFieldSchema(schemaType)) {
        return false;
      }

      // For basic Zod types, compare constructor names
      return schema.constructor.name === schemaType.constructor.name;
    });

    if (!entry) {
      throw new Error(
        `No component found for schema type: ${schema.constructor.name}`
      );
    }

    return entry[1];
  }

  // Form component with generics for type safety
  function Form<TFieldValues extends FieldValues = FieldValues, TOutput = any>({
    schema,
    action,
    initialValues = {},
    onSuccess,
    onError,
    children,
    renderSubmit,
  }: FormProps<TFieldValues, TOutput>) {
    // Initialize form with react-hook-form
    const form = useForm<TFieldValues>({
      defaultValues: initialValues as DefaultValues<TFieldValues>,
      resolver: zodResolver(schema as any),
    });

    const { handleSubmit, formState } = form;
    const { errors, isSubmitting } = formState;

    // Format errors for our context
    const formattedErrors: Record<string, string> = {};
    Object.entries(errors).forEach(([key, value]) => {
      if (value?.message) {
        formattedErrors[key] = value.message as string;
      }
    });

    // Create the form context value
    const formContextValue: FormContextValue<TFieldValues> = {
      ...form,
      isSubmitting,
      errors: formattedErrors,
    };

    // Handle form submission
    const handleFormSubmit = handleSubmit(async (data) => {
      try {
        const result = await action({ input: data });
        onSuccess?.(result);
      } catch (error) {
        onError?.(error as Error);
      }
    });

    // @ts-ignore
    const shape = schema.shape;

    // Map schema fields to components
    const fields = Object.entries(shape).map(([name, fieldSchema]) => {
      const Component = findComponentForSchema(fieldSchema as z.ZodTypeAny);

      // Wrap component with FieldProvider to provide the field name via context
      return (
        <FieldProvider key={name} name={name}>
          <Component />
        </FieldProvider>
      );
    });

    // Create submit render props
    const submitRenderProps: SubmitRenderProps = {
      isSubmitting,
      submit: () => handleFormSubmit(),
    };

    return (
      <FormContext.Provider value={formContextValue}>
        <form onSubmit={handleFormSubmit}>
          {fields}
          {renderSubmit(submitRenderProps)}
        </form>
      </FormContext.Provider>
    );
  }

  return Form;
}

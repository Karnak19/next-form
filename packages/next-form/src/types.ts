import { ReactElement, ComponentType, RefObject } from "react";
import { z } from "zod";
import {
  FieldValues,
  UseFormReturn,
  ChangeHandler,
  RefCallBack,
} from "react-hook-form";

// Mapping type definitions
export type FieldComponentMapping =
  | ReadonlyArray<readonly [z.ZodTypeAny, ComponentType<any>]>
  | Array<readonly [z.ZodTypeAny, ComponentType<any>]>;

// Form context types
export type FormContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any
> = UseFormReturn<TFieldValues, TContext> & {
  isSubmitting: boolean;
  errors: Record<string, string>;
};

// Action types
export type ActionDefinition<TInput, TOutput, TContextInput = any> = (props: {
  input: TInput;
  ctx?: TContextInput;
}) => Promise<TOutput>;

// Form props type
export interface FormProps<
  TFieldValues extends FieldValues = FieldValues,
  TOutput = any
> {
  schema: z.ZodTypeAny;
  onSuccess?: (data: TOutput) => void;
  onError?: (error: Error) => void;
  children?: ReactElement | ReactElement[];
  action: ActionDefinition<TFieldValues, TOutput>;
  initialValues?: Partial<TFieldValues>;
}

// Field hook return type
export interface FieldHookReturn<T = any> {
  field: {
    name: string;
    value: T;
    onChange: (value: T) => void;
    onBlur: ChangeHandler;
    ref: RefCallBack;
  };
  label: string;
  error?: string;
}

// Create form options
export interface CreateFormOptions {
  mapping: FieldComponentMapping;
}

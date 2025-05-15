import { z } from "zod";
import { ActionDefinition } from "../types";

/**
 * Creates a procedure with a specified middleware function.
 * Procedures allow defining middleware that processes context before an action's main handler executes.
 *
 * @template TInitialContext - The type of the initial context expected by the middleware.
 * @template TActualProcessedContext - The type of the context after being processed by the middleware.
 * @param middlewareFn - The function to process the context. It receives TInitialContext and returns TActualProcessedContext.
 * @returns An object with a `createServerAction` method to build an action from this procedure.
 */
export function createProcedure<TInitialContext, TActualProcessedContext>(
  middlewareFn: (
    ctx: TInitialContext
  ) => TActualProcessedContext | Promise<TActualProcessedContext>
) {
  return {
    /**
     * Creates an action builder from the configured procedure.
     * Actions built this way will first execute the procedure's middleware.
     *
     * @returns An object with `input` and `handler` methods to define the action.
     */
    createAction: () => {
      return {
        /**
         * Specifies the Zod schema for the action's input.
         *
         * @template TSchema - The Zod schema type.
         * @param schema - The Zod schema.
         * @returns An object with a `handler` method to define the action's logic.
         */
        input: <TSchema extends z.ZodTypeAny>(schema: TSchema) => {
          return {
            /**
             * Defines the main logic for the action.
             * This function receives the validated input and the processed context from the procedure.
             *
             * @template TOutput - The return type of the action.
             * @param actionFn - The function containing the action's core logic.
             * @returns The ActionDefinition.
             */
            handler: <TOutput>(
              actionFn: (props: {
                input: z.infer<TSchema>;
                ctx: TActualProcessedContext;
              }) => Promise<TOutput>
            ): ActionDefinition<z.infer<TSchema>, TOutput, TInitialContext> => {
              return async ({ input, ctx: initialCtxValue }) => {
                const processedCtx = await middlewareFn(
                  initialCtxValue as TInitialContext
                );
                const validatedInput = schema.parse(input);
                return actionFn({ input: validatedInput, ctx: processedCtx });
              };
            },
          };
        },
      };
    },
  };
}

/**
 * Creates a basic action builder without any specific preceding middleware.
 * This is a convenience function, equivalent to calling `createProcedure` with an identity middleware
 * that passes the context through unchanged (any => any).
 *
 * @returns An object with `input` and `handler` methods to define the action.
 */
export function createAction() {
  // TInitialContext = any, TActualProcessedContext = any
  const publicProcedure = createProcedure((ctx: any) => ctx);
  return publicProcedure.createAction();
}

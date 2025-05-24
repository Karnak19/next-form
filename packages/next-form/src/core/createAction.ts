import type { z } from "zod/v4";
import type { ActionDefinition } from "../types";

// Helper type for the builder object returned by createProcedure and pipe
interface ChainedProcedureBuilder<
  TChainStartContext,
  TCurrentChainOutputContext
> {
  /**
   * Chains another middleware function to the current procedure.
   * The output context of the current procedure becomes the input for the next middleware.
   *
   * @template TNextMiddlewareOutputContext - The output type of the next middleware function.
   * @param nextMiddlewareFn - The middleware function to add to the chain.
   * @returns A new procedure builder representing the extended chain.
   */
  pipe: <TNextMiddlewareOutputContext>(
    nextMiddlewareFn: (
      ctx: TCurrentChainOutputContext
    ) => TNextMiddlewareOutputContext | Promise<TNextMiddlewareOutputContext>
  ) => ChainedProcedureBuilder<
    TChainStartContext,
    TNextMiddlewareOutputContext
  >;

  /**
   * Creates an action builder from the configured procedure chain.
   * Actions built this way will execute all chained middleware in sequence.
   *
   * @returns An object with `input` and `handler` methods to define the action.
   */
  createAction: () => {
    input: <TSchema extends z.ZodTypeAny>(
      schema: TSchema
    ) => {
      handler: <TOutput>(
        actionFn: (props: {
          input: z.infer<TSchema>;
          ctx: TCurrentChainOutputContext; // Context from the end of the chain
        }) => Promise<TOutput>
      ) => ActionDefinition<z.infer<TSchema>, TOutput, TChainStartContext>; // TChainStartContext for the ActionDefinition
    };
  };
}

/**
 * Creates an initial procedure with a specified middleware function, which can then be extended by chaining.
 * Procedures allow defining middleware that processes context before an action's main handler executes.
 *
 * @template TInitialContext - The type of the initial context expected by the first middleware.
 * @template TFirstMiddlewareOutputContext - The type of the context after being processed by this first middleware.
 * @param firstMiddlewareFn - The first middleware function in the chain.
 * @returns A ChainedProcedureBuilder to further build the action or pipe more middleware.
 */
export function createProcedure<TInitialContext, TFirstMiddlewareOutputContext>(
  firstMiddlewareFn: (
    ctx: TInitialContext
  ) => TFirstMiddlewareOutputContext | Promise<TFirstMiddlewareOutputContext>
): ChainedProcedureBuilder<TInitialContext, TFirstMiddlewareOutputContext> {
  // Internal helper function to create the builder object for each step in the chain.
  // This function is called recursively by `pipe`.
  function buildProcedureChainStep<TChainStartCtx, TCurrentOutputCtx>(
    composedMiddleware: (
      ctx: TChainStartCtx
    ) => TCurrentOutputCtx | Promise<TCurrentOutputCtx>
  ): ChainedProcedureBuilder<TChainStartCtx, TCurrentOutputCtx> {
    return {
      pipe: <TNextOutputContext>(
        nextMiddlewareFn: (
          ctx: TCurrentOutputCtx
        ) => TNextOutputContext | Promise<TNextOutputContext>
      ) => {
        const newComposedMiddleware = async (
          initialCtx: TChainStartCtx
        ): Promise<TNextOutputContext> => {
          const prevOutput = await composedMiddleware(initialCtx);
          return nextMiddlewareFn(prevOutput);
        };
        // Recursively call to get the next step's builder
        return buildProcedureChainStep<TChainStartCtx, TNextOutputContext>(
          newComposedMiddleware
        );
      },
      createAction: () => {
        return {
          input: <TSchema extends z.ZodTypeAny>(schema: TSchema) => {
            return {
              /**
               * Defines the main logic for the action.
               * This function receives the validated input and the processed context from the procedure chain.
               *
               * @template TOutput - The return type of the action.
               * @param actionFn - The function containing the action's core logic.
               * @returns The ActionDefinition.
               */
              handler: <TOutput>(
                actionFn: (props: {
                  input: z.infer<TSchema>;
                  ctx: TCurrentOutputCtx; // Uses the output context of *this* step in the chain
                }) => Promise<TOutput>
              ): ActionDefinition<
                z.infer<TSchema>,
                TOutput,
                TChainStartCtx
              > => {
                return async ({ input, ctx: initialCtxValue }) => {
                  const processedCtx = await composedMiddleware(
                    initialCtxValue as TChainStartCtx
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

  // Initial call for the very first procedure.
  return buildProcedureChainStep<
    TInitialContext,
    TFirstMiddlewareOutputContext
  >(firstMiddlewareFn);
}

/**
 * Creates a basic action builder without any specific preceding middleware.
 * This is a convenience function, equivalent to calling `createProcedure` with an identity-like middleware
 * that passes the context through (or provides an empty object if context is initially undefined).
 * The `ctx` in the action handler will be `{}` or the initial context if provided.
 *
 * @returns An object with `input` and `handler` methods to define the action.
 */
export function createAction() {
  // The middleware (ctx: any) => ctx || {} ensures that if initialCtxValue is undefined/null,
  // an empty object is passed to the action handler's `ctx`.
  // If initialCtxValue is provided, it's passed through.
  // TInitialContext becomes `any`, TFirstMiddlewareOutputContext becomes `any` (or effectively `{}` if initial context is nil).
  return createProcedure((ctx: any) => ctx || {}).createAction();
}

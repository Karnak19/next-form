"use server";

import { createAction, createProcedure } from "../core/createAction";
import { exampleSchema } from "./schema";

const authedProcedure = createProcedure(() => {
  return {
    user: {
      name: "John Doe",
    },
  };
});

const combinedProcedure = authedProcedure.pipe((ctx) => {
  return {
    ...ctx,
    admin: true,
  };
});

export const exampleAction = createAction()
  .input(exampleSchema)
  .handler(async ({ input }) => {
    return input;
  });

export const exampleAuthedAction = combinedProcedure
  .createAction()
  .input(exampleSchema)
  .handler(async ({ input, ctx }) => {
    return {
      ...input,
      name: ctx.user.name,
    };
  });

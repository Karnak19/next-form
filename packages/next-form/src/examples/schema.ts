import { z } from "zod";

export const exampleSchema = z.object({
  name: z.string(),
  isAdult: z.boolean(),
});

export type ExampleSchema = z.infer<typeof exampleSchema>;

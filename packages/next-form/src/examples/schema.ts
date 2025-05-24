import { z } from "zod/v4";
import { zSelect } from "./unique-fields";

export const exampleSchema = z.object({
  name: z.string(),
  isAdult: z.boolean(),
  select: zSelect,
});

export type ExampleSchema = z.infer<typeof exampleSchema>;

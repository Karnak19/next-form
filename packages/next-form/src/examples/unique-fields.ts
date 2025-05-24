import { z } from "zod/v4";
import { createUniqueFieldSchema } from "../client";

export const zSelect = createUniqueFieldSchema(z.string(), "select");

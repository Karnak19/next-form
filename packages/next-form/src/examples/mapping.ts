"use client";

import { z } from "zod/v4";
import { createForm } from "../core/createForm";
import TextField from "./text-field";
import { CheckboxField } from "./checkbox-field";
import { zSelect } from "./unique-fields";

export const mapping = [
  [z.string(), TextField],
  [z.boolean(), CheckboxField],
  [zSelect, TextField],
] as const;

export const Form = createForm({ mapping });

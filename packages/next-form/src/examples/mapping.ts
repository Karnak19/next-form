"use client";

import { z } from "zod";
import { createForm } from "../core/createForm";
import TextField from "./text-field";
import { CheckboxField } from "./checkbox-field";

export const mapping = [
  [z.string(), TextField],
  [z.boolean(), CheckboxField],
] as const;

export const Form = createForm({ mapping });

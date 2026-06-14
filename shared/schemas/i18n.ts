import { z } from "zod";

export const localizedStringSchema = z.object({
  de: z.string().min(1),
  en: z.string().min(1),
});

export type LocalizedString = z.infer<typeof localizedStringSchema>;

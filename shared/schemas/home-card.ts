import { z } from "zod";

export const homeCardSchema = z.object({
  id: z.number().positive(),
  slug: z.string(),
  background: z.string(),
  link: z.string().optional(),
});

export type HomeCardSchema = z.infer<typeof homeCardSchema>;

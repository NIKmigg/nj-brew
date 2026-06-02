import { z } from "zod";

export const HomeCardSchema = z.object({
  id: z.number().positive(),
  slug: z.string(),
  background: z.string(),
  link: z.string().optional(),
});

export type HomeCardSchema = z.infer<typeof HomeCardSchema>;

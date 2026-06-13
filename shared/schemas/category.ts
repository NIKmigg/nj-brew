import type { z } from "zod";
import { categories } from "@server/db/schema/categories";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const insertCategorySchema = createInsertSchema(categories, {
  name: field => field.min(1).max(50),
}).omit ({
  id: true,
  createdAt: true,
});
export const categorySchema = createSelectSchema(categories);

export type InsertCategorySchema = z.infer<typeof insertCategorySchema>;
export type SelectCategorySchema = z.infer<typeof categorySchema>;

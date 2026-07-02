import type { z } from "zod";
import { categories } from "@server/db/schema/categories";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { localizedStringSchema } from "./i18n";

export const insertCategorySchema = createInsertSchema(categories, {
  name: () => localizedStringSchema,
}).omit ({
  id: true,
  createdAt: true,
});
export const categorySchema = createSelectSchema(categories);

export type InsertCategorySchema = z.infer<typeof insertCategorySchema>;
export type SelectCategorySchema = z.infer<typeof categorySchema>;

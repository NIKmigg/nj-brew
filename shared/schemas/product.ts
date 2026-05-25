import type { z } from "zod";
import { products } from "@server/db/schema/products";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const insertProductSchema = createInsertSchema(products, {
  name: field => field.min(1).max(100),
  description: field => field.min(1).max(1000),
  price: field => field.min(0.01),
  stock: field => field.min(1),
}).omit({
  id: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
});
export const productSchema = createSelectSchema(products);

export type InsertProductSchema = z.infer<typeof insertProductSchema>;
export type SelectProductSchema = z.infer<typeof productSchema>;

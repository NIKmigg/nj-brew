import { products } from "@server/db/schema/products";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { z } from "zod";

export const insertProductSchema = createInsertSchema(products, {
  name: field => field.min(1).max(100),
  description: field => field.min(1).max(1000),
  price: field => field.min(0.01),
  stock: field => field.min(1),
  category: field => field.min(1).max(50),
}).omit({
  id: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
});
export const productSchema = createSelectSchema(products);

export const productFiltersSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  inStock: z.coerce.boolean().optional(),
  sortBy: z.enum(["price", "name"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type InsertProductSchema = z.infer<typeof insertProductSchema>;
export type SelectProductSchema = z.infer<typeof productSchema>;
export type ProductFilters = z.infer<typeof productFiltersSchema>;

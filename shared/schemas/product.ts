import { products } from "@server/db/schema/products";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { z } from "zod";
import { categorySchema } from "./category";

export const insertProductSchema = createInsertSchema(products, {
  name: field => field.min(1).max(100),
  description: field => field.min(1).max(1000),
  price: field => field.min(0.01),
  stock: field => field.min(1),
  categoryId: field => field.min(1),
}).omit({
  id: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
});
export const productSchema = createSelectSchema(products).extend(
  {
    category: categorySchema.nullable(),
  },
);

export const productFiltersSchema = z.object({
  search: z.string().optional(),
  categoryId: z.coerce.number().nullish().catch(undefined),
  minPrice: z.coerce.number().optional().catch(undefined),
  maxPrice: z.coerce.number().optional().catch(undefined),
  inStock: z.coerce.boolean().optional(),
  sortBy: z.enum(["price", "name"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type InsertProductSchema = z.infer<typeof insertProductSchema>;
export type SelectProductSchema = z.infer<typeof productSchema>;
export type ProductFilters = z.infer<typeof productFiltersSchema>;

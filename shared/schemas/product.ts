import type { z } from "zod";
import { products } from "@server/db/schema/products";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
});
export const productSchema = createSelectSchema(products);

export type ProductInput = z.infer<typeof insertProductSchema>;
export type Product = z.infer<typeof productSchema>;

import {
  categories,
  products,
  productVariants,
  tags,
} from "@server/db/schema/products";

import {
  createInsertSchema,
  createSelectSchema,
} from "drizzle-zod";

import { z } from "zod";

//
// CATEGORY
//
export const insertCategorySchema = createInsertSchema(categories, {
  name: field => field.min(1).max(100),
  slug: field => field.min(1).max(100),
}).omit({
  id: true,
});

export const selectCategorySchema = createSelectSchema(categories);

//
// TAG
//
export const insertTagSchema = createInsertSchema(tags, {
  name: field => field.min(1).max(100),
  slug: field => field.min(1).max(100),
}).omit({
  id: true,
});

export const selectTagSchema = createSelectSchema(tags);

//
// PRODUCT VARIANT
//
export const insertVariantSchema = createInsertSchema(productVariants, {
  name: field => field.min(1).max(50),
  sku: field => field.min(1).max(100),
  price: field => field.min(0.01),
  stock: field => field.min(0),
}).omit({
  id: true,
  productId: true,
});

export const selectVariantSchema = createSelectSchema(productVariants);

//
// PRODUCT
//
export const insertProductSchema
  = createInsertSchema(products, {
    name: field => field.min(1).max(100),
    description: field => field.max(1000),
  })
    .omit({
      id: true,
      slug: true,
      createdAt: true,
      updatedAt: true,
    })
    .extend({
      //
      // Kategorien
      //
      categoryIds: z
        .array(z.number().int())
        .default([]),

      //
      // Tags
      //
      tagIds: z
        .array(z.number().int())
        .default([]),

      //
      // Varianten
      //
      variants: z
        .array(insertVariantSchema)
        .min(1),
    });

export const selectProductSchema = createSelectSchema(products);

//
// TYPES
//
export type InsertCategorySchema = z.infer<typeof insertCategorySchema>;
export type SelectCategorySchema = z.infer<typeof selectCategorySchema>;
export type InsertTagSchema = z.infer<typeof insertTagSchema>;
export type SelectTagSchema = z.infer<typeof selectTagSchema>;
export type InsertVariantSchema = z.infer<typeof insertVariantSchema>;
export type SelectVariantSchema = z.infer<typeof selectVariantSchema>;
export type InsertProductSchema = z.infer<typeof insertProductSchema>;
export type SelectProductSchema = z.infer<typeof selectProductSchema>;

import { cartItems, carts } from "@server/db/schema/carts";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { productSchema } from "./product";

export const insertCartItemSchema = createInsertSchema(cartItems, {
  quantity: field => field.min(1).max(99),
}).omit({
  id: true,
  cartId: true,
  createdAt: true,
  updatedAt: true,
});

export const cartItemSchema = createSelectSchema(cartItems).extend({
  product: productSchema,
});

export const cartSchema = createSelectSchema(carts).extend({
  items: z.array(cartItemSchema),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().min(1).max(99),
});

export type InsertCartItemSchema = z.infer<typeof insertCartItemSchema>;
export type CartItemSchema = z.infer<typeof cartItemSchema>;
export type CartSchema = z.infer<typeof cartSchema>;
export type UpdateCartItemSchema = z.infer<typeof updateCartItemSchema>;

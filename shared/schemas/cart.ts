import { cartItems, carts } from "@server/db/schema/cart";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { productSchema } from "./product";

// --- Cart Item ---

export const insertCartItemSchema = createInsertSchema(cartItems, {
  quantity: field => field.min(1).max(99),
  productId: field => field.min(1),
}).omit({
  id: true,
  cartId: true, // wird serverseitig aus dem aktuellen Cart gesetzt
  createdAt: true,
  updatedAt: true,
});

export const cartItemSchema = createSelectSchema(cartItems).extend({
  product: productSchema,
});

// --- Cart ---

export const cartSchema = createSelectSchema(carts).extend({
  items: z.array(cartItemSchema),
});

// --- Für Mengenänderung im Cart (z.B. Plus/Minus-Buttons) ---

export const updateCartItemSchema = z.object({
  quantity: z.number().min(1).max(99),
});

// --- Types ---

export type InsertCartItemSchema = z.infer<typeof insertCartItemSchema>;
export type CartItemSchema = z.infer<typeof cartItemSchema>;
export type CartSchema = z.infer<typeof cartSchema>;
export type UpdateCartItemSchema = z.infer<typeof updateCartItemSchema>;

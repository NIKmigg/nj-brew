import { orderItems, orders } from "@server/db/schema/orders";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { addressSchema } from "./address";
import { localizedStringSchema } from "./i18n";
import { productSchema } from "./product";

export const orderStatusSchema = z.enum([
  "pending",
  "paid",
  "processing",
  "shipped",
  "completed",
  "cancelled",
]);

export const paymentStatusSchema = z.enum([
  "pending",
  "paid",
  "failed",
  "refunded",
]);

export const orderItemSchema = createSelectSchema(orderItems, {
  productName: () => localizedStringSchema,
  unitPrice: field => field.min(0),
  quantity: field => field.min(1),
  lineTotal: field => field.min(0),
}).extend({
  product: productSchema.nullable().optional(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems, {
  productName: () => localizedStringSchema,
  unitPrice: field => field.min(0),
  quantity: field => field.min(1),
  lineTotal: field => field.min(0),
}).omit({
  id: true,
  orderId: true,
  createdAt: true,
});

export const orderSchema = createSelectSchema(orders, {
  status: () => orderStatusSchema,
  paymentStatus: () => paymentStatusSchema,
  subtotal: field => field.min(0),
  shippingCost: field => field.min(0),
  total: field => field.min(0),
  billingAddress: () => addressSchema,
  shippingAddress: () => addressSchema,
}).extend({
  items: z.array(orderItemSchema),
});

export const insertOrderSchema = createInsertSchema(orders, {
  status: () => orderStatusSchema.optional(),
  paymentStatus: () => paymentStatusSchema.optional(),
  subtotal: field => field.min(0),
  shippingCost: field => field.min(0).optional(),
  total: field => field.min(0),
  billingAddress: () => addressSchema,
  shippingAddress: () => addressSchema,
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const checkoutOrderSchema = z.object({
  billingAddress: addressSchema,
  shippingAddress: addressSchema,
});

export type OrderStatusSchema = z.infer<typeof orderStatusSchema>;
export type PaymentStatusSchema = z.infer<typeof paymentStatusSchema>;
export type OrderItemSchema = z.infer<typeof orderItemSchema>;
export type InsertOrderItemSchema = z.infer<typeof insertOrderItemSchema>;
export type OrderSchema = z.infer<typeof orderSchema>;
export type InsertOrderSchema = z.infer<typeof insertOrderSchema>;
export type CheckoutOrderSchema = z.infer<typeof checkoutOrderSchema>;

import type { LocalizedString } from "@shared/schemas/i18n";
import { sql } from "drizzle-orm";
import { index, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth";
import { products } from "./products";

export type OrderStatus = "pending" | "paid" | "processing" | "shipped" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export const orders = sqliteTable(
  "orders",
  {
    id: text("id").primaryKey(),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    status: text("status").$type<OrderStatus>().default("pending").notNull(),
    paymentStatus: text("payment_status").$type<PaymentStatus>().default("pending").notNull(),

    subtotal: real("subtotal").notNull(),
    shippingCost: real("shipping_cost").default(0).notNull(),
    total: real("total").notNull(),
    currency: text("currency").default("EUR").notNull(),

    billingName: text("billing_name").notNull(),
    billingEmail: text("billing_email").notNull(),
    billingStreet: text("billing_street").notNull(),
    billingPostalCode: text("billing_postal_code").notNull(),
    billingCity: text("billing_city").notNull(),
    billingCountry: text("billing_country").notNull(),

    shippingName: text("shipping_name").notNull(),
    shippingEmail: text("shipping_email").notNull(),
    shippingStreet: text("shipping_street").notNull(),
    shippingPostalCode: text("shipping_postal_code").notNull(),
    shippingCity: text("shipping_city").notNull(),
    shippingCountry: text("shipping_country").notNull(),

    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  table => [
    index("orders_userId_idx").on(table.userId),
    index("orders_status_idx").on(table.status),
    index("orders_paymentStatus_idx").on(table.paymentStatus),
  ],
);

export const orderItems = sqliteTable(
  "order_items",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),

    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),

    productId: integer("product_id").references(() => products.id, { onDelete: "set null" }),

    productSlug: text("product_slug").notNull(),
    productName: text("product_name", { mode: "json" }).notNull().$type<LocalizedString>(),
    unitPrice: real("unit_price").notNull(),
    quantity: integer("quantity").notNull(),
    lineTotal: real("line_total").notNull(),

    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
  },
  table => [
    index("orderItems_orderId_idx").on(table.orderId),
    index("orderItems_productId_idx").on(table.productId),
  ],
);

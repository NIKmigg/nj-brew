import type { Address } from "@shared/schemas/address";
import { cartItems } from "@server/db/schema/carts";
import { orderItems, orders } from "@server/db/schema/orders";
import { products } from "@server/db/schema/products";
import { eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "..";

type CreateOrderFromCartInput = {
  userId: string;
  cartId: string;
  billingAddress: Address;
  shippingAddress: Address;
  shippingCost?: number;
  currency?: string;
};

export async function createOrderFromCart(input: CreateOrderFromCartInput) {
  return db.transaction((tx) => {
    const cart = tx.query.carts.findFirst({
      where: (table, { and, eq }) => and(
        eq(table.id, input.cartId),
        eq(table.userId, input.userId),
      ),
      with: {
        items: {
          with: {
            product: true,
          },
        },
      },
    }).sync();

    if (!cart)
      throw new Error("CART_NOT_FOUND");
    if (!cart.items.length)
      throw new Error("CART_EMPTY");

    for (const item of cart.items) {
      if (!item.product)
        throw new Error("PRODUCT_NOT_FOUND");
      if (item.product.stock < item.quantity)
        throw new Error("INSUFFICIENT_STOCK");
    }

    const orderId = nanoid();
    const shippingCost = input.shippingCost ?? 0;
    const subtotal = toCurrency(
      cart.items.reduce((sum, item) => {
        if (!item.product)
          return sum;

        return sum + item.product.price * item.quantity;
      }, 0),
    );
    const total = toCurrency(subtotal + shippingCost);

    const order = tx.insert(orders).values({
      id: orderId,
      userId: input.userId,
      subtotal,
      shippingCost,
      total,
      currency: input.currency ?? "EUR",
      billingAddress: input.billingAddress,
      shippingAddress: input.shippingAddress,
    }).returning().get();

    if (!order)
      throw new Error("ORDER_NOT_CREATED");

    tx.insert(orderItems).values(
      cart.items.map((item) => {
        if (!item.product)
          throw new Error("PRODUCT_NOT_FOUND");

        return {
          orderId,
          productId: item.product.id,
          productSlug: item.product.slug,
          productName: item.product.name,
          unitPrice: item.product.price,
          quantity: item.quantity,
          lineTotal: toCurrency(item.product.price * item.quantity),
        };
      }),
    ).run();

    for (const item of cart.items) {
      if (!item.product)
        throw new Error("PRODUCT_NOT_FOUND");

      tx.update(products)
        .set({
          stock: sql`${products.stock} - ${item.quantity}`,
        })
        .where(eq(products.id, item.product.id))
        .run();
    }

    tx.delete(cartItems).where(eq(cartItems.cartId, input.cartId)).run();

    return tx.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        items: {
          with: {
            product: {
              with: { category: true },
            },
          },
        },
      },
    }).sync();
  });
}

function toCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

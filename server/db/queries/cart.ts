import { db } from "@server/db";
import { cartItems, carts } from "@server/db/schema/carts";
import { products } from "@server/db/schema/products";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function getOrCreateCart(userId: string) {
  const existing = await db.query.carts.findFirst({
    where: eq(carts.userId, userId),
  });

  if (existing)
    return existing;

  const [newCart] = await db.insert(carts).values({
    id: nanoid(),
    userId,
  }).returning();

  if (!newCart) {
    throw new Error("Warenkorb konnte nicht erstellt werden");
  }

  return newCart;
}

export async function getCartWithItems(cartId: string) {
  return db.query.carts.findFirst({
    where: eq(carts.id, cartId),
    with: {
      items: {
        with: {
          product: {
            with: { category: true },
          },
        },
      },
    },
  });
}

export async function findCartItem(cartId: string, productId: string) {
  return db.query.cartItems.findFirst({
    where: and(
      eq(cartItems.cartId, cartId),
      eq(cartItems.productId, productId),
    ),
  });
}

export async function findCartItemById(cartId: string, itemId: string) {
  return db.query.cartItems.findFirst({
    where: and(eq(cartItems.id, itemId), eq(cartItems.cartId, cartId)),
  });
}

export async function addCartItem(
  cartId: string,
  productId: string,
  quantity: number,
) {
  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
  });
  if (!product)
    throw new Error("PRODUCT_NOT_FOUND");
  if (product.stock < quantity)
    throw new Error("INSUFFICIENT_STOCK");

  const existing = await findCartItem(cartId, productId);

  if (existing) {
    return db.update(cartItems)
      .set({ quantity: existing.quantity + quantity })
      .where(eq(cartItems.id, existing.id))
      .returning();
  }

  return db.insert(cartItems).values({
    id: nanoid(),
    cartId,
    productId,
    quantity,
  }).returning();
}

export async function updateCartItemQuantity(
  cartId: string,
  itemId: string,
  quantity: number,
) {
  const item = await findCartItemById(cartId, itemId);
  if (!item)
    throw new Error("ITEM_NOT_FOUND");

  return db.update(cartItems)
    .set({ quantity })
    .where(eq(cartItems.id, itemId))
    .returning();
}

export async function removeCartItem(cartId: string, itemId: string) {
  return db.delete(cartItems)
    .where(and(eq(cartItems.id, itemId), eq(cartItems.cartId, cartId)));
}

export async function clearCart(cartId: string) {
  return db.delete(cartItems).where(eq(cartItems.cartId, cartId));
}

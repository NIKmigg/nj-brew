import { getOrCreateCart } from "@server/db/queries/cart";
import { createOrderFromCart } from "@server/db/queries/order";
import { requireUser } from "@server/utils/require-user";
import { checkoutOrderSchema, orderSchema } from "@shared/schemas/order";

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, checkoutOrderSchema.parse);
  const { user } = await requireUser(event);
  const cart = await getOrCreateCart(user.id);

  try {
    const order = await createOrderFromCart({
      userId: user.id,
      cartId: cart.id,
      billingAddress: body.billingAddress,
      shippingAddress: body.shippingAddress,
    });

    setResponseStatus(event, 201);
    return orderSchema.parse(order);
  }
  catch (error) {
    if (error instanceof Error && error.message === "CART_EMPTY") {
      throw createError({ statusCode: 400, message: "Warenkorb ist leer" });
    }
    if (error instanceof Error && error.message === "CART_NOT_FOUND") {
      throw createError({ statusCode: 404, message: "Warenkorb nicht gefunden" });
    }
    if (error instanceof Error && error.message === "PRODUCT_NOT_FOUND") {
      throw createError({ statusCode: 404, message: "Produkt nicht gefunden" });
    }
    if (error instanceof Error && error.message === "INSUFFICIENT_STOCK") {
      throw createError({ statusCode: 400, message: "Nicht genug Lagerbestand" });
    }

    throw error;
  }
});

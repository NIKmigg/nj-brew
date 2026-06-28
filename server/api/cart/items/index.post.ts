import { addCartItem, getOrCreateCart } from "@server/db/queries/cart";
import { requireUser } from "@server/utils/require-user";
import { insertCartItemSchema } from "@shared/schemas/cart";

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, insertCartItemSchema.parse);
  const { user } = await requireUser(event);

  const cart = await getOrCreateCart(user.id);

  try {
    await addCartItem(cart.id, body.productId, body.quantity);
  }
  catch (err) {
    if (err instanceof Error && err.message === "INSUFFICIENT_STOCK") {
      throw createError({ statusCode: 400, message: "Nicht genug Lagerbestand" });
    }
    if (err instanceof Error && err.message === "PRODUCT_NOT_FOUND") {
      throw createError({ statusCode: 404, message: "Produkt nicht gefunden" });
    }
    throw err;
  }

  setResponseStatus(event, 201);
});

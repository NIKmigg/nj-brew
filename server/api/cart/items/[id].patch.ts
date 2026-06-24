import { getOrCreateCart, updateCartItemQuantity } from "@server/db/queries/cart";
import { requireUserSession } from "@server/utils/session";
import { updateCartItemSchema } from "@shared/schemas/cart";

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));
  const body = await readValidatedBody(event, updateCartItemSchema.parse);
  const { user } = await requireUserSession(event);

  const cart = await getOrCreateCart(user.id);

  try {
    await updateCartItemQuantity(cart.id, id, body.quantity);
  }
  catch {
    throw createError({ statusCode: 404, message: "Eintrag nicht gefunden" });
  }
});

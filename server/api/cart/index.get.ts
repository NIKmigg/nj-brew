import { getCartWithItems, getOrCreateCart } from "@server/db/queries/cart";
import { requireUserSession } from "@server/utils/session";
import { cartSchema } from "@shared/schemas/cart";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const cart = await getOrCreateCart(user.id);
  const result = await getCartWithItems(cart.id);

  return cartSchema.parse(result);
});

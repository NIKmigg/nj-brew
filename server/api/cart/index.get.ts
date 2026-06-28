import { getCartWithItems, getOrCreateCart } from "@server/db/queries/cart";
import { requireUser } from "@server/utils/require-user";
import { cartSchema } from "@shared/schemas/cart";

export default defineEventHandler(async (event) => {
  const { user } = await requireUser(event);

  const cart = await getOrCreateCart(user.id);
  const result = await getCartWithItems(cart.id);

  return cartSchema.parse(result);
});

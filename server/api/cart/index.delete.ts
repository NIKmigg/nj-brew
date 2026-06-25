import { clearCart, getOrCreateCart } from "@server/db/queries/cart";
import { requireUserSession } from "@server/utils/session";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const cart = await getOrCreateCart(user.id);
  await clearCart(cart.id);
});

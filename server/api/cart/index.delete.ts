import { clearCart, getOrCreateCart } from "@server/db/queries/cart";
import { requireUser } from "@server/utils/require-user";

export default defineEventHandler(async (event) => {
  const { user } = await requireUser(event);

  const cart = await getOrCreateCart(user.id);
  await clearCart(cart.id);
});

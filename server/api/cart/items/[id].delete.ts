import { getOrCreateCart, removeCartItem } from "@server/db/queries/cart";
import { requireUser } from "@server/utils/require-user";

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));
  const { user } = await requireUser(event);

  const cart = await getOrCreateCart(user.id);
  await removeCartItem(cart.id, id);
});

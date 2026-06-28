import { getOrCreateCart, removeCartItem } from "@server/db/queries/cart";
import { requireUser } from "@server/utils/require-user";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const { user } = await requireUser(event);

  if (!id)
    throw createError({ statusCode: 400, message: "Eintrag fehlt" });

  const cart = await getOrCreateCart(user.id);
  await removeCartItem(cart.id, id);
});

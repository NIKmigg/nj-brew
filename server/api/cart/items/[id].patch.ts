import { getOrCreateCart, updateCartItemQuantity } from "@server/db/queries/cart";
import { requireUser } from "@server/utils/require-user";
import { updateCartItemSchema } from "@shared/schemas/cart";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readValidatedBody(event, updateCartItemSchema.parse);
  const { user } = await requireUser(event);

  if (!id)
    throw createError({ statusCode: 400, message: "Eintrag fehlt" });

  const cart = await getOrCreateCart(user.id);

  try {
    await updateCartItemQuantity(cart.id, id, body.quantity);
  }
  catch {
    throw createError({ statusCode: 404, message: "Eintrag nicht gefunden" });
  }
});

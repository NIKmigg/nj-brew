import { findProductBySlug } from "@server/db/queries/product";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: "Slug fehlt",
    });
  }

  const product = await findProductBySlug(slug);

  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: "Produkt nicht gefunden",
    });
  }

  return product;
});

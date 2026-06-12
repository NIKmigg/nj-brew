import { findProducts } from "@server/db/queries/product";
import { productFiltersSchema } from "~~/shared/schemas/product";

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const filters = productFiltersSchema.parse(query);
  return findProducts(filters);
});

import { findProducts } from "@server/db/queries/product";

export default defineEventHandler(() => {
  return findProducts();
});

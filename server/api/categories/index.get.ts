import { findCategories } from "@server/db/queries/category";

export default defineEventHandler(() => {
  return findCategories();
});

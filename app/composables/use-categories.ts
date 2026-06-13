import type { SelectCategorySchema } from "~~/shared/schemas/category";

export function useCategories() {
  const { data: categories, status } = useFetch<SelectCategorySchema[]>("/api/categories");

  return { categories, status };
}

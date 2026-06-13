import type { ProductFilters, SelectProductSchema } from "~~/shared/schemas/product";

export function useProductFilters() {
  const filters = ref<ProductFilters>({ categoryId: null });

  const query = computed(() => ({
    ...filters.value,
    inStock: filters.value.inStock || undefined,
  }));

  const { data: products, status, error, refresh } = useFetch<SelectProductSchema[]>("/api/products", {
    query,
  });

  const safeProducts = computed(() => products.value ?? []);

  function resetFilters(type: string) {
    switch (type) {
      case "sort":
        filters.value.sortBy = undefined;
        filters.value.sortOrder = undefined;
        break;
      case "filter":
        filters.value.categoryId = null;
        filters.value.inStock = undefined;
        filters.value.maxPrice = undefined;
        filters.value.minPrice = undefined;
        break;
      default:
        filters.value = { categoryId: null };
        break;
    }
  }

  type SortBy = NonNullable<ProductFilters["sortBy"]>;
  type SortOrder = NonNullable<ProductFilters["sortOrder"]>;

  function isActiveSort(sortBy: SortBy, sortOrder: SortOrder) {
    return filters.value.sortBy === sortBy && filters.value.sortOrder === sortOrder;
  }

  function setSort(sortBy: SortBy, sortOrder: SortOrder) {
    filters.value.sortBy = sortBy;
    filters.value.sortOrder = sortOrder;
  }

  const isSortActive = computed(() =>
    !!(filters.value.sortBy && filters.value.sortOrder),
  );

  const isFilterActive = computed(() =>
    !!(
      filters.value.categoryId != null
      || filters.value.inStock === true
      || filters.value.maxPrice
      || filters.value.minPrice
    ),
  );

  let interval: ReturnType<typeof setInterval>;

  onMounted(() => {
    interval = setInterval(refresh, 60_000);
  });

  onUnmounted(() => {
    clearInterval(interval);
  });

  return {
    filters,
    products: safeProducts,
    status,
    error,
    resetFilters,
    isActiveSort,
    setSort,
    isSortActive,
    isFilterActive,
  };
}

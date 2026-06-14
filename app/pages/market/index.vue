<template>
  <div>
    <section class="py-16 mx-auto max-w-3xl px-4">
      <div class="container my-auto text-center mx-auto max-w-3xl">
        <p class="text-4xl font-bold mb-4 font-old-style">
          {{ $t('market.hero.title') }}
        </p>
        <p>{{ $t('market.hero.body') }}</p>
      </div>
    </section>
    <WaveCard />
    <section class="bg-base-200 py-16">
      <div class="container my-auto text-center mx-auto max-w-7xl px-4">
        <div class="container my-auto text-center mx-auto max-w-3xl mb-8">
          <p class="text-4xl font-bold mb-4 font-old-style">
            {{ $t('market.browse.title') }}
          </p>
          <p>
            {{ $t('market.browse.body') }}
            <br>
            {{ $t('market.browse.hint') }}
          </p>
        </div>
        <div class="mb-8 flex justify-center">
          <label class="input input-neutral border-none w-100">
            <Icon name="mdi:magnify" class="text-xl" />
            <input
              v-model="filters.search"
              type="search"
              required
              :placeholder="$t('market.filter.search')"
              class=""
            >
          </label>

          <div class="dropdown dropdown-end">
            <button tabindex="0" type="button" class="btn btn-ghost btn-circle ml-4 hover:bg-neutral">
              <Icon
                name="mdi:filter"
                class="text-2xl cursor-pointer"
                :class="{
                  'text-neutral': isFilterActive,
                  'hover:text-base-content': isFilterActive,
                }"
              />
            </button>

            <div tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box shadow-lg p-4 w-64 mt-2 gap-4">
              <div class="flex flex-col gap-1">
                <span class="text-sm font-semibold text-start">{{ $t('market.filter.category') }}</span>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="filters.categoryId"
                    type="radio"
                    :value="null"
                    class="radio radio-sm"
                  >
                  <span>{{ $t('market.filter.all') }}</span>
                </label>
                <label
                  v-for="category in categories"
                  :key="category.id"
                  class="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    v-model="filters.categoryId"
                    type="radio"
                    :value="category.id"
                    class="radio radio-sm"
                  >
                  <span>{{ localize(category.name) }}</span>
                </label>
              </div>

              <div class="flex flex-col gap-1">
                <span class="text-sm font-semibold text-start">{{ $t('market.filter.price') }}</span>
                <div class="flex items-center gap-2">
                  <input
                    v-model.number="filters.minPrice"
                    type="number"
                    placeholder="Min"
                    class="input input-sm input-bordered w-full"
                  >
                  <span>-</span>
                  <input
                    v-model.number="filters.maxPrice"
                    type="number"
                    placeholder="Max"
                    class="input input-sm input-bordered w-full"
                  >
                </div>
              </div>

              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="filters.inStock"
                  type="checkbox"
                  class="checkbox checkbox-sm"
                  :true-value="true"
                  :false-value="undefined"
                >
                <span>{{ $t('market.filter.inStock') }}</span>
              </label>

              <button type="button" class="btn btn-sm" @click="resetFilters('filter')">
                {{ $t('market.filter.reset') }}
              </button>
            </div>
          </div>
          <div class="dropdown dropdown-end">
            <button
              tabindex="0"
              type="button"
              class="btn btn-ghost btn-circle ml-4 hover:bg-neutral"
            >
              <Icon
                name="mdi:sort"
                class="text-2xl cursor-pointer"
                :class="{
                  'text-neutral': isSortActive,
                  'hover:text-base-content': isSortActive,
                }"
              />
            </button>

            <div tabindex="0" class="dropdown-content menu bg-base-100 rounded-box shadow-lg p-4 w-64 mt-2 gap-4">
              <div class="flex flex-col gap-1">
                <button
                  class="btn btn-ghost justify-start"
                  :class="{ 'bg-neutral': isActiveSort('price', 'asc') }"
                  @click="setSort('price', 'asc')"
                >
                  <Icon name="mdi:sort-ascending" />
                  {{ $t('market.sort.priceAsc') }}
                </button>
                <button
                  class="btn btn-ghost justify-start"
                  :class="{ 'bg-neutral': isActiveSort('price', 'desc') }"
                  @click="setSort('price', 'desc')"
                >
                  <Icon name="mdi:sort-descending" />
                  {{ $t('market.sort.priceDesc') }}
                </button>
                <button
                  class="btn btn-ghost justify-start"
                  :class="{ 'bg-neutral': isActiveSort('name', 'asc') }"
                  @click="setSort('name', 'asc')"
                >
                  <Icon name="mdi:sort-alphabetical-ascending" />
                  {{ $t('market.sort.nameAsc') }}
                </button>
                <button
                  class="btn btn-ghost justify-start"
                  :class="{ 'bg-neutral': isActiveSort('name', 'desc') }"
                  @click="setSort('name', 'desc')"
                >
                  <Icon name="mdi:sort-alphabetical-descending" />
                  {{ $t('market.sort.nameDesc') }}
                </button>
                <button class="btn btn-sm" @click="resetFilters('sort')">
                  {{ $t('market.sort.reset') }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="status === 'idle' || (status === 'pending' && !products?.length)"
          class="flex justify-center"
        >
          <span class="loading loading-spinner loading-lg" />
        </div>

        <div
          v-else-if="error"
          class="alert alert-error"
        >
          <span>{{ error.message }}</span>
        </div>

        <div
          v-else
          class="flex flex-wrap gap-8 justify-center h-auto"
        >
          <NuxtLink
            v-for="product in products"
            :key="product.id"
            :to="`/market/${product.slug}`"
          >
            <MarketProductCard :product="product" />
          </NuxtLink>
        </div>
      </div>
    </section>
    <WaveCard class="rotate-180 bg-base-100/80" />
    <section class="bg-base-100/80 py-16">
      <div class="container my-auto text-center mx-auto max-w-3xl px-4">
        <p class="text-4xl font-bold mb-4 font-old-style">
          {{ $t('market.contact.title') }}
        </p>
        <p>{{ $t('market.contact.body') }}</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const toast = useToast();
const { localize } = useLocalize();

definePageMeta({
  middleware: "auth",
});

const { filters, products, status, error, resetFilters, isActiveSort, setSort, isSortActive, isFilterActive } = useProductFilters();
const { categories } = useCategories();

onMounted(() => {
  toast.show($t("market.toast"), "warning", 9000);
});
</script>

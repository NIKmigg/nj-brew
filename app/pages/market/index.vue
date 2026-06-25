<template>
  <div>
    <section v-section-reveal class="py-16 mx-auto max-w-3xl px-4">
      <div class="container my-auto text-center mx-auto max-w-3xl">
        <h1 data-split class="text-4xl font-bold mb-4 font-old-style">
          {{ $t('market.hero.title') }}
        </h1>
        <p data-split="{ type: 'word', stagger: 0.015 }">
          {{ $t('market.hero.body') }}
        </p>
      </div>
    </section>
    <WaveCard />
    <section class="bg-base-200 py-16">
      <div class="container my-auto text-center mx-auto max-w-7xl px-4">
        <div v-section-reveal class="container my-auto text-center mx-auto max-w-3xl mb-8">
          <h2 data-split class="text-4xl font-bold mb-4 font-old-style">
            {{ $t('market.browse.title') }}
          </h2>
          <p data-split="{ type: 'word', stagger: 0.015 }">
            {{ $t('market.browse.body') }}
            <br>
            {{ $t('market.browse.hint') }}
          </p>
        </div>
        <div class="mb-8 flex justify-center">
          <label class="input input-neutral w-100 border-none">
            <Icon
              name="mdi:magnify"
              class="text-xl"
            />

            <input
              v-model="filters.search"
              type="search"
              :placeholder="$t('market.filter.search')"
              :aria-label="$t('market.filter.search')"
            >
          </label>

          <!-- Filter -->
          <GsapDropdown
            id="market-filter"
            type="dialog"
            align="end"
            :label="$t('market.filter.category')"
            :duration="0.65"
            :close-time-scale="2.5"
            open-ease="elastic.out(0.9, 0.45)"
            close-ease="power3.in"
            trigger-class="btn btn-ghost btn-circle ml-4 hover:bg-neutral"
            panel-class="mt-2 w-64 rounded-box bg-base-100 p-4 shadow-lg"
          >
            <template #trigger="{ open }">
              <Icon
                :name="open ? 'mdi:filter' : 'mdi:filter-outline'"
                class="cursor-pointer text-2xl"
                :class="{
                  'text-neutral': isFilterActive,
                  'hover:text-base-content': isFilterActive,
                }"
              />
            </template>

            <template #default="{ close }">
              <div class="flex flex-col gap-4">
                <fieldset class="flex flex-col gap-1">
                  <legend class="mb-1 text-start text-sm font-semibold">
                    {{ $t("market.filter.category") }}
                  </legend>

                  <label class="flex cursor-pointer items-center gap-2">
                    <input
                      v-model="filters.categoryId"
                      type="radio"
                      :value="null"
                      class="radio radio-sm"
                    >

                    <span>
                      {{ $t("market.filter.all") }}
                    </span>
                  </label>

                  <label
                    v-for="category in categories"
                    :key="category.id"
                    class="flex cursor-pointer items-center gap-2"
                  >
                    <input
                      v-model="filters.categoryId"
                      type="radio"
                      :value="category.id"
                      class="radio radio-sm"
                    >

                    <span>
                      {{ localize(category.name) }}
                    </span>
                  </label>
                </fieldset>

                <fieldset class="flex flex-col gap-1">
                  <legend class="mb-1 text-start text-sm font-semibold">
                    {{ $t("market.filter.price") }}
                  </legend>

                  <div class="flex items-center gap-2">
                    <input
                      v-model.number="filters.minPrice"
                      type="number"
                      inputmode="decimal"
                      placeholder="Min"
                      :aria-label="`${$t('market.filter.price')} Min`"
                      class="input input-bordered input-sm w-full"
                    >

                    <span aria-hidden="true">
                      –
                    </span>

                    <input
                      v-model.number="filters.maxPrice"
                      type="number"
                      inputmode="decimal"
                      placeholder="Max"
                      :aria-label="`${$t('market.filter.price')} Max`"
                      class="input input-bordered input-sm w-full"
                    >
                  </div>
                </fieldset>

                <label class="flex cursor-pointer items-center gap-2">
                  <input
                    v-model="filters.inStock"
                    type="checkbox"
                    class="checkbox checkbox-sm"
                    :true-value="true"
                    :false-value="undefined"
                  >

                  <span>
                    {{ $t("market.filter.inStock") }}
                  </span>
                </label>

                <div class="flex gap-2">
                  <button
                    type="button"
                    class="btn btn-sm flex-1"
                    @click="resetFilters('filter')"
                  >
                    {{ $t("market.filter.reset") }}
                  </button>

                  <button
                    type="button"
                    class="btn btn-primary btn-sm flex-1"
                    @click="close()"
                  >
                    {{ $t("common.close") }}
                  </button>
                </div>
              </div>
            </template>
          </GsapDropdown>

          <!-- Sortierung -->
          <GsapDropdown
            id="market-sort"
            type="menu"
            align="end"
            :label="$t('market.sort.reset')"
            :duration="0.65"
            :close-time-scale="2.5"
            open-ease="elastic.out(0.9, 0.45)"
            close-ease="power3.in"
            trigger-class="btn btn-ghost btn-circle ml-4 hover:bg-neutral"
            panel-class="mt-2 w-64 rounded-box bg-base-100 p-4 shadow-lg"
          >
            <template #trigger="{ open }">
              <Icon
                :name="open ? 'mdi:sort' : 'mdi:sort'"
                class="cursor-pointer text-2xl"
                :class="{
                  'text-neutral': isSortActive,
                  'hover:text-base-content': isSortActive,
                }"
              />
            </template>

            <template #default="{ close }">
              <div class="flex flex-col gap-1">
                <button
                  type="button"
                  role="menuitemradio"
                  class="btn btn-ghost justify-start"
                  :class="{
                    'bg-neutral': isActiveSort('price', 'asc'),
                  }"
                  :aria-checked="isActiveSort('price', 'asc')"
                  @click="applySort('price', 'asc', close)"
                >
                  <Icon name="mdi:sort-ascending" />

                  {{ $t("market.sort.priceAsc") }}
                </button>

                <button
                  type="button"
                  role="menuitemradio"
                  class="btn btn-ghost justify-start"
                  :class="{
                    'bg-neutral': isActiveSort('price', 'desc'),
                  }"
                  :aria-checked="isActiveSort('price', 'desc')"
                  @click="applySort('price', 'desc', close)"
                >
                  <Icon name="mdi:sort-descending" />

                  {{ $t("market.sort.priceDesc") }}
                </button>

                <button
                  type="button"
                  role="menuitemradio"
                  class="btn btn-ghost justify-start"
                  :class="{
                    'bg-neutral': isActiveSort('name', 'asc'),
                  }"
                  :aria-checked="isActiveSort('name', 'asc')"
                  @click="applySort('name', 'asc', close)"
                >
                  <Icon name="mdi:sort-alphabetical-ascending" />

                  {{ $t("market.sort.nameAsc") }}
                </button>

                <button
                  type="button"
                  role="menuitemradio"
                  class="btn btn-ghost justify-start"
                  :class="{
                    'bg-neutral': isActiveSort('name', 'desc'),
                  }"
                  :aria-checked="isActiveSort('name', 'desc')"
                  @click="applySort('name', 'desc', close)"
                >
                  <Icon name="mdi:sort-alphabetical-descending" />

                  {{ $t("market.sort.nameDesc") }}
                </button>

                <div class="divider my-2" />

                <button
                  type="button"
                  role="menuitem"
                  class="btn btn-sm"
                  @click="resetSort(close)"
                >
                  {{ $t("market.sort.reset") }}
                </button>
              </div>
            </template>
          </GsapDropdown>
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
            :to="localePath(`/market/${product.slug}`)"
          >
            <MarketProductCard :product="product" />
          </NuxtLink>
        </div>
      </div>
    </section>
    <WaveCard class="rotate-180 bg-base-100/80" />
    <section v-section-reveal class="bg-base-100/80 py-16">
      <div class="container my-auto text-center mx-auto max-w-3xl px-4">
        <h2 data-split class="text-4xl font-bold mb-4 font-old-style">
          {{ $t('market.contact.title') }}
        </h2>
        <p data-split="{ type: 'word', stagger: 0.015 }">
          {{ $t('market.contact.body') }}
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
type SortField = "price" | "name";
type SortDirection = "asc" | "desc";
type CloseDropdown = () => void;

const toast = useToast();
const { localize } = useLocalize();
const localePath = useLocalePath();

definePageMeta({
  middleware: "auth",
  titleKey: "seo.market.title",
  descriptionKey: "seo.market.description",
});

const {
  filters,
  products,
  status,
  error,
  resetFilters,
  isActiveSort,
  setSort,
  isSortActive,
  isFilterActive,
} = useProductFilters();

const { categories } = useCategories();

function applySort(
  field: SortField,
  direction: SortDirection,
  close: CloseDropdown,
) {
  setSort(field, direction);
  close();
}

function resetSort(close: CloseDropdown) {
  resetFilters("sort");
  close();
}

onMounted(() => {
  toast.show(
    $t("market.toast"),
    "warning",
    9000,
  );
});
</script>

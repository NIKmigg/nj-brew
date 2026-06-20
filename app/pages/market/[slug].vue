<template>
  <div>
    <div v-if="product" class="max-w-6xl mx-auto">
      <div class="grid gap-10 lg:grid-cols-2">
        <div class="rounded-2xl overflow-hidden bg-base-100 border border-base-300">
          <img
            :src="product.imageUrl || ''"
            :alt="localize(product.name)"
            class="w-full h-full object-cover"
          >
        </div>
        <div class="space-y-6">
          <div>
            <h1 class="text-4xl font-bold">
              {{ localize(product.name) }}
            </h1>
            <p class="mt-4 text-base-content/70">
              {{ product.description ? localize(product.description) : "" }}
            </p>
          </div>
          <div class="text-3xl font-semibold">
            {{ formatPrice(product.price) }}
          </div>
          <div>
            <div
              class="badge"
              :class="product.stock > 0
                ? 'badge-success'
                : 'badge-error'"
            >
              {{
                product.stock > 0
                  ? $t("market.product.available", { count: product.stock })
                  : $t("market.product.notAvailable")
              }}
            </div>
          </div>
          <button class="btn btn-primary btn-lg" type="button" :aria-label="$t('market.product.buyProduct', { name: localize(product.name) })">
            {{ $t("market.product.buy") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SelectProductSchema } from "@shared/schemas/product";

const { localize } = useLocalize();

definePageMeta({
  middleware: "auth",
});

const route = useRoute();

const {
  data: product,
  error,
} = await useFetch<SelectProductSchema>(
  `/api/products/${route.params.slug}`,
);

if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Produkt nicht gefunden",
  });
}

usePageSeo({
  title: () => product.value ? localize(product.value.name) : $t("seo.market.title"),
  description: () => product.value?.description ? localize(product.value.description) : $t("seo.market.description"),
  image: () => product.value?.imageUrl ?? "/market-light.webp",
});

function formatPrice(price: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}
</script>

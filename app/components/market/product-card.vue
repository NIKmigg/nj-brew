<template>
  <div class="md:hover-3d">
    <div class="card bg-base-100 w-90 h-100 shadow-sm">
      <div
        class="absolute left-1/2 top-20 -translate-x-1/2 w-50 h-50 rounded-full blur-3xl bg-neutral/30 pointer-events-none z-0"
      />
      <div v-if="product.category" class="badge badge-soft badge-neutral absolute top-2 right-2 z-1">
        {{ localize(product.category.name) }}
      </div>
      <figure class="px-10 pt-10 z-1">
        <img
          :src="product.imageUrl || ''"
          :alt="localize(product.name)"
          class="rounded-xl w-48 h-48 object-cover"
        >
      </figure>
      <div class="card-body items-center text-center z-1">
        <h2 class="card-title line-clamp-1">
          {{ localize(product.name) }}
        </h2>
        <p class="line-clamp-2">
          {{ product.description ? localize(product.description) : "" }}
        </p>
        <div class="card-actions">
          <button
            type="button"
            class="btn btn-circle absolute right-2 bottom-2 shadow-xl hover:bg-neutral"
            :aria-label="$t('market.product.addToCart', { name: localize(product.name) })"
            @click.stop="handleAddToCart"
          >
            <Icon name="mdi:cart-add" class="text-2xl" />
          </button>
        </div>
        <div class="mt-4 flex items-center justify-between">
          <span class="font-semibold">
            {{ formatPrice(product.price) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SelectProductSchema } from "@shared/schemas/product";

const { product } = defineProps<{ product: SelectProductSchema }>();
const { localize } = useLocalize();

function formatPrice(price: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

function handleAddToCart() {
  console.warn(`Adding product ${localize(product.name)} to cart`);
}
</script>

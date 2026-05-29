<template>
  <div class="card bg-base-100 w-100 shadow-sm justify-self-center">
    <div
      class="absolute left-1/2 top-20 -translate-x-1/2 w-50 h-50 rounded-full blur-3xl bg-neutral/30 pointer-events-none"
    />
    <figure class="px-10 pt-10">
      <img
        :src="product.imageUrl || ''"
        :alt="product.name"
        class="rounded-xl w-48 h-48 object-cover"
      >
    </figure>
    <div class="card-body items-center text-center">
      <h2 class="card-title">
        {{ product.name }}
      </h2>
      <p>{{ product.description }}</p>
      <div class="card-actions">
        <button class="btn btn-primary">
          Buy Now
        </button>
      </div>
      <div class="mt-4 flex items-center justify-between">
        <span class="font-semibold">
          {{ formatPrice(product.price) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SelectProductSchema } from "@shared/schemas/product";

defineProps<{ product: SelectProductSchema }>();

function formatPrice(price: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}
</script>

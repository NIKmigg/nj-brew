<template>
  <div>
    <div v-if="product" class="max-w-6xl mx-auto">
      <div class="grid gap-10 lg:grid-cols-2">
        <div class="rounded-2xl overflow-hidden bg-base-100 border border-base-300">
          <img
            :src="product.imageUrl || ''"
            :alt="product.name"
            class="w-full h-full object-cover"
          >
        </div>
        <div class="space-y-6">
          <div>
            <h1 class="text-4xl font-bold">
              {{ product.name }}
            </h1>
            <p class="mt-4 text-base-content/70">
              {{ product.description }}
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
                  ? `${product.stock} verfügbar`
                  : "Nicht verfügbar"
              }}
            </div>
          </div>
          <button class="btn btn-primary btn-lg">
            Kaufen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SelectProductSchema } from "@shared/schemas/product";

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

function formatPrice(price: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}
</script>

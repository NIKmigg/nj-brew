<template>
  <div class="space-y-6 p-6">
    <div
      class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
    >
      <div
        v-for="product in safeProducts"
        :key="product.id"
        class="card bg-base-100 shadow-sm"
      >
        <figure
          v-if="product.imageUrl"
          class="aspect-video overflow-hidden"
        >
          <img
            :src="product.imageUrl"
            :alt="product.name"
            class="h-50 w-50 object-cover"
          >
        </figure>

        <div class="card-body">
          <h2 class="card-title">
            {{ product.name }}
          </h2>

          <p class="text-sm text-base-content/70">
            {{ product.description }}
          </p>

          <div class="mt-4 flex items-center justify-between">
            <span class="font-semibold">
              {{ formatPrice(product.price) }}
            </span>

            <div
              class="badge"
              :class="product.stock > 0
                ? 'badge-success'
                : 'badge-error'"
            >
              {{ product.stock }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="pending"
      class="flex justify-center"
    >
      <span class="loading loading-spinner loading-lg" />
    </div>

    <div
      v-if="error"
      class="alert alert-error"
    >
      <span>{{ error.message }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SelectProductSchema } from "@shared/schemas/product";

definePageMeta({
  middleware: "auth",
});

const {
  data: products,
  pending,
  error,
  refresh,
} = await useFetch<SelectProductSchema[]>("/api/products");

const safeProducts = computed(
  () => products.value ?? [],
);

let interval: ReturnType<typeof setInterval>;

onMounted(() => {
  interval = setInterval(() => {
    refresh();
  }, 30_000);
});

onUnmounted(() => {
  clearInterval(interval);
});

function formatPrice(price: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}
</script>

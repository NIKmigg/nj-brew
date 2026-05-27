<template>
  <div>
    <div
      v-if="pending"
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

    <div v-else class="grid gap-6 grid-cols-[repeat(auto-fit,minmax(380px,1fr))] justify-center">
      <NuxtLink
        v-for="product in safeProducts"
        :key="product.id"
        :to="`/market/${product.slug}`"
        class="justify-self-center"
      >
        <MarketProductCard :product="product" />
      </NuxtLink>
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
</script>

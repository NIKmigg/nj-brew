<template>
  <div class="mx-auto max-w-6xl px-4 py-8 sm:py-12">
    <header class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-4xl font-bold sm:text-5xl">
          {{ $t("cart.title") }}
        </h1>
      </div>
    </header>

    <div
      v-if="status === 'pending'"
      class="rounded-lg bg-base-100/90 p-12 text-center shadow-sm"
    >
      <span class="loading loading-spinner loading-lg text-primary" />
    </div>

    <div
      v-else-if="items.length === 0"
      class="rounded-lg bg-base-100/90 px-6 py-16 text-center shadow-sm"
    >
      <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-base-200 text-primary">
        <Icon name="mdi:basket-outline" class="size-8" />
      </div>
      <p class="mb-6 text-lg font-medium">
        {{ $t("cart.empty") }}
      </p>
      <NuxtLink :to="localePath('/market')" class="btn btn-primary">
        <Icon name="mdi:storefront-outline" class="size-5" />
        {{ $t("nav.market") }}
      </NuxtLink>
    </div>

    <div v-else class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div class="space-y-4">
        <article
          v-for="item in items"
          :key="item.id"
          class="overflow-hidden rounded-lg bg-base-100/90 shadow-sm"
        >
          <div class="flex gap-4 p-4 sm:p-5">
            <img
              v-if="item.product.imageUrl"
              :src="item.product.imageUrl"
              :alt="item.product.name[locale]"
              class="size-20 shrink-0 rounded-md object-cover sm:size-24"
            >
            <div
              v-else
              class="flex size-20 shrink-0 items-center justify-center rounded-md bg-base-200 sm:size-24"
            >
              <Icon name="mdi:leaf" class="size-8 text-base-content/40" />
            </div>

            <div class="min-w-0 flex-1">
              <NuxtLink :to="localePath(`/market/${item.product.slug}`)">
                <p class="truncate text-lg font-semibold transition-colors hover:text-primary">
                  {{ item.product.name[locale] }}
                </p>
              </NuxtLink>
              <p class="mt-1 text-sm text-base-content/60">
                {{ formatPrice(item.product.price) }}
              </p>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3 bg-base-200/45 px-4 py-3 sm:px-5">
            <div class="flex items-center gap-2 rounded-md bg-base-100 px-2 py-1">
              <button
                type="button"
                class="btn btn-ghost btn-xs btn-square"
                :disabled="item.quantity <= 1"
                :aria-label="$t('cart.decrease')"
                @click="decrement(item.id, item.quantity)"
              >
                <Icon name="mdi:minus" class="size-4" />
              </button>
              <span class="w-8 text-center text-sm font-medium">{{ item.quantity }}</span>
              <button
                type="button"
                class="btn btn-ghost btn-xs btn-square"
                :aria-label="$t('cart.increase')"
                @click="increment(item.id, item.quantity)"
              >
                <Icon name="mdi:plus" class="size-4" />
              </button>
            </div>

            <div class="ml-auto flex items-center gap-3">
              <p class="min-w-24 text-right font-semibold">
                {{ formatPrice(item.product.price * item.quantity) }}
              </p>

              <button
                type="button"
                class="btn btn-ghost btn-sm btn-square text-error"
                :aria-label="$t('cart.remove')"
                @click="cartStore.removeItem(item.id)"
              >
                <Icon name="mdi:trash-can-outline" class="size-5" />
              </button>
            </div>
          </div>
        </article>
      </div>

      <aside class="h-fit rounded-lg bg-base-100/95 p-5 shadow-sm lg:sticky lg:top-24">
        <div class="mb-5 flex items-center justify-between">
          <Icon name="mdi:receipt-text-outline" class="size-6 text-primary" />
          <span class="text-sm font-medium text-base-content/60">{{ totalQuantity }}x</span>
        </div>

        <div class="space-y-3 border-y border-base-300 py-4">
          <div class="flex items-center justify-between text-sm text-base-content/70">
            <span>{{ $t("cart.subtotal") }}</span>
            <span>{{ formatPrice(subtotal) }}</span>
          </div>
          <div class="flex items-center justify-between text-sm text-base-content/70">
            <span>{{ $t("cart.shipping") }}</span>
            <span>{{ formatPrice(0) }}</span>
          </div>
          <div class="flex items-center justify-between text-xl font-bold">
            <span>{{ $t("cart.total") }}</span>
            <span>{{ formatPrice(subtotal) }}</span>
          </div>
        </div>

        <div class="mt-5 grid gap-3">
          <NuxtLink :to="localePath('/market/checkout')" class="btn btn-primary w-full">
            <Icon name="mdi:cash-register" class="size-5" />
            {{ $t("cart.checkout") }}
          </NuxtLink>
          <NuxtLink :to="localePath('/market')" class="btn btn-ghost w-full">
            <Icon name="mdi:arrow-left" class="size-5" />
            {{ $t("nav.market") }}
          </NuxtLink>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

const cartStore = useCartStore();
const { items, subtotal, status } = storeToRefs(cartStore);

const { locale } = useI18n();
const localePath = useLocalePath();
const totalQuantity = computed(() =>
  items.value.reduce((sum, item) => sum + item.quantity, 0),
);

definePageMeta({
  titleKey: "seo.cart.title",
  descriptionKey: "seo.cart.description",
});

function formatPrice(value: number) {
  return new Intl.NumberFormat(locale.value, {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function increment(itemId: number, currentQuantity: number) {
  cartStore.updateQuantity(itemId, currentQuantity + 1);
}

function decrement(itemId: number, currentQuantity: number) {
  if (currentQuantity <= 1)
    return;
  cartStore.updateQuantity(itemId, currentQuantity - 1);
}
</script>

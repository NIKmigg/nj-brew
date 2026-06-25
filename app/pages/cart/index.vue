<template>
  <div class="mx-auto min-h-[calc(100vh-8rem)] w-full max-w-6xl px-4 py-8 sm:py-12">
    <div class="grid items-start gap-6 md:grid-cols-[minmax(0,1fr)_22rem]">
      <section class="overflow-hidden rounded-lg bg-base-100/95 text-base-content shadow-2xl shadow-base-300/30">
        <div class="flex items-center justify-between gap-4 border-b border-base-300 px-6 py-5">
          <div class="flex min-w-0 items-center gap-3">
            <Icon name="mdi:package-variant-closed" class="size-6 shrink-0 text-primary" />
            <h1 class="truncate text-xl font-bold sm:text-2xl">
              {{ $t("cart.products") }}
            </h1>
          </div>

          <span
            v-if="items.length > 0"
            class="shrink-0 rounded-xl bg-base-200 px-3 py-1 text-sm font-bold text-primary sm:text-base"
          >
            {{ $t("cart.itemCount", { count: totalQuantity }) }}
          </span>
        </div>

        <div
          v-if="status === 'pending'"
          class="flex min-h-72 items-center justify-center px-6 py-14"
        >
          <span class="loading loading-spinner loading-lg text-primary" />
        </div>

        <div
          v-else-if="items.length === 0"
          class="px-6 py-14 text-center"
        >
          <div class="mx-auto mb-5 flex size-16 items-center justify-center rounded-lg bg-base-200 text-primary">
            <Icon name="mdi:basket-off-outline" class="size-8" />
          </div>
          <p class="mb-6 text-lg font-semibold">
            {{ $t("cart.empty") }}
          </p>
          <NuxtLink :to="localePath('/market')" class="btn btn-outline">
            <Icon name="mdi:storefront-outline" class="size-5" />
            {{ $t("nav.market") }}
          </NuxtLink>
        </div>

        <div v-else class="px-6 py-4">
          <article
            v-for="(item, index) in items"
            :key="item.id"
            class="grid grid-cols-[3.75rem_minmax(0,1fr)_auto] gap-4 py-5"
            :class="index > 0 ? 'border-t border-base-300' : ''"
          >
            <NuxtLink
              :to="localePath(`/market/${item.product.slug}`)"
              class="flex size-15 items-center justify-center rounded-lg bg-base-200 text-primary transition-colors hover:bg-base-300"
              :aria-label="item.product.name[locale]"
            >
              <img
                :src="item.product.imageUrl || ''"
                :alt="item.product.name[locale]"
                class="p-2"
              >
            </NuxtLink>

            <div class="min-w-0 self-center">
              <NuxtLink :to="localePath(`/market/${item.product.slug}`)">
                <h2 class="truncate text-lg font-bold leading-tight transition-colors hover:text-primary">
                  {{ item.product.name[locale] }}
                </h2>
              </NuxtLink>
              <p
                v-if="item.product.description?.[locale]"
                class="mt-1 line-clamp-1 text-sm font-medium text-base-content/65"
              >
                {{ item.product.description[locale] }}
              </p>
            </div>

            <div class="flex flex-col items-end justify-center gap-3">
              <p class="whitespace-nowrap text-base font-bold">
                {{ formatPrice(item.product.price * item.quantity) }}
              </p>

              <div class="flex h-8 items-center overflow-hidden rounded-lg border border-base-300 bg-base-200">
                <button
                  type="button"
                  class="flex size-8 items-center justify-center text-base-content transition-colors hover:bg-base-300 disabled:cursor-not-allowed disabled:opacity-35"
                  :disabled="item.quantity <= 1"
                  :aria-label="$t('cart.decrease')"
                  @click="decrement(item.id, item.quantity)"
                >
                  <Icon name="mdi:minus" class="size-4" />
                </button>
                <span class="w-8 text-center text-base font-bold leading-none">{{ item.quantity }}</span>
                <button
                  type="button"
                  class="flex size-8 items-center justify-center text-base-content transition-colors hover:bg-base-300"
                  :aria-label="$t('cart.increase')"
                  @click="increment(item.id, item.quantity)"
                >
                  <Icon name="mdi:plus" class="size-4" />
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <aside
        v-if="items.length > 0"
        class="rounded-lg bg-base-100/95 p-6 text-base-content shadow-2xl shadow-base-300/30 md:sticky md:top-28"
      >
        <div class="mb-5 flex items-center gap-3">
          <Icon name="mdi:basket-check-outline" class="size-6 text-primary" />
          <h2 class="text-xl font-bold">
            {{ $t("cart.title") }}
          </h2>
        </div>

        <dl class="space-y-2 border-y border-base-300 py-5 text-base">
          <div class="flex items-center justify-between gap-4 text-base-content/70">
            <dt>{{ $t("cart.subtotal") }}</dt>
            <dd class="font-medium text-base-content">
              {{ formatPrice(subtotal) }}
            </dd>
          </div>
          <div class="flex items-center justify-between gap-4 text-base-content/70">
            <dt>{{ $t("cart.shippingCourier") }}</dt>
            <dd class="font-medium text-base-content">
              {{ formatPrice(shippingCost) }}
            </dd>
          </div>
          <div class="flex items-center justify-between gap-4 pt-2 text-xl font-bold">
            <dt>{{ $t("cart.total") }}</dt>
            <dd>{{ formatPrice(total) }}</dd>
          </div>
        </dl>

        <NuxtLink
          :to="localePath('/market/checkout')"
          class="mt-5 flex h-13 w-full items-center justify-center gap-3 rounded-lg border border-base-300 bg-base-200 px-4 text-lg font-bold text-base-content transition-colors hover:bg-base-300"
        >
          <Icon name="mdi:currency-usd-circle-outline" class="size-5 text-primary" />
          {{ $t("cart.checkout") }}
        </NuxtLink>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

const cartStore = useCartStore();
await cartStore.ensureLoaded();

const { items, subtotal, status } = storeToRefs(cartStore);

const { locale } = useI18n();
const localePath = useLocalePath();
const shippingCost = 4.5;
const totalQuantity = computed(() =>
  items.value.reduce((sum, item) => sum + item.quantity, 0),
);
const total = computed(() => subtotal.value + shippingCost);

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

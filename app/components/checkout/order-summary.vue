<template>
  <aside class="card bg-base-100 p-6 text-base-content shadow-sm lg:sticky lg:top-28" aria-labelledby="checkout-summary-title">
    <div class="mb-4 flex items-center gap-3">
      <Icon
        name="mdi:basket-check-outline"
        size="24"
        class="text-primary"
        aria-hidden="true"
      />
      <h2 id="checkout-summary-title" class="text-xl font-bold sm:text-2xl font-old-style">
        {{ $t("cart.orderSummary") }}
      </h2>
    </div>

    <dl class="-mx-6 space-y-2 border-y border-base-300 px-6 py-5 text-base">
      <div>
        <dt class="mb-3 font-bold text-base-content">
          {{ $t("checkout.items") }}
        </dt>
        <dd>
          <ul class="space-y-3">
            <li
              v-for="item in items"
              :key="item.id"
              class="grid grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-3"
            >
              <NuxtLink
                :to="localePath(`/market/${item.product.slug}`)"
                class="flex size-12 items-center justify-center rounded-box bg-base-200"
                :aria-label="$t('cart.viewProduct', { name: item.product.name[locale] })"
              >
                <img
                  :src="item.product.imageUrl || ''"
                  :alt="item.product.name[locale]"
                  class="max-h-10 p-1"
                >
              </NuxtLink>

              <div class="min-w-0">
                <NuxtLink
                  :to="localePath(`/market/${item.product.slug}`)"
                  class="line-clamp-1 font-semibold hover:text-primary"
                >
                  {{ item.product.name[locale] }}
                </NuxtLink>
                <p class="text-sm text-base-content/65">
                  {{ item.quantity }} x {{ formatPrice(item.product.price) }}
                </p>
              </div>

              <span class="whitespace-nowrap font-semibold">
                {{ formatPrice(item.product.price * item.quantity) }}
              </span>
            </li>
          </ul>
        </dd>
      </div>

      <div class="divider my-2" />

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

    <FormMessage :message="formError" class="mt-4" />

    <button class="btn btn-primary mt-5 w-full" type="submit" :disabled="pending">
      <span v-if="pending" class="loading loading-spinner loading-sm" aria-hidden="true" />
      <Icon
        v-else
        name="mdi:package-check"
        size="24"
        aria-hidden="true"
      />
      {{ $t("checkout.submit") }}
    </button>
  </aside>
</template>

<script setup lang="ts">
import type { CartItemSchema } from "@shared/schemas/cart";

defineProps<{
  formError: string;
  items: CartItemSchema[];
  pending: boolean;
  shippingCost: number;
  subtotal: number;
  total: number;
}>();

const { locale } = useI18n();
const localePath = useLocalePath();

function formatPrice(value: number) {
  return new Intl.NumberFormat(locale.value, {
    style: "currency",
    currency: "EUR",
  }).format(value);
}
</script>

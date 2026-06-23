<template>
  <div class="mx-auto max-w-2xl px-4 py-8">
    <h1 class="mb-6 text-2xl font-semibold">
      {{ $t("cart.title") }}
    </h1>

    <div v-if="status === 'pending'" class="flex justify-center py-12">
      <span class="loading loading-spinner loading-lg" />
    </div>

    <div v-else-if="items.length === 0" class="py-12 text-center text-base-content/60">
      {{ $t("cart.empty") }}
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="item in items"
        :key="item.id"
        class="flex items-center gap-4 rounded-lg border border-base-300 p-4"
      >
        <img
          v-if="item.product.imageUrl"
          :src="item.product.imageUrl"
          :alt="item.product.name[locale]"
          class="size-16 rounded-md object-cover"
        >
        <div
          v-else
          class="flex size-16 shrink-0 items-center justify-center rounded-md bg-base-200"
        >
          <Icon name="tabler:leaf" class="size-6 text-base-content/40" />
        </div>

        <div class="min-w-0 flex-1">
          <p class="truncate font-medium">
            {{ item.product.name[locale] }}
          </p>
          <p class="text-sm text-base-content/60">
            {{ formatPrice(item.product.price) }}
          </p>
        </div>

        <div class="flex items-center gap-2 rounded-md border border-base-300 px-2 py-1">
          <button
            type="button"
            class="btn btn-ghost btn-xs btn-square"
            :disabled="item.quantity <= 1"
            :aria-label="$t('cart.decrease')"
            @click="decrement(item.id, item.quantity)"
          >
            <Icon name="tabler:minus" class="size-4" />
          </button>
          <span class="w-6 text-center text-sm">{{ item.quantity }}</span>
          <button
            type="button"
            class="btn btn-ghost btn-xs btn-square"
            :aria-label="$t('cart.increase')"
            @click="increment(item.id, item.quantity)"
          >
            <Icon name="tabler:plus" class="size-4" />
          </button>
        </div>

        <p class="w-20 shrink-0 text-right font-medium">
          {{ formatPrice(item.product.price * item.quantity) }}
        </p>

        <button
          type="button"
          class="btn btn-ghost btn-sm btn-square text-error"
          :aria-label="$t('cart.remove')"
          @click="removeItem(item.id)"
        >
          <Icon name="tabler:trash" class="size-4" />
        </button>
      </div>

      <div class="mt-6 flex items-center justify-between border-t border-base-300 pt-4">
        <span class="text-lg font-medium">{{ $t("cart.total") }}</span>
        <span class="text-lg font-semibold">{{ formatPrice(subtotal) }}</span>
      </div>

      <NuxtLink to="/market/checkout" class="btn btn-primary w-full mt-4">
        {{ $t("cart.checkout") }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const { items, subtotal, status, updateQuantity, removeItem } = useCart();

const { locale } = useI18n();

function formatPrice(value: number) {
  return new Intl.NumberFormat(locale.value, {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function increment(itemId: number, currentQuantity: number) {
  updateQuantity(itemId, currentQuantity + 1);
}

function decrement(itemId: number, currentQuantity: number) {
  if (currentQuantity <= 1)
    return;
  updateQuantity(itemId, currentQuantity - 1);
}
</script>

<template>
  <div class="mx-auto min-h-[calc(100vh-8rem)] w-full max-w-6xl px-4 py-8 sm:py-12">
    <div class="grid items-start gap-6 md:grid-cols-[minmax(0,1fr)_22rem]">
      <section class="card overflow-hidden bg-base-100 text-base-content shadow-sm">
        <div class="flex items-center justify-between gap-4 border-b border-base-300 p-6">
          <div class="flex items-center gap-3">
            <Icon name="mdi:package-variant-closed" size="24" class="shrink-0 text-primary" />
            <h1 class="truncate text-xl font-bold sm:text-2xl font-old-style">
              {{ $t("cart.products") }}
            </h1>
          </div>

          <span
            v-if="items.length > 0"
            class="badge badge-soft badge-neutral shrink-0 text-sm font-bold sm:text-base"
          >
            {{ $t("cart.itemCount", { count: totalQuantity }, totalQuantity) }}
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
          <div class="mx-auto mb-5 flex size-16 items-center justify-center rounded-box bg-base-200 text-primary">
            <Icon name="mdi:basket-off-outline" size="30" />
          </div>
          <p class="mb-6 text-lg font-semibold">
            {{ $t("cart.empty") }}
          </p>
          <NuxtLink :to="localePath('/market')" class="btn btn-ghost hover:text-primary">
            <Icon name="mdi:arrow-left-bold" />
            {{ $t("nav.market") }}
          </NuxtLink>
        </div>

        <ul v-else class="px-6 py-4">
          <li
            v-for="(item, index) in items"
            :key="item.id"
            class="grid grid-cols-[3.75rem_minmax(0,1fr)] gap-4 py-5 sm:grid-cols-[3.75rem_minmax(0,1fr)_auto]"
            :class="index > 0 ? 'border-t border-base-300' : ''"
          >
            <NuxtLink
              :to="localePath(`/market/${item.product.slug}`)"
              class="flex size-15 items-center justify-center rounded-box bg-base-200 text-primary"
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
                <h2 class="truncate text-lg font-bold leading-tight transition-colors hover:text-primary font-old-style">
                  {{ item.product.name[locale] }}
                </h2>
              </NuxtLink>
              <p
                v-if="item.product.description?.[locale]"
                class="mt-1 line-clamp-1 text-sm font-medium text-base-content/65"
              >
                {{ item.product.description[locale] }}
              </p>
              <p class="mt-2 text-sm font-semibold text-base-content/70">
                {{ $t("cart.unitPrice", { price: formatPrice(item.product.price) }) }}
              </p>
            </div>

            <div class="col-start-2 flex items-center justify-between gap-3 sm:col-start-auto sm:flex-col sm:items-end sm:justify-center">
              <p class="whitespace-nowrap text-base font-bold">
                {{ formatPrice(item.product.price * item.quantity) }}
              </p>

              <div class="flex items-center gap-2">
                <div class="join">
                  <button
                    type="button"
                    class="btn btn-sm join-item btn-square"
                    :disabled="item.quantity <= 1"
                    :aria-label="$t('cart.decrease')"
                    @click="decrement(item.id, item.quantity)"
                  >
                    <Icon name="mdi:minus" size="24" />
                  </button>
                  <input
                    :value="item.quantity"
                    type="number"
                    min="1"
                    inputmode="numeric"
                    class="input input-sm join-item w-14 px-1 text-center font-bold [appearance:textfield]
                    [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
                    border-none"
                    :aria-label="$t('cart.quantity')"
                    @change="updateQuantityFromInput(item.id, $event, item.quantity)"
                    @keydown.enter.prevent="updateQuantityFromInput(item.id, $event, item.quantity)"
                  >
                  <button
                    type="button"
                    class="btn btn-sm join-item btn-square"
                    :disabled="item.quantity >= 99"
                    :aria-label="$t('cart.increase')"
                    @click="increment(item.id, item.quantity)"
                  >
                    <Icon name="mdi:plus" size="24" />
                  </button>
                </div>

                <button
                  type="button"
                  class="btn btn-sm btn-ghost text-error"
                  :aria-label="$t('cart.remove')"
                  @click="openRemoveConfirm(item.id)"
                >
                  <Icon name="mdi:trash-can-outline" size="24" />
                </button>
              </div>
            </div>
          </li>
        </ul>
      </section>

      <aside
        v-if="items.length > 0"
        class="card bg-base-100 p-6 text-base-content shadow-sm md:sticky md:top-28"
      >
        <div class="flex items-center gap-3 mb-4">
          <Icon name="mdi:basket-check-outline" size="24" class="text-primary" />
          <h1 class="truncate text-xl font-bold sm:text-2xl font-old-style">
            {{ $t("cart.title") }}
          </h1>
        </div>

        <dl class="-mx-6 space-y-2 border-y border-base-300 px-6 py-5 text-base">
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
          class="btn btn-primary mt-5 w-full"
        >
          <Icon name="mdi:currency-usd-circle-outline" size="24" />
          {{ $t("cart.checkout") }}
        </NuxtLink>

        <NuxtLink :to="localePath('/market')" class="btn btn-ghost mt-3 hover:text-primary">
          <Icon name="mdi:arrow-left-bold" />
          {{ $t("nav.market") }}
        </NuxtLink>
      </aside>
    </div>

    <GsapConfirmModal
      v-model="showRemoveConfirm"
      title-key="cart.itemConfirmRemoveTitle"
      text-key="cart.itemConfirmRemoveText"
      confirm-key="cart.remove"
      cancel-key="global.cancel"
      close-key="global.close"
      :text-params="{ name: itemPendingRemovalName }"
      @confirm="removePendingItem"
    />
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
const showRemoveConfirm = ref(false);
const itemPendingRemovalId = ref<number | null>(null);
const itemPendingRemovalName = computed(() => {
  const item = items.value.find(item => item.id === itemPendingRemovalId.value);

  return item?.product.name[locale.value] ?? "";
});

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
  if (currentQuantity >= 99)
    return;
  cartStore.updateQuantity(itemId, currentQuantity + 1);
}

function decrement(itemId: number, currentQuantity: number) {
  if (currentQuantity <= 1)
    return;
  cartStore.updateQuantity(itemId, currentQuantity - 1);
}

function updateQuantityFromInput(itemId: number, event: Event, currentQuantity: number) {
  const input = event.currentTarget as HTMLInputElement;
  const parsedQuantity = Number.parseInt(input.value, 10);
  const quantity = clampQuantity(Number.isFinite(parsedQuantity) ? parsedQuantity : currentQuantity);

  input.value = String(quantity);

  if (quantity === currentQuantity)
    return;

  cartStore.updateQuantity(itemId, quantity);
}

function clampQuantity(quantity: number) {
  return Math.min(Math.max(quantity, 1), 99);
}

function openRemoveConfirm(itemId: number) {
  itemPendingRemovalId.value = itemId;
  showRemoveConfirm.value = true;
}

function removePendingItem() {
  if (itemPendingRemovalId.value === null)
    return;

  cartStore.removeItem(itemPendingRemovalId.value);
  itemPendingRemovalId.value = null;
}
</script>

<template>
  <div class="mx-auto min-h-[calc(100vh-8rem)] w-full max-w-6xl px-4 py-8 sm:py-12">
    <div
      class="grid items-start gap-6"
      :class="items.length > 0 ? 'md:grid-cols-[minmax(0,1fr)_22rem]' : ''"
    >
      <section
        class="card overflow-hidden bg-base-100 text-base-content shadow-sm"
        aria-labelledby="cart-products-title"
      >
        <div class="flex items-center justify-between gap-4 border-b border-base-300 p-6">
          <div class="flex items-center gap-3">
            <Icon
              name="mdi:package-variant-closed"
              size="24"
              class="shrink-0 text-primary"
              aria-hidden="true"
            />
            <h1 id="cart-products-title" class="truncate text-xl font-bold sm:text-2xl font-old-style">
              {{ $t("cart.products") }}
            </h1>
          </div>

          <span
            v-if="items.length > 0"
            class="badge badge-soft badge-neutral shrink-0 text-sm font-bold sm:text-base"
            aria-live="polite"
            aria-atomic="true"
          >
            {{ $t("cart.itemCount", { count: totalQuantity }, totalQuantity) }}
          </span>
        </div>

        <div
          v-if="status === 'pending'"
          class="flex min-h-72 items-center justify-center px-6 py-14"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span class="loading loading-spinner loading-lg text-primary" aria-hidden="true" />
          <span class="sr-only">
            {{ $t("cart.loading") }}
          </span>
        </div>

        <div
          v-else-if="items.length === 0"
          class="px-6 py-14 text-center"
          role="status"
          aria-live="polite"
        >
          <div class="mx-auto mb-5 flex size-16 items-center justify-center rounded-box bg-base-200 text-primary">
            <Icon name="mdi:basket-off-outline" size="30" aria-hidden="true" />
          </div>
          <p class="mb-6 text-lg font-semibold">
            {{ $t("cart.empty") }}
          </p>
          <NuxtLink :to="localePath('/market')" class="btn btn-ghost hover:text-primary">
            <Icon name="mdi:arrow-left-bold" aria-hidden="true" />
            {{ $t("nav.market") }}
          </NuxtLink>
        </div>

        <ul
          v-else
          class="px-6 py-4"
          :aria-label="$t('cart.productList')"
          aria-live="polite"
          aria-relevant="additions removals"
        >
          <li
            v-for="(item, index) in items"
            :key="item.id"
            class="grid grid-cols-[3.75rem_minmax(0,1fr)] gap-4 py-5 sm:grid-cols-[3.75rem_minmax(0,1fr)_auto]"
            :class="index > 0 ? 'border-t border-base-300' : ''"
          >
            <NuxtLink
              :to="localePath(`/market/${item.product.slug}`)"
              class="flex size-15 items-center justify-center rounded-box bg-base-200 text-primary"
              :aria-label="$t('cart.viewProduct', { name: item.product.name[locale] })"
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
              <p
                class="whitespace-nowrap text-base font-bold"
                :aria-label="$t('cart.lineTotal', {
                  name: item.product.name[locale],
                  price: formatPrice(item.product.price * item.quantity),
                })"
              >
                {{ formatPrice(item.product.price * item.quantity) }}
              </p>

              <div class="flex items-center gap-2">
                <div
                  class="join"
                  role="group"
                  :aria-label="$t('cart.quantityFor', { name: item.product.name[locale] })"
                >
                  <button
                    type="button"
                    class="btn btn-sm join-item btn-square"
                    :disabled="item.quantity <= 1"
                    :aria-label="$t('cart.decreaseItem', { name: item.product.name[locale] })"
                    @click="decrement(item.id, item.quantity)"
                  >
                    <Icon name="mdi:minus" size="24" aria-hidden="true" />
                  </button>
                  <input
                    :value="item.quantity"
                    type="number"
                    min="1"
                    max="99"
                    inputmode="numeric"
                    class="input input-sm join-item w-14 px-1 text-center font-bold [appearance:textfield]
                    [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
                    border-none"
                    :aria-label="$t('cart.quantityFor', { name: item.product.name[locale] })"
                    @change="updateQuantityFromInput(item.id, $event, item.quantity)"
                    @keydown.enter.prevent="updateQuantityFromInput(item.id, $event, item.quantity)"
                  >
                  <button
                    type="button"
                    class="btn btn-sm join-item btn-square"
                    :disabled="item.quantity >= 99"
                    :aria-label="$t('cart.increaseItem', { name: item.product.name[locale] })"
                    @click="increment(item.id, item.quantity)"
                  >
                    <Icon name="mdi:plus" size="24" aria-hidden="true" />
                  </button>
                </div>

                <button
                  type="button"
                  class="btn btn-sm btn-ghost text-error"
                  :aria-label="$t('cart.removeItem', { name: item.product.name[locale] })"
                  aria-haspopup="dialog"
                  @click="openRemoveConfirm(item.id)"
                >
                  <Icon name="mdi:trash-can-outline" size="24" aria-hidden="true" />
                </button>
              </div>
            </div>
          </li>
        </ul>
      </section>

      <aside
        v-if="items.length > 0"
        class="card bg-base-100 p-6 text-base-content shadow-sm md:sticky md:top-28"
        aria-labelledby="cart-summary-title"
      >
        <div class="flex items-center gap-3 mb-4">
          <Icon
            name="mdi:basket-check-outline"
            size="24"
            class="text-primary"
            aria-hidden="true"
          />
          <h2 id="cart-summary-title" class="truncate text-xl font-bold sm:text-2xl font-old-style">
            {{ $t("cart.title") }}
          </h2>
        </div>

        <dl
          class="-mx-6 space-y-2 border-y border-base-300 px-6 py-5 text-base"
          :aria-label="$t('cart.orderSummary')"
        >
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

        <GsapMagneticButton
          :to="localePath('/cart/order')"
          mode="attract"
          class="btn btn-primary mt-5 w-full"
          :strength="24"
          :activation-distance="30"
          :aria-label="$t('cart.checkout')"
        >
          <Icon name="mdi:currency-usd-circle-outline" size="24" aria-hidden="true" />
          {{ $t("cart.checkout") }}
        </GsapMagneticButton>

        <NuxtLink :to="localePath('/market')" class="btn btn-ghost mt-3 hover:text-primary">
          <Icon name="mdi:arrow-left-bold" aria-hidden="true" />
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
const itemPendingRemovalId = ref<string | null>(null);
const itemPendingRemovalName = computed(() => {
  const item = items.value.find(item => item.id === itemPendingRemovalId.value);

  return item?.product.name[locale.value] ?? "";
});

definePageMeta({
  middleware: "auth",
  titleKey: "seo.cart.title",
  descriptionKey: "seo.cart.description",
});

function formatPrice(value: number) {
  return new Intl.NumberFormat(locale.value, {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function increment(itemId: string, currentQuantity: number) {
  if (currentQuantity >= 99)
    return;
  cartStore.updateQuantity(itemId, currentQuantity + 1);
}

function decrement(itemId: string, currentQuantity: number) {
  if (currentQuantity <= 1)
    return;
  cartStore.updateQuantity(itemId, currentQuantity - 1);
}

function updateQuantityFromInput(itemId: string, event: Event, currentQuantity: number) {
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

function openRemoveConfirm(itemId: string) {
  itemPendingRemovalId.value = itemId;
  showRemoveConfirm.value = true;
}

function removePendingItem() {
  if (itemPendingRemovalId.value === null)
    return;

  cartStore.removeItem(itemPendingRemovalId.value);
  itemPendingRemovalId.value = null;
  showRemoveConfirm.value = false;
}
</script>

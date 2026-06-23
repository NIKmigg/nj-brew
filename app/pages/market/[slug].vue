<template>
  <div>
    <div v-if="product" class="max-w-6xl mx-auto">
      <div class="grid gap-10 lg:grid-cols-2">
        <div class="rounded-2xl overflow-hidden bg-base-100 border border-base-300">
          <img
            :src="product.imageUrl || ''"
            :alt="localize(product.name)"
            class="w-full h-full object-cover"
          >
        </div>
        <div class="space-y-6">
          <div>
            <h1 class="text-4xl font-bold">
              {{ localize(product.name) }}
            </h1>
            <p class="mt-4 text-base-content/70">
              {{ product.description ? localize(product.description) : "" }}
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
                  ? $t("market.product.available", { count: product.stock })
                  : $t("market.product.notAvailable")
              }}
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div v-if="product.stock > 0" class="flex items-center gap-2 rounded-md border border-base-300 px-2 py-1">
              <button
                type="button"
                class="btn btn-ghost btn-sm btn-square"
                :disabled="quantity <= 1"
                :aria-label="$t('cart.decrease')"
                @click="quantity--"
              >
                <Icon name="tabler:minus" class="size-4" />
              </button>
              <span class="w-8 text-center">{{ quantity }}</span>
              <button
                type="button"
                class="btn btn-ghost btn-sm btn-square"
                :disabled="quantity >= product.stock"
                :aria-label="$t('cart.increase')"
                @click="quantity++"
              >
                <Icon name="tabler:plus" class="size-4" />
              </button>
            </div>

            <button
              class="btn btn-primary btn-lg flex-1"
              type="button"
              :disabled="product.stock === 0 || isAdding"
              :aria-label="$t('market.product.buyProduct', { name: localize(product.name) })"
              @click="handleBuy"
            >
              <span v-if="isAdding" class="loading loading-spinner loading-sm" />
              <template v-else>
                {{ product.stock === 0 ? $t("market.product.notAvailable") : $t("market.product.buy") }}
              </template>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SelectProductSchema } from "@shared/schemas/product";

const { localize } = useLocalize();
const { addItem } = useCart();
const toast = useToast();

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

usePageSeo({
  title: () => product.value ? localize(product.value.name) : $t("seo.market.title"),
  description: () => product.value?.description ? localize(product.value.description) : $t("seo.market.description"),
  image: () => product.value?.imageUrl ?? "/market-light.webp",
});

const quantity = ref(1);
const isAdding = ref(false);

async function handleBuy() {
  if (!product.value)
    return;

  isAdding.value = true;
  try {
    await addItem(product.value.id, quantity.value);
    toast.show($t("market.product.addedToCart"), "success");
  }
  catch {
    toast.show($t("market.product.addToCartFailed"), "error");
  }
  finally {
    isAdding.value = false;
  }
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}
</script>

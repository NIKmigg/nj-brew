<template>
  <div v-if="product">
    <section
      ref="detailHeaderSection"
      class="w-full flex flex-col items-center justify-start pb-20 overflow-hidden"
    >
      <div class="max-w-4xl w-full px-6 text-center">
        <img
          ref="heroImageRef"
          :src="product.imageUrl || ''"
          :alt="localize(product.name)"
          class="w-60 mx-auto mb-6 object-cover -rotate-12"
        >

        <h1 ref="heroTitleRef" class="text-5xl md:text-6xl product-name mb-10">
          {{ localize(product.name) }}
        </h1>

        <p ref="heroTextRef" class="text-lg opacity-80 leading-relaxed mb-10">
          {{ product.description ? localize(product.description) : "" }}
        </p>

        <div ref="heroInfoRef" class="flex flex-wrap items-center justify-center gap-4">
          <p class="text-3xl font-semibold">
            {{ formatPrice(product.price) }}
          </p>

          <div
            class="badge"
            :class="product.stock > 0
              ? 'badge-success'
              : 'badge-error'"
          >
            {{
              product.stock > 0
                ? t('market.product.available', { count: product.stock })
                : t('market.product.notAvailable')
            }}
          </div>
        </div>
      </div>
    </section>

    <div class="sticky bottom-4 flex justify-center">
      <button
        type="button"
        class="btn btn-primary shadow-xl mb-10 text-white"
        :disabled="product.stock === 0 || isAdding"
        :aria-label="t('market.product.buyProduct', { name: localize(product.name) })"
        @click="handleBuy"
      >
        <span v-if="isAdding" class="loading loading-spinner loading-sm" />
        <template v-else-if="product.stock === 0">
          {{ t('market.product.notAvailable') }}
        </template>
        <template v-else>
          {{ t('market.product.addToCart') }}
          <Icon
            v-if="cartStore.showAddToCartFeedback"
            name="mdi:check"
            class="text-xl"
          />
          <Icon v-else name="mdi:cart-add" class="text-2xl text-white" />
        </template>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SelectProductSchema } from "@shared/schemas/product";
import { gsap } from "gsap";
import { SplitText } from "gsap/all";

gsap.registerPlugin(SplitText);

const { t } = useI18n();
const { localize } = useLocalize();
const cartStore = useCartStore();
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
  title: () => product.value ? localize(product.value.name) : t("seo.market.title"),
  description: () => product.value?.description ? localize(product.value.description) : t("seo.market.description"),
  image: () => product.value?.imageUrl ?? "/market-light.webp",
});

const quantity = ref(1);
const isAdding = ref(false);

// -----------------------
// ANIMATION REFS
// -----------------------
const detailHeaderSection = ref<HTMLElement | null>(null);
const heroImageRef = ref<HTMLImageElement | null>(null);
const heroTitleRef = ref<HTMLHeadingElement | null>(null);
const heroTextRef = ref<HTMLParagraphElement | null>(null);
const heroInfoRef = ref<HTMLDivElement | null>(null);

let ctx: gsap.Context;

onMounted(() => {
  ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (heroImageRef.value) {
      tl.from(heroImageRef.value, { y: -40, rotate: -30, opacity: 0, duration: 1.2 });
    }

    if (heroTitleRef.value) {
      const split = SplitText.create(heroTitleRef.value, { type: "chars" });
      tl.from(split.chars, { y: 80, opacity: 0, stagger: 0.03, duration: 0.8 }, "-=0.8");
    }

    if (heroTextRef.value) {
      tl.from(heroTextRef.value, { y: 30, opacity: 0, duration: 1 }, "-=0.6");
    }

    if (heroInfoRef.value) {
      tl.from(
        heroInfoRef.value.children,
        { y: 20, opacity: 0, duration: 0.8, stagger: 0.1 },
        "-=0.5",
      );
    }
  }, detailHeaderSection.value ?? undefined);
});

onBeforeUnmount(() => {
  ctx?.revert();
});

async function handleBuy() {
  if (!product.value || product.value.stock === 0)
    return;

  isAdding.value = true;
  try {
    await cartStore.addItem(product.value.id, quantity.value);
  }
  catch {
    toast.show(t("market.product.addToCartFailed"), "error");
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

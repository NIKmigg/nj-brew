<template>
  <div class="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-3xl items-center px-4 py-12">
    <section class="card w-full bg-base-100 p-8 text-center text-base-content shadow-sm">
      <div class="mx-auto mb-5 flex size-16 items-center justify-center rounded-box bg-success/15 text-success">
        <Icon name="mdi:check-circle-outline" size="34" aria-hidden="true" />
      </div>

      <p class="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
        {{ $t("checkout.confirmationStep") }}
      </p>

      <h1 class="text-3xl font-bold font-old-style">
        {{ $t("checkout.confirmationTitle") }}
      </h1>

      <p class="mx-auto mt-4 max-w-xl text-base-content/70">
        {{ $t("checkout.confirmationText") }}
      </p>

      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <NuxtLink
          :to="localePath('/market')"
          replace
          class="btn btn-primary"
        >
          <Icon name="mdi:storefront-outline" size="24" aria-hidden="true" />
          {{ $t("checkout.backToMarket") }}
        </NuxtLink>

        <NuxtLink
          :to="localePath('/orders')"
          replace
          class="btn btn-ghost hover:text-primary"
        >
          <Icon name="mdi:receipt-text-outline" size="24" aria-hidden="true" />
          {{ $t("checkout.viewOrders") }}
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  titleKey: "seo.checkout.confirmationTitle",
  descriptionKey: "seo.checkout.confirmationDescription",
});

const localePath = useLocalePath();
</script>

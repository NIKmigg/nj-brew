<template>
  <div>
    <section class="py-16">
      <div class="container my-auto text-center mx-auto max-w-3xl">
        <p class="text-4xl font-bold mb-4 font-old-style">
          {{ $t("legal.imprint") }}
        </p>
      </div>
    </section>
    <WaveCard />
    <section class="bg-base-200 text-center">
      <div
        class="prose prose-lg max-w-4xl mx-auto px-4 py-30"
        v-html="content"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import imprintDe from "@legal/imprint.de.html?raw";
import imprintEn from "@legal/imprint.en.html?raw";

const { locale } = useI18n();

const content = computed(() =>
  locale.value === "de"
    ? imprintDe
    : imprintEn,
);
</script>

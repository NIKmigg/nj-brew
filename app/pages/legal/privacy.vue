<template>
  <div>
    <section class="py-16">
      <div class="container my-auto text-center mx-auto max-w-3xl">
        <p class="text-4xl font-bold mb-4 font-old-style">
          {{ $t("legal.privacy") }}
        </p>
      </div>
    </section>
    <WaveCard />
    <section class="bg-base-200 py-16">
      <div
        class="prose prose-lg max-w-4xl mx-auto"
        v-html="content"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import privacyDe from "@legal/privacy.de.html?raw";
import privacyEn from "@legal/privacy.en.html?raw";

const { locale } = useI18n();

const content = computed(() =>
  locale.value === "de"
    ? privacyDe
    : privacyEn,
);
</script>

<template>
  <div>
    <section class="mx-auto max-w-3xl text-center">
      {{ $t("global.missingFeature") }}
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "settings",
  middleware: "auth",
});
</script>

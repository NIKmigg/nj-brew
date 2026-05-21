<template>
  <div role="alert" class="alert alert-warning alert-outline">
    <span>{{ $t("market.title") }}</span>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});
</script>

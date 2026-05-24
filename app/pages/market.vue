<template>
  <div>
    <div role="alert" class="alert alert-warning alert-outline">
      <span>{{ $t("market.title") }}</span>
    </div>
    <AdminProductForm @created="console.log('created')" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "admin",
});
</script>

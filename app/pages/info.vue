<template>
  <div role="alert" class="alert alert-warning alert-outline">
    <span>Info</span>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});
</script>

<template>
  <div role="alert" class="alert alert-error alert-outline">
    <span>Oh no! {{ error }}</span>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const error = route.query.error || "An unknown error occurred.";
</script>

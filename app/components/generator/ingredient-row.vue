<template>
  <div class="flex justify-between">
    <span class="text-base-content/60 text-sm">{{ label }}</span>
    <span class="font-medium">{{ value }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; value: string }>();
</script>

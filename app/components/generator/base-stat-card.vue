<template>
  <div class="bg-base-200 rounded-lg p-3 flex flex-col gap-1">
    <span class="text-xs text-base-content/40 uppercase tracking-wide">{{ label }}</span>
    <span class="text-xl font-medium">{{ value }}</span>
    <span v-if="hint" class="text-xs text-base-content/40">{{ hint }}</span>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  label: string;
  value: string;
  hint?: string;
}>();
</script>

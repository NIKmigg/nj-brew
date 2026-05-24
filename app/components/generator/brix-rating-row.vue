<template>
  <div
    class="flex items-center justify-between px-3 py-2 rounded-lg border-l-[3px]"
    :class="colorMap[color]"
  >
    <span>{{ label }}</span>
    <span class="font-medium">{{ range }}</span>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  label: string;
  range: string;
  color: "info" | "warning" | "success" | "error";
}>();

const colorMap = {
  info: "bg-info/70 border-info",
  warning: "bg-warning/70 border-warning",
  success: "bg-success/70 border-success",
  error: "bg-error/70 border-error",
} satisfies Record<string, string>;
</script>

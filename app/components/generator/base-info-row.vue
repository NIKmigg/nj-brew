<template>
  <div
    class="flex items-start gap-3 px-3 py-2 border-l-[3px]"
    :class="colorMap[color]"
    style="border-radius: 0 0.5rem 0.5rem 0"
  >
    <Icon :name="icon" class="text-base mt-0.5 shrink-0" />
    <div class="flex flex-col gap-0.5 items-start">
      <span class="text-sm font-medium">{{ title }}</span>
      <span class="text-xs opacity-80">{{ description }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  icon: string;
  title: string;
  description?: string;
  color: "success" | "warning" | "error" | "info";
}>();

const colorMap = {
  success: "bg-success/30 border-success",
  warning: "bg-warning/30 border-warning",
  error: "bg-error/30 border-error",
  info: "bg-info/30 border-info",
} satisfies Record<string, string>;
</script>

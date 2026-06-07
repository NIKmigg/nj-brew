<template>
  <div
    class="flex items-center gap-4 px-4 py-3 border-b border-base-200 last:border-b-0 transition-colors"
    :class="{ 'hover:bg-base-200 cursor-pointer': clickable }"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
  >
    <div v-if="$slots.leading" class="shrink-0 flex items-center justify-center">
      <slot name="leading" />
    </div>
    <div class="flex-1 min-w-0 text-left">
      <p class="text-sm font-medium text-base-content truncate">
        {{ title }}
      </p>
      <p v-if="subtitle" class="text-xs text-base-content/60 truncate mt-0.5">
        {{ subtitle }}
      </p>
    </div>
    <div v-if="$slots.trailing" class="shrink-0 flex items-center text-base-content/40">
      <slot name="trailing" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
  clickable?: boolean;
}>();
</script>

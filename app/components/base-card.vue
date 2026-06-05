<template>
  <div class="card bg-base-100 shadow-sm flex-1 min-w-64 max-block-max relative overflow-visible">
    <div class="card-body gap-3">
      <div class="flex items-center justify-between">
        <h2 class="card-title text-base">
          {{ title }}
        </h2>
      </div>
      <div class="card-body p-3">
        <slot />
      </div>
    </div>

    <div class="absolute -top-5 right-4 bg-base-200 rounded-full p-2 ring-4 ring-base-100">
      <Icon :name="icon" size="32" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; icon: string }>();
</script>

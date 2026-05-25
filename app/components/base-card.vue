<template>
  <div class="card bg-base-100 shadow-sm flex-1 min-w-64 max-block-max">
    <div class="card-body gap-3">
      <h2 class="card-title text-base">
        {{ title }}
      </h2>
      <div class="card-body p-3">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>();
</script>

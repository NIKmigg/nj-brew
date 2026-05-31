<template>
  <div
    :class="[
      active ? 'z-20 flex-[2] scale-105' : 'flex-1',
      background,
    ]"
    class="card bg-cover bg-center transition-all duration-500 overflow-hidden"
    @mouseenter="emit('activate')"
    @mouseleave="emit('deactivate')"
  >
    <div class="card-body items-center text-center">
      <h2 class="card-title text-neutral-content font-old-style text-3xl">
        {{ title }}
      </h2>
      <p v-show="active">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  active: boolean;
  background?: string;
}>();

const emit = defineEmits([
  "activate",
  "deactivate",
]);
</script>

<template>
  <section class="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-10">
    <div class="card w-full max-w-md bg-base-100/80 shadow-xl">
      <div class="card-body gap-5">
        <div class="text-center">
          <h1 class="text-3xl font-old-style">
            {{ title }}
          </h1>
          <p v-if="description" class="mt-2 text-sm text-base-content/60">
            {{ description }}
          </p>
        </div>

        <slot />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  description?: string;
  title: string;
}>();
</script>

<template>
  <div class="min-h-screen flex flex-col bg-base-200">
    <div class="sticky top-4 z-50 flex justify-center px-4 pb-8">
      <NavBar class="w-full max-w-7xl" />
    </div>
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
await authStore.init();
</script>

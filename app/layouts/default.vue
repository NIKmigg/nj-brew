<template>
  <div class="relative min-h-screen overflow-x-hidden bg-base-200">
    <div v-if="route.path !== '/'" class="app-background" aria-hidden="true" />

    <div class="relative z-50 top-4 flex justify-center px-4 pb-8 h-28">
      <NavBar class="w-full max-w-7xl" />
    </div>

    <!-- mindestens Bildschirmhöhe -->
    <main class="relative z-10 min-h-[calc(100vh-7rem)]">
      <slot />
    </main>

    <Footer class="relative z-10" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const authStore = useAuthStore();

await authStore.init();
</script>

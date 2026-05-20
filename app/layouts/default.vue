<template>
  <div class="min-h-screen flex flex-col">
    <NavBar />
    <main class="pt-16">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
await authStore.init();
</script>

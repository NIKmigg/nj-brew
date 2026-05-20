<template>
  <div class="min-h-screen flex flex-col">
    <NavBar />
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
await authStore.init();
</script>

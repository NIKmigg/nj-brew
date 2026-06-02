<template>
  <div class="relative min-h-screen  bg-base-200">
    <div v-if="route.path !== '/'" class="app-background" aria-hidden="true" />

    <div class="sticky z-50 top-4 flex justify-center px-4 pb-8 transition-all duration-300">
      <NavBar
        class="w-full shadow-lg max-w-7xl"
        :class="scrolled
          ? 'md:opacity-70 hover:opacity-100'
          : ''"
      />
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
const { y } = useWindowScroll();
const scrolled = computed(() => y.value > 50);
</script>

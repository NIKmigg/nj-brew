<template>
  <div class="relative min-h-screen  bg-base-200">
    <a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-9999 focus:btn focus:btn-primary">
      {{ $t("global.skipToContent") }}
    </a>
    <div v-if="route.path !== '/'" class="app-background" aria-hidden="true" />

    <div class="sticky z-50 top-4 flex justify-center px-4 pb-8 transition-all duration-300">
      <UserNavBar
        class="w-full shadow-lg max-w-7xl"
        :class="scrolled
          ? 'md:opacity-70 hover:opacity-100'
          : ''"
      />
    </div>

    <!-- mindestens Bildschirmhöhe -->
    <main id="main-content" class="relative z-10 min-h-[calc(100vh-6.7rem)]" tabindex="-1">
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

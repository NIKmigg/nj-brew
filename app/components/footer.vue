<template>
  <footer class="relative footer footer-horizontal footer-center bg-primary p-10">
    <div
      class="pointer-events-none absolute top-0 left-0 w-full h-60 bg-linear-to-b from-black/80 to-transparent z-1"
    />
    <aside class="z-2">
      <img
        src="/logo.webp"
        alt=""
        aria-hidden="true"
        class="w-8 h-8 drop-shadow-[0_0_20px_rgba(255,255,255,1)]"
      >
      <p class="font-bold">
        NJ Brew
        <span class="block">{{ $t("footer.tagline") }}</span>
      </p>

      <p class="text-base-content/70">
        {{ $t("footer.copyright", { year: new Date().getFullYear() }) }}
      </p>
    </aside>
    <nav class="z-2" :aria-label="$t('legal.imprint')">
      <div class="grid grid-flow-col gap-4 font-bold">
        <NuxtLink :to="localePath('/legal/imprint')" class="hover:bg-transparent hover:scale-110">
          {{ $t("legal.imprint") }}
        </NuxtLink>
        -
        <NuxtLink :to="localePath('/legal/privacy')" class="hover:bg-transparent hover:scale-110">
          {{ $t("legal.privacy") }}
        </NuxtLink>
      </div>
    </nav>
  </footer>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
</script>

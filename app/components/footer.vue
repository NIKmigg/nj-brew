<template>
  <footer class="relative footer footer-horizontal footer-center bg-primary p-10">
    <div
      class="pointer-events-none absolute top-0 left-0 w-full h-60 bg-linear-to-b from-black/80 to-transparent z-1"
    />
    <aside class="z-2">
      <img src="/logo.png" alt="NJ Logo" class="w-8 h-8 drop-shadow-[0_0_20px_rgba(255,255,255,1)]">
      <p class="font-bold">
        NJ Brew
        <span class="block">{{ $t("footer.tagline") }}</span>
      </p>

      <p class="text-base-content/70">
        {{ $t("footer.copyright", { year: new Date().getFullYear() }) }}
      </p>
    </aside>
    <nav class="z-2">
      <div class="grid grid-flow-col gap-4">
        <a>
          <Icon name="mdi:twitter" class="text-3xl" />
        </a>
        <a>
          <Icon name="mdi:youtube" class="text-3xl" />
        </a>
        <a>
          <Icon name="mdi:instagram" class="text-3xl" />
        </a>
      </div>
    </nav>
  </footer>
</template>

<script setup lang="ts">
</script>

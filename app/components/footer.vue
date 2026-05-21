<template>
  <footer class="relative footer footer-horizontal footer-center bg-primary/70 p-10">
    <div
      class="pointer-events-none absolute top-0 left-0 w-full h-1/2 bg-linear-to-b from-black/40 to-transparent"
    />
    <aside>
      <img src="/logo.png" alt="NJ Logo" class="w-8 h-8">
      <p class="font-bold">
        NJ Brew
        <span class="block">{{ $t("footer.tagline") }}</span>
      </p>

      <p class="text-base-content/50">
        {{ $t("footer.copyright", { year: new Date().getFullYear() }) }}
      </p>
    </aside>
    <nav>
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

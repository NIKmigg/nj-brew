<template>
  <Html :lang="localeHead.htmlAttrs?.lang" :dir="localeHead.htmlAttrs?.dir">
    <Head>
      <template v-for="link in localeHead.link" :key="link.id || link.key || link.hid || link.href">
        <Link v-bind="link" />
      </template>
      <template v-for="meta in localeHead.meta" :key="meta.id || meta.key || meta.hid || meta.property || meta.name">
        <Meta v-bind="meta" />
      </template>
    </Head>
  </Html>

  <NuxtRouteAnnouncer />

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <Toast />
</template>

<script setup lang="ts">
const localeHead = useLocaleHead({
  dir: true,
  lang: true,
  seo: true,
});

useHead({
  titleTemplate: titleChunk => titleChunk ? `${titleChunk} | NJ Brew` : "NJ Brew",
  meta: [
    { name: "theme-color", content: "#17120f" },
  ],
  link: [
    { rel: "icon", href: "/favicon.ico" },
  ],
});

usePageSeo();
</script>

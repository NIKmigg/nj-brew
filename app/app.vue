<template>
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

useHead(() => ({
  htmlAttrs: localeHead.value.htmlAttrs,
  titleTemplate: titleChunk => titleChunk ? `${titleChunk} | NJ Brew` : "NJ Brew",
  meta: [
    ...localeHead.value.meta,
    { name: "theme-color", content: "#17120f" },
  ],
  link: [
    ...localeHead.value.link,
    { rel: "icon", href: "/favicon.ico" },
  ],
}));

usePageSeo();
</script>

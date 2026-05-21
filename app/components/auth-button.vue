<template>
  <NuxtLink class="btn btn-accent w-full" :to="loginTo">
    <Icon name="mdi:login" size="20" />
    {{ $t("auth.login") }}
  </NuxtLink>
</template>

<script setup lang="ts">
const route = useRoute();
const localePath = useLocalePath();

const loginTo = computed(() => ({
  path: localePath("/login"),
  query: route.path === localePath("/") ? undefined : { redirect: route.fullPath },
}));
</script>

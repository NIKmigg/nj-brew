<template>
  <NuxtLink class="btn btn-accent w-full" :to="loginTo">
    <Icon name="mdi:login" size="20" />
    Login
  </NuxtLink>
</template>

<script setup lang="ts">
const route = useRoute();

const loginTo = computed(() => ({
  path: "/login",
  query: route.path === "/" ? undefined : { redirect: route.fullPath },
}));
</script>

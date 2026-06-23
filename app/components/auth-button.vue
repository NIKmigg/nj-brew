<template>
  <NuxtLink class="btn btn-ghost btn-wide hover:scale-110 hover:text-accent" :to="loginTo">
    <Icon name="mdi:login" class="text-xl" />
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

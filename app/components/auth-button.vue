<template>
  <button :disabled="authStore.loading" class="btn btn-accent" @click="authStore.signIn">
    <span v-if="authStore.loading" class="loading loading-spinner loading-md" />
    <Icon v-else name="tabler:brand-github" size="24" />
    Sign in with GitHub
  </button>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
</script>

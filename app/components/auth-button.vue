<template>
  <button class="btn btn-accent" @click="signIn">
    <Icon name="tabler:brand-github" size="24" />
    Sign in with GitHub
  </button>
</template>

<script setup lang="ts">
import { createAuthClient } from "better-auth/client";

const authClient = createAuthClient();

async function signIn() {
  await authClient.signIn.social({
    provider: "github",
    callbackURL: "/dashboard",
  });
}
</script>

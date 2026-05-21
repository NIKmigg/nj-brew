<template>
  <section class="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-10">
    <div class="card w-full max-w-md bg-base-100 shadow-xl">
      <div class="card-body gap-5">
        <div class="text-center">
          <h1 class="text-2xl font-semibold">
            Willkommen
          </h1>
          <p class="mt-2 text-sm text-base-content/60">
            Melde dich an oder erstelle ein neues Konto.
          </p>
        </div>

        <div class="join w-full">
          <button
            class="btn join-item flex-1"
            :class="{ 'btn-active': mode === 'login' }"
            type="button"
            @click="mode = 'login'"
          >
            Login
          </button>
          <button
            class="btn join-item flex-1"
            :class="{ 'btn-active': mode === 'signup' }"
            type="button"
            @click="mode = 'signup'"
          >
            Registrieren
          </button>
        </div>

        <form class="flex flex-col gap-3" @submit.prevent="submit">
          <label v-if="mode === 'signup'" class="form-control w-full">
            <span class="label pb-1">
              <span class="label-text">Name</span>
            </span>
            <input
              v-model="name"
              class="input w-full"
              autocomplete="name"
              required
              type="text"
            >
          </label>

          <label class="form-control w-full">
            <span class="label pb-1">
              <span class="label-text">Email</span>
            </span>
            <input
              v-model="email"
              class="input w-full"
              autocomplete="email"
              required
              type="email"
            >
          </label>

          <label class="form-control w-full">
            <span class="label pb-1">
              <span class="label-text">Passwort</span>
            </span>
            <input
              v-model="password"
              class="input w-full"
              :autocomplete="mode === 'signup' ? 'new-password' : 'current-password'"
              minlength="8"
              required
              type="password"
            >
          </label>

          <p v-if="errorMessage" class="text-sm text-error">
            {{ errorMessage }}
          </p>

          <button :disabled="submitting" class="btn btn-accent w-full" type="submit">
            <span v-if="submitting" class="loading loading-spinner loading-sm" />
            <Icon v-else name="mdi:email" size="20" />
            {{ mode === 'signup' ? 'Registrieren' : 'Login' }}
          </button>
        </form>

        <div class="divider my-0" />

        <button
          :disabled="submitting"
          class="btn btn-outline w-full"
          type="button"
          @click="signInWithGitHub"
        >
          <Icon name="tabler:brand-github" size="20" />
          Mit GitHub anmelden
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const route = useRoute();

const mode = ref<"login" | "signup">("login");
const name = ref("");
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const submitting = ref(false);

const redirect = computed(() => {
  const value = route.query.redirect;

  return typeof value === "string" && value.startsWith("/") ? value : "/";
});

watch(
  () => authStore.user,
  async (user) => {
    if (user) {
      await navigateTo(redirect.value);
    }
  },
  { immediate: true },
);

async function submit() {
  errorMessage.value = "";
  submitting.value = true;

  try {
    if (mode.value === "signup") {
      await authStore.signUpWithEmail(name.value, email.value, password.value);
    }
    else {
      await authStore.signInWithEmail(email.value, password.value);
    }

    await navigateTo(redirect.value);
  }
  catch (error) {
    errorMessage.value = error instanceof Error ? error.message : "Auth fehlgeschlagen.";
  }
  finally {
    submitting.value = false;
  }
}

async function signInWithGitHub() {
  await authStore.signInWithGitHub(redirect.value);
}
</script>

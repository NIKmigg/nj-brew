import { createAuthClient } from "better-auth/vue";

const authClient = createAuthClient();

export const useAuthStore = defineStore("useAuthStore", () => {
  const session = ref<Awaited<ReturnType<typeof authClient.useSession>> | null>(null);

  async function init() {
    const data = await authClient.useSession(useFetch);
    session.value = data;
  }

  const user = computed(() => session.value?.data?.user);
  const loading = computed(() => session.value?.isPending);

  async function signInWithGitHub(callbackURL = "/") {
    await authClient.signIn.social({
      provider: "github",
      callbackURL,
      errorCallbackURL: "/error",
    });
  }

  async function signInWithEmail(email: string, password: string) {
    const result = await authClient.signIn.email({
      email,
      password,
      rememberMe: true,
    });

    if (result.error) {
      throw new Error(result.error.message || "Login fehlgeschlagen.");
    }

    await init();
  }

  async function signUpWithEmail(name: string, email: string, password: string) {
    const result = await authClient.signUp.email({
      name,
      email,
      password,
    });

    if (result.error) {
      throw new Error(result.error.message || "Registrierung fehlgeschlagen.");
    }

    await init();
  }

  async function signOut() {
    await authClient.signOut();
    await init();
  }

  return {
    init,
    loading,
    user,
    signInWithGitHub,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };
});

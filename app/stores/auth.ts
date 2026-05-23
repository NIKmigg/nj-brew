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
    const { csrf } = useCsrf();
    const headers = new Headers();

    headers.append("csrf-token", csrf);

    await authClient.signIn.social({
      provider: "github",
      callbackURL,
      errorCallbackURL: "/error",
      fetchOptions: {
        headers,
      },
    });
  }

  async function signInWithEmail(email: string, password: string) {
    const { csrf } = useCsrf();
    const headers = new Headers();

    headers.append("csrf-token", csrf);

    const result = await authClient.signIn.email({
      email,
      password,
      rememberMe: true,
      fetchOptions: {
        headers,
      },
    });

    if (result.error) {
      throw new Error(result.error.message || "Login fehlgeschlagen.");
    }

    await init();
  }

  async function signUpWithEmail(name: string, email: string, password: string) {
    const { csrf } = useCsrf();
    const headers = new Headers();

    headers.append("csrf-token", csrf);

    const result = await authClient.signUp.email({
      name,
      email,
      password,
      fetchOptions: {
        headers,
      },
    });

    if (result.error) {
      throw new Error(result.error.message || "Registrierung fehlgeschlagen.");
    }

    await init();
  }

  async function signOut() {
    const { csrf } = useCsrf();
    const headers = new Headers();
    headers.append("csrf-token", csrf);
    await authClient.signOut({
      fetchOptions: {
        headers,
      },
    });
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

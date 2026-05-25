import { authClient } from "~/lib/auth-client";

export async function useAuth() {
  const session = await authClient.useSession(useFetch);

  const user = computed(() =>
    session.data.value?.user,
  );

  const loading = computed(() =>
    session.isPending,
  );

  const isAuthenticated = computed(() =>
    !!user.value,
  );

  const isAdmin = computed(() =>
    user.value?.role === "admin",
  );

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
      throw new Error(
        result.error.message || "Login fehlgeschlagen.",
      );
    }
  }

  async function signUpWithEmail(
    name: string,
    email: string,
    password: string,
  ) {
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
      throw new Error(
        result.error.message || "Registrierung fehlgeschlagen.",
      );
    }
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
  }

  return {
    session,
    user,
    loading,
    isAuthenticated,
    isAdmin,

    signInWithGitHub,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };
}

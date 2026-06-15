import { authClient } from "~/lib/auth-client";

type AuthClientError = {
  code?: string;
};

type EmailAvailability = {
  available: boolean;
};

const authErrorMessages: Record<string, string> = {
  EMAIL_NOT_VERIFIED: "auth.emailNotVerified",
  INVALID_EMAIL_OR_PASSWORD: "auth.invalidEmailOrPassword",
  USER_ALREADY_EXISTS: "auth.emailAlreadyRegistered",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "auth.emailAlreadyRegistered",
};

function getAuthErrorMessage(error: AuthClientError | null | undefined, fallback: string) {
  if (error?.code && authErrorMessages[error.code]) {
    return authErrorMessages[error.code];
  }

  return fallback;
}

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
    const result = await authClient.signIn.social({
      provider: "github",
      callbackURL,
      errorCallbackURL: "/error",
    });

    if (result.error) {
      throw new Error(
        getAuthErrorMessage(result.error, "auth.loginFailed"),
      );
    }
  }

  async function signInWithEmail(email: string, password: string) {
    const result = await authClient.signIn.email({
      email,
      password,
      rememberMe: true,
    });

    if (result.error) {
      throw new Error(
        getAuthErrorMessage(result.error, "auth.loginFailed"),
      );
    }
  }

  async function signUpWithEmail(
    name: string,
    email: string,
    password: string,
    callbackURL = "/",
  ) {
    const availability = await $fetch<EmailAvailability>("/api/auth/email-available", {
      method: "POST",
      body: {
        email,
      },
    });

    if (!availability.available) {
      throw new Error("auth.emailAlreadyRegistered");
    }

    const result = await authClient.signUp.email({
      name,
      email,
      password,
      callbackURL,
    });

    if (result.error) {
      throw new Error(
        getAuthErrorMessage(result.error, "auth.registerFailed"),
      );
    }
  }

  async function sendVerificationEmail(email: string, callbackURL = "/") {
    const result = await authClient.sendVerificationEmail({
      email,
      callbackURL,
    });

    if (result.error) {
      throw new Error(
        getAuthErrorMessage(result.error, "auth.verificationEmailFailed"),
      );
    }
  }

  async function requestPasswordReset(email: string, redirectTo = "/login/reset-password") {
    const result = await authClient.requestPasswordReset({
      email,
      redirectTo,
    });

    if (result.error) {
      throw new Error(
        getAuthErrorMessage(result.error, "auth.resetRequestFailed"),
      );
    }
  }

  async function resetPassword(newPassword: string, token: string) {
    const result = await authClient.resetPassword({
      newPassword,
      token,
    });

    if (result.error) {
      throw new Error(
        getAuthErrorMessage(result.error, "auth.resetPasswordFailed"),
      );
    }
  }

  async function signOut() {
    const result = await authClient.signOut();

    if (result.error) {
      throw new Error(
        getAuthErrorMessage(result.error, "auth.logoutFailed"),
      );
    }
  }

  async function deleteUser() {
    const result = await authClient.deleteUser();

    if (result.error) {
      throw new Error(
        getAuthErrorMessage(result.error, "auth.deleteAccountFailed"),
      );
    }
    else {
      await authClient.signOut();
    }
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
    sendVerificationEmail,
    requestPasswordReset,
    resetPassword,
    signOut,
    deleteUser,
  };
}

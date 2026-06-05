export function useFormState(defaultError = "auth.failed") {
  const { t } = useI18n();

  const errorMessage = ref("");
  const successMessage = ref("");
  const pending = ref(false);

  function clearMessages() {
    errorMessage.value = "";
    successMessage.value = "";
  }

  function setError(error: unknown, fallback = defaultError) {
    errorMessage.value = error instanceof Error
      ? error.message
      : t(fallback);
  }

  function setSuccess(message: string) {
    successMessage.value = message;
  }

  async function submit(action: () => Promise<void>, fallback = defaultError) {
    clearMessages();
    pending.value = true;

    try {
      await action();
    }
    catch (error) {
      setError(error, fallback);
    }
    finally {
      pending.value = false;
    }
  }

  return {
    clearMessages,
    errorMessage,
    pending,
    setError,
    setSuccess,
    submit,
    successMessage,
  };
}

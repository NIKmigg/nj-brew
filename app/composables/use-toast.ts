import type {
  Toast,
  ToastType,
} from "@shared/schemas/toast";

import { nanoid } from "nanoid";

export function useToast() {
  const toasts = useState<Toast[]>(
    "toasts",
    () => [],
  );

  function show(
    message: string,
    type: ToastType = "success",
    duration = 4000,
  ) {
    const normalizedMessage = message.trim();

    if (!normalizedMessage) {
      return;
    }

    const normalizedDuration = Math.max(
      0,
      duration,
    );

    const existingIndex = toasts.value.findIndex(
      toast => toast.message === normalizedMessage,
    );

    /*
     * Derselbe Inhalt ist bereits vorhanden:
     * Eintrag an derselben Stelle ersetzen.
     *
     * Die ID bleibt identisch, damit nicht kurz zwei
     * identische Toasts durch Enter/Leave entstehen.
     */
    if (existingIndex >= 0) {
      const existingToast
        = toasts.value[existingIndex];

      if (!existingToast) {
        return;
      }

      toasts.value.splice(existingIndex, 1, {
        ...existingToast,
        message: normalizedMessage,
        type,
        duration: normalizedDuration,
        revision: existingToast.revision + 1,
      });

      return existingToast.id;
    }

    const id = nanoid();

    toasts.value.push({
      id,
      message: normalizedMessage,
      type,
      duration: normalizedDuration,
      revision: 0,
    });

    return id;
  }

  function remove(id: string) {
    const index = toasts.value.findIndex(
      toast => toast.id === id,
    );

    if (index < 0) {
      return;
    }

    toasts.value.splice(index, 1);
  }

  function clear() {
    toasts.value = [];
  }

  return {
    toasts: readonly(toasts),
    show,
    remove,
    clear,
  };
}

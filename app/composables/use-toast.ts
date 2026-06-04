import type { Toast, ToastType } from "@shared/schemas/toast";

export function useToast() {
  const toasts = useState<Toast[]>("toasts", () => []);

  function show(
    message: string,
    type: ToastType = "success",
    duration = 4000,
  ) {
    const id = crypto.randomUUID();

    toasts.value.push({
      id,
      message,
      type,
    });

    setTimeout(() => {
      remove(id);
    }, duration);
  }

  function remove(id: string) {
    toasts.value = toasts.value.filter(t => t.id !== id);
  }

  return {
    toasts,
    show,
    remove,
  };
}

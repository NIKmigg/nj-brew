import type { Toast, ToastType } from "@shared/schemas/toast";
import { nanoid } from "nanoid";

export function useToast() {
  const toasts = useState<Toast[]>("toasts", () => []);

  function show(
    message: string,
    type: ToastType = "success",
    duration = 4000,
  ) {
    const id = nanoid();

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

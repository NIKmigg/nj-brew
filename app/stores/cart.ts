import type { CartSchema } from "@shared/schemas/cart";
import { defineStore } from "pinia";

type FetchRequest = Parameters<typeof $fetch>[0];
type FetchOptions = Parameters<typeof $fetch>[1];

export const useCartStore = defineStore("cart", () => {
  const nuxtApp = useNuxtApp();
  const runtimeConfig = useRuntimeConfig();
  const requestHeaders = import.meta.server ? useRequestHeaders(["cookie"]) : undefined;

  const cart = ref<CartSchema | null>(null);
  const status = ref<"idle" | "pending" | "success" | "error">("idle");
  const showAddToCartFeedback = ref(false);
  let addToCartFeedbackTimeout: ReturnType<typeof setTimeout> | null = null;
  let cartRequestVersion = 0;

  const items = computed(() => cart.value?.items ?? []);

  const itemCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0),
  );

  const subtotal = computed(() =>
    items.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  );

  function csrfFetch<T>(
    request: FetchRequest,
    options?: FetchOptions,
  ) {
    const headers = new Headers(options?.headers);
    const headerName = runtimeConfig.public.csurf.headerName ?? "";
    const csrf = import.meta.server
      ? nuxtApp.ssrContext?.event.context.csrfToken
      : window.document.querySelector("meta[name=\"csrf-token\"]")?.getAttribute("content");

    if (headerName && csrf) {
      headers.set(headerName, csrf);
    }

    if (import.meta.server && requestHeaders?.cookie && !headers.has("cookie")) {
      headers.set("cookie", requestHeaders.cookie);
    }

    return $fetch<T>(request, {
      ...options,
      headers: Object.fromEntries(headers),
    });
  }

  async function fetchCart() {
    const requestVersion = cartRequestVersion;
    status.value = "pending";

    try {
      const result = await csrfFetch<CartSchema>("/api/cart");

      if (requestVersion !== cartRequestVersion)
        return;

      cart.value = result;
      status.value = "success";
    }
    catch (err) {
      if (requestVersion !== cartRequestVersion)
        return;

      status.value = "error";
      throw err;
    }
  }

  async function addItem(productId: string, quantity = 1) {
    await csrfFetch("/api/cart/items", {
      method: "POST",
      body: { productId, quantity },
    });

    await fetchCart();
    triggerAddToCartFeedback();
  }

  function triggerAddToCartFeedback() {
    showAddToCartFeedback.value = true;

    if (addToCartFeedbackTimeout) {
      clearTimeout(addToCartFeedbackTimeout);
    }

    addToCartFeedbackTimeout = setTimeout(() => {
      showAddToCartFeedback.value = false;
      addToCartFeedbackTimeout = null;
    }, 1500);
  }

  async function updateQuantity(itemId: string, quantity: number) {
    if (!cart.value)
      return;

    const index = cart.value.items.findIndex(i => i.id === itemId);
    if (index === -1)
      return;

    const previous = cart.value.items[index];

    cart.value.items = cart.value.items.map(i =>
      i.id === itemId ? { ...i, quantity } : i,
    );

    try {
      await csrfFetch(`/api/cart/items/${itemId}`, {
        method: "PATCH",
        body: { quantity },
      });
    }
    catch (err) {
      cart.value.items = cart.value.items.map(i =>
        i.id === itemId ? previous! : i,
      );
      throw err;
    }
  }

  async function removeItem(itemId: string) {
    if (!cart.value)
      return;

    const previous = cart.value.items;
    cart.value.items = cart.value.items.filter(i => i.id !== itemId);

    try {
      await csrfFetch(`/api/cart/items/${itemId}`, {
        method: "DELETE",
      });
    }
    catch (err) {
      cart.value.items = previous;
      throw err;
    }
  }

  async function clear() {
    await csrfFetch("/api/cart", { method: "DELETE" });
    await fetchCart();
  }

  function reset() {
    cartRequestVersion++;
    cart.value = null;
    status.value = "idle";
    showAddToCartFeedback.value = false;

    if (addToCartFeedbackTimeout) {
      clearTimeout(addToCartFeedbackTimeout);
      addToCartFeedbackTimeout = null;
    }
  }

  async function ensureLoaded() {
    if (cart.value !== null || status.value === "pending")
      return;

    await fetchCart();
  }

  return {
    cart,
    items,
    itemCount,
    subtotal,
    status,
    showAddToCartFeedback,
    addItem,
    updateQuantity,
    removeItem,
    clear,
    reset,
    ensureLoaded,
    refresh: fetchCart,
  };
});

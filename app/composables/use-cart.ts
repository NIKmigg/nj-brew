// app/composables/useCart.ts
import type { CartSchema } from "@shared/schemas/cart";

export function useCart() {
  const { $csrfFetch } = useNuxtApp();

  const cart = useState<CartSchema | null>("cart", () => null);
  const status = useState<"idle" | "pending" | "success" | "error">("cart-status", () => "idle");

  async function fetchCart() {
    status.value = "pending";
    try {
      cart.value = await $csrfFetch<CartSchema>("/api/cart");
      status.value = "success";
    }
    catch (err) {
      status.value = "error";
      throw err;
    }
  }

  const items = computed(() => cart.value?.items ?? []);

  const itemCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0),
  );

  const subtotal = computed(() =>
    items.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  );

  async function addItem(productId: number, quantity = 1) {
    await $csrfFetch("/api/cart/items", {
      method: "POST",
      body: { productId, quantity },
    });
    await fetchCart();
  }

  async function updateQuantity(itemId: number, quantity: number) {
    if (!cart.value)
      return;

    const index = cart.value.items.findIndex(i => i.id === itemId);
    if (index === -1)
      return;

    const previous = cart.value.items[index];

    // Immutable update -> garantiert Reactivity-Trigger, egal welche Komponente liest
    cart.value.items = cart.value.items.map(i =>
      i.id === itemId ? { ...i, quantity } : i,
    );

    try {
      await $csrfFetch(`/api/cart/items/${itemId}`, {
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

  async function removeItem(itemId: number) {
    if (!cart.value)
      return;

    const previous = cart.value.items;
    cart.value.items = cart.value.items.filter(i => i.id !== itemId);

    try {
      await $csrfFetch(`/api/cart/items/${itemId}`, {
        method: "DELETE",
      });
    }
    catch (err) {
      cart.value.items = previous;
      throw err;
    }
  }

  async function clear() {
    await $csrfFetch("/api/cart", { method: "DELETE" });
    await fetchCart();
  }

  if (cart.value === null && status.value === "idle") {
    fetchCart();
  }

  return {
    cart,
    items,
    itemCount,
    subtotal,
    status,
    addItem,
    updateQuantity,
    removeItem,
    clear,
    refresh: fetchCart,
  };
}

import type { CartItemSchema, CartSchema } from "@shared/schemas/cart";

export function useCart() {
  const { data: cart, status, error, refresh } = useFetch<CartSchema>("/api/cart", {
    key: "cart",
  });

  const { $csrfFetch } = useNuxtApp();

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
    await refresh();
  }

  async function updateQuantity(itemId: number, quantity: number) {
    await $fetch(`/api/cart/items/${itemId}`, {
      method: "PATCH",
      body: { quantity },
    });
    await refresh();
  }

  async function removeItem(itemId: number) {
    await $fetch(`/api/cart/items/${itemId}`, {
      method: "DELETE",
    });
    await refresh();
  }

  async function clear() {
    await $fetch("/api/cart", {
      method: "DELETE",
    });
    await refresh();
  }

  return {
    cart,
    items,
    itemCount,
    subtotal,
    status,
    error,
    addItem,
    updateQuantity,
    removeItem,
    clear,
    refresh,
  };
}

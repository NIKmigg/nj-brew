import type { Address } from "@shared/schemas/address";

type CheckoutOrderPayload = {
  billingAddress: Address;
  shippingAddress: Address;
};

export function useCheckoutOrder() {
  const { $csrfFetch } = useNuxtApp();
  const cartStore = useCartStore();
  const pending = ref(false);
  const errorMessage = ref("");

  function clearError() {
    errorMessage.value = "";
  }

  function setError(message: string) {
    errorMessage.value = message;
  }

  async function createOrder(payload: CheckoutOrderPayload) {
    clearError();
    pending.value = true;

    try {
      const order = await $csrfFetch("/api/orders", {
        method: "POST",
        body: payload,
      });

      await cartStore.refresh();

      return order;
    }
    catch (error) {
      errorMessage.value = error instanceof Error
        ? error.message
        : "checkout.failed";

      throw error;
    }
    finally {
      pending.value = false;
    }
  }

  return {
    clearError,
    createOrder,
    errorMessage,
    pending,
    setError,
  };
}

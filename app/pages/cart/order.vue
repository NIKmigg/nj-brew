<template>
  <div class="mx-auto min-h-[calc(100vh-8rem)] w-full max-w-6xl px-4 py-8 sm:py-12">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-sm font-semibold uppercase tracking-wide text-primary">
          {{ $t("checkout.step") }}
        </p>
        <h1 class="text-3xl font-bold font-old-style">
          {{ $t("checkout.title") }}
        </h1>
      </div>

      <NuxtLink :to="localePath('/cart')" class="btn btn-ghost hover:text-primary">
        <Icon name="mdi:arrow-left-bold" aria-hidden="true" />
        {{ $t("checkout.backToCart") }}
      </NuxtLink>
    </div>

    <div
      v-if="status === 'pending'"
      class="flex min-h-72 items-center justify-center"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span class="loading loading-spinner loading-lg text-primary" aria-hidden="true" />
      <span class="sr-only">{{ $t("cart.loading") }}</span>
    </div>

    <div
      v-else-if="items.length === 0"
      class="card bg-base-100 p-8 text-center shadow-sm"
      role="status"
      aria-live="polite"
    >
      <div class="mx-auto mb-5 flex size-16 items-center justify-center rounded-box bg-base-200 text-primary">
        <Icon name="mdi:basket-off-outline" size="30" aria-hidden="true" />
      </div>
      <p class="mb-6 text-lg font-semibold">
        {{ $t("cart.empty") }}
      </p>
      <NuxtLink :to="localePath('/market')" class="btn btn-ghost hover:text-primary">
        <Icon name="mdi:arrow-left-bold" aria-hidden="true" />
        {{ $t("nav.market") }}
      </NuxtLink>
    </div>

    <form
      v-else
      class="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]"
      novalidate
      @submit.prevent="openSubmitConfirm"
    >
      <div class="space-y-6">
        <CheckoutAddressForm
          v-model="shippingAddress"
          autocomplete-prefix="shipping"
          :errors="shippingErrors"
          icon="mdi:truck-delivery-outline"
          id-prefix="shipping"
          title-key="checkout.shippingAddress"
        />

        <CheckoutAddressForm
          v-model="billingAddress"
          autocomplete-prefix="billing"
          :errors="billingErrors"
          icon="mdi:file-document-outline"
          id-prefix="billing"
          :message-key="useShippingAsBilling ? 'checkout.billingMatchesShipping' : ''"
          title-key="checkout.billingAddress"
        >
          <template #header-action>
            <label class="label cursor-pointer justify-start gap-3 rounded-box bg-base-200 px-4 py-3">
              <input
                v-model="useShippingAsBilling"
                type="checkbox"
                class="checkbox checkbox-primary"
              >
              <span class="label-text font-semibold">{{ $t("checkout.useShippingAsBilling") }}</span>
            </label>
          </template>
        </CheckoutAddressForm>

        <CheckoutPaymentMethod />
      </div>

      <CheckoutOrderSummary
        :form-error="formError"
        :items="items"
        :pending="pending"
        :shipping-cost="shippingCost"
        :subtotal="subtotal"
        :total="total"
      />
    </form>

    <GsapConfirmModal
      v-model="showSubmitConfirm"
      title-key="checkout.confirmTitle"
      text-key="checkout.confirmText"
      confirm-key="checkout.confirmSubmit"
      cancel-key="global.cancel"
      close-key="global.close"
      :text-params="{ total: formatPrice(total) }"
      @confirm="submitOrder"
    />
  </div>
</template>

<script setup lang="ts">
import type { Address } from "@shared/schemas/address";
import { addressSchema } from "@shared/schemas/address";
import { toTypedSchema } from "@vee-validate/zod";
import { storeToRefs } from "pinia";
import { useForm } from "vee-validate";
import { z } from "zod";

type AddressFieldKey = keyof Address;

function emptyAddress(): Address {
  return {
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    houseNumber: "",
    postalCode: "",
    city: "",
    country: "Deutschland",
  };
}

const checkoutClientSchema = z.object({
  billingAddress: addressSchema,
  shippingAddress: addressSchema,
});

type CheckoutPayload = z.infer<typeof checkoutClientSchema>;

definePageMeta({
  middleware: "auth",
  titleKey: "seo.checkout.title",
  descriptionKey: "seo.checkout.description",
});

const cartStore = useCartStore();
await cartStore.ensureLoaded();

const { user } = await useAuth();
const { items, subtotal, status } = storeToRefs(cartStore);
const { locale, t } = useI18n();
const localePath = useLocalePath();
const toast = useToast();
const checkoutOrder = useCheckoutOrder();

const shippingAddress = reactive(emptyAddress());
const billingAddress = reactive(emptyAddress());
const useShippingAsBilling = ref(true);
const showSubmitConfirm = ref(false);
const pendingOrderPayload = ref<CheckoutPayload | null>(null);
const validationStarted = ref(false);
const shippingCost = 4.5;

const total = computed(() => subtotal.value + shippingCost);
const formError = checkoutOrder.errorMessage;
const pending = checkoutOrder.pending;

const {
  errors,
  setValues,
  validate,
} = useForm({
  validationSchema: toTypedSchema(checkoutClientSchema),
  initialValues: {
    shippingAddress: emptyAddress(),
    billingAddress: emptyAddress(),
  },
});

watch(
  user,
  (value) => {
    if (!value)
      return;

    const [firstName = "", ...lastNameParts] = (value.name ?? "").trim().split(/\s+/).filter(Boolean);
    const lastName = lastNameParts.join(" ");

    shippingAddress.firstName ||= firstName;
    shippingAddress.lastName ||= lastName;
    shippingAddress.email ||= value.email ?? "";
    billingAddress.firstName ||= firstName;
    billingAddress.lastName ||= lastName;
    billingAddress.email ||= value.email ?? "";
  },
  { immediate: true },
);

watch(
  [shippingAddress, billingAddress, useShippingAsBilling],
  async () => {
    if (!validationStarted.value)
      return;

    await validateCurrentOrder();
  },
  { deep: true },
);

function formatPrice(value: number) {
  return new Intl.NumberFormat(locale.value, {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function cloneAddress(address: Address): Address {
  return { ...toRaw(address) };
}

function getOrderPayload() {
  return {
    shippingAddress: cloneAddress(shippingAddress),
    billingAddress: useShippingAsBilling.value
      ? cloneAddress(shippingAddress)
      : cloneAddress(billingAddress),
  };
}

async function validateCurrentOrder() {
  setValues(getOrderPayload());

  const validation = await validate();

  if (!validation.valid) {
    checkoutOrder.setError(t("checkout.validationError"));
    pendingOrderPayload.value = null;

    return null;
  }

  checkoutOrder.clearError();

  return validation.values as CheckoutPayload;
}

type AddressErrors = Partial<Record<AddressFieldKey, string>>;

function emptyErrors(): AddressErrors {
  return {};
}

const shippingErrors = computed<AddressErrors>(() => {
  if (!validationStarted.value)
    return emptyErrors();

  return {
    firstName: errors.value["shippingAddress.firstName"],
    lastName: errors.value["shippingAddress.lastName"],
    email: errors.value["shippingAddress.email"],
    street: errors.value["shippingAddress.street"],
    houseNumber: errors.value["shippingAddress.houseNumber"],
    postalCode: errors.value["shippingAddress.postalCode"],
    city: errors.value["shippingAddress.city"],
    country: errors.value["shippingAddress.country"],
  };
});

const billingErrors = computed<AddressErrors>(() => {
  if (!validationStarted.value || useShippingAsBilling.value)
    return emptyErrors();

  return {
    firstName: errors.value["billingAddress.firstName"],
    lastName: errors.value["billingAddress.lastName"],
    email: errors.value["billingAddress.email"],
    street: errors.value["billingAddress.street"],
    houseNumber: errors.value["billingAddress.houseNumber"],
    postalCode: errors.value["billingAddress.postalCode"],
    city: errors.value["billingAddress.city"],
    country: errors.value["billingAddress.country"],
  };
});

async function openSubmitConfirm() {
  checkoutOrder.clearError();
  pendingOrderPayload.value = null;
  validationStarted.value = true;

  const payload = await validateCurrentOrder();

  if (!payload)
    return;

  pendingOrderPayload.value = payload;
  showSubmitConfirm.value = true;
}

async function submitOrder() {
  if (!pendingOrderPayload.value)
    return;

  showSubmitConfirm.value = false;

  try {
    await checkoutOrder.createOrder(pendingOrderPayload.value);
    pendingOrderPayload.value = null;
    toast.show(t("checkout.success"));
    await navigateTo(localePath("/cart/order-confirmation"), { replace: true });
  }
  catch (error) {
    console.error(error);
  }
}
</script>

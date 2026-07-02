<template>
  <section class="card bg-base-100 p-6 text-base-content shadow-sm" aria-labelledby="payment-method-title">
    <div class="mb-5 flex items-center gap-3">
      <Icon
        name="mdi:cash"
        size="24"
        class="text-primary"
        aria-hidden="true"
      />
      <h2 id="payment-method-title" class="text-xl font-bold sm:text-2xl font-old-style">
        {{ $t("checkout.paymentMethod") }}
      </h2>
    </div>

    <label class="flex cursor-pointer items-start gap-3 rounded-box bg-base-200 p-4">
      <input
        checked
        class="radio radio-primary mt-1"
        name="payment-method"
        type="radio"
        value="cash"
        readonly
      >
      <span>
        <span class="block font-semibold">
          {{ $t("checkout.cashPayment") }}
        </span>
        <span class="mt-1 block text-sm text-base-content/70">
          {{ $t("checkout.cashPaymentInfo") }}
        </span>
      </span>
    </label>
  </section>
</template>

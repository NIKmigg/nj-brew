<template>
  <section class="card bg-base-100 p-6 text-base-content shadow-sm" :aria-labelledby="titleId">
    <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <Icon
          :name="props.icon"
          size="24"
          class="text-primary"
          aria-hidden="true"
        />
        <h2 :id="titleId" class="text-xl font-bold sm:text-2xl font-old-style">
          {{ $t(props.titleKey) }}
        </h2>
      </div>

      <slot name="header-action" />
    </div>

    <div v-if="props.messageKey" class="alert alert-soft">
      <Icon name="mdi:check-circle-outline" class="text-xl" aria-hidden="true" />
      <span>{{ $t(props.messageKey) }}</span>
    </div>

    <div v-else class="grid gap-4 sm:grid-cols-2">
      <div
        v-for="field in addressFields"
        :key="`${props.idPrefix}-${field.key}`"
        class="form-control w-full"
        :class="field.full ? 'sm:col-span-2' : ''"
      >
        <label class="label pl-3 pb-1" :for="`${props.idPrefix}-${field.key}`">
          <span class="label-text">{{ $t(field.labelKey) }}</span>
        </label>
        <div class="relative">
          <Icon
            :name="field.icon"
            class="absolute left-3 top-1/2 z-10 -translate-y-1/2 opacity-60"
            aria-hidden="true"
          />
          <input
            :id="`${props.idPrefix}-${field.key}`"
            v-model="address[field.key]"
            class="input input-neutral w-full pl-10"
            :class="{ 'input-error': errors[field.key] }"
            :type="field.type"
            :autocomplete="`${props.autocompletePrefix} ${field.autocomplete}`"
            :aria-invalid="errors[field.key] ? 'true' : 'false'"
            :aria-describedby="errors[field.key] ? `${props.idPrefix}-${field.key}-error` : undefined"
          >
        </div>
        <p
          v-if="errors[field.key]"
          :id="`${props.idPrefix}-${field.key}-error`"
          class="text-error label text-xs"
        >
          {{ $t(errors[field.key]) }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Address } from "@shared/schemas/address";

type AddressFieldKey = keyof Address;

type AddressField = {
  key: AddressFieldKey;
  labelKey: string;
  icon: string;
  autocomplete: string;
  type: "email" | "text";
  full?: boolean;
};

const props = withDefaults(defineProps<{
  autocompletePrefix: "billing" | "shipping";
  errors?: Partial<Record<AddressFieldKey, string>>;
  icon: string;
  idPrefix: string;
  messageKey?: string;
  titleKey: string;
}>(), {
  errors: () => ({}),
  messageKey: "",
});

const address = defineModel<Address>({ required: true });
const titleId = computed(() => `${props.idPrefix}-address-title`);
const errors = computed(() => props.errors);

const addressFields: AddressField[] = [
  { key: "firstName", labelKey: "checkout.fields.firstName", icon: "mdi:account-outline", autocomplete: "given-name", type: "text" },
  { key: "lastName", labelKey: "checkout.fields.lastName", icon: "mdi:account-outline", autocomplete: "family-name", type: "text" },
  { key: "email", labelKey: "checkout.fields.email", icon: "mdi:at", autocomplete: "email", type: "email", full: true },
  { key: "street", labelKey: "checkout.fields.street", icon: "mdi:road-variant", autocomplete: "address-line1", type: "text" },
  { key: "houseNumber", labelKey: "checkout.fields.houseNumber", icon: "mdi:home-outline", autocomplete: "address-line2", type: "text" },
  { key: "postalCode", labelKey: "checkout.fields.postalCode", icon: "mdi:mailbox-outline", autocomplete: "postal-code", type: "text" },
  { key: "city", labelKey: "checkout.fields.city", icon: "mdi:city-variant-outline", autocomplete: "address-level2", type: "text" },
  { key: "country", labelKey: "checkout.fields.country", icon: "mdi:earth", autocomplete: "country-name", type: "text", full: true },
];
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ label }}
    </legend>
    <div class="input w-full">
      <input
        v-model="value"
        :name="name"
        :aria-label="label"
        :aria-invalid="errorMessage ? 'true' : 'false'"
        type="number"
        :step="step"
        :min="min"
        :max="max"
        class="w-full [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        @blur="handleBlur"
      >
      <span v-if="unit">{{ unit }}</span>
      <button
        type="button"
        class="btn btn-ghost btn-xs"
        :aria-label="$t('global.reset')"
        @click="$emit('reset')"
      >
        <Icon name="mdi:restore" size="20" class="text-primary/60" />
      </button>
    </div>
    <p v-if="errorMessage" class="label text-error">
      {{ errorMessage }}
    </p>
  </fieldset>
</template>

<script setup lang="ts">
import { useField } from "vee-validate";

type Props = {
  name: string;
  label: string;
  unit?: string;
  step?: number | string;
  min?: number;
  max?: number;
};

const props = withDefaults(defineProps<Props>(), {
  unit: undefined,
  step: "any",
  min: 0,
  max: undefined,
});

defineEmits<{ reset: [] }>();

const { value, errorMessage, handleBlur } = useField<number>(() => props.name);
</script>

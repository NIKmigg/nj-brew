<template>
  <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
    <!-- Zutaten -->
    <p class="text-xs font-medium text-base-content/50 uppercase tracking-wide">
      {{ $t("admin.constants.ingredients") }}
    </p>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">
        {{ $t("admin.constants.honeyPerL") }}
      </legend>
      <div class="input w-full">
        <input
          v-model="honeyPerL"
          v-bind="honeyPerLAttrs"
          type="number"
          step="any"
          min="0"
          class="w-full"
        >
        <span>g/L</span>
      </div>
      <p v-if="errors.honeyPerL" class="text-error label">
        {{ errors.honeyPerL }}
      </p>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">
        {{ $t("admin.constants.volumePerKgHoney") }}
      </legend>
      <div class="input w-full">
        <input
          v-model="volumePerKgHoney"
          v-bind="volumePerKgHoneyAttrs"
          type="number"
          step="any"
          min="0"
          class="w-full"
        >
        <span>L/kg</span>
      </div>
      <p v-if="errors.volumePerKgHoney" class="text-error label">
        {{ errors.volumePerKgHoney }}
      </p>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">
        {{ $t("admin.constants.yeastPerL") }}
      </legend>
      <div class="input w-full">
        <input
          v-model="yeastPerL"
          v-bind="yeastPerLAttrs"
          type="number"
          step="any"
          min="0"
          class="w-full"
        >
        <span>g/L</span>
      </div>
      <p v-if="errors.yeastPerL" class="text-error label">
        {{ errors.yeastPerL }}
      </p>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">
        {{ $t("admin.constants.nutrientPerL") }}
      </legend>
      <div class="input w-full">
        <input
          v-model="nutrientPerL"
          v-bind="nutrientPerLAttrs"
          type="number"
          step="any"
          min="0"
          class="w-full"
        >
        <span>g/L</span>
      </div>
      <p v-if="errors.nutrientPerL" class="text-error label">
        {{ errors.nutrientPerL }}
      </p>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">
        {{ $t("admin.constants.tanninPerL") }}
      </legend>
      <div class="input w-full">
        <input
          v-model="tanninPerL"
          v-bind="tanninPerLAttrs"
          type="number"
          step="any"
          min="0"
          class="w-full"
        >
        <span>g/L</span>
      </div>
      <p v-if="errors.tanninPerL" class="text-error label">
        {{ errors.tanninPerL }}
      </p>
    </fieldset>

    <div class="divider my-0" />

    <!-- Faktoren -->
    <p class="text-xs font-medium text-base-content/50 uppercase tracking-wide">
      {{ $t("admin.constants.factors") }}
    </p>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">
        {{ $t("admin.constants.stepFeedRatio") }}
      </legend>
      <div class="input w-full">
        <input
          v-model="stepFeedRatio"
          v-bind="stepFeedRatioAttrs"
          type="number"
          step="any"
          min="0"
          max="1"
          class="w-full"
        >
        <span>0–1</span>
      </div>
      <p v-if="errors.stepFeedRatio" class="text-error label">
        {{ errors.stepFeedRatio }}
      </p>
    </fieldset>

    <div class="divider my-0" />

    <!-- Osmose -->
    <p class="text-xs font-medium text-base-content/50 uppercase tracking-wide">
      {{ $t("admin.constants.osmosis") }}
    </p>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">
        {{ $t("admin.constants.osmosisThreshold") }}
      </legend>
      <div class="input w-full">
        <input
          v-model="osmosisThreshold"
          v-bind="osmosisThresholdAttrs"
          type="number"
          step="any"
          min="0"
          class="w-full"
        >
        <span>°dH</span>
      </div>
      <p v-if="errors.osmosisThreshold" class="text-error label">
        {{ errors.osmosisThreshold }}
      </p>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">
        {{ $t("admin.constants.targetHardness") }}
      </legend>
      <div class="input w-full">
        <input
          v-model="targetHardness"
          v-bind="targetHardnessAttrs"
          type="number"
          step="any"
          min="0"
          class="w-full"
        >
        <span>°dH</span>
      </div>
      <p v-if="errors.targetHardness" class="text-error label">
        {{ errors.targetHardness }}
      </p>
    </fieldset>

    <div class="divider my-0" />

    <!-- Anzeigewerte -->
    <p class="text-xs font-medium text-base-content/50 uppercase tracking-wide">
      {{ $t("admin.constants.displayValues") }}
    </p>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">
        {{ $t("admin.constants.estimatedBrix") }}
      </legend>
      <div class="input w-full">
        <input
          v-model="estimatedBrix"
          v-bind="estimatedBrixAttrs"
          type="number"
          step="any"
          min="0"
          class="w-full"
        >
        <span>°Brix</span>
      </div>
      <p v-if="errors.estimatedBrix" class="text-error label">
        {{ errors.estimatedBrix }}
      </p>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">
        {{ $t("admin.constants.estimatedAlc") }}
      </legend>
      <div class="input w-full">
        <input
          v-model="estimatedAlc"
          v-bind="estimatedAlcAttrs"
          type="number"
          step="any"
          min="0"
          class="w-full"
        >
        <span>%vol</span>
      </div>
      <p v-if="errors.estimatedAlc" class="text-error label">
        {{ errors.estimatedAlc }}
      </p>
    </fieldset>

    <button type="submit" class="btn btn-primary w-full mt-auto" :disabled="isSubmitting">
      <span v-if="isSubmitting" class="loading loading-spinner loading-sm" />
      {{ $t("admin.constants.save") }}
    </button>
  </form>
</template>

<script setup lang="ts">
import type { UpdateMeadConstantsSchema } from "@shared/schemas/mead";
import { updateMeadConstantsSchema } from "@shared/schemas/mead";

definePageMeta({
  middleware: "auth",
});

const { data: constants } = await useFetch<UpdateMeadConstantsSchema>("/api/mead");
const { defineField, handleSubmit, errors, isSubmitting, setValues } = useForm({
  validationSchema: toTypedSchema(updateMeadConstantsSchema),
});

if (constants.value)
  setValues(constants.value);

const [honeyPerL, honeyPerLAttrs] = defineField("honeyPerL");
const [volumePerKgHoney, volumePerKgHoneyAttrs] = defineField("volumePerKgHoney");
const [yeastPerL, yeastPerLAttrs] = defineField("yeastPerL");
const [nutrientPerL, nutrientPerLAttrs] = defineField("nutrientPerL");
const [tanninPerL, tanninPerLAttrs] = defineField("tanninPerL");
const [stepFeedRatio, stepFeedRatioAttrs] = defineField("stepFeedRatio");
const [osmosisThreshold, osmosisThresholdAttrs] = defineField("osmosisThreshold");
const [targetHardness, targetHardnessAttrs] = defineField("targetHardness");
const [estimatedBrix, estimatedBrixAttrs] = defineField("estimatedBrix");
const [estimatedAlc, estimatedAlcAttrs] = defineField("estimatedAlc");
const { $csrfFetch } = useNuxtApp();

// Bestehende Werte aus DB ins Formular laden
watchEffect(() => {
  if (constants.value)
    setValues(constants.value);
});

const onSubmit = handleSubmit(async (values) => {
  await $csrfFetch("/api/mead", {
    method: "PATCH",
    body: values,
  });
});
</script>

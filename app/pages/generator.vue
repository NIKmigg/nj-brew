<template>
  <div class="flex flex-wrap gap-4 p-6">
    <!-- Eingabe Card -->
    <BaseCard :title="$t('generator.recipe')">
      <fieldset class="fieldset">
        <legend class="fieldset-legend">
          {{ $t("generator.targetVolume") }}
        </legend>
        <input
          v-model="targetVolumeL"
          v-bind="targetVolumeLAttrs"
          type="number"
          min="0"
          class="input w-full"
          :class="{ 'input-error': errors.targetVolumeL }"
          :placeholder="$t('generator.targetVolumePlaceholder')"
        >
      </fieldset>

      <fieldset class="fieldset">
        <legend class="fieldset-legend">
          {{ $t("generator.useTannin") }}
        </legend>
        <input v-model="useTannin" type="checkbox" class="toggle toggle-primary">
      </fieldset>

      <button class="btn btn-primary w-full mt-auto" @click="onSubmit">
        {{ $t("generator.calculate") }}
      </button>
    </BaseCard>

    <!-- Zutaten Card -->
    <BaseCard v-if="result" :title="$t('generator.ingredients')">
      <GeneratorIngredientRow :label="$t('generator.honey')" :value="`${result.honey_g} g`" />
      <div class="divider my-0" />
      <GeneratorIngredientRow :label="$t('generator.water')" :value="`${result.water_L.toFixed(2)} L`" />
      <div class="divider my-0" />
      <GeneratorIngredientRow :label="$t('generator.yeast')" :value="`${result.yeast_g.toFixed(1)} g`" />
      <div class="divider my-0" />
      <GeneratorIngredientRow :label="$t('generator.nutrient')" :value="`${result.nutrient_g.toFixed(1)} g`" />
      <template v-if="result.tannin_g !== undefined">
        <div class="divider my-0" />
        <GeneratorIngredientRow :label="$t('generator.tannin')" :value="`${result.tannin_g.toFixed(2)} g`" />
      </template>
    </BaseCard>

    <!-- Gärwerte Card -->
    <BaseCard v-if="result" :title="$t('generator.fermentationValues')">
      <div class="flex flex-col gap-1">
        <div class="flex justify-between text-sm">
          <span class="text-base-content/60">°Brix</span>
          <span class="font-medium">{{ result.estimatedBrix.toFixed(1) }}</span>
        </div>
        <progress
          class="progress w-full"
          :class="brixProgressClass"
          :value="result.estimatedBrix"
          max="35"
        />
        <p class="text-xs text-base-content/40">
          {{ $t("generator.brixTarget") }}
        </p>
      </div>
      <div class="flex flex-col gap-1">
        <div class="flex justify-between text-sm">
          <span class="text-base-content/60">{{ $t("generator.alcohol") }}</span>
          <span class="font-medium">{{ result.estimatedABV.toFixed(1) }} %</span>
        </div>
        <progress
          class="progress progress-info w-full"
          :value="result.estimatedABV"
          max="25"
        />
        <p class="text-xs text-base-content/40">
          {{ $t("generator.abvExpected") }}
        </p>
      </div>
    </BaseCard>
  </div>
</template>

<script lang="ts" setup>
// 26–29 °Brix ≈ 14% Alkoholpotential

// Brix-Bewertung
// <24 zu schwach "Ansatz könnte zu schwach werden."
// 24–26 akzeptabel  "Ansatz könnte zu schwach werden."
// 26–29 ideal
// >30 "Hohes Risiko für Hefestress oder Gärstopp."
// 24–26 akzeptabel  "Ansatz könnte zu schwach werden."
// 26–29 ideal
// >30 "Hohes Risiko für Hefestress oder Gärstopp."

import type { MeadRecipeInput, MeadRecipeOutput } from "@shared/schemas/mead";
// const fermentableSugarPerGHoney = 0.8; // g vergärbarer Zucker pro g Honig
import { meadRecipeInputSchema } from "@shared/schemas/mead";

definePageMeta({
  middleware: "auth",
});

const honeyPerL = 364;
const volumePerKgHoney = 0.75;
const yeastPerL = 0.5;
const nutrientPerL = 0.375;

const calculated = ref(false);

const result = ref<MeadRecipeOutput | null>(null);
const { defineField, handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(meadRecipeInputSchema),
});

const [targetVolumeL, targetVolumeLAttrs] = defineField("targetVolumeL");
const useTannin = ref(false);

const brixProgressClass = computed(() => {
  if (!result.value?.estimatedBrix)
    return "progress-warning";
  if (result.value.estimatedBrix < 26)
    return "progress-warning";
  if (result.value.estimatedBrix > 29)
    return "progress-error";
  return "progress-success";
});

const onSubmit = handleSubmit((values) => {
  const { targetVolumeL: vol } = values;
  const tannin = useTannin.value;

  const honey_g = vol * honeyPerL;

  result.value = {
    honey_g,
    water_L: vol - ((honey_g / 1000) * volumePerKgHoney),
    yeast_g: vol * yeastPerL,
    nutrient_g: vol * nutrientPerL,
    tannin_g: tannin ? vol * 0.16 : undefined,
    estimatedABV: (honey_g / vol) / 26,
    estimatedBrix: (honey_g / vol) / 14,
    recommendOsmosis: false,
    stepFeedHoney_g: honey_g * 0.1,
  };

  calculated.value = true;
});
</script>

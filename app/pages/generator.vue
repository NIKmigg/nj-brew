<template>
  <div class="flex flex-wrap gap-4 p-6">
    <!-- Eingabe Card -->
    <div class="card bg-base-100 shadow-sm flex-1 min-w-64">
      <div class="card-body gap-4">
        <h2 class="card-title text-base">
          {{ $t("generator.recipe") }}
        </h2>

        <fieldset class="fieldset">
          <legend class="fieldset-legend">
            {{ $t("generator.targetVolume") }}
          </legend>
          <input
            v-model="form.targetVolumeL"
            type="number"
            min="0"
            class="input w-full"
            :placeholder="$t('generator.targetVolumePlaceholder')"
          >
        </fieldset>

        <fieldset class="fieldset">
          <legend class="fieldset-legend">
            {{ $t("generator.useTannin") }}
          </legend>
          <input v-model="form.useTannin" type="checkbox" class="toggle toggle-primary">
        </fieldset>

        <button class="btn btn-primary w-full" @click="calculate">
          {{ $t("generator.calculate") }}
        </button>
      </div>
    </div>

    <!-- Zutaten Card -->
    <div v-if="result" class="card bg-base-100 shadow-sm flex-1 min-w-64">
      <div class="card-body gap-3">
        <h2 class="card-title text-base">
          {{ $t("generator.ingredients") }}
        </h2>
        <div class="flex justify-between">
          <span class="text-base-content/60 text-sm">{{ $t("generator.honey") }}</span>
          <span class="font-medium">{{ result.honey_g }} g</span>
        </div>
        <div class="divider my-0" />
        <div class="flex justify-between">
          <span class="text-base-content/60 text-sm">{{ $t("generator.water") }}</span>
          <span class="font-medium">{{ result.water_L.toFixed(2) }} L</span>
        </div>
        <div class="divider my-0" />
        <div class="flex justify-between">
          <span class="text-base-content/60 text-sm">{{ $t("generator.yeast") }}</span>
          <span class="font-medium">{{ result.yeast_g.toFixed(1) }} g</span>
        </div>
        <div class="divider my-0" />
        <div class="flex justify-between">
          <span class="text-base-content/60 text-sm">{{ $t("generator.nutrient") }}</span>
          <span class="font-medium">{{ result.nutrient_g.toFixed(1) }} g</span>
        </div>
        <template v-if="result.tannin_g !== undefined">
          <div class="divider my-0" />
          <div class="flex justify-between">
            <span class="text-base-content/60 text-sm">{{ $t("generator.tannin") }}</span>
            <span class="font-medium">{{ result.tannin_g.toFixed(2) }} g</span>
          </div>
        </template>
      </div>
    </div>

    <!-- Gärwerte Card -->
    <div v-if="result" class="card bg-base-100 shadow-sm flex-1 min-w-64">
      <div class="card-body gap-4">
        <h2 class="card-title text-base">
          {{ $t("generator.fermentationValues") }}
        </h2>
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
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 26–29 °Brix ≈ 14% Alkoholpotential

// Brix-Bewertung
// <24 zu schwach "Ansatz könnte zu schwach werden."
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

const showError = ref(false);
const calculated = ref(false);

const result = ref<MeadRecipeOutput | null>(null);
const form = ref<MeadRecipeInput>({
  targetVolumeL: 0,
  waterHardness_dH: undefined,
  useTannin: false,
});

const brixProgressClass = computed(() => {
  if (!result.value?.estimatedBrix)
    return "progress-warning";
  if (result.value.estimatedBrix < 26)
    return "progress-warning";
  if (result.value.estimatedBrix > 29)
    return "progress-error";
  return "progress-success";
});

function calculate() {
  const parsed = meadRecipeInputSchema.safeParse(form.value);

  if (!parsed.success) {
    showError.value = true;
    return;
  }

  const { targetVolumeL: vol, useTannin: tannin } = parsed.data;
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

  showError.value = false;

  calculated.value = true;
}
</script>

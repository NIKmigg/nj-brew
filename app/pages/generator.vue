<template>
  <div class="flex flex-wrap gap-4 p-6">
    <!-- Eingabe Card -->
    <BaseCard title="Rezept">
      <fieldset class="fieldset">
        <legend class="fieldset-legend">
          Ansatzvolumen (L)
        </legend>
        <input
          v-model="form.targetVolumeL"
          type="number"
          min="0"
          class="input w-full"
          placeholder="z.B. 8"
        >
      </fieldset>

      <fieldset class="fieldset">
        <legend class="fieldset-legend">
          Tannin verwenden
        </legend>
        <input v-model="form.useTannin" type="checkbox" class="toggle toggle-primary">
      </fieldset>

      <button class="btn btn-primary w-full mt-auto" @click="calculate">
        Berechnen
      </button>
    </BaseCard>

    <!-- Zutaten Card -->
    <BaseCard v-if="result" title="Zutaten">
      <GeneratorIngredientRow label="Honig" :value="`${result.honey_g} g`" />
      <div class="divider my-0" />
      <GeneratorIngredientRow label="Wasser" :value="`${result.water_L.toFixed(2)} L`" />
      <div class="divider my-0" />
      <GeneratorIngredientRow label="Hefe" :value="`${result.yeast_g.toFixed(1)} g`" />
      <div class="divider my-0" />
      <GeneratorIngredientRow label="Hefenährsalz" :value="`${result.nutrient_g.toFixed(1)} g`" />
      <template v-if="result.tannin_g !== undefined">
        <div class="divider my-0" />
        <GeneratorIngredientRow label="Tannin" :value="`${result.tannin_g.toFixed(2)} g`" />
      </template>
    </BaseCard>

    <!-- Gärwerte Card -->
    <BaseCard v-if="result" title="Gärwerte">
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
          Ziel: 26–29 °Brix
        </p>
      </div>
      <div class="flex flex-col gap-1">
        <div class="flex justify-between text-sm">
          <span class="text-base-content/60">Alkohol</span>
          <span class="font-medium">{{ result.estimatedABV.toFixed(1) }} %</span>
        </div>
        <progress
          class="progress progress-info w-full"
          :value="result.estimatedABV"
          max="25"
        />
        <p class="text-xs text-base-content/40">
          ~14% ABV erwartet
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

// const fermentableSugarPerGHoney = 0.8; // g vergärbarer Zucker pro g Honig
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

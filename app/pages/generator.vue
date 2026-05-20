<template>
  <div class="flex flex-wrap gap-4 p-26">
    <!-- Eingabe Card -->
    <div class="card bg-base-200 shadow-sm flex-1 min-w-64">
      <div class="card-body gap-4">
        <h2 class="card-title text-base">
          Rezept
        </h2>

        <fieldset class="fieldset">
          <legend class="fieldset-legend">
            Ansatzvolumen (L)
          </legend>
          <input
            v-model="targetVolumeL"
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
          <input v-model="useTannin" type="checkbox" class="toggle toggle-primary">
        </fieldset>

        <button class="btn btn-primary w-full" @click="calculate">
          Berechnen
        </button>
      </div>
    </div>

    <!-- Zutaten Card -->
    <div v-if="calculated" class="card bg-base-200 shadow-sm flex-1 min-w-64">
      <div class="card-body gap-3">
        <h2 class="card-title text-base">
          Zutaten
        </h2>
        <div class="flex justify-between">
          <span class="text-base-content/60 text-sm">Honig</span>
          <span class="font-medium">{{ baseHoney_g }} g</span>
        </div>
        <div class="divider my-0" />
        <div class="flex justify-between">
          <span class="text-base-content/60 text-sm">Wasser</span>
          <span class="font-medium">{{ waterL?.toFixed(2) }} L</span>
        </div>
        <div class="divider my-0" />
        <div class="flex justify-between">
          <span class="text-base-content/60 text-sm">Hefe</span>
          <span class="font-medium">{{ yeast_g?.toFixed(1) }} g</span>
        </div>
        <div class="divider my-0" />
        <div class="flex justify-between">
          <span class="text-base-content/60 text-sm">Hefenährsalz</span>
          <span class="font-medium">{{ nutrient_g?.toFixed(1) }} g</span>
        </div>
        <template v-if="useTannin && tannin_g !== null">
          <div class="divider my-0" />
          <div class="flex justify-between">
            <span class="text-base-content/60 text-sm">Tannin</span>
            <span class="font-medium">{{ tannin_g?.toFixed(2) }} g</span>
          </div>
        </template>
      </div>
    </div>

    <!-- Gärwerte Card -->
    <div v-if="calculated" class="card bg-base-200 shadow-sm flex-1 min-w-64">
      <div class="card-body gap-4">
        <h2 class="card-title text-base">
          Gärwerte
        </h2>

        <div class="flex flex-col gap-1">
          <div class="flex justify-between text-sm">
            <span class="text-base-content/60">°Brix</span>
            <span class="font-medium">{{ estimatedBrix?.toFixed(1) }}</span>
          </div>
          <progress
            class="progress w-full"
            :class="brixProgressClass"
            :value="estimatedBrix ?? 0"
            max="35"
          />
          <p class="text-xs text-base-content/40">
            Ziel: 26–29 °Brix
          </p>
        </div>

        <div class="flex flex-col gap-1">
          <div class="flex justify-between text-sm">
            <span class="text-base-content/60">Alkohol</span>
            <span class="font-medium">{{ estimatedABV?.toFixed(1) }} %</span>
          </div>
          <progress
            class="progress progress-info w-full"
            :value="estimatedABV ?? 0"
            max="25"
          />
          <p class="text-xs text-base-content/40">
            ~14% ABV erwartet
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
// 24–26	akzeptabel  "Ansatz könnte zu schwach werden."
// 26–29	ideal
// >30	"Hohes Risiko für Hefestress oder Gärstopp."

// const fermentableSugarPerGHoney = 0.8; // g vergärbarer Zucker pro g Honig
const honeyPerL = 364;
const volumePerKgHoney = 0.75;
const yeastPerL = 0.5;
const nutrientPerL = 0.375;

const targetVolumeL = ref<number | null>(null);
const useTannin = ref(false);
const showError = ref(false);
const calculated = ref(false);

const baseHoney_g = ref<number | null>(null);
const waterL = ref<number | null>(null);
const yeast_g = ref<number | null>(null);
const nutrient_g = ref<number | null>(null);
const tannin_g = ref<number | null>(null);
const estimatedABV = ref<number | null>(null);
const estimatedBrix = ref<number | null>(null);

const brixProgressClass = computed(() => {
  if (!estimatedBrix.value)
    return "progress-warning";
  if (estimatedBrix.value < 26)
    return "progress-warning";
  if (estimatedBrix.value > 29)
    return "progress-error";
  return "progress-success";
});

function calculate() {
  if (!targetVolumeL.value) {
    showError.value = true;
    return;
  }

  showError.value = false;
  tannin_g.value = null;

  baseHoney_g.value = targetVolumeL.value * honeyPerL;
  waterL.value = targetVolumeL.value - ((baseHoney_g.value / 1000) * volumePerKgHoney);
  yeast_g.value = targetVolumeL.value * yeastPerL;
  nutrient_g.value = targetVolumeL.value * nutrientPerL;

  if (useTannin.value) {
    tannin_g.value = targetVolumeL.value * 0.16;
  }

  estimatedABV.value = (baseHoney_g.value / targetVolumeL.value) / 26;
  estimatedBrix.value = (baseHoney_g.value / targetVolumeL.value) / 14;

  calculated.value = true;
}
</script>

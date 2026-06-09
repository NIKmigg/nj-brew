<template>
  <div class="flex flex-col items-center py-8 px-4 select-none">
    <div id="print-area" class="scroll-wrap cursor-pointer" @click="open = !open">
      <div class="rod z-10 relative" />

      <div
        class="parchment-clip overflow-hidden transition-all duration-700 ease-in-out"
        :style="{ maxHeight: open ? '1200px' : '0px' }"
      >
        <div class="aged-edge-top" />
        <div class="parchment relative px-10 py-8 border-x-4 border-[#a07830]">
          <div class="parchment-lines absolute inset-0 pointer-events-none" />
          <div class="parchment-vignette absolute inset-0 pointer-events-none" />

          <div class="relative z-10">
            <h2 class="scroll-title text-center mb-4">
              {{ title }}
            </h2>
            <div class="text-center text-[#7a4a10] opacity-70 tracking-widest mb-6">
              {{ t('generator.parchmentRoll.divider') }}
            </div>

            <!-- Zutaten -->
            <div v-if="result" class="scroll-body">
              <p class="drop-cap">
                {{ t('generator.parchmentRoll.intro', { waterL: result.water_L.toFixed(0) }) }}
              </p>

              <div class="ingredient-block my-4">
                <div class="ingredient-row">
                  <span class="ingredient-icon">🍯</span>
                  <span class="ingredient-label">{{ t('generator.parchmentRoll.ingredients.honey') }}</span>
                  <span class="ingredient-dots" />
                  <span class="ingredient-value">{{ result.honey_g }} {{ t('generator.parchmentRoll.units.grams') }}</span>
                </div>
                <div class="ingredient-row">
                  <span class="ingredient-icon">💧</span>
                  <span class="ingredient-label">{{ t('generator.parchmentRoll.ingredients.water') }}</span>
                  <span class="ingredient-dots" />
                  <span class="ingredient-value">{{ result.water_L.toFixed(2) }} {{ t('generator.parchmentRoll.units.liters') }}</span>
                </div>
                <div class="ingredient-row">
                  <span class="ingredient-icon">🌿</span>
                  <span class="ingredient-label">{{ t('generator.parchmentRoll.ingredients.yeast') }}</span>
                  <span class="ingredient-dots" />
                  <span class="ingredient-value">{{ result.yeast_g.toFixed(1) }} {{ t('generator.parchmentRoll.units.grams') }}</span>
                </div>
                <div class="ingredient-row">
                  <span class="ingredient-icon">⚗️</span>
                  <span class="ingredient-label">{{ t('generator.parchmentRoll.ingredients.nutrient') }}</span>
                  <span class="ingredient-dots" />
                  <span class="ingredient-value">{{ result.nutrient_g.toFixed(1) }} {{ t('generator.parchmentRoll.units.grams') }}</span>
                </div>
                <div v-if="result.tannin_g !== undefined" class="ingredient-row">
                  <span class="ingredient-icon">🌰</span>
                  <span class="ingredient-label">{{ t('generator.parchmentRoll.ingredients.tannin') }}</span>
                  <span class="ingredient-dots" />
                  <span class="ingredient-value">{{ result.tannin_g.toFixed(2) }} {{ t('generator.parchmentRoll.units.grams') }}</span>
                </div>
              </div>

              <div class="divider-ornament my-4">
                {{ t('generator.parchmentRoll.ornament') }}
              </div>

              <!-- Gärwerte -->
              <p class="section-heading">
                {{ t('generator.parchmentRoll.fermentation.heading') }}
              </p>
              <p>
                {{ t('generator.parchmentRoll.fermentation.description', {
                  brix: result.estimatedBrix.toFixed(1),
                  alc: result.estimatedAlc.toFixed(1),
                }) }}
              </p>

              <template v-if="result.recommendOsmosis && result.osmosisRatio !== undefined">
                <div class="divider-ornament my-4">
                  {{ t('generator.parchmentRoll.ornament') }}
                </div>
                <p class="section-heading">
                  {{ t('generator.parchmentRoll.osmosis.heading') }}
                </p>
                <p>
                  {{ t('generator.parchmentRoll.osmosis.description', {
                    osmosisPercent: result.osmosisRationInPercent,
                    tapPercent: result.tapWaterRatioInPercent,
                  }) }}
                </p>
              </template>

              <div class="divider-ornament my-4">
                {{ t('generator.parchmentRoll.ornament') }}
              </div>

              <!-- Nachsüßen -->
              <p class="section-heading">
                {{ t('generator.parchmentRoll.stepFeeding.heading') }}
              </p>
              <p>
                {{ t('generator.parchmentRoll.stepFeeding.description', {
                  honey: result.stepFeedHoney_g.toFixed(0),
                  percent: result.stepFeedHoneyPercent.toFixed(0),
                }) }}
              </p>

              <div class="divider-ornament my-4">
                {{ t('generator.parchmentRoll.ornament') }}
              </div>

              <!-- Utensilien -->
              <p class="section-heading">
                {{ t('generator.parchmentRoll.utensils.heading') }}
              </p>
              <ul class="utensil-list">
                <li v-for="item in utensils" :key="item.title">
                  ⚒ {{ $t(item.title) }}
                  <span v-if="item.subtitle" class="utensil-sub"> — {{ $t(item.subtitle ?? "") }}</span>
                </li>
              </ul>
            </div>

            <slot v-else />

            <p v-if="seal" class="seal-line text-center mt-6 text-xs tracking-widest italic opacity-75">
              ⚜ &nbsp; {{ seal }} &nbsp; ⚜
            </p>
          </div>
        </div>
        <div class="aged-edge-bottom" />
      </div>

      <div
        class="rod z-10 relative transition-all duration-700 ease-in-out"
        :style="{ marginTop: open ? '0' : '-24px', opacity: open ? 1 : 0 }"
      />
    </div>

    <button
      v-if="result && open"
      class="btn btn-ghost mt-4 gap-2 font-serif italic"
      @click="onPrint"
    >
      <Icon name="mdi:printer" />
      {{ t('generator.parchmentRoll.printRecipe') }}
    </button>

    <p
      class="hint-text italic text-sm mt-4 tracking-widest transition-opacity duration-300"
      :class="open ? 'opacity-0' : 'opacity-100'"
    >
      {{ t('generator.parchmentRoll.clickToUnroll') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { MeadRecipeOutput } from "@shared/schemas/mead";
import { utensils } from "@shared/schemas/utensils";

defineProps<{
  title?: string;
  seal?: string;
  result?: MeadRecipeOutput | null;
}>();

const { t } = useI18n();
const open = ref(false);

const { print } = usePrint();

function onPrint() {
  print("print-area");
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=IM+Fell+English:ital@0;1&display=swap");

.scroll-wrap {
  width: min(800px, 94vw);
  filter: drop-shadow(0 8px 24px rgba(60, 30, 0, 0.38));
}

.rod {
  width: 100%;
  height: 24px;
  border-radius: 5px;
  background: linear-gradient(
    180deg,
    #d4a96a 0%,
    #b8864a 8%,
    #8b5e2e 22%,
    #6b4220 38%,
    #9a6535 52%,
    #7a4e28 65%,
    #5c3a1e 78%,
    #8b5e2e 88%,
    #6b4220 95%,
    #4a2c10 100%
  );
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 220, 150, 0.25);
}
.rod::before,
.rod::after {
  content: "";
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 22px;
  height: 34px;
  border-radius: 50%;
  background: radial-gradient(ellipse at 35% 35%, #e8c070 0%, #b8762a 35%, #7a4a18 60%, #3e2410 85%);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.55);
}
.rod::before {
  left: -9px;
}
.rod::after {
  right: -9px;
}

.parchment {
  background-color: #e8c87a;
  background-image:
    radial-gradient(ellipse at 8% 12%, rgba(210, 160, 60, 0.45) 0%, transparent 45%),
    radial-gradient(ellipse at 92% 85%, rgba(180, 120, 40, 0.4) 0%, transparent 45%),
    radial-gradient(ellipse at 50% 50%, rgba(255, 240, 190, 0.3) 0%, transparent 65%),
    radial-gradient(ellipse at 20% 80%, rgba(160, 100, 30, 0.25) 0%, transparent 40%);
}
.parchment-lines {
  background-image: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 26px,
    rgba(120, 80, 20, 0.055) 26px,
    rgba(120, 80, 20, 0.055) 27px
  );
}
.parchment-vignette {
  background:
    linear-gradient(180deg, rgba(0, 0, 0, 0.07) 0%, transparent 12%, transparent 88%, rgba(0, 0, 0, 0.07) 100%),
    linear-gradient(90deg, rgba(0, 0, 0, 0.06) 0%, transparent 8%, transparent 92%, rgba(0, 0, 0, 0.06) 100%);
}
.aged-edge-top {
  background: linear-gradient(180deg, rgba(100, 55, 10, 0.18) 0%, transparent 100%);
}
.aged-edge-bottom {
  background: linear-gradient(0deg, rgba(100, 55, 10, 0.18) 0%, transparent 100%);
}

.scroll-title {
  font-family: "UnifrakturMaguntia", serif;
  font-size: 22px;
  color: #3a1e05;
  letter-spacing: 0.04em;
  text-shadow: 1px 1px 0 rgba(255, 230, 150, 0.4);
}
.scroll-body {
  font-family: "IM Fell English", serif;
  font-size: 14px;
  line-height: 1.9;
  color: #2e1604;
  text-align: justify;
}
.scroll-body p {
  margin-bottom: 10px;
}
.drop-cap::first-letter {
  font-family: "UnifrakturMaguntia", serif;
  font-size: 3em;
  line-height: 0.8;
  float: left;
  margin: 0 6px 0 0;
  color: #6b1a00;
}
.section-heading {
  font-family: "UnifrakturMaguntia", serif !important;
  font-size: 16px !important;
  color: #5a2d00 !important;
  border-bottom: 1px solid rgba(120, 70, 0, 0.25);
  padding-bottom: 4px;
  margin-bottom: 8px !important;
}
.divider-ornament {
  text-align: center;
  color: #7a4a10;
  opacity: 0.6;
  font-size: 14px;
}

.ingredient-block {
  border: 1px solid rgba(120, 70, 0, 0.2);
  padding: 8px 12px;
  background: rgba(180, 120, 30, 0.08);
}
.ingredient-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-family: "IM Fell English", serif;
  font-size: 13.5px;
  color: #2e1604;
  padding: 3px 0;
  border-bottom: 1px dashed rgba(120, 70, 0, 0.15);
}
.ingredient-row:last-child {
  border-bottom: none;
}
.ingredient-icon {
  font-size: 12px;
}
.ingredient-label {
  flex-shrink: 0;
}
.ingredient-dots {
  flex: 1;
  border-bottom: 1px dotted rgba(120, 70, 0, 0.35);
  margin: 0 4px 3px;
}
.ingredient-value {
  flex-shrink: 0;
  font-style: italic;
}

.utensil-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-family: "IM Fell English", serif;
  font-size: 13.5px;
  color: #2e1604;
}
.utensil-list li {
  padding: 2px 0;
}
.utensil-sub {
  opacity: 0.65;
  font-style: italic;
  font-size: 12.5px;
}

.seal-line {
  font-family: "IM Fell English", serif;
  color: #7a4a18;
}
.hint-text {
  font-family: "IM Fell English", serif;
  color: oklch(var(--bc) / 0.4);
}
</style>

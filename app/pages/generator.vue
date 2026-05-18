<template>
  <div class="flex flex-col items-center pt-16 gap-6">
    <h1 class="text-3xl font-bold">
      Generator
    </h1>

    <div class="card bg-base-200 w-full max-w-md shadow-sm">
      <div class="card-body gap-4">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">
            Ansatzvolumen (in Litern)
          </legend>
          <input v-model="targetVolumeL" type="number" class="input">
        </fieldset>

        <button class="btn btn-primary" @click="calculate">
          Berechnen
        </button>

        <div v-if="baseHoney_g !== null" class="flex flex-col gap-2">
          <p>Honig: <span class="font-bold">{{ baseHoney_g }} g</span></p>
          <p>Wasser: <span class="font-bold">{{ waterL?.toFixed(2) }} L</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const targetVolumeL = ref<number | null>(null);
const baseHoney_g = ref<number | null>(null);
const waterL = ref<number | null>(null);

function calculate() {
  if (!targetVolumeL.value)
    return;

  baseHoney_g.value = targetVolumeL.value * 364;
  waterL.value = targetVolumeL.value - ((baseHoney_g.value / 1000) * 0.75);
}
</script>

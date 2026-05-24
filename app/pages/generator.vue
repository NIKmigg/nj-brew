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
        <p v-if="errors.targetVolumeL" class="text-error label">
          {{ $t(errors.targetVolumeL) }}
        </p>
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
      <InfoModal :title="$t('generator.brixInfoTitle')">
        <div class="flex flex-col gap-1 w-full">
          <div class="flex justify-between text-sm">
            <span class="text-base-content/60">°Brix</span>
            <span class="font-medium">{{ estimatedBrix.toFixed(1) }}</span>
          </div>
          <progress
            class="progress progress-success w-full"
            :value="estimatedBrix"
            max="35"
          />
        </div>
        <template #info>
          <div class="mt-2 flex flex-col gap-1.5">
            <p class="text-sm text-base-content/70 mb-2">
              {{ $t("generator.brixInfo") }}
            </p>

            <GeneratorBrixRatingRow :label="$t('generator.brixWeak')" range="< 24" color="info" />
            <GeneratorBrixRatingRow :label="$t('generator.brixOk')" range="24–26" color="warning" />
            <GeneratorBrixRatingRow :label="$t('generator.brixIdeal')" range="26–29" color="success" />
            <GeneratorBrixRatingRow :label="$t('generator.brixRisk')" range="> 30" color="error" />
          </div>
        </template>
      </InfoModal>

      <InfoModal :title="$t('generator.alcoholInfo')">
        <div class="flex flex-col gap-1 w-full">
          <div class="flex justify-between text-sm">
            <span class="text-base-content/60">{{ $t("generator.alcohol") }}</span>
            <span class="font-medium">{{ estimatedAlc.toFixed(1) }} %</span>
          </div>
          <progress
            class="progress progress-info w-full"
            :value="estimatedAlc"
            max="25"
          />
        </div>
        <template #info>
          <p class="text-sm text-base-content/60">
            {{ $t("generator.alcoholInfoText") }}
          </p>
        </template>
      </InfoModal>
    </BaseCard>

    <!-- Nachsüßen / Step Feeding Card -->
    <BaseCard v-if="result" title="Nachsüßen / Step Feeding">
      <!-- <GeneratorBaseStatCard label="Honig / Schritt" :value="`${stepFeedHoney_g} g`" hint="15% der Basismenge" /> -->
    </BaseCard>
  </div>
</template>

<script lang="ts" setup>
import type { MeadRecipeOutput } from "@shared/schemas/mead";
import { estimatedAlc, estimatedBrix, honeyPerL, meadRecipeInputSchema, nutrientPerL, volumePerKgHoney, yeastPerL } from "@shared/schemas/mead";

definePageMeta({
  middleware: "auth",
});

const result = ref<MeadRecipeOutput | null>(null);
const { defineField, handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(meadRecipeInputSchema),
});

const [targetVolumeL, targetVolumeLAttrs] = defineField("targetVolumeL");
const useTannin = ref(false);

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
    recommendOsmosis: false,
    stepFeedHoney_g: honey_g * 0.1,
  };

  sessionStorage.setItem("meadResult", JSON.stringify(result.value));
});

onMounted(() => {
  const saved = sessionStorage.getItem("meadResult");
  if (saved)
    result.value = JSON.parse(saved);
});
</script>

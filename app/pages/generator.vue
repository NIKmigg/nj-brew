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
      <InfoModal :title="$t('generator.brixInfo')">
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
            <!-- Zu schwach -->
            <div class="flex items-center justify-between px-3 py-2 rounded-lg border-l-[5px] bg-info/70 border-info">
              <span class="text-info-content">{{ $t("generator.brixWeak") }}</span>
              <span class="font-medium text-info-content">&lt; 24</span>
            </div>

            <!-- Akzeptabel -->
            <div class="flex items-center justify-between px-3 py-2 rounded-lg border-l-[3px] bg-warning/70 border-warning">
              <span class="text-warning-content">{{ $t("generator.brixOk") }}</span>
              <span class="font-medium text-warning-content">24 – 26</span>
            </div>

            <!-- Ideal -->
            <div class="flex items-center justify-between px-3 py-2 rounded-lg border-l-[3px] bg-success/70 border-success">
              <span class="text-success-content">{{ $t("generator.brixIdeal") }}</span>
              <span class="font-medium text-success-content">26 – 29</span>
            </div>

            <!-- Hohes Risiko -->
            <div class="flex items-center justify-between px-3 py-2 rounded-lg border-l-[3px] bg-error/70 border-error">
              <span class="text-error-content">{{ $t("generator.brixRisk") }}</span>
              <span class="font-medium text-error-content">&gt; 30</span>
            </div>
          </div>
        </template>
      </InfoModal>
      <div class="flex flex-col gap-1 pt-3">
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

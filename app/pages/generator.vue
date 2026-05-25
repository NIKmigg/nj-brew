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
        <InfoModal :title="$t('generator.waterHardnessInfo')">
          <legend class="fieldset-legend w-full">
            {{ $t("generator.waterHardness") }}
          </legend>
          <template #info>
            <div class="mt-2 flex flex-col gap-1.5">
              <p class="text-sm text-base-content/70 mb-2">
                {{ $t("generator.waterHardnessInfoText") }}
              </p>

              <GeneratorRatingRow :label="$t('generator.waterHardnessSoftLabel')" range="0–4 °dH" color="info" />
              <GeneratorRatingRow :label="$t('generator.waterHardnessIdealLabel')" range="5–8 °dH" color="success" />
              <GeneratorRatingRow :label="$t('generator.waterHardnessOkLabel')" range="9–14 °dH" color="warning" />
              <GeneratorRatingRow :label="$t('generator.waterHardnessHardLabel')" range="15–20 °dH" color="error" />
              <GeneratorRatingRow :label="$t('generator.waterHardnessVeryHardLabel')" range="> 20 °dH" color="error" />
            </div>
          </template>
        </InfoModal>
        <div class="w-full input">
          <input
            v-model="waterHardness"
            v-bind="waterHardnessAttrs"
            type="number"
            min="0"
            class="w-full"
            :placeholder="$t('generator.waterHardnessPlaceholder')"
          >
          <span class="">°dH</span>
        </div>
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

            <GeneratorRatingRow :label="$t('generator.brixWeak')" range="< 24" color="info" />
            <GeneratorRatingRow :label="$t('generator.brixOk')" range="24–26" color="warning" />
            <GeneratorRatingRow :label="$t('generator.brixIdeal')" range="26–29" color="success" />
            <GeneratorRatingRow :label="$t('generator.brixRisk')" range="> 30" color="error" />
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
    <BaseCard v-if="result" title="Nachsüßen / Step Feeding" class="min-w-fit">
      <div class="grid grid-cols-3 gap-2">
        <GeneratorBaseStatCard
          :label="$t('generator.stepHoneyLabel')"
          :value="`${result.stepFeedHoney_g.toFixed(0)} g`"
          :hint="$t('generator.stepHoneyHint')"
        />
        <GeneratorBaseStatCard
          :label="$t('generator.stepAlcLabel')"
          value="≈ 2 %"
          :hint="$t('generator.stepAlcHint')"
        />
        <GeneratorBaseStatCard
          :label="$t('generator.stepMaxLabel')"
          value="15-20 %"
          :hint="$t('generator.stepMaxHint')"
        />
      </div>
      <div class="divider my-0" />

      <div class="flex flex-col gap-2">
        <span class="text-xs font-medium text-base-content/50">
          {{ $t('generator.stepWhenTitle') }}
        </span>
        <GeneratorBaseInfoRow
          icon="mdi:clock-outline"
          :title="$t('generator.stepWhenBubble')"
          :description="$t('generator.stepWhenBubbleHint')"
          color="success"
        />
        <GeneratorBaseInfoRow
          icon="mdi:chart-line"
          :title="$t('generator.stepWhenSG')"
          :description="$t('generator.stepWhenSGHint')"
          color="success"
        />
        <GeneratorBaseInfoRow
          icon="mdi:alert-outline"
          :title="$t('generator.stepWarning')"
          :description="$t('generator.stepWarningHint')"
          color="warning"
        />
      </div>
    </BaseCard>

    <!-- Osmosis Empfehlung Card -->
    <BaseCard v-if="result?.recommendOsmosis && result?.osmosisRatio !== undefined" :title="$t('generator.osmosisTitle')">
      <div class="grid grid-cols-2 gap-2">
        <GeneratorBaseStatCard
          :label="$t('generator.osmosisWater')"
          :value="`${result.osmosisRationInPercent} %`"
          :hint="$t('generator.osmosisWaterHint')"
        />
        <GeneratorBaseStatCard
          :label="$t('generator.tapWater')"
          :value="`${result.tapWaterRatioInPercent} %`"
          :hint="$t('generator.tapWaterHint')"
        />
      </div>
      <progress
        class="progress progress-info w-full mt-4"
        :value="result.osmosisRatio"
        max="1"
      />
      <div class="flex justify-between text-xs text-base-content/40">
        <span>{{ $t('generator.osmosisWater') }}</span>
        <span>{{ $t('generator.tapWater') }}</span>
      </div>

      <GeneratorBaseInfoRow
        icon="mdi:information-outline"
        :title="$t('generator.osmosisInfo')"
        color="warning"
        class="mt-4"
      />
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
const [waterHardness, waterHardnessAttrs] = defineField("waterHardness_dH");

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
    recommendOsmosis: (waterHardness.value ?? 0) > 15,
    osmosisRatio: waterHardness.value ? 1 - (8 / waterHardness.value) : undefined,
    osmosisRationInPercent: waterHardness.value ? Math.max(0, Math.min(100, (1 - (8 / waterHardness.value)) * 100)) : undefined,
    tapWaterRatioInPercent: waterHardness.value ? Math.max(0, Math.min(100, (8 / waterHardness.value) * 100)) : undefined,
    stepFeedHoney_g: honey_g * 0.15,
  };

  sessionStorage.setItem("meadResult", JSON.stringify(result.value));
});

onMounted(() => {
  const saved = sessionStorage.getItem("meadResult");
  if (saved)
    result.value = JSON.parse(saved);
});
</script>

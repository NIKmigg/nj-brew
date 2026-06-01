<template>
  <div class="flex flex-wrap gap-4 p-6">
    <!-- Eingabe Card -->
    <BaseCard :title="$t('generator.inputs.recipe')">
      <fieldset class="fieldset">
        <legend class="fieldset-legend">
          {{ $t("generator.inputs.targetVolume") }}
        </legend>
        <input
          v-model="targetVolumeL"
          v-bind="targetVolumeLAttrs"
          type="number"
          min="0"
          class="input w-full"
          :class="{ 'input-error': errors.targetVolumeL }"
          :placeholder="$t('generator.inputs.targetVolumePlaceholder')"
        >
        <p v-if="errors.targetVolumeL" class="text-error label">
          {{ $t(errors.targetVolumeL) }}
        </p>
      </fieldset>

      <fieldset class="fieldset">
        <InfoModal :title="$t('generator.water.hardnessInfo')">
          <legend class="fieldset-legend w-full">
            {{ $t("generator.water.hardness") }}
          </legend>
          <template #info>
            <div class="mt-2 flex flex-col gap-1.5">
              <p class="text-sm text-base-content/70 mb-2">
                {{ $t("generator.water.hardnessInfoText") }}
              </p>

              <GeneratorRatingRow :label="$t('generator.water.softLabel')" range="0–4 °dH" color="info" />
              <GeneratorRatingRow :label="$t('generator.water.idealLabel')" range="5–8 °dH" color="success" />
              <GeneratorRatingRow :label="$t('generator.water.okLabel')" range="9–14 °dH" color="warning" />
              <GeneratorRatingRow :label="$t('generator.water.hardLabel')" range="15–20 °dH" color="error" />
              <GeneratorRatingRow :label="$t('generator.water.veryHardLabel')" range="> 20 °dH" color="error" />
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
            :placeholder="$t('generator.water.hardnessPlaceholder')"
          >
          <span class="">°dH</span>
        </div>
      </fieldset>

      <fieldset class="fieldset">
        <legend class="fieldset-legend">
          {{ $t("generator.inputs.useTannin") }}
        </legend>
        <input v-model="useTannin" type="checkbox" class="toggle toggle-primary">
      </fieldset>

      <button class="btn btn-primary w-full mt-auto" @click="onSubmit">
        {{ $t("generator.inputs.calculate") }}
      </button>
    </BaseCard>

    <!-- Zutaten Card -->
    <BaseCard v-if="result" :title="$t('generator.ingredients.title')">
      <GeneratorIngredientRow :label="$t('generator.ingredients.honey')" :value="`${result.honey_g} g`" />
      <div class="divider my-0" />
      <GeneratorIngredientRow :label="$t('generator.ingredients.water')" :value="`${result.water_L.toFixed(2)} L`" />
      <div class="divider my-0" />
      <GeneratorIngredientRow :label="$t('generator.ingredients.yeast')" :value="`${result.yeast_g.toFixed(1)} g`" />
      <div class="divider my-0" />
      <GeneratorIngredientRow :label="$t('generator.ingredients.nutrient')" :value="`${result.nutrient_g.toFixed(1)} g`" />
      <template v-if="result.tannin_g !== undefined">
        <div class="divider my-0" />
        <GeneratorIngredientRow :label="$t('generator.ingredients.tannin')" :value="`${result.tannin_g.toFixed(2)} g`" />
      </template>
    </BaseCard>

    <!-- Gärwerte Card -->
    <BaseCard v-if="result" :title="$t('generator.fermentation.title')">
      <InfoModal :title="$t('generator.fermentation.brixInfoTitle')">
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
              {{ $t("generator.fermentation.brixInfo") }}
            </p>

            <GeneratorRatingRow :label="$t('generator.fermentation.brixWeak')" range="< 24" color="info" />
            <GeneratorRatingRow :label="$t('generator.fermentation.brixOk')" range="24–26" color="warning" />
            <GeneratorRatingRow :label="$t('generator.fermentation.brixIdeal')" range="26–29" color="success" />
            <GeneratorRatingRow :label="$t('generator.fermentation.brixRisk')" range="> 30" color="error" />
          </div>
        </template>
      </InfoModal>

      <InfoModal :title="$t('generator.alcohol.info')">
        <div class="flex flex-col gap-1 w-full">
          <div class="flex justify-between text-sm">
            <span class="text-base-content/60">{{ $t("generator.alcohol.label") }}</span>
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
            {{ $t("generator.alcohol.infoText") }}
          </p>
        </template>
      </InfoModal>
    </BaseCard>

    <!-- Nachsüßen / Step Feeding Card -->
    <BaseCard v-if="result" title="Nachsüßen / Step Feeding" class="min-w-fit">
      <div class="grid grid-cols-3 gap-2">
        <GeneratorBaseStatCard
          :label="$t('generator.stepping.honeyLabel')"
          :value="`${result.stepFeedHoney_g.toFixed(0)} g`"
          :hint="$t('generator.stepping.honeyHint')"
        />
        <GeneratorBaseStatCard
          :label="$t('generator.stepping.alcLabel')"
          value="≈ 2 %"
          :hint="$t('generator.stepping.alcHint')"
        />
        <GeneratorBaseStatCard
          :label="$t('generator.stepping.maxLabel')"
          value="15-20 %"
          :hint="$t('generator.stepping.maxHint')"
        />
      </div>
      <div class="divider my-0" />

      <div class="flex flex-col gap-2">
        <span class="text-xs font-medium text-base-content/50">
          {{ $t('generator.stepping.whenTitle') }}
        </span>
        <GeneratorBaseInfoRow
          icon="mdi:clock-outline"
          :title="$t('generator.stepping.whenBubble')"
          :description="$t('generator.stepping.whenBubbleHint')"
          color="success"
        />
        <GeneratorBaseInfoRow
          icon="mdi:chart-line"
          :title="$t('generator.stepping.whenSG')"
          :description="$t('generator.stepping.whenSGHint')"
          color="success"
        />
        <GeneratorBaseInfoRow
          icon="mdi:alert-outline"
          :title="$t('generator.stepping.warning')"
          :description="$t('generator.stepping.warningHint')"
          color="warning"
        />
      </div>
    </BaseCard>

    <!-- Osmosis Empfehlung Card -->
    <BaseCard v-if="result?.recommendOsmosis && result?.osmosisRatio !== undefined" :title="$t('generator.osmosis.title')">
      <div class="grid grid-cols-2 gap-2">
        <GeneratorBaseStatCard
          :label="$t('generator.osmosis.water')"
          :value="`${result.osmosisRationInPercent} %`"
          :hint="$t('generator.osmosis.waterHint')"
        />
        <GeneratorBaseStatCard
          :label="$t('generator.osmosis.tapWater')"
          :value="`${result.tapWaterRatioInPercent} %`"
          :hint="$t('generator.osmosis.tapWaterHint')"
        />
      </div>
      <progress
        class="progress progress-info w-full mt-4"
        :value="result.osmosisRatio"
        max="1"
      />
      <div class="flex justify-between text-xs text-base-content/40">
        <span>{{ $t('generator.osmosis.water') }}</span>
        <span>{{ $t('generator.osmosis.tapWater') }}</span>
      </div>

      <GeneratorBaseInfoRow
        icon="mdi:information-outline"
        :title="$t('generator.osmosis.info')"
        color="warning"
        class="mt-4"
      />
    </BaseCard>
  </div>
</template>

<script lang="ts" setup>
import type { MeadRecipeOutput } from "@shared/schemas/mead";
import { estimatedAlc, estimatedBrix, meadRecipeInputSchema } from "@shared/schemas/mead";

definePageMeta({
  middleware: "auth",
});

const result = ref<MeadRecipeOutput | null>(null);
const { defineField, handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(meadRecipeInputSchema),
});

const [targetVolumeL, targetVolumeLAttrs] = defineField("targetVolumeL");
const [waterHardness, waterHardnessAttrs] = defineField("waterHardness_dH");
const [useTannin] = defineField("useTannin");

const onSubmit = handleSubmit(async (values) => {
  const { $csrfFetch } = useNuxtApp();

  result.value = await $csrfFetch<MeadRecipeOutput>("/api/mead/calculate", {
    method: "POST",
    body: values,
  });

  // sessionStorage.setItem("meadResult", JSON.stringify(result.value));
});

// onMounted(() => {
//   const saved = sessionStorage.getItem("meadResult");
//   if (saved)
//     result.value = JSON.parse(saved);
// });
</script>

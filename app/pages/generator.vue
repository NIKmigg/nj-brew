<template>
  <div>
    <section class="max-w-250 mx-auto px-4">
      <div class="grid grid-rows-[1fr_auto] sm:grid-cols-[1fr_auto] sm:grid-rows-none items-end ">
        <div class="flex flex-col min-h-120 sm:min-h-100">
          <div class="chat chat-end">
            <div class="chat-bubble chat-bubble-primary">
              {{ $t("generator.chat.welcome1") }}
              <br>
              {{ $t("generator.chat.welcome2") }}
            </div>
          </div>
          <div
            v-for="(msg, i) in chat"
            :key="i"
            class="chat"
            :class="msg.role === 'user' ? 'chat-start' : 'chat-end'"
          >
            <div
              class="chat-bubble"
              :class="msg.role === 'user' ? 'chat-bubble-neutral' : 'chat-bubble-primary'"
            >
              {{ msg.text }}
              <button
                v-if="msg.step === 'volume'"
                class="btn btn-ghost ml-2 hover:bg-transparent"
                @click="onVolumeEdit"
              >
                <Icon name="mdi:edit" />
              </button>
            </div>
          </div>

          <div class="mt-auto pt-5">
            <div class="chat chat-start">
              <label
                v-if="state.step === 'volume' && !isThinking"
                class="chat-bubble"
                :class="{ 'border-error border-e-2': errors.targetVolumeL }"
              >
                <div>
                  <input
                    v-model="targetVolumeL"
                    v-bind="targetVolumeLAttrs"
                    type="number"
                    min="0.1"
                    class="app-number-input focus:outline-none max-w-30 "
                    :class="{ 'input-error': errors.targetVolumeL }"
                    :disabled="isThinking"
                    @keyup.enter="onEnter"
                  >
                  <span>{{ $t("generator.chat.liters") }}</span>
                  <button
                    class="btn btn-ghost ml-5"
                    :disabled="isThinking"
                    @click="onEnter"
                  >
                    <Icon name="mdi:send" />
                  </button>
                </div>
                <p v-if="errors.targetVolumeL" class="text-error label text-xs">
                  {{ $t(errors.targetVolumeL) }}
                </p>
              </label>
            </div>

            <div v-if="state.step === 'tanninUsage' && !isThinking" class="felx gap-2">
              <div class="chat chat-start">
                <button
                  class="btn btn-ghost chat-bubble"
                  :disabled="isThinking"
                  @click="onTanninAnswer(true)"
                >
                  {{ $t("generator.chat.yes") }}
                </button>
              </div>
              <div class="chat chat-start">
                <button
                  class="btn btn-ghost chat-bubble"
                  :disabled="isThinking"
                  @click="onTanninAnswer(false)"
                >
                  {{ $t("generator.chat.no") }}
                </button>
              </div>
            </div>
          </div>

          <div v-if="isThinking" class="chat chat-end">
            <div class="chat-bubble chat-bubble-primary">
              <span class="loading loading-dots loading-sm" />
            </div>
          </div>
        </div>

        <img
          src="/generator/brewmaster-5.png"
          alt="Braumeister"
          class="relative -bottom-15 h-45 sm:h-60 -z-2 justify-self-end pl-10 -mt-15"
        >
      </div>
    </section>
    <WaveCard />

    <section
      v-if="!result"
      v-section-reveal
      class="bg-base-200 py-16"
    >
      <div class="container my-auto text-center mx-auto max-w-3xl">
        <p data-split class="text-4xl font-bold mb-4 font-old-style">
          {{ $t('generator.intro.title') }}
        </p>
        <p data-split="{ type: 'word', stagger: 0.015 }">
          {{ $t('generator.intro.line1') }}
          <br><br>
          {{ $t('generator.intro.line2') }}
          <br>
          {{ $t('generator.intro.line3') }}
        </p>
      </div>
    </section>

    <section v-if="result" class="w-full text-center bg-base-200 pt-5 px-4 pb-5">
      <div class="flex flex-col gap-4 max-w-7xl mx-auto">
        <div class="flex flex-wrap gap-4">
          <!-- Zutaten Card -->
          <BaseCard :title="$t('generator.ingredients.title')" icon="mdi:food-apple">
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
          <BaseCard :title="$t('generator.fermentation.title')" icon="mdi:chart-line">
            <InfoModal :title="$t('generator.fermentation.brixInfoTitle')">
              <div class="flex flex-col gap-1 w-full">
                <div class="flex justify-between text-sm">
                  <span class="text-base-content/60">°Brix</span>
                  <span class="font-medium">{{ result.estimatedBrix.toFixed(1) }}</span>
                </div>
                <progress
                  class="progress progress-success w-full"
                  :value="result.estimatedBrix"
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
                  <span class="font-medium">{{ result.estimatedAlc.toFixed(1) }} %</span>
                </div>
                <progress
                  class="progress progress-info w-full"
                  :value="result.estimatedAlc"
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
        </div>

        <!-- Utensilien Card -->
        <BaseCard title="Utensilien" icon="mdi:tools">
          <NuxtLink
            v-for="item in utensils"
            :key="item.title"
            :to="item.to"
          >
            <ListTile
              :title="item.title"
              :subtitle="item.subtitle"
              :clickable="item.to ? true : false"
            >
              <template #leading>
                <Icon :name="item.icon" />
              </template>
              <template v-if="item.to" #trailing>
                <Icon name="mdi:chevron-right" class="text-base-content/30" />
              </template>
            </ListTile>
          </NuxtLink>
          <p class="text-sm text-base-content/60 px-4 pt-3 pb-1">
            Viele dieser Utensilien findest du direkt bei uns im
            <NuxtLink to="/market" class="link link-primary">
              Markt
            </NuxtLink>.
          </p>
        </BaseCard>

        <!-- Nachsüßen / Step Feeding Card -->
        <BaseCard
          v-if="result"
          title="Nachsüßen / Step Feeding"
          class="min-w-fit"
          icon="mdi:foot-print"
        >
          <div class="grid grid-cols-3 gap-2">
            <GeneratorBaseStatCard
              :label="$t('generator.stepping.honeyLabel')"
              :value="`${result.stepFeedHoney_g.toFixed(0)} g`"
              :hint="`${result.stepFeedHoneyPercent.toFixed(0)}${$t('generator.stepping.honeyHint')}`"
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
        <BaseCard
          v-if="result?.recommendOsmosis && result?.osmosisRatio !== undefined"
          :title="$t('generator.osmosis.title')"
          icon="mdi:water-percent"
        >
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
    </section>

    <WaveCard class="rotate-180" />

    <section class="min-h-50">
      <GeneratorParchmentRoll
        v-if="result"
        title="Des Braumeisters Rezept"
        seal="Gesiegelt vom Braumeister höchstpersönlich"
        :result="result"
      />
    </section>
  </div>
</template>

<script lang="ts" setup>
import type { MeadRecipeOutput } from "@shared/schemas/mead";
import { meadRecipeInputSchema } from "@shared/schemas/mead";
import { utensils } from "@shared/schemas/utensils";
import ListTile from "~/components/list-tile.vue";

definePageMeta({
  middleware: "auth",
});

const result = ref<MeadRecipeOutput | null>(null);
const { defineField, handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(meadRecipeInputSchema),
});

const [targetVolumeL, targetVolumeLAttrs] = defineField("targetVolumeL");
// const [waterHardness, waterHardnessAttrs] = defineField("waterHardness_dH");
const [useTannin] = defineField("useTannin");

const onSubmit = handleSubmit(async (values) => {
  const { $csrfFetch } = useNuxtApp();

  result.value = await $csrfFetch<MeadRecipeOutput>("/api/mead/calculate", {
    method: "POST",
    body: values,
  });
});

const { state, chat, send, isThinking, reset } = useBrewmasterChat(async () => {
  await onSubmit();
});

function onEnter() {
  if (!targetVolumeL.value)
    return;

  send(targetVolumeL.value.toString());
}

function onVolumeEdit() {
  result.value = null;
  sessionStorage.removeItem("generator");
  reset();
}

function onTanninAnswer(useTanninArg: boolean) {
  send(useTanninArg ? $t("generator.chat.yes") : $t("generator.chat.no"), useTanninArg);
  useTannin.value = useTanninArg;
}

// State aus SessionStorage laden
onMounted(() => {
  const saved = sessionStorage.getItem("generator");
  if (saved) {
    const parsed = JSON.parse(saved);
    result.value = parsed.result;
    chat.value = parsed.chat;
  }
});

// State in SessionStorage speichern
watch([result, chat], () => {
  sessionStorage.setItem("generator", JSON.stringify({
    result: result.value,
    chat: chat.value,
  }));
}, { deep: true });
</script>

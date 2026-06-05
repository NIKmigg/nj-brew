<template>
  <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
    <!-- Zutaten -->
    <p class="text-xs font-medium text-base-content/50 uppercase tracking-wide">
      {{ $t("admin.constants.ingredients") }}
    </p>

    <AdminNumberInputField
      name="honeyPerL"
      :label="$t('admin.constants.honeyPerL')"
      unit="g/L"
      @reset="resetField('honeyPerL')"
    />

    <AdminNumberInputField
      name="volumePerKgHoney"
      :label="$t('admin.constants.volumePerKgHoney')"
      unit="L/kg"
      @reset="resetField('volumePerKgHoney')"
    />

    <AdminNumberInputField
      name="yeastPerL"
      :label="$t('admin.constants.yeastPerL')"
      unit="g/L"
      @reset="resetField('yeastPerL')"
    />

    <AdminNumberInputField
      name="nutrientPerL"
      :label="$t('admin.constants.nutrientPerL')"
      unit="g/L"
      @reset="resetField('nutrientPerL')"
    />

    <AdminNumberInputField
      name="tanninPerL"
      :label="$t('admin.constants.tanninPerL')"
      unit="g/L"
      @reset="resetField('tanninPerL')"
    />

    <div class="divider my-0" />

    <!-- Faktoren -->
    <p class="text-xs font-medium text-base-content/50 uppercase tracking-wide">
      {{ $t("admin.constants.factors") }}
    </p>

    <AdminNumberInputField
      name="stepFeedRatio"
      :label="$t('admin.constants.stepFeedRatio')"
      :min="0.1"
      :max="1"
      @reset="resetField('stepFeedRatio')"
    />

    <div class="divider my-0" />

    <!-- Osmose -->
    <p class="text-xs font-medium text-base-content/50 uppercase tracking-wide">
      {{ $t("admin.constants.osmosis") }}
    </p>

    <AdminNumberInputField
      name="osmosisThreshold"
      :label="$t('admin.constants.osmosisThreshold')"
      unit="°dH"
      @reset="resetField('osmosisThreshold')"
    />

    <AdminNumberInputField
      name="targetHardness"
      :label="$t('admin.constants.targetHardness')"
      unit="°dH"
      @reset="resetField('targetHardness')"
    />

    <div class="divider my-0" />

    <!-- Anzeigewerte -->
    <p class="text-xs font-medium text-base-content/50 uppercase tracking-wide">
      {{ $t("admin.constants.displayValues") }}
    </p>

    <AdminNumberInputField
      name="estimatedBrix"
      :label="$t('admin.constants.estimatedBrix')"
      unit="°Brix"
      @reset="resetField('estimatedBrix')"
    />

    <AdminNumberInputField
      name="estimatedAlc"
      :label="$t('admin.constants.estimatedAlc')"
      unit="%vol"
      @reset="resetField('estimatedAlc')"
    />

    <button type="submit" class="btn btn-primary w-full mt-auto" :disabled="isSubmitting">
      <span v-if="isSubmitting" class="loading loading-spinner loading-sm" />
      {{ $t("admin.constants.save") }}
    </button>
  </form>
</template>

<script setup lang="ts">
import type { SelectMeadConstantsSchema, UpdateMeadConstantsSchema } from "@shared/schemas/mead";
import { updateMeadConstantsSchema } from "@shared/schemas/mead";

definePageMeta({
  middleware: "auth",
});

const { data: constants } = await useFetch<SelectMeadConstantsSchema>("/api/mead");

const { handleSubmit, isSubmitting, setValues, setFieldValue } = useForm({
  validationSchema: toTypedSchema(updateMeadConstantsSchema),
});

watchEffect(() => {
  if (constants.value)
    setValues(constants.value);
});

const { $csrfFetch } = useNuxtApp();

function resetField(field: keyof UpdateMeadConstantsSchema) {
  const defaultKey = `${field}Default` as keyof SelectMeadConstantsSchema;
  if (constants.value?.[defaultKey] !== undefined)
    setFieldValue(field, constants.value[defaultKey] as number);
}

const toast = useToast();

const onSubmit = handleSubmit(async (values) => {
  try {
    await $csrfFetch("/api/mead", {
      method: "PATCH",
      body: values,
    });

    toast.show("Erfolgreich gespeichert!", "success", 3000);
  }
  catch (error: any) {
    const message = error.data?.message ?? "Speichern fehlgeschlagen.";
    toast.show(message, "error", 5000);
  }
});
</script>

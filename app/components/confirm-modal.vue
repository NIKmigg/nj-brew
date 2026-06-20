<template>
  <Teleport to="body">
    <dialog
      class="modal"
      :class="{ 'modal-open': modelValue }"
      :aria-labelledby="titleId"
      :aria-describedby="textId"
      :open="modelValue || undefined"
    >
      <div class="modal-box">
        <h3 :id="titleId" class="font-bold text-lg">
          {{ t(titleKey, titleParams) }}
        </h3>

        <p :id="textId" class="py-4 whitespace-pre-line">
          {{ t(textKey, textParams) }}
        </p>

        <div class="modal-action">
          <button class="btn" type="button" @click="cancel">
            {{ t(cancelKey) }}
          </button>
          <button class="btn btn-primary text-white" type="button" @click="confirm">
            {{ t(confirmKey) }}
          </button>
        </div>
      </div>

      <form method="dialog" class="modal-backdrop">
        <button type="button" :aria-label="t(closeKey)" @click="cancel">
          {{ t(closeKey) }}
        </button>
      </form>
    </dialog>
  </Teleport>
</template>

<script setup lang="ts">
type TranslationParams = Record<string, unknown>;

withDefaults(defineProps<{
  modelValue: boolean;
  titleKey: string;
  textKey: string;
  titleParams?: TranslationParams;
  textParams?: TranslationParams;
  confirmKey?: string;
  cancelKey?: string;
  closeKey?: string;
}>(), {
  titleParams: () => ({}),
  textParams: () => ({}),
  confirmKey: "global.confirm",
  cancelKey: "global.cancel",
  closeKey: "global.close",
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  "cancel": [];
  "confirm": [];
}>();

const { t } = useI18n();
const titleId = useId();
const textId = useId();

function cancel() {
  emit("update:modelValue", false);
  emit("cancel");
}

function confirm() {
  emit("confirm");
}
</script>

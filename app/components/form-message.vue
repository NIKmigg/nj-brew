<template>
  <p v-if="message" :class="messageClass">
    {{ displayMessage }}
  </p>
</template>

<script setup lang="ts">
type MessageType = "error" | "success" | "info";

const props = withDefaults(defineProps<{
  message?: string;
  type?: MessageType;
}>(), {
  message: "",
  type: "error",
});

const { t, te } = useI18n();

const displayMessage = computed(() =>
  props.message && te(props.message) ? t(props.message) : props.message,
);

const messageClass = computed(() => ({
  "text-sm text-base-content/70": props.type === "info",
  "text-sm text-error": props.type === "error",
  "text-sm text-success": props.type === "success",
}));
</script>

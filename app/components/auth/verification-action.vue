<template>
  <button
    v-if="show"
    :disabled="disabled || pending"
    class="btn btn-outline btn-sm w-full"
    type="button"
    @click="resend"
  >
    <span v-if="pending" class="loading loading-spinner loading-sm" />
    <Icon v-else name="mdi:email-sync" size="18" />
    {{ $t("auth.resendVerificationEmail") }}
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  callbackUrl: string;
  disabled?: boolean;
  email: string;
  show?: boolean;
}>(), {
  disabled: false,
  show: false,
});

const emit = defineEmits<{
  error: [error: unknown];
  sent: [];
}>();

const { sendVerificationEmail } = await useAuth();
const pending = ref(false);

async function resend() {
  pending.value = true;

  try {
    await sendVerificationEmail(props.email, props.callbackUrl);
    emit("sent");
  }
  catch (error) {
    emit("error", error);
  }
  finally {
    pending.value = false;
  }
}
</script>

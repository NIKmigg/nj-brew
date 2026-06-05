<template>
  <AuthCard :title="$t('auth.setNewPassword')" :description="$t('auth.setNewPasswordIntro')">
    <div v-if="tokenError" class="alert alert-error">
      {{ tokenError }}
    </div>

    <form v-else class="flex flex-col gap-3" @submit.prevent="onSubmit">
      <label class="form-control w-full">
        <span class="label pb-1">
          <span class="label-text">{{ $t("auth.newPassword") }}</span>
        </span>
        <input
          v-model="password"
          v-bind="passwordAttrs"
          class="input w-full"
          autocomplete="new-password"
          type="password"
        >
        <FormMessage :message="errors.password" />
      </label>

      <FormMessage :message="formState.errorMessage.value" />
      <FormMessage :message="formState.successMessage.value" type="success" />

      <button :disabled="formState.pending.value" class="btn btn-accent w-full" type="submit">
        <span v-if="formState.pending.value" class="loading loading-spinner loading-sm" />
        <Icon v-else name="mdi:lock-reset" size="20" />
        {{ $t("auth.updatePassword") }}
      </button>
    </form>

    <NuxtLink class="link-hover link text-center text-sm" :to="localePath('/login')">
      {{ $t("auth.backToLogin") }}
    </NuxtLink>
  </AuthCard>
</template>

<script setup lang="ts">
import { resetPasswordSchema } from "@shared/schemas/auth";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import AuthCard from "~/components/auth/auth-card.vue";
import FormMessage from "~/components/form-message.vue";

const { resetPassword } = await useAuth();
const route = useRoute();
const localePath = useLocalePath();
const { t } = useI18n();
const formState = useFormState();

const token = computed(() => {
  const value = route.query.token;

  return typeof value === "string" ? value : "";
});

const tokenError = computed(() => {
  if (route.query.error) {
    return t("auth.invalidResetToken");
  }

  return token.value ? "" : t("auth.missingResetToken");
});

const {
  defineField,
  errors,
  handleSubmit,
  resetForm,
} = useForm({
  validationSchema: toTypedSchema(resetPasswordSchema),
  initialValues: {
    password: "",
  },
});

const [password, passwordAttrs] = defineField("password");

const onSubmit = handleSubmit(async (values) => {
  await formState.submit(async () => {
    await resetPassword(values.password, token.value);
    formState.setSuccess("auth.passwordUpdated");
    resetForm();
  });
});
</script>

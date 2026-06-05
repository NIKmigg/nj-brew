<template>
  <AuthCard :title="$t('auth.resetPassword')" :description="$t('auth.resetPasswordIntro')">
    <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
      <label class="form-control w-full">
        <span class="label pb-1">
          <span class="label-text">{{ $t("auth.email") }}</span>
        </span>
        <input
          v-model="email"
          v-bind="emailAttrs"
          class="input w-full"
          autocomplete="email"
          type="email"
        >
        <FormMessage :message="errors.email" />
      </label>

      <FormMessage :message="formState.errorMessage.value" />
      <FormMessage :message="formState.successMessage.value" type="success" />

      <button :disabled="formState.pending.value" class="btn btn-accent w-full" type="submit">
        <span v-if="formState.pending.value" class="loading loading-spinner loading-sm" />
        <Icon v-else name="mdi:email-fast" size="20" />
        {{ $t("auth.sendResetLink") }}
      </button>

      <NuxtLink class="link-hover link text-center text-sm" :to="localePath('/login')">
        {{ $t("auth.backToLogin") }}
      </NuxtLink>
    </form>
  </AuthCard>
</template>

<script setup lang="ts">
import { forgotPasswordSchema } from "@shared/schemas/auth";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import AuthCard from "~/components/auth/auth-card.vue";
import FormMessage from "~/components/form-message.vue";

const { requestPasswordReset } = await useAuth();
const localePath = useLocalePath();
const formState = useFormState();

const {
  defineField,
  errors,
  handleSubmit,
} = useForm({
  validationSchema: toTypedSchema(forgotPasswordSchema),
  initialValues: {
    email: "",
  },
});

const [email, emailAttrs] = defineField("email");

const onSubmit = handleSubmit(async (values) => {
  await formState.submit(async () => {
    await requestPasswordReset(values.email, localePath("/login/reset-password"));
    formState.setSuccess("auth.checkResetEmail");
  });
});
</script>

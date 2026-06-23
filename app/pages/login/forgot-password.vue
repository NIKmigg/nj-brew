<template>
  <div>
    <div class="fixed inset-0 -z-1">
      <div
        class="login-hero-bg h-full w-full"
      />
    </div>
    <AuthCard :title="$t('auth.resetPassword')" :description="$t('auth.resetPasswordIntro')">
      <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
        <div class="form-control w-full">
          <label class="label pl-3 pb-1" for="forgot-email">
            <span class="label-text">{{ $t('auth.email') }}</span>
          </label>
          <div class="relative">
            <Icon name="mdi:at" class="absolute z-60 left-3 top-1/2 -translate-y-1/2 opacity-60" />
            <input
              v-bind="emailAttrs"
              id="forgot-email"
              v-model="email"
              class="input input-neutral w-full pl-10 pr-10"
              autocomplete="email"
              type="email"
              :aria-invalid="errors.email ? 'true' : 'false'"
            >
          </div>
          <FormMessage :message="errors.email" class="pl-3" />
        </div>
        <FormMessage :message="formState.errorMessage.value" />
        <FormMessage :message="formState.successMessage.value" type="success" />
        <button :disabled="formState.pending.value" class="btn btn-accent w-full" type="submit">
          <span v-if="formState.pending.value" class="loading loading-spinner loading-sm" />
          <Icon v-else name="mdi:email-fast" class="text-xl" />
          {{ $t("auth.sendResetLink") }}
        </button>
        <NuxtLink class="link-hover link text-center text-sm" :to="localePath('/login')">
          {{ $t("auth.backToLogin") }}
        </NuxtLink>
      </form>
    </AuthCard>
  </div>
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

definePageMeta({
  titleKey: "seo.forgotPassword.title",
  descriptionKey: "seo.forgotPassword.description",
});

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

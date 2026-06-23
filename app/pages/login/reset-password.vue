<template>
  <div>
    <div class="fixed inset-0 -z-1">
      <div
        class="login-hero-bg h-full w-full"
      />
    </div>
    <AuthCard :title="$t('auth.setNewPassword')" :description="$t('auth.setNewPasswordIntro')">
      <div v-if="tokenError" class="alert alert-error">
        {{ tokenError }}
      </div>

      <form v-else class="flex flex-col gap-3" @submit.prevent="onSubmit">
        <div class="form-control w-full">
          <label class="label pl-3 pb-1" for="reset-password">
            <span class="label-text">{{ $t('auth.password') }}</span>
          </label>
          <div class="relative">
            <Icon name="mdi:lock" class="absolute z-60 left-3 top-1/2 -translate-y-1/2 opacity-60" />
            <input
              v-bind="passwordAttrs"
              id="reset-password"
              v-model="password"
              class="input input-neutral w-full pl-10 pr-10"
              autocomplete="new-password"
              :type="showPassword ? 'text' : 'password'"
              :aria-invalid="errors.password ? 'true' : 'false'"
            >
            <button
              type="button"
              class="absolute right-3 top-5.5 -translate-y-1/2 cursor-pointer hover:text-neutral focus:text-neutral"
              :aria-label="$t('auth.password')"
              :aria-pressed="showPassword"
              @click="showPassword = !showPassword"
            >
              <Icon :name="showPassword ? 'mdi-eye' : 'mdi-eye-off'" class="opacity-60 text-2xl" />
            </button>
          </div>
          <FormMessage :message="errors.password" class="pl-3" />
        </div>
        <div class="form-control w-full">
          <label class="label pl-3 pb-1" for="reset-confirm-password">
            <span class="label-text">{{ $t('auth.confirmPassword') }}</span>
          </label>

          <div class="relative">
            <Icon
              name="mdi:lock-check"
              class="absolute z-60 left-3 top-1/2 -translate-y-1/2 opacity-60"
            />

            <input
              v-bind="confirmPasswordAttrs"
              id="reset-confirm-password"
              v-model="confirmPassword"
              class="input input-neutral w-full pl-10 pr-10"
              autocomplete="new-password"
              :type="showConfirmPassword ? 'text' : 'password'"
              :aria-invalid="errors.confirmPassword ? 'true' : 'false'"
            >
            <button
              type="button"
              class="absolute right-3 top-5.5 -translate-y-1/2 cursor-pointer hover:text-neutral focus:text-neutral"
              :aria-label="$t('auth.confirmPassword')"
              :aria-pressed="showConfirmPassword"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <Icon :name="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'" class="opacity-60 text-2xl" />
            </button>
          </div>
          <FormMessage :message="errors.confirmPassword" class="pl-3" />
        </div>

        <FormMessage :message="formState.errorMessage.value" />
        <FormMessage :message="formState.successMessage.value" type="success" />

        <button :disabled="formState.pending.value" class="btn btn-accent w-full" type="submit">
          <span v-if="formState.pending.value" class="loading loading-spinner loading-sm" />
          <Icon v-else name="mdi:lock-reset" class="text-xl" />
          {{ $t("auth.updatePassword") }}
        </button>
      </form>

      <NuxtLink class="link-hover link text-center text-sm" :to="localePath('/login')">
        {{ $t("auth.backToLogin") }}
      </NuxtLink>
    </AuthCard>
  </div>
</template>

<script setup lang="ts">
import { resetPasswordSchema } from "@shared/schemas/auth";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import AuthCard from "~/components/auth/auth-card.vue";
import FormMessage from "~/components/form-message.vue";

const toast = useToast();

definePageMeta({
  titleKey: "seo.resetPassword.title",
  descriptionKey: "seo.resetPassword.description",
});

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
    confirmPassword: "",
  },
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const [password, passwordAttrs] = defineField("password");
const [confirmPassword, confirmPasswordAttrs] = defineField("confirmPassword");

const onSubmit = handleSubmit(async (values) => {
  await formState.submit(async () => {
    try {
      await resetPassword(values.password, token.value);
      toast.show($t("auth.resetPasswordSuccess"));
      formState.setSuccess("auth.passwordUpdated");
      resetForm();
      navigateTo(localePath("/login"));
    }
    catch (error) {
      console.error(error);
      toast.show($t("auth.resetPasswordFailed"), "error");
      formState.setError("auth.resetPasswordFailed");
    }
  });
});
</script>

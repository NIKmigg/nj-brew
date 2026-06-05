<template>
  <div>
    <div class="fixed inset-0 -z-1">
      <div
        class="login-hero-bg h-full w-full"
      />
    </div>
    <AuthCard :title="$t('auth.welcome')" :description="$t('auth.intro')">
      <div class="join w-full">
        <button
          class="btn btn-soft join-item flex-1"
          :class="{ 'btn-neutral': mode === 'login' }"
          type="button"
          @click="selectMode('login')"
        >
          {{ $t("auth.login") }}
        </button>
        <button
          class="btn btn-soft join-item flex-1"
          :class="{ 'btn-neutral': mode === 'signup' }"
          type="button"
          @click="selectMode('signup')"
        >
          {{ $t("auth.register") }}
        </button>
      </div>
      <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
        <div v-if="mode === 'signup'" class="form-control w-full">
          <label class="label pl-3 pb-1">
            <span class="label-text">{{ $t('auth.name') }}</span>
          </label>
          <div class="relative">
            <Icon name="mdi:account" class="absolute z-60 left-3 top-1/2 -translate-y-1/2 opacity-60" />
            <input
              v-model="name"
              v-bind="nameAttrs"
              class="input input-neutral w-full pl-10 pr-10"
              autocomplete="name"
              type="text"
            >
          </div>
          <FormMessage :message="errors.name" class="pl-3" />
        </div>
        <div class="form-control w-full">
          <label class="label pl-3 pb-1">
            <span class="label-text">{{ $t('auth.email') }}</span>
          </label>
          <div class="relative">
            <Icon name="mdi:at" class="absolute z-60 left-3 top-1/2 -translate-y-1/2 opacity-60" />
            <input
              v-model="email"
              v-bind="emailAttrs"
              class="input input-neutral w-full pl-10 pr-10"
              autocomplete="email"
              type="email"
            >
          </div>
          <FormMessage :message="errors.email" class="pl-3" />
        </div>
        <div class="form-control w-full">
          <label class="label pl-3 pb-1">
            <span class="label-text">{{ $t('auth.password') }}</span>
          </label>
          <div class="relative">
            <Icon name="mdi:lock" class="absolute z-60 left-3 top-1/2 -translate-y-1/2 opacity-60" />
            <input
              v-model="password"
              v-bind="passwordAttrs"
              class="input input-neutral w-full pl-10 pr-10"
              :autocomplete="mode === 'signup' ? 'new-password' : 'current-password'"
              :type="showPassword ? 'text' : 'password'"
            >
            <span
              tabindex="0"
              role="button"
              class="absolute right-3 top-5.5 -translate-y-1/2 cursor-pointer hover:text-neutral focus:text-neutral"
              @click="showPassword = !showPassword"
              @keydown.enter="showPassword = !showPassword"
            >
              <Icon :name="showPassword ? 'mdi-eye' : 'mdi-eye-off'" class="opacity-60 text-2xl" />
            </span>
          </div>
          <FormMessage :message="errors.password" class="pl-3" />
        </div>
        <div v-if="mode === 'signup'" class="form-control w-full">
          <label class="label pl-3 pb-1">
            <span class="label-text">{{ $t('auth.confirmPassword') }}</span>
          </label>

          <div class="relative">
            <Icon
              name="mdi:lock-check"
              class="absolute z-60 left-3 top-1/2 -translate-y-1/2 opacity-60"
            />

            <input
              v-model="confirmPassword"
              v-bind="confirmPasswordAttrs"
              class="input input-neutral w-full pl-10 pr-10"
              autocomplete="new-password"
              :type="showConfirmPassword ? 'text' : 'password'"
            >
            <span
              tabindex="0"
              role="button"
              class="absolute right-3 top-5.5 -translate-y-1/2 cursor-pointer hover:text-neutral focus:text-neutral"
              @click="showConfirmPassword = !showConfirmPassword"
              @keydown.enter="showConfirmPassword = !showConfirmPassword"
            >
              <Icon :name="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'" class="opacity-60 text-2xl" />
            </span>
          </div>
          <FormMessage :message="errors.confirmPassword" class="pl-3" />
        </div>
        <FormMessage :message="formState.errorMessage.value" />
        <FormMessage :message="formState.successMessage.value" type="success" />
        <AuthVerificationAction
          :callback-url="redirect"
          :disabled="formState.pending.value"
          :email="email ?? ''"
          :show="showVerificationResend"
          @error="formState.setError"
          @sent="formState.setSuccess('auth.verificationEmailSent')"
        />
        <button :disabled="formState.pending.value" class="btn btn-accent w-full" type="submit">
          <span v-if="formState.pending.value" class="loading loading-spinner loading-sm" />
          <Icon v-else name="mdi:key" size="20" />
          {{ mode === 'signup' ? $t("auth.register") : $t("auth.login") }}
        </button>
        <NuxtLink
          v-if="mode === 'login'"
          class="link-hover link text-center text-sm"
          :to="localePath('/login/forgot-password')"
        >
          {{ $t("auth.forgotPassword") }}
        </NuxtLink>
      </form>
      <div class="divider my-0" />
      <button
        :disabled="formState.pending.value"
        class="btn btn-outline w-full"
        type="button"
        @click="callSignInWithGitHub"
      >
        <Icon name="tabler:brand-github" size="20" />
        {{ $t("auth.github") }}
      </button>
    </AuthCard>
  </div>
</template>

<script setup lang="ts">
import { authEntrySchema } from "@shared/schemas/auth";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import AuthCard from "~/components/auth/auth-card.vue";
import AuthVerificationAction from "~/components/auth/verification-action.vue";
import FormMessage from "~/components/form-message.vue";

const {
  user,
  signInWithEmail,
  signUpWithEmail,
  signInWithGitHub,
} = await useAuth();
const route = useRoute();
const localePath = useLocalePath();

const formState = useFormState();
const showVerificationResend = ref(false);

const redirect = computed(() => {
  const value = route.query.redirect;

  return typeof value === "string" && value.startsWith("/") ? value : localePath("/");
});

const {
  defineField,
  errors,
  handleSubmit,
  setFieldValue,
} = useForm({
  validationSchema: toTypedSchema(authEntrySchema),
  initialValues: {
    email: "",
    mode: "login",
    name: "",
    password: "",
    confirmPassword: "",
  },
});

const [mode] = defineField("mode");
const [name, nameAttrs] = defineField("name");
const [email, emailAttrs] = defineField("email");
const [password, passwordAttrs] = defineField("password");
const [confirmPassword, confirmPasswordAttrs] = defineField("confirmPassword");

const showPassword = ref(false);
const showConfirmPassword = ref(false);

watch(
  user,
  async (value) => {
    if (value) {
      await navigateTo(redirect.value);
    }
  },
  { immediate: true },
);

function selectMode(nextMode: "login" | "signup") {
  setFieldValue("mode", nextMode);
  formState.clearMessages();
  showVerificationResend.value = false;
}

const onSubmit = handleSubmit(async (values) => {
  await formState.submit(async () => {
    showVerificationResend.value = false;

    if (values.mode === "signup") {
      await signUpWithEmail(values.name, values.email, values.password, redirect.value);
      formState.setSuccess("auth.checkVerificationEmail");
      showVerificationResend.value = true;
      setFieldValue("mode", "login");
      setFieldValue("password", "");
      return;
    }

    try {
      await signInWithEmail(values.email, values.password);
    }
    catch (error) {
      showVerificationResend.value = !!values.email;
      throw error;
    }

    await navigateTo(redirect.value);
  });
});

async function callSignInWithGitHub() {
  await signInWithGitHub(redirect.value || localePath("/"));
}
</script>

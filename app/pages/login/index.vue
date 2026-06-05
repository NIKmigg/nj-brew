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
          class="btn join-item flex-1"
          :class="{ 'btn-active': mode === 'login' }"
          type="button"
          @click="selectMode('login')"
        >
          {{ $t("auth.login") }}
        </button>
        <button
          class="btn join-item flex-1"
          :class="{ 'btn-active': mode === 'signup' }"
          type="button"
          @click="selectMode('signup')"
        >
          {{ $t("auth.register") }}
        </button>
      </div>
      <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
        <label v-if="mode === 'signup'" class="form-control w-full">
          <span class="label pb-1">
            <span class="label-text">{{ $t("auth.name") }}</span>
          </span>
          <input
            v-model="name"
            v-bind="nameAttrs"
            class="input w-full"
            autocomplete="name"
            type="text"
          >
          <FormMessage :message="errors.name" />
        </label>
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
        <label class="form-control w-full">
          <span class="label pb-1">
            <span class="label-text">{{ $t("auth.password") }}</span>
          </span>
          <input
            v-model="password"
            v-bind="passwordAttrs"
            class="input w-full"
            :autocomplete="mode === 'signup' ? 'new-password' : 'current-password'"
            type="password"
          >
          <FormMessage :message="errors.password" />
        </label>
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
  },
});

const [mode] = defineField("mode");
const [name, nameAttrs] = defineField("name");
const [email, emailAttrs] = defineField("email");
const [password, passwordAttrs] = defineField("password");

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

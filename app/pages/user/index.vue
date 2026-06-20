<template>
  <div>
    <section class="py-16">
      <div class="container my-auto text-center mx-auto max-w-3xl">
        <p class="text-4xl font-bold mb-4 font-old-style">
          {{ $t("settings.welcomeTitle", { name: user?.name }) }}
        </p>
        <p>
          {{ $t("settings.welcomeText") }}
        </p>
      </div>
    </section>
    <WaveCard />
    <section class="bg-base-200 py-16">
      <div class="container my-auto text-center mx-auto max-w-7xl">
        <div class="w-25 mx-auto">
          <img
            v-if="user?.image"
            :src="user.image"
            :alt="user.name || $t('nav.user')"
            class="rounded-full"
          >
          <img
            v-else
            src="/avatar.webp"
            :alt="$t('nav.user')"
            class="rounded-full"
          >
        </div>
        <br>
        {{ $t("settings.userProperties.name") }}: {{ user?.name }}
        <br>
        {{ $t("settings.userProperties.email") }}: {{ user?.email }}
        <br>
        {{ $t("settings.userProperties.createdAt") }}: {{ user?.createdAt }}
      </div>
    </section>
    <WaveCard class="rotate-180 bg-base-100/80" />
    <section class="bg-base-100/80 py-16">
      <div class="container my-auto text-center mx-auto max-w-3xl">
        <p class="text-4xl font-bold mb-4 font-old-style">
          {{ $t("settings.deleteTitle") }}
        </p>

        <p>
          {{ $t("settings.deleteQuestion") }}
        </p>

        <button class="btn btn-success btn-soft my-5" @click="handleSignOut">
          {{ $t("auth.logout") }}
        </button>

        <p class="whitespace-pre-line">
          {{ $t("settings.deleteDescription") }}
        </p>

        <button class="btn btn-error btn-soft my-5" type="button" @click="showDeleteConfirm = true">
          {{ $t("auth.deleteAccount") }}
        </button>
      </div>
    </section>

    <ConfirmModal
      v-model="showDeleteConfirm"
      title-key="settings.deleteConfirmTitle"
      text-key="settings.deleteConfirmText"
      confirm-key="settings.deleteConfirmSubmit"
      :text-params="{ email: user?.email || '-' }"
      @confirm="handleDeleteAccount"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "settings",
  middleware: "auth",
  titleKey: "seo.user.title",
  descriptionKey: "seo.user.description",
});

const { user, signOut, deleteUser } = await useAuth();
const localePath = useLocalePath();
const toast = useToast();
const showDeleteConfirm = ref(false);

async function handleSignOut() {
  try {
    await signOut();

    toast.show($t("auth.logoutSuccess"));

    await navigateTo(localePath("/"));
  }
  catch (error) {
    console.error(error);

    toast.show($t("auth.logoutFailed"), "error");
  }
}

async function handleDeleteAccount() {
  try {
    showDeleteConfirm.value = false;

    await deleteUser();

    toast.show($t("auth.deleteAccountSuccess"));

    await navigateTo(localePath("/"));
  }
  catch (error) {
    console.error(error);

    toast.show($t("auth.deleteAccountFailed"), "error");
  }
}
</script>

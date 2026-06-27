<template>
  <div>
    <section v-section-reveal class="py-16">
      <div class="container my-auto text-center mx-auto max-w-3xl">
        <h1 data-split class="text-4xl font-bold mb-4 font-old-style">
          {{ $t("settings.welcomeTitle", { name: user?.name }) }}
        </h1>
        <p data-split="{ type: 'word', stagger: 0.015 }">
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
        <div class="divider my-3" />
        <div class="grid grid-cols-[1fr_auto_1fr] gap-x-4">
          <span class="text-right">
            {{ $t("settings.userProperties.name") }}
          </span>
          <span>:</span>
          <span class="text-left font-semibold">
            {{ user?.name }}
          </span>

          <span class="text-right">
            {{ $t("settings.userProperties.email") }}
          </span>
          <span>:</span>
          <span class="text-left font-semibold">
            {{ user?.email }}
          </span>

          <span class="text-right">
            {{ $t("settings.userProperties.createdAt") }}
          </span>
          <span>:</span>
          <span class="text-left font-semibold">
            {{ formatDateTime(user?.createdAt) }}
          </span>
        </div>
      </div>
    </section>
    <WaveCard class="rotate-180 bg-base-100/80" />
    <section v-section-reveal class="bg-base-100/80 py-16">
      <div class="container my-auto text-center mx-auto max-w-3xl">
        <h1 data-split class="text-4xl font-bold mb-4 font-old-style">
          {{ $t("settings.deleteTitle") }}
        </h1>

        <p data-split="{ type: 'word', stagger: 0.015 }">
          {{ $t("settings.deleteQuestion") }}
        </p>

        <button class="btn btn-success btn-soft my-5" @click="handleSignOut">
          {{ $t("auth.logout") }}
        </button>

        <p data-split="{ type: 'word', stagger: 0.015 }" class="whitespace-pre-line">
          {{ $t("settings.deleteDescription") }}
        </p>

        <button class="btn btn-error btn-soft my-5" type="button" @click="showDeleteConfirm = true">
          {{ $t("auth.deleteAccount") }}
        </button>
      </div>
    </section>

    <GsapConfirmModal
      v-model="showDeleteConfirm"
      title-key="settings.deleteConfirmTitle"
      text-key="settings.deleteConfirmText"
      confirm-key="settings.deleteConfirmSubmit"
      cancel-key="global.cancel"
      close-key="global.close"
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
const { formatDateTime } = useFormatDate();
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

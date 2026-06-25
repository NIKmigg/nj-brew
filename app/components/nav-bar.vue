<template>
  <nav
    class="navbar rounded-2xl border border-base-300/30 bg-base-100/80 shadow-lg backdrop-blur"
    :aria-label="$t('nav.home')"
  >
    <div class="navbar-start ml-4">
      <!-- Mobile Navigation -->
      <GsapDropdown
        id="mobile-navigation"
        class="lg:hidden"
        type="menu"
        align="start"
        :label="$t('nav.home')"
        trigger-class="flex items-center justify-center transition-transform hover:scale-110"
        panel-class="mt-3 w-52 rounded-box bg-base-100 p-2 shadow-lg"
      >
        <template #trigger="{ open }">
          <Icon :name="open ? 'mdi:close' : 'mdi:menu'" class="text-3xl" />
        </template>

        <template #default="{ close }">
          <ul class="menu menu-sm p-0" role="none">
            <li role="none">
              <NuxtLink
                :to="localePath('/')"
                role="menuitem"
                class="hover:scale-110 hover:bg-transparent"
                :class="{
                  'text-primary/80': isActive('/'),
                }"
                @click="close()"
              >
                <Icon name="mdi:home" class="text-3xl" />

                {{ $t("nav.home") }}
              </NuxtLink>
            </li>

            <li role="none">
              <NuxtLink
                :to="localePath('/generator')"
                role="menuitem"
                class="hover:scale-110 hover:bg-transparent"
                :class="{
                  'text-primary/80':
                    isActive('/generator'),
                }"
                @click="close()"
              >
                <Icon name="mdi:glass-mug-variant" class="text-3xl" />

                {{ $t("nav.generator") }}
              </NuxtLink>
            </li>

            <li role="none">
              <NuxtLink
                :to="localePath('/market')"
                role="menuitem"
                class="hover:scale-110 hover:bg-transparent"
                :class="{
                  'text-primary/80':
                    isActive('/market'),
                }"
                @click="close()"
              >
                <Icon name="mdi:storefront" class="text-3xl" />

                {{ $t("nav.market") }}
              </NuxtLink>
            </li>
          </ul>
        </template>
      </GsapDropdown>

      <!-- Logo -->
      <NuxtLink :to="localePath('/')" class="ml-4 flex items-center" aria-label="NJ Brew">
        <img
          src="/logo.webp"
          alt=""
          aria-hidden="true"
          class="h-10 w-10"
        >

        <span
          class="ml-2 font-old-style text-xl font-bold text-primary/80"
        >
          NJ Brew
        </span>
      </NuxtLink>
    </div>

    <!-- Desktop Navigation -->
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1" role="list">
        <li>
          <NuxtLink
            :to="localePath('/')"
            class="hover:scale-110 hover:bg-transparent"
            :class="{
              'text-primary/80': isActive('/'),
            }"
          >
            <Icon name="mdi:home" class="text-3xl" />

            {{ $t("nav.home") }}
          </NuxtLink>
        </li>

        <li>
          <NuxtLink
            :to="localePath('/generator')"
            class="hover:scale-110 hover:bg-transparent"
            :class="{
              'text-primary/80':
                isActive('/generator'),
            }"
          >
            <Icon name="mdi:glass-mug-variant" class="text-3xl" />

            {{ $t("nav.generator") }}
          </NuxtLink>
        </li>

        <li>
          <NuxtLink
            :to="localePath('/market')"
            class="hover:scale-110 hover:bg-transparent"
            :class="{
              'text-primary/80':
                isActive('/market'),
            }"
          >
            <Icon name="mdi:storefront" class="text-3xl" />

            {{ $t("nav.market") }}
          </NuxtLink>
        </li>
      </ul>
    </div>

    <div class="navbar-end mr-4">
      <div class="navbar-end mr-4 space-x-4">
        <NuxtLink
          :to="localePath('/cart')"
          type="button"
          class="flex items-center justify-center hover:scale-110 relative"
          :class="{ 'animate-pulse': showAddToCartFeedback }"
          :aria-label="$t('nav.cart')"
        >
          <Icon name="mdi:cart" class="text-3xl" />
          <span
            v-if="itemCount > 0"
            class="absolute -top-2 -right-2 flex items-center justify-center min-w-5 h-5 px-1 bg-primary text-primary-content text-xs font-bold rounded-full leading-none"
          >
            {{ itemCount }}
          </span>
        </NuxtLink>

        <button
          v-if="!mounted"
          type="button"
          class="btn btn-circle btn-ghost avatar"
          :aria-label="$t('nav.user')"
          disabled
        >
          <img src="/avatar.webp" :alt="$t('nav.user')" class="rounded-full">
        </button>

        <GsapDropdown
          v-else
          id="user-navigation"
          type="dialog"
          align="end"
          :label="$t('nav.user')"
          trigger-class="btn btn-circle btn-ghost avatar hover:scale-110"
          panel-class="mt-3 w-64 rounded-box bg-base-100 shadow-lg"
        >
          <template #trigger>
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
          </template>

          <template #default="{ close }">
            <div class="card card-compact">
              <div class="card-body text-center">
                <h3 class="font-semibold">
                  {{ user?.name || "Ragnar Prostbrok" }}
                </h3>

                <p class="mt-1 text-sm opacity-70">
                  {{
                    user?.email
                      || "ragnar@valhalla.met"
                  }}
                </p>

                <div class="divider my-3" />

                <ThemeToggle class="mb-3" />

                <div class="join mx-auto">
                  <NuxtLink
                    v-for="language in languages"
                    :key="language.code"
                    class="btn btn-soft btn-sm join-item hover:scale-110"
                    :class="{
                      'btn-active bg-primary/80':
                        locale === language.code,
                    }"
                    :to="switchLocalePath(language.code)
                    "
                    :aria-current="locale === language.code
                      ? 'true'
                      : undefined
                    "
                    @click="close()"
                  >
                    {{ language.label }}
                  </NuxtLink>
                </div>

                <div class="divider my-3" />

                <div v-if="user">
                  <NuxtLink
                    :to="localePath('/user')"
                    class="btn btn-ghost  btn-wide hover:scale-110"
                    :class="{
                      'text-primary/80':
                        isActive('/user'),
                    }"
                    @click="close()"
                  >
                    <Icon name="mdi:cog" class="text-xl" />

                    {{ $t("nav.user") }}
                  </NuxtLink>

                  <button
                    type="button"
                    class="btn btn-ghost btn-wide hover:scale-110 hover:text-error"
                    @click="handleSignOut(close)"
                  >
                    <Icon name="mdi:logout" class="text-xl" />

                    {{ $t("nav.logout") }}
                  </button>
                </div>

                <div v-else @click="close()">
                  <AuthButton />
                </div>
              </div>
            </div>
          </template>
        </GsapDropdown>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

const { user, signOut } = await useAuth();

const mounted = ref(false);

const route = useRoute();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();

const { locale, t } = useI18n();

const toast = useToast();
const cartStore = useCartStore();
const { itemCount, showAddToCartFeedback } = storeToRefs(cartStore);

const languages = [
  {
    code: "de",
    label: "DE",
  },
  {
    code: "en",
    label: "EN",
  },
] as const;

onMounted(() => {
  mounted.value = true;

  watch(
    user,
    async (value) => {
      if (value) {
        await cartStore.ensureLoaded();
      }
      else {
        cartStore.reset();
      }
    },
    { immediate: true },
  );
});

function isActive(path: string) {
  return route.path === localePath(path);
}

async function handleSignOut(
  closeDropdown?: () => void,
) {
  closeDropdown?.();

  try {
    await signOut();

    toast.show(
      t("auth.logoutSuccess"),
    );

    await navigateTo(
      localePath("/"),
    );
  }
  catch (error) {
    console.error(error);

    toast.show(
      t("auth.logoutFailed"),
      "error",
    );
  }
}
</script>

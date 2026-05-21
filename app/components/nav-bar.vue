<template>
  <div class="navbar rounded-2xl border border-base-300/30 bg-base-100/80 backdrop-blur shadow-lg">
    <div class="navbar-start ml-4">
      <div class="dropdown">
        <div tabindex="0" role="button" class="flex items-center justify-center hover:scale-110 lg:hidden">
          <Icon name="mdi:menu" class="text-3xl" />
        </div>
        <ul
          tabindex="-1"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
        >
          <li>
            <NuxtLink :to="localePath('/')" class="hover:bg-transparent hover:scale-110" :class="{ 'text-primary/80': isActive('/') }">
              <Icon name="mdi:home" class="text-3xl" />
              {{ $t("nav.home") }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              :to="localePath('/generator')"
              class="hover:bg-transparent hover:scale-110"
              :class="{ 'text-primary/80': isActive('/generator') }"
            >
              <Icon name="mdi:glass-mug-variant" class="text-3xl" />
              {{ $t("nav.generator") }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink :to="localePath('/market')" class="hover:bg-transparent hover:scale-110" :class="{ 'text-primary/80': isActive('/market') }">
              <Icon name="mdi:storefront" class="text-3xl" />
              {{ $t("nav.market") }}
            </NuxtLink>
          </li>
        </ul>
      </div>
      <NuxtLink
        :to="localePath('/')"
        class="flex items-center ml-4"
      >
        <img
          src="/logo.png"
          alt="NJ Logo"
          class="w-10 h-10"
        >
        <span class="ml-2 font-bold text-xl font-old-style text-primary/80">
          NJ Brew
        </span>
      </NuxtLink>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li>
          <NuxtLink :to="localePath('/')" class="hover:bg-transparent hover:scale-110" :class="{ 'text-primary/80': isActive('/') }">
            <Icon name="mdi:home" class="text-3xl" />
            {{ $t("nav.home") }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            :to="localePath('/generator')"
            class="hover:bg-transparent hover:scale-110"
            :class="{ 'text-primary/80': isActive('/generator') }"
          >
            <Icon name="mdi:glass-mug-variant" class="text-3xl" />
            {{ $t("nav.generator") }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localePath('/market')" class="hover:bg-transparent hover:scale-110" :class="{ 'text-primary/80': isActive('/market') }">
            <Icon name="mdi:storefront" class="text-3xl" />
            {{ $t("nav.market") }}
          </NuxtLink>
        </li>
      </ul>
    </div>
    <div class="navbar-end mr-4">
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
          <img
            v-if="authStore.user?.image"
            :src="authStore.user.image"
            alt="avatar"
            class="rounded-full"
          >

          <img
            v-else
            src="/avatar.png"
            alt="avatar"
            class="rounded-full"
          >
        </div>

        <div tabindex="0" class="dropdown-content mt-3 z-1 w-64 card card-compact bg-base-100 shadow">
          <div class="card-body text-center">
            <h3 class="font-semibold">
              {{ authStore.user?.name || 'Ragnar Prostbrok' }}
            </h3>

            <p class="text-sm opacity-70 mt-1">
              {{ authStore.user?.email || 'ragnar@valhalla.met' }}
            </p>

            <div class="divider my-3" />

            <ThemeToggle class="mb-4" />

            <div class="join mb-4 w-full">
              <NuxtLink
                v-for="language in languages"
                :key="language.code"
                class="btn btn-sm join-item flex-1"
                :class="{ 'btn-active': locale === language.code }"
                :to="switchLocalePath(language.code)"
              >
                {{ language.label }}
              </NuxtLink>
            </div>

            <button v-if="authStore.user" class="btn btn-ghost" @click="authStore.signOut">
              {{ $t("auth.logout") }}
            </button>

            <AuthButton v-else />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();

const route = useRoute();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();
const { locale } = useI18n();

const languages = [
  { code: "de", label: "DE" },
  { code: "en", label: "EN" },
] as const;

function isActive(path: string) {
  return route.path === localePath(path);
}
</script>

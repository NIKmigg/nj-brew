<template>
  <nav class="navbar rounded-2xl border border-base-300/30 bg-base-100/80 backdrop-blur shadow-lg" :aria-label="$t('nav.home')">
    <div class="navbar-start ml-4">
      <div class="dropdown">
        <button
          type="button"
          class="flex items-center justify-center hover:scale-110 lg:hidden"
          :aria-label="$t('nav.home')"
          aria-haspopup="menu"
        >
          <Icon name="mdi:menu" class="text-3xl" />
        </button>
        <ul
          tabindex="-1"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          role="menu"
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
        aria-label="NJ Brew"
      >
        <img
          src="/logo.webp"
          alt=""
          aria-hidden="true"
          class="w-10 h-10"
        >
        <span class="ml-2 font-bold text-xl font-old-style text-primary/80">
          NJ Brew
        </span>
      </NuxtLink>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1" role="list">
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
    <div class="navbar-end mr-4 space-x-4">
      <NuxtLink
        :to="localePath('/cart')"
        type="button"
        class="flex items-center justify-center hover:scale-110"
        :aria-label="$t('nav.cart')"
      >
        <Icon name="mdi:cart" class="text-3xl" />
      </NuxtLink>

      <button
        v-if="!mounted"
        type="button"
        class="btn btn-ghost btn-circle avatar"
        :aria-label="$t('nav.user')"
        disabled
      >
        <img
          src="/avatar.webp"
          :alt="$t('nav.user')"
          class="rounded-full"
        >
      </button>

      <div v-else class="dropdown dropdown-end">
        <button
          type="button"
          class="btn btn-ghost btn-circle avatar hover:scale-110"
          :aria-label="$t('nav.user')"
          aria-haspopup="menu"
        >
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
        </button>

        <div tabindex="0" class="dropdown-content mt-3 z-1 w-64 card card-compact bg-base-100 shadow" role="menu">
          <div class="card-body text-center">
            <h3 class="font-semibold">
              {{ user?.name || 'Ragnar Prostbrok' }}
            </h3>

            <p class="text-sm opacity-70 mt-1">
              {{ user?.email || 'ragnar@valhalla.met' }}
            </p>

            <div class="divider my-3" />

            <ThemeToggle class="mb-3" />

            <div class="join mx-auto">
              <NuxtLink
                v-for="language in languages"
                :key="language.code"
                class="btn btn-soft btn-sm join-item hover:scale-110"
                :class="{ 'btn-active bg-primary/80': locale === language.code }"
                :to="switchLocalePath(language.code)"
                :aria-current="locale === language.code ? 'true' : undefined"
              >
                {{ language.label }}
              </NuxtLink>
            </div>

            <div class="divider my-3" />

            <div v-if="user">
              <NuxtLink
                :to="localePath('/user')"
                class="btn btn-ghost btn-wide hover:scale-110"
                :class="{ 'text-primary/80': isActive('/admin') }"
              >
                <Icon name="mdi:cog" class="text-xl" />
                {{ $t("nav.user") }}
              </NuxtLink>

              <button class="btn btn-ghost btn-wide hover:scale-110 hover:text-error" @click="handleSignOut">
                <Icon name="mdi:logout" class="text-xl" />
                {{ $t("nav.logout") }}
              </button>
            </div>

            <AuthButton v-else />
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { user, signOut } = await useAuth();

const mounted = ref(false);
const route = useRoute();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();
const { locale } = useI18n();
const toast = useToast();

const languages = [
  { code: "de", label: "DE" },
  { code: "en", label: "EN" },
] as const;

onMounted(() => {
  mounted.value = true;
});

function isActive(path: string) {
  return route.path === localePath(path);
}

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
</script>

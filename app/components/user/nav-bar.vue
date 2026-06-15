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
            <NuxtLink :to="localePath('/user')" class="hover:bg-transparent hover:scale-110" :class="{ 'text-primary/80': isActive('/user') }">
              <Icon name="mdi:account-cog" class="text-3xl" />
              {{ $t("nav.userSettings") }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              :to="localePath('/orders')"
              class="hover:bg-transparent hover:scale-110"
              :class="{ 'text-primary/80': isActive('/orders') }"
            >
              <Icon name="mdi:package-variant" class="text-3xl" />
              {{ $t("nav.userOrders") }}
            </NuxtLink>
          </li>
        </ul>
      </div>
      <NuxtLink
        :to="localePath('/')"
        class="flex items-center ml-4"
      >
        <img
          src="/logo.webp"
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
          <NuxtLink :to="localePath('/user')" class="hover:bg-transparent hover:scale-110" :class="{ 'text-primary/80': isActive('/user') }">
            <Icon name="mdi:account-cog" class="text-3xl" />
            {{ $t("nav.userSettings") }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            :to="localePath('/orders')"
            class="hover:bg-transparent hover:scale-110"
            :class="{ 'text-primary/80': isActive('/orders') }"
          >
            <Icon name="mdi:package-variant" class="text-3xl" />
            {{ $t("nav.userOrders") }}
          </NuxtLink>
        </li>
      </ul>
    </div>
    <div class="navbar-end mr-4">
      <NuxtLink
        :to="localePath('/')"
        class="btn btn-primary flex items-center ml-4"
      >
        <Icon name="mdi:arrow-left" class="text-3xl" />
        {{ $t("nav.back") }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const localePath = useLocalePath();

function isActive(path: string) {
  return route.path === localePath(path);
}
</script>

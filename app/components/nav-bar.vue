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
            <NuxtLink to="/" class="hover:bg-transparent hover:scale-110">
              <Icon name="mdi:home" class="text-3xl" :class="{ 'text-primary/80': isActive('/') }" />
              Home
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/generator"
              class="hover:bg-transparent hover:scale-110"
            >
              <Icon name="mdi:glass-mug-variant" class="text-3xl" :class="{ 'text-primary/80': isActive('/generator') }" />
              Rezept-Generator
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/info" class="hover:bg-transparent hover:scale-110">
              <Icon name="mdi:info" class="text-3xl" :class="{ 'text-primary/80': isActive('/info') }" />
              Info
            </NuxtLink>
          </li>
        </ul>
      </div>
      <NuxtLink
        to="/"
        class="flex items-center ml-4"
      >
        <img
          src="/logo.png"
          alt="NJ Logo"
          class="w-10 h-10"
        >
      </NuxtLink>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li>
          <NuxtLink to="/" class="hover:bg-transparent hover:scale-110" :class="{ 'text-primary/80': isActive('/') }">
            <Icon name="mdi:home" class="text-3xl" />
            Home
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/generator"
            class="hover:bg-transparent hover:scale-110"
            :class="{ 'text-primary/80': isActive('/generator') }"
          >
            <Icon name="mdi:glass-mug-variant" class="text-3xl" />
            Rezept-Generator
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/info" class="hover:bg-transparent hover:scale-110">
            <Icon name="mdi:info" class="text-3xl" :class="{ 'text-primary/80': isActive('/info') }" />
            Info
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

            <button v-if="authStore.user" class="btn btn-ghost" @click="authStore.signOut">
              Logout
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

function isActive(path: string) {
  return route.path === path;
}
</script>

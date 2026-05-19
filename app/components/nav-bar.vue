<template>
  <nav class="fixed w-full bg-base-100 shadow-sm">
    <div class="flex items-center justify-between px-4 py-2">
      <!-- Links: Hamburger (Mobile) / Logo (Desktop) -->
      <div class="flex items-center lg:hidden relative cursor-pointer">
        <!-- Hamburger -->
        <div
          class="w-8 h-8  flex items-center justify-center transition-transform duration-300 ease-in-out hover:scale-110"
          @click="isDropdownOpen = !isDropdownOpen"
        >
          <Icon v-if="isDropdownOpen" name="mdi:menu-open" class="text-3xl" />
          <Icon v-else name="mdi:menu" class="text-3xl" />
        </div>
      </div>

      <!-- Logo (Mobile zentriert, Desktop links) -->
      <NuxtLink
        to="/"
        class="absolute left-1/2 transform -translate-x-1/2 md:translate-x-0 lg:static lg:transform-none flex items-center"
      >
        <img
          src="/logo.png"
          alt="NJ Logo"
          class="w-10 h-10  transition-transform duration-300 ease-in-out hover:scale-110"
        >
      </NuxtLink>

      <!-- Desktop Menü -->
      <div class="hidden lg:flex flex-1 justify-center">
        <ul class="menu menu-horizontal px-1 font-bold">
          <li>
            <NuxtLink to="/" class="hover:bg-transparent hover:scale-110">
              <Icon name="mdi:home" class="text-3xl" />
              <a>Home</a>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/"
              class="hover:bg-transparent hover:scale-110"
            >
              <Icon name="mdi:glass-mug-variant" class="text-3xl" />
              Rezept-Generator
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/" class="hover:bg-transparent hover:scale-110">
              <Icon name="mdi:info" class="text-3xl" />
              <a>Info</a>
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Navbar-End (Desktop & Mobile Icon rechts) -->
      <div class="flex items-center space-x-2 cursor-pointer">
        <div class="navbar bg-transparent px-4">
          <div class="flex-1" />

          <!-- Dropdown -->
          <div class="dropdown dropdown-end cursor-auto">
            <label tabindex="0" class="hover:bg-transparent hover:scale-110 cursor-pointer">
              <div
                class="w-10 h-10  flex items-center justify-center transition-transform duration-300 ease-in-out hover:scale-110"
              >

                <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                  <img
                    v-if="authStore.user?.image"
                    :src="authStore.user.image"
                    alt="avatar"
                    class="rounded-full"
                  >
                  <Icon v-else name="mdi:user" size="24" />
                </div>
              </div>
            </label>

            <div tabindex="0" class="mt-3 z-1 card card-compact dropdown-content w-64 bg-base-100 shadow">
              <div class="card-body text-center">
                <h3 class="font-semibold">
                  {{ authStore.user?.name || 'Guest' }}
                </h3>

                <p class="text-sm opacity-70 mt-1">
                  {{ authStore.user?.email || '' }}
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
    </div>

    <!-- Mobile Dropdown -->
    <ul
      v-if="isDropdownOpen"
      class="lg:hidden menu menu-sm backdrop-blur p-2 flex flex-row w-full justify-around font-bold "
    >
      <li>
        <NuxtLink
          to="/"
          class="hover:bg-transparent hover:scale-110"
          @click="closeDropdown"
        >
          <Icon name="mdi:home" class="text-3xl" />
          Home
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          to="/"
          class="hover:bg-transparent hover:scale-110"
          @click="closeDropdown"
        >
          <Icon name="mdi:glass-mug-variant" class="text-3xl" />
          Rezept-Generator
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          to="/"
          class="hover:bg-transparent hover:scale-110"
          @click="closeDropdown"
        >
          <Icon name="mdi:info" class="text-3xl" />
          Info
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const isDropdownOpen = ref(false);

function closeDropdown() {
  isDropdownOpen.value = false;
}
</script>

<template>
  <div class="navbar bg-base-100 shadow-sm">
    <div class="flex-1">
      <a class="btn btn-ghost text-xl">daisyUI</a>
    </div>
    <div class="flex-none">
      <ThemeToggle class="mx-4" />
      <div class="dropdown dropdown-end">
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
            <img
              v-if="authStore.user?.image"
              :src="authStore.user.image"
              alt="avatar"
              class="rounded-full"
            >
            <Icon v-else name="mdi:user" size="24" />
          </div>
          <ul
            tabindex="-1"
            class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li v-if="authStore.user">
              <a @click="authStore.signOut">Logout</a>
            </li>
            <li v-else>
              <AuthButton />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
</script>

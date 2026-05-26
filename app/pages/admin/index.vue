<template>
  <div class="flex flex-wrap gap-4 p-6">
    <h1 class="w-full text-2xl font-bold">
      {{ $t("admin.title") }}
    </h1>
    <div class="card bg-base-100 shadow-sm flex-1 min-w-64">
      <div class="card-body gap-4">
        <h2 class="card-title text-base">
          {{ $t("admin.products") }}
        </h2>

        <NuxtLink :to="localePath('/admin/products/create')" class="btn btn-primary mb-4">
          {{ $t("admin.addProduct") }}
        </NuxtLink>
      </div>
    </div>
    <div class="card bg-base-100 shadow-sm flex-1 min-w-64">
      <div class="card-body gap-4">
        <h2 class="card-title text-base">
          {{ $t("admin.orders") }}
        </h2>

        {{ $t("global.missingFeature") }}
      </div>
    </div>
    <div class="card bg-base-100 shadow-sm flex-1 min-w-64">
      <div class="card-body gap-4">
        <h2 class="card-title text-base">
          {{ $t("admin.users") }}
        </h2>

        {{ $t("global.missingFeature") }}
      </div>
    </div>
    <div class="card bg-base-100 shadow-sm flex-1 min-w-64">
      <div class="card-body gap-4">
        <h2 class="card-title text-base">
          {{ $t("admin.meadConstants") }}
        </h2>
        {{ $t("global.missingFeature") }}

        <!-- <NuxtLink :to="localePath('/admin/mead-constants')" class="btn btn-secondary">
          {{ $t("admin.editMeadConstants") }}
        </NuxtLink> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "admin",
});

const localePath = useLocalePath();
</script>

<template>
  <div class="flex flex-wrap gap-4 p-6">
    <div class="card bg-base-100 shadow-sm flex-1 min-w-64">
      <div class="card-body gap-4">
        <h2 class="card-title text-base">
          {{ $t("admin.addProduct") }}
        </h2>

        <AdminProductForm @created="console.log('created')" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "admin",
});
</script>

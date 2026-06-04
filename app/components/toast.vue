<template>
  <div
    class="fixed bottom-8 left-1/2 -translate-x-1/2 z-9999 flex flex-col gap-2 w-full max-w-md"
  >
    <TransitionGroup name="fade">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        role="alert"
        class="alert alert-soft shadow-lg"
        :class="[
          typeClasses[toast.type],
        ]"
      >
        <span>{{ toast.message }}</span>

        <button
          class="btn btn-circle btn-ghost btn-sm ml-auto"
          @click="remove(toast.id)"
        >
          <Icon name="mdi:close" class="text-lg" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
const { toasts, remove } = useToast();

const typeClasses = {
  success: "alert-success",
  error: "alert-error",
  warning: "alert-warning",
  info: "alert-info",
} as const;
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* verhindert Sprünge beim Entfernen */
.fade-move {
  transition: all 0.3s ease;
}
</style>

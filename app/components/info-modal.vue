<template>
  <div class="flex flex-row gap-2">
    <slot />
    <button class="btn btn-ghost" @click="modal?.showModal()">
      <Icon name="mdi:info" size="24" class="text-base-content/40 cursor-help" />
    </button>
  </div>

  <Teleport to="body">
    <dialog ref="modal" class="modal">
      <div class="modal-box">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 class="text-lg font-bold">
          {{ title }}
        </h3>
        <p class="py-4">
          <slot name="info" />
        </p>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
}>();

const modal = useTemplateRef<HTMLDialogElement>("modal");
</script>

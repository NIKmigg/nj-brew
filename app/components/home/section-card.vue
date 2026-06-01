<template>
  <div
    :class="[
      active ? 'z-20 flex-2' : 'flex-1',
      background,
    ]"
    class="card bg-cover bg-center transition-all duration-500 overflow-hidden"
    @mouseenter="emit('activate')"
    @mouseleave="emit('deactivate')"
  >
    <div class="relative card-body items-center text-center justify-center">
      <div
        class="absolute rounded-full blur-3xl bg-black pointer-events-none z-0"
        :class="active ? 'inset-0 opacity-50' : 'left-1/2 top-20 -translate-x-1/2 w-50 h-50'"
      />
      <h2 class="relative card-title text-neutral-content font-old-style text-4xl z-1">
        {{ title }}
      </h2>
      <Transition
        enter-active-class="transition-all duration-500"
        enter-from-class="opacity-0 scale-75"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-300"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-75"
      >
        <p
          v-if="active"
          class="relative z-1 text-2xl max-w-100 pt-5 text-neutral-content"
        >
          {{ description }}
        </p>
      </Transition>
      <Transition
        enter-active-class="transition-all duration-500"
        enter-from-class="opacity-0 scale-75"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-300"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-75"
      >
        <NuxtLink v-if="active && link" :to="`/${link}`" class="btn btn-primary z-1">
          {{ $t(`nav.${link}`) }}
        </NuxtLink>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  active: boolean;
  link?: string;
  background?: string;
}>();

const emit = defineEmits<{
  activate: [];
  deactivate: [];
}>();
</script>

<template>
  <label class="swap swap-rotate">
    <input v-model="isDark" type="checkbox">
    <Icon name="tabler:sun" class="swap-on" />
    <Icon name="tabler:moon" class="swap-off" />
  </label>
</template>

<script setup lang="ts">
const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(value: boolean) {
    colorMode.preference = value ? "dark" : "light";
  },
});
</script>

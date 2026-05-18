<template>
  <label class="swap swap-rotate">
    <input v-model="isDark" type="checkbox">
    <Icon name="tabler:sun" class="swap-on" size="24" />
    <Icon name="tabler:moon" class="swap-off" size="24" />
  </label>
</template>

<script setup lang="ts">
const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === "nj-brew-dark";
  },
  set(value: boolean) {
    colorMode.preference = value ? "nj-brew-dark" : "nj-brew-light";
  },
});
</script>

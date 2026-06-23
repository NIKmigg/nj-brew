<template>
  <label v-if="mounted" class="swap swap-rotate hover:scale-110 hover:text-primary w-fit mx-auto" :aria-label="toggleLabel">
    <input
      v-model="isDark"
      type="checkbox"
      :aria-checked="isDark"
      :aria-label="toggleLabel"
    >
    <Icon name="tabler:sun" class="swap-on" size="24" />
    <Icon name="tabler:moon" class="swap-off" size="24" />
  </label>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
const { t } = useI18n();
const mounted = ref(false);

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(value: boolean) {
    colorMode.preference = value ? "dark" : "light";
  },
});

const toggleLabel = computed(() => isDark.value ? t("theme.switchToLight") : t("theme.switchToDark"));

onMounted(() => {
  mounted.value = true;
});
</script>

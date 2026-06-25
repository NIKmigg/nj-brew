<template>
  <div
    ref="rootRef"
    class="relative"
    :data-state="isOpen ? 'open' : 'closed'"
  >
    <button
      :id="triggerId"
      ref="triggerRef"
      type="button"
      :class="triggerClass"
      :aria-label="label"
      :aria-haspopup="type"
      :aria-controls="panelId"
      :aria-expanded="isOpen"
      @click="toggle"
      @keydown="handleTriggerKeydown"
    >
      <slot
        name="trigger"
        :open="isOpen"
      />
    </button>

    <div
      :id="panelId"
      ref="panelRef"
      tabindex="-1"
      class="gsap-dropdown-panel pointer-events-none invisible absolute top-full z-50 opacity-0"
      :class="[
        align === 'end'
          ? 'right-0'
          : 'left-0',
        panelClass,
      ]"
      :role="type"
      :aria-labelledby="triggerId"
      :aria-hidden="!isOpen"
      :inert="!isOpen"
      @keydown="handlePanelKeydown"
    >
      <slot
        :open="isOpen"
        :close="close"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from "gsap";

type DropdownAlign = "start" | "end";
type DropdownType = "menu" | "dialog";

type OpenOptions = {
  focusFirst?: boolean;
};

type CloseOptions = {
  restoreFocus?: boolean;
  immediate?: boolean;
};

type Props = {
  id?: string;
  label: string;
  align?: DropdownAlign;
  type?: DropdownType;
  triggerClass?: string;
  panelClass?: string;
  duration?: number;
  openEase?: string;
  closeEase?: string;
  closeTimeScale?: number;
  closeOnRouteChange?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  align: "start",
  type: "menu",
  triggerClass: "",
  panelClass: "",
  duration: 0.8,
  openEase: "elastic.out(0.9, 0.45)",
  closeEase: "power2.in",
  closeTimeScale: 3,
  closeOnRouteChange: true,
});

const emit = defineEmits<{
  open: [];
  close: [];
}>();

const route = useRoute();

const rootRef = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLButtonElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);

const isOpen = ref(false);

const generatedId = useId().replace(/[^\w-]/g, "");

const baseId = computed(() => {
  return props.id || `gsap-dropdown-${generatedId}`;
});

const triggerId = computed(() => {
  return `${baseId.value}-trigger`;
});

const panelId = computed(() => {
  return `${baseId.value}-panel`;
});

let timeline: ReturnType<typeof gsap.timeline> | null = null;
let gsapContext: ReturnType<typeof gsap.context> | null = null;

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex=\"-1\"])",
].join(",");

function getFocusableElements(): HTMLElement[] {
  if (!panelRef.value) {
    return [];
  }

  return Array
    .from(
      panelRef.value.querySelectorAll<HTMLElement>(
        focusableSelector,
      ),
    )
    .filter((element) => {
      return (
        !element.hasAttribute("disabled")
        && element.getAttribute("aria-hidden") !== "true"
        && element.offsetParent !== null
      );
    });
}

async function focusFirstElement() {
  await nextTick();

  requestAnimationFrame(() => {
    const firstElement = getFocusableElements()[0];

    if (firstElement) {
      firstElement.focus({
        preventScroll: true,
      });
    }
    else {
      panelRef.value?.focus({
        preventScroll: true,
      });
    }
  });
}

async function open(options: OpenOptions = {}) {
  const panel = panelRef.value;

  if (!timeline || !panel) {
    return;
  }

  if (isOpen.value) {
    if (options.focusFirst) {
      await focusFirstElement();
    }

    return;
  }

  isOpen.value = true;

  gsap.set(panel, {
    pointerEvents: "auto",
    willChange: "transform, opacity",
  });

  timeline
    .timeScale(1)
    .play();

  emit("open");

  if (options.focusFirst) {
    await focusFirstElement();
  }
}

function close(options: CloseOptions = {}) {
  const panel = panelRef.value;

  if (!timeline || !panel) {
    return;
  }

  const wasVisible = (
    isOpen.value
    || timeline.progress() > 0
  );

  isOpen.value = false;

  gsap.set(panel, {
    pointerEvents: "none",
    willChange: "transform, opacity",
  });

  if (options.immediate) {
    timeline.pause(0);
  }
  else {
    timeline
      .timeScale(props.closeTimeScale)
      .reverse();
  }

  if (wasVisible) {
    emit("close");
  }

  if (options.restoreFocus) {
    nextTick(() => {
      triggerRef.value?.focus({
        preventScroll: true,
      });
    });
  }
}

function toggle() {
  if (isOpen.value) {
    close();
  }
  else {
    open();
  }
}

function handleTriggerKeydown(event: KeyboardEvent) {
  if (event.key === "ArrowDown") {
    event.preventDefault();

    open({
      focusFirst: true,
    });
  }

  if (event.key === "Escape" && isOpen.value) {
    event.preventDefault();

    close({
      restoreFocus: true,
    });
  }
}

function handlePanelKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    event.preventDefault();
    event.stopPropagation();

    close({
      restoreFocus: true,
    });

    return;
  }

  /*
   * Pfeiltasten-Navigation nur für echte Menüs.
   * Bei type="dialog" funktioniert die normale Tab-Navigation.
   */
  if (props.type !== "menu") {
    return;
  }

  const elements = getFocusableElements();

  if (elements.length === 0) {
    return;
  }

  const activeIndex = elements.indexOf(
    document.activeElement as HTMLElement,
  );

  let nextIndex = activeIndex;

  switch (event.key) {
    case "ArrowDown":
      nextIndex = activeIndex < elements.length - 1
        ? activeIndex + 1
        : 0;
      break;

    case "ArrowUp":
      nextIndex = activeIndex > 0
        ? activeIndex - 1
        : elements.length - 1;
      break;

    case "Home":
      nextIndex = 0;
      break;

    case "End":
      nextIndex = elements.length - 1;
      break;

    default:
      return;
  }

  event.preventDefault();

  elements[nextIndex]?.focus({
    preventScroll: true,
  });
}

function handleDocumentPointerDown(event: PointerEvent) {
  if (!isOpen.value || !rootRef.value) {
    return;
  }

  const target = event.target;

  if (
    target instanceof Node
    && !rootRef.value.contains(target)
  ) {
    close();
  }
}

function handleDocumentKeydown(event: KeyboardEvent) {
  if (event.key !== "Escape" || !isOpen.value) {
    return;
  }

  event.preventDefault();

  close({
    restoreFocus: true,
  });
}

onMounted(() => {
  const root = rootRef.value;
  const panel = panelRef.value;

  if (!root || !panel) {
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  gsapContext = gsap.context(() => {
    gsap.set(panel, {
      autoAlpha: 0,
      y: prefersReducedMotion ? 0 : -12,
      scale: prefersReducedMotion ? 1 : 0.9,
      pointerEvents: "none",
      transformOrigin: props.align === "end"
        ? "top right"
        : "top left",
    });

    timeline = gsap.timeline({
      paused: true,

      onComplete() {
        gsap.set(panel, {
          willChange: "auto",
        });
      },

      onReverseComplete() {
        gsap.set(panel, {
          pointerEvents: "none",
          willChange: "auto",
        });
      },
    });

    const duration = prefersReducedMotion
      ? 0.01
      : props.duration;

    timeline
    // Nur Bewegung und Größe bekommen die Elastic-Ease
      .to(
        panel,
        {
          y: 0,
          scale: 1,
          force3D: true,
          duration,

          ease: prefersReducedMotion
            ? "none"
            : props.openEase,

          easeReverse: prefersReducedMotion
            ? "none"
            : props.closeEase,
        },
        0,
      )

    // Deckkraft wird separat und ohne Überschwingen animiert
      .to(
        panel,
        {
          autoAlpha: 1,
          duration: 0.3,

          ease: prefersReducedMotion
            ? "none"
            : "power3.out",

          easeReverse: prefersReducedMotion
            ? "none"
            : "power2.in",
        },
        0,
      );
  }, root);

  document.addEventListener(
    "pointerdown",
    handleDocumentPointerDown,
    true,
  );

  document.addEventListener(
    "keydown",
    handleDocumentKeydown,
  );
});

watch(
  () => route.fullPath,
  () => {
    if (
      props.closeOnRouteChange
      && isOpen.value
    ) {
      close();
    }
  },
);

onBeforeUnmount(() => {
  document.removeEventListener(
    "pointerdown",
    handleDocumentPointerDown,
    true,
  );

  document.removeEventListener(
    "keydown",
    handleDocumentKeydown,
  );

  gsapContext?.revert();

  gsapContext = null;
  timeline = null;
});

defineExpose({
  open,
  close,
  toggle,
});
</script>

<style scoped>
.gsap-dropdown-panel {
  /*
   * Verhindert ein kurzes sichtbares Aufblitzen,
   * bevor onMounted und GSAP ausgeführt wurden.
   */
  transform: translate3d(0, -0.75rem, 0) scale(0.9);
}
</style>

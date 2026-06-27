<template>
  <component
    :is="isLink ? NuxtLink : 'button'"
    :ref="setControlRef"
    v-bind="$attrs"
    :to="props.to"
    :type="isLink ? undefined : props.type"
    :disabled="isLink ? undefined : props.disabled"
    :aria-disabled="isLink && props.disabled ? 'true' : undefined"
    :tabindex="isLink && props.disabled ? -1 : undefined"
    class="magnetic-button"
    @click="handleClick"
    @focus="handleFocus"
  >
    <span ref="contentRef" class="magnetic-button-content">
      <slot />
    </span>
  </component>
</template>

<script setup lang="ts">
import type { ComponentPublicInstance } from "vue";
import type { RouteLocationRaw } from "vue-router";
import { gsap } from "gsap";
import { NuxtLink } from "#components";

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<{
  to?: RouteLocationRaw;
  mode?: MagneticMode;
  type?: ButtonType;
  disabled?: boolean;
  strength?: number;
  activationDistance?: number;
  moveDuration?: number;
  returnDuration?: number;
  moveEase?: string;
  returnEase?: string;
}>(), {
  to: undefined,
  mode: "attract",
  type: "button",
  disabled: false,
  strength: 28,
  activationDistance: 90,
  moveDuration: 0.28,
  returnDuration: 0.7,
  moveEase: "power2.out",
  returnEase: "elastic.out(1, 0.4)",
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

type MagneticMode = "attract" | "repel";
type ButtonType = "button" | "submit" | "reset";
type QuickToFunction = ReturnType<typeof gsap.quickTo>;

const buttonRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);

const isLink = computed(() => props.to !== undefined);

function setControlRef(value: Element | ComponentPublicInstance | null) {
  if (value instanceof HTMLElement) {
    buttonRef.value = value;
    return;
  }

  if (value && "$el" in value && value.$el instanceof HTMLElement) {
    buttonRef.value = value.$el;
    return;
  }

  buttonRef.value = null;
}

let contentXTo: QuickToFunction | null = null;
let contentYTo: QuickToFunction | null = null;

const clamp = gsap.utils.clamp(0, 1);

let xTo: QuickToFunction | null = null;
let yTo: QuickToFunction | null = null;
let returnTween: ReturnType<typeof gsap.to> | null = null;

let reducedMotionQuery: MediaQueryList | null = null;
let finePointerQuery: MediaQueryList | null = null;

let isTracking = false;

function canAnimate() {
  return !props.disabled && finePointerQuery?.matches === true && reducedMotionQuery?.matches !== true;
}

function readPosition(element: HTMLElement, property: "x" | "y") {
  const value = gsap.getProperty(element, property);

  return Number.parseFloat(String(value)) || 0;
}

function getAnchorMetrics(button: HTMLElement) {
  const rect = button.getBoundingClientRect();
  const currentX = readPosition(button, "x");
  const currentY = readPosition(button, "y");

  const left = rect.left - currentX;
  const top = rect.top - currentY;

  return {
    centerX: left + rect.width / 2,
    centerY: top + rect.height / 2,
    radius: Math.max(rect.width, rect.height) / 2 + props.activationDistance,
  };
}

function handleClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }

  emit("click", event);
}

function createMovementTweens() {
  const button = buttonRef.value;
  const content = contentRef.value;

  if (!button || !content) {
    return;
  }

  returnTween?.kill();
  returnTween = null;

  xTo?.tween.kill();
  yTo?.tween.kill();
  contentXTo?.tween.kill();
  contentYTo?.tween.kill();

  xTo = gsap.quickTo(button, "x", {
    duration: props.moveDuration,
    ease: props.moveEase,
  });

  yTo = gsap.quickTo(button, "y", {
    duration: props.moveDuration,
    ease: props.moveEase,
  });

  contentXTo = gsap.quickTo(content, "x", {
    duration: props.moveDuration,
    ease: props.moveEase,
  });

  contentYTo = gsap.quickTo(content, "y", {
    duration: props.moveDuration,
    ease: props.moveEase,
  });
}

function stopMovementTweens() {
  xTo?.tween.kill();
  yTo?.tween.kill();
  contentXTo?.tween.kill();
  contentYTo?.tween.kill();

  xTo = null;
  yTo = null;
  contentXTo = null;
  contentYTo = null;
}

function startTracking() {
  const button = buttonRef.value;
  const content = contentRef.value;

  if (!button || !content) {
    return;
  }

  isTracking = true;
  createMovementTweens();

  gsap.set([button, content], {
    willChange: "transform",
  });
}

function resetButton(immediate = false) {
  const button = buttonRef.value;
  const content = contentRef.value;

  if (!button || !content) {
    return;
  }

  isTracking = false;

  stopMovementTweens();

  returnTween?.kill();
  returnTween = null;

  if (immediate) {
    gsap.set([button, content], {
      x: 0,
      y: 0,
      willChange: "auto",
    });

    return;
  }

  returnTween = gsap.to([button, content], {
    x: 0,
    y: 0,
    duration: props.returnDuration,
    ease: props.returnEase,
    overwrite: "auto",
    onComplete() {
      gsap.set([button, content], {
        willChange: "auto",
      });

      returnTween = null;
    },
  });
}

function getTargetPosition(deltaX: number, deltaY: number, distance: number, radius: number) {
  if (distance < 0.5) {
    return {
      x: 0,
      y: 0,
    };
  }

  const directionX = deltaX / distance;
  const directionY = deltaY / distance;
  const proximity = 1 - clamp(distance / radius);

  if (props.mode === "attract") {
    const force = props.strength * proximity;

    return {
      x: directionX * force,
      y: directionY * force,
    };
  }

  const force = props.strength * Math.sin(proximity * Math.PI);

  return {
    x: -directionX * force,
    y: -directionY * force,
  };
}

function handlePointerMove(event: PointerEvent) {
  const button = buttonRef.value;

  if (!button || event.pointerType === "touch") {
    return;
  }

  if (button.matches(":focus-visible")) {
    if (isTracking) {
      resetButton();
    }

    return;
  }

  if (!canAnimate()) {
    if (isTracking) {
      resetButton(true);
    }

    return;
  }

  const {
    centerX,
    centerY,
    radius,
  } = getAnchorMetrics(button);

  const deltaX = event.clientX - centerX;
  const deltaY = event.clientY - centerY;
  const distance = Math.hypot(deltaX, deltaY);

  if (distance > radius) {
    if (isTracking) {
      resetButton();
    }

    return;
  }

  if (!isTracking) {
    startTracking();
  }

  const position = getTargetPosition(
    deltaX,
    deltaY,
    distance,
    radius,
  );

  xTo?.(position.x);
  yTo?.(position.y);

  const contentDirection = props.mode === "attract" ? 1 : -1;

  const contentX = gsap.utils.clamp(-12, 12, deltaX * 0.15) * contentDirection;
  const contentY = gsap.utils.clamp(-8, 8, deltaY * 0.15) * contentDirection;

  contentXTo?.(contentX);
  contentYTo?.(contentY);
}

function handleFocus() {
  requestAnimationFrame(() => {
    if (buttonRef.value?.matches(":focus-visible")) {
      resetButton();
    }
  });
}

function handleMediaChange() {
  if (!canAnimate()) {
    resetButton(true);
  }
}

function handleWindowBlur() {
  resetButton(true);
}

function handleVisibilityChange() {
  if (document.hidden) {
    resetButton(true);
  }
}

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) {
      resetButton(true);
    }
  },
);

onMounted(() => {
  reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  finePointerQuery = window.matchMedia("(any-pointer: fine)");

  reducedMotionQuery.addEventListener("change", handleMediaChange);
  finePointerQuery.addEventListener("change", handleMediaChange);

  window.addEventListener("pointermove", handlePointerMove, {
    passive: true,
  });

  window.addEventListener("blur", handleWindowBlur);
  document.addEventListener("visibilitychange", handleVisibilityChange);
});

onBeforeUnmount(() => {
  reducedMotionQuery?.removeEventListener("change", handleMediaChange);
  finePointerQuery?.removeEventListener("change", handleMediaChange);

  window.removeEventListener("pointermove", handlePointerMove);
  window.removeEventListener("blur", handleWindowBlur);
  document.removeEventListener("visibilitychange", handleVisibilityChange);

  stopMovementTweens();

  returnTween?.kill();
  returnTween = null;
});
</script>

<style scoped>
.magnetic-button {
  min-block-size: 2.75rem;
  min-inline-size: 2.75rem;
  transform: translate3d(0, 0, 0);
}

.magnetic-button-content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: inherit;
  pointer-events: none;
  transform: translate3d(0, 0, 0);
}

.magnetic-button:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 4px;
}

@media (prefers-reduced-motion: reduce) {
  .magnetic-button,
  .magnetic-button-content {
    transform: none !important;
  }
}
</style>

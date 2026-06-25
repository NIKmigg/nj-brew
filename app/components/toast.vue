<template>
  <div
    role="region"
    class="pointer-events-none fixed bottom-6 left-1/2 z-9999 w-full max-w-md -translate-x-1/2 px-4 sm:px-0"
    :aria-label="$t('toast.regionLabel')"
  >
    <TransitionGroup
      tag="div"
      appear
      :css="false"
      class="toast-stack"
      @before-enter="handleBeforeEnter"
      @enter="handleEnter"
      @leave="handleLeave"
      @enter-cancelled="handleTransitionCancelled"
      @leave-cancelled="handleTransitionCancelled"
    >
      <div
        v-for="(toast, index) in visibleToasts"
        :key="toast.id"
        :ref="element => setToastElement(toast.id, element)"
        :data-stack-index="index"
        class="toast-sheet"
        :class="{ 'pointer-events-auto': index === 0, 'pointer-events-none': index !== 0 }"
        :style="{ zIndex: MAX_VISIBLE_TOASTS - index }"
        :aria-hidden="index === 0 ? undefined : true"
        :inert="index !== 0"
        @pointerenter="index === 0 && pauseActiveTimer()"
        @pointerleave="index === 0 && resumeActiveTimer()"
        @focusin="index === 0 && pauseActiveTimer()"
        @focusout="index === 0 && resumeActiveTimer()"
      >
        <div class="alert alert-soft relative min-h-16 w-full overflow-hidden shadow-lg" :class="typeClasses[toast.type]">
          <Icon :name="typeIcons[toast.type]" class="shrink-0 text-xl" aria-hidden="true" />

          <span
            class="min-w-0 flex-1"
            :role="index === 0 ? getLiveRole(toast.type) : undefined"
            :aria-live="index === 0 ? getLiveMode(toast.type) : undefined"
            :aria-atomic="index === 0 ? 'true' : undefined"
          >
            {{ toast.message }}
          </span>

          <span
            v-if="index === 0 && queuedToastCount > 0"
            class="badge badge-sm shrink-0"
            :aria-label="$t('toast.queuedCount', { count: queuedToastCount })"
          >
            +{{ queuedToastCount }}
          </span>

          <button
            v-if="index === 0"
            type="button"
            class="btn btn-circle btn-ghost btn-sm ml-auto shrink-0"
            :aria-label="$t('toast.close', { message: toast.message })"
            @click="remove(toast.id)"
          >
            <Icon name="mdi:close" class="text-lg" aria-hidden="true" />
          </button>

          <div v-if="index === 0" class="absolute w-90 mx-auto inset-x-0 bottom-0 h-1 overflow-hidden rounded-full bg-base-content/10" aria-hidden="true">
            <div data-toast-progress class="h-full w-full origin-left bg-current opacity-40" />
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import type { ToastType } from "@shared/schemas/toast";
import type { ComponentPublicInstance } from "vue";

import { gsap } from "gsap";

const MAX_VISIBLE_TOASTS = 4;
const STACK_OFFSET = 9;

const OPEN_DURATION = 0.65;
const CLOSE_TIME_SCALE = 2.5;

const OPEN_EASE = "elastic.out(0.9, 0.45)";
const CLOSE_EASE = "power3.in";

const { toasts, remove } = useToast();

const typeClasses = {
  success: "alert-success",
  error: "alert-error",
  warning: "alert-warning",
  info: "alert-info",
} as const;

const typeIcons = {
  success: "mdi:check-circle-outline",
  error: "mdi:alert-circle-outline",
  warning: "mdi:alert-outline",
  info: "mdi:information-outline",
} as const;

const visibleToasts = computed(() => {
  return toasts.value.slice(
    0,
    MAX_VISIBLE_TOASTS,
  );
});

const activeToast = computed(() => {
  return toasts.value[0];
});

const activeTimerKey = computed(() => {
  const toast = activeToast.value;

  if (!toast) {
    return null;
  }

  return `${toast.id}:${toast.revision}`;
});

const toastElements = new Map<string, HTMLElement>();

const toastTimelines = new Map<HTMLElement, ReturnType<typeof gsap.timeline>>();

const queuedToastCount = computed(() => {
  return Math.max(0, toasts.value.length - 1);
});

let timerDelay:
  | ReturnType<typeof gsap.delayedCall>
  | null = null;

let expiryCall:
  | ReturnType<typeof gsap.delayedCall>
  | null = null;

let progressTween:
  | ReturnType<typeof gsap.to>
  | null = null;

function getLiveRole(type: ToastType) {
  return type === "error" ? "alert" : "status";
}

function getLiveMode(type: ToastType) {
  return type === "error" ? "assertive" : "polite";
}

function pauseActiveTimer() {
  timerDelay?.pause();
  expiryCall?.pause();
  progressTween?.pause();
}

function resumeActiveTimer() {
  timerDelay?.resume();
  expiryCall?.resume();
  progressTween?.resume();
}

function setToastElement(
  id: string,
  element:
    | Element
    | ComponentPublicInstance
    | null,
) {
  if (element instanceof HTMLElement) {
    toastElements.set(id, element);
  }
  else {
    toastElements.delete(id);
  }
}

function prefersReducedMotion() {
  return window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
}

function getStackState(index: number) {
  if (index === 0) {
    return {
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      opacity: 1,
    };
  }

  const rotation = index % 2 === 0 ? -0.65 : 0.65;

  return {
    x: index % 2 === 0 ? -2 : 2,
    y: -(index * STACK_OFFSET),
    scale: 1 - index * 0.035,
    rotation,
    opacity: 1,
  };
}

function createToastTimeline(element: HTMLElement, index: number) {
  toastTimelines.get(element)?.kill();

  const state = getStackState(index);
  const reducedMotion = prefersReducedMotion();

  const duration = reducedMotion
    ? 0.01
    : OPEN_DURATION;

  const timeline = gsap.timeline({
    paused: true,
  });

  timeline.fromTo(element, {
    x: state.x,
    y: state.y + 22,
    scale: state.scale * 0.9,
    rotation: state.rotation,
  }, {
    x: state.x,
    y: state.y,
    scale: state.scale,
    rotation: state.rotation,
    force3D: true,
    duration,
    ease: reducedMotion
      ? "none"
      : OPEN_EASE,
    easeReverse: reducedMotion
      ? "none"
      : CLOSE_EASE,
    immediateRender: false,
  }, 0);

  timeline.fromTo(element, {
    autoAlpha: 0,
  }, {
    autoAlpha: state.opacity,
    duration,
    ease: reducedMotion ? "none" : "power3.out",
    easeReverse: reducedMotion ? "none" : "power2.in",
    immediateRender: false,
  }, 0);

  toastTimelines.set(element, timeline);

  return timeline;
}

function handleBeforeEnter(element: Element) {
  const toastElement = element as HTMLElement;
  const index = Number(
    toastElement.dataset.stackIndex ?? 0,
  );

  const state = getStackState(index);

  toastElement.dataset.entering = "true";

  gsap.set(toastElement, {
    autoAlpha: 0,
    x: state.x,
    y: state.y + 22,
    scale: state.scale * 0.9,
    rotation: state.rotation,
    transformOrigin: "center bottom",
    willChange: "transform, opacity",
  });
}

function handleEnter(element: Element, done: () => void) {
  const toastElement = element as HTMLElement;
  const index = Number(toastElement.dataset.stackIndex ?? 0);

  const timeline = createToastTimeline(toastElement, index);

  timeline.eventCallback("onComplete", () => {
    toastElement.dataset.entering = "false";

    gsap.set(toastElement, {
      willChange: "auto",
    });

    done();
  });

  timeline.timeScale(1).play(0);
}

function handleLeave(element: Element, done: () => void) {
  const toastElement = element as HTMLElement;
  const index = Number(
    toastElement.dataset.stackIndex ?? 0,
  );

  gsap.killTweensOf(toastElement);
  toastTimelines.get(toastElement)?.kill();

  const timeline = createToastTimeline(
    toastElement,
    index,
  );

  gsap.set(toastElement, {
    pointerEvents: "none",
    willChange: "transform, opacity",
  });

  timeline.progress(1);

  timeline.eventCallback("onReverseComplete", () => {
    cleanupToastAnimation(toastElement);
    done();
  });

  timeline.timeScale(CLOSE_TIME_SCALE).reverse();
}

function handleTransitionCancelled(element: Element) {
  cleanupToastAnimation(
    element as HTMLElement,
  );
}

function cleanupToastAnimation(element: HTMLElement) {
  gsap.killTweensOf(element);

  const timeline = toastTimelines.get(element);

  timeline?.kill();
  toastTimelines.delete(element);
}

function animateStackPositions() {
  visibleToasts.value.forEach((toast, index) => {
    const element = toastElements.get(toast.id);

    if (!element || element.dataset.entering === "true") {
      return;
    }

    const state = getStackState(index);

    element.dataset.stackIndex = String(index);
    element.style.zIndex = String(
      MAX_VISIBLE_TOASTS - index,
    );

    gsap.to(element, {
      x: state.x,
      y: state.y,
      scale: state.scale,
      rotation: state.rotation,
      force3D: true,
      duration: prefersReducedMotion()
        ? 0.01
        : 0.55,
      ease: prefersReducedMotion()
        ? "none"
        : OPEN_EASE,
      overwrite: "auto",
    });

    gsap.to(element, {
      autoAlpha: state.opacity,
      duration: prefersReducedMotion() ? 0.01 : 0.18,
      ease: prefersReducedMotion() ? "none" : "power2.out",
      overwrite: "auto",
    });
  });
}

function stopActiveTimer() {
  timerDelay?.kill();
  expiryCall?.kill();
  progressTween?.kill();

  timerDelay = null;
  expiryCall = null;
  progressTween = null;
}

function startActiveTimer(
  toastId: string,
  revision: number,
) {
  const toast = activeToast.value;

  if (!toast || toast.id !== toastId || toast.revision !== revision || toast.duration <= 0)
    return;

  const element = toastElements.get(toastId);

  if (!element)
    return;

  const progressElement
    = element.querySelector<HTMLElement>(
      "[data-toast-progress]",
    );

  if (progressElement) {
    progressTween = gsap.fromTo(progressElement, {
      scaleX: 1,
    }, {
      scaleX: 0,
      transformOrigin: "left center",
      duration: toast.duration / 1000,
      ease: "none",
      overwrite: true,
    });
  }

  expiryCall = gsap.delayedCall(toast.duration / 1000, () => {
    const currentToast = activeToast.value;

    if (currentToast?.id === toastId && currentToast.revision === revision) {
      remove(toastId);
    }
  });
}

function scheduleActiveTimer() {
  stopActiveTimer();

  const toast = activeToast.value;

  if (!toast) {
    return;
  }

  const toastId = toast.id;
  const revision = toast.revision;

  const delay = prefersReducedMotion() ? 0 : OPEN_DURATION;

  timerDelay = gsap.delayedCall(delay, () => {
    startActiveTimer(toastId, revision);
  });
}

watch(activeTimerKey, async () => {
  await nextTick();

  animateStackPositions();
  scheduleActiveTimer();
}, {
  immediate: true,
  flush: "post",
});

watch(() => visibleToasts.value.map(toast => toast.id).join("|"), async () => {
  await nextTick();

  requestAnimationFrame(() => {
    animateStackPositions();
  });
}, {
  flush: "post",
});

onBeforeUnmount(() => {
  stopActiveTimer();

  for (const timeline of toastTimelines.values()) {
    timeline.kill();
  }

  for (const element of toastElements.values()) {
    gsap.killTweensOf(element);
  }

  toastTimelines.clear();
  toastElements.clear();
});
</script>

<style scoped>
.toast-stack {
  display: grid;
  width: 100%;
  align-items: end;
}

.toast-sheet {
  grid-column: 1;
  grid-row: 1;

  width: 100%;

  visibility: hidden;
  opacity: 0;

  transform: translate3d(0, 1.375rem, 0) scale(0.9);

  transform-origin: center bottom;
}
</style>

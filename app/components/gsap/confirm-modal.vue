<template>
  <Teleport to="body">
    <dialog
      ref="dialogRef"
      class="modal"
      :aria-labelledby="titleId"
      :aria-describedby="textId"
      @cancel="handleNativeCancel"
      @close="handleNativeClose"
    >
      <div ref="boxRef" class="modal-box">
        <h2 :id="titleId" class="text-lg font-bold">
          {{ t(titleKey, titleParams) }}
        </h2>

        <p :id="textId" class="whitespace-pre-line py-4">
          {{ t(textKey, textParams) }}
        </p>

        <div class="modal-action">
          <button
            ref="cancelButtonRef"
            type="button"
            class="btn"
            autofocus
            @click="cancel"
          >
            {{ t(cancelKey) }}
          </button>

          <button type="button" class="btn btn-primary" @click="confirm">
            {{ t(confirmKey) }}
          </button>
        </div>
      </div>

      <form
        ref="backdropRef"
        method="dialog"
        class="modal-backdrop"
        @submit.prevent="cancel"
      >
        <button type="submit" :aria-label="t(closeKey)">
          <span class="sr-only">
            {{ t(closeKey) }}
          </span>
        </button>
      </form>
    </dialog>
  </Teleport>
</template>

<script setup lang="ts">
import { gsap } from "gsap";

type TranslationParams = Record<string, unknown>;

const props = withDefaults(defineProps<{
  modelValue: boolean;
  titleKey: string;
  textKey: string;
  titleParams?: TranslationParams;
  textParams?: TranslationParams;
  confirmKey?: string;
  cancelKey?: string;
  closeKey?: string;
  closeOnConfirm?: boolean;
  duration?: number;
  closeTimeScale?: number;
  openEase?: string;
  closeEase?: string;
}>(), {
  titleParams: () => ({}),
  textParams: () => ({}),
  confirmKey: "global.confirm",
  cancelKey: "global.cancel",
  closeKey: "global.close",
  closeOnConfirm: true,
  duration: 0.65,
  closeTimeScale: 2.5,
  openEase: "elastic.out(0.9, 0.45)",
  closeEase: "power3.in",
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  "cancel": [];
  "confirm": [];
}>();

const { t } = useI18n();

const dialogRef = ref<HTMLDialogElement | null>(null);
const boxRef = ref<HTMLElement | null>(null);
const backdropRef = ref<HTMLFormElement | null>(null);
const cancelButtonRef = ref<HTMLButtonElement | null>(null);

const componentId = useId();
const titleId = `confirm-modal-title-${componentId}`;
const textId = `confirm-modal-text-${componentId}`;

let timeline: ReturnType<typeof gsap.timeline> | null = null;
let gsapContext: ReturnType<typeof gsap.context> | null = null;
let previouslyFocusedElement: HTMLElement | null = null;
let isUnmounting = false;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function createTimeline() {
  const dialog = dialogRef.value;
  const box = boxRef.value;
  const backdrop = backdropRef.value;

  if (!dialog || !box || !backdrop) {
    return;
  }

  const reducedMotion = prefersReducedMotion();
  const duration = reducedMotion ? 0.01 : props.duration;

  gsapContext = gsap.context(() => {
    gsap.set(box, {
      autoAlpha: 0,
      y: reducedMotion ? 0 : 18,
      scale: reducedMotion ? 1 : 0.9,
      transformOrigin: "center center",
    });

    gsap.set(backdrop, {
      autoAlpha: 0,
    });

    timeline = gsap.timeline({
      paused: true,

      onComplete() {
        gsap.set(box, {
          willChange: "auto",
        });

        gsap.set(backdrop, {
          willChange: "auto",
        });
      },

      onReverseComplete() {
        finishClosing();
      },
    });

    timeline.to(box, {
      y: 0,
      scale: 1,
      force3D: true,
      duration,
      ease: reducedMotion ? "none" : props.openEase,
      easeReverse: reducedMotion ? "none" : props.closeEase,
    }, 0);

    timeline.to(box, {
      autoAlpha: 1,
      duration,
      ease: reducedMotion ? "none" : "power3.out",
      easeReverse: reducedMotion ? "none" : "power2.in",
    }, 0);

    timeline.to(backdrop, {
      autoAlpha: 1,
      duration,
      ease: reducedMotion ? "none" : "power3.out",
      easeReverse: reducedMotion ? "none" : "power2.in",
    }, 0);
  }, dialog);
}

function openDialog() {
  const dialog = dialogRef.value;
  const box = boxRef.value;
  const backdrop = backdropRef.value;

  if (!dialog || !box || !backdrop || !timeline)
    return;

  if (!dialog.open) {
    previouslyFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    timeline.pause(0);

    dialog.showModal();
  }

  gsap.set(dialog, {
    pointerEvents: "auto",
  });

  gsap.set(box, {
    willChange: "transform, opacity",
  });

  gsap.set(backdrop, {
    willChange: "opacity",
  });

  timeline.timeScale(1).play();

  nextTick(() => {
    cancelButtonRef.value?.focus({
      preventScroll: true,
    });
  });
}

function closeDialog() {
  const dialog = dialogRef.value;
  const box = boxRef.value;
  const backdrop = backdropRef.value;

  if (!dialog?.open || !timeline) {
    return;
  }

  gsap.set(dialog, {
    pointerEvents: "none",
  });

  if (box) {
    gsap.set(box, {
      willChange: "transform, opacity",
    });
  }

  if (backdrop) {
    gsap.set(backdrop, {
      willChange: "opacity",
    });
  }

  if (timeline.progress() === 0) {
    finishClosing();
    return;
  }

  timeline.timeScale(props.closeTimeScale).reverse();
}

function finishClosing() {
  const dialog = dialogRef.value;

  if (dialog?.open) {
    dialog.close();
  }
}

function restorePreviousFocus() {
  const element = previouslyFocusedElement;

  previouslyFocusedElement = null;

  if (!element?.isConnected) {
    return;
  }

  requestAnimationFrame(() => {
    element.focus({
      preventScroll: true,
    });
  });
}

function handleNativeCancel(event: Event) {
  event.preventDefault();
  cancel();
}

function handleNativeClose() {
  timeline?.pause(0);

  if (!isUnmounting && props.modelValue) {
    emit("update:modelValue", false);
  }

  if (!isUnmounting) {
    restorePreviousFocus();
  }
}

function cancel() {
  emit("cancel");
  emit("update:modelValue", false);
}

function confirm() {
  emit("confirm");

  if (props.closeOnConfirm) {
    emit("update:modelValue", false);
  }
}

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    openDialog();
  }
  else {
    closeDialog();
  }
}, {
  flush: "post",
});

onMounted(() => {
  createTimeline();

  if (props.modelValue) {
    openDialog();
  }
});

onBeforeUnmount(() => {
  isUnmounting = true;

  timeline?.kill();
  gsapContext?.revert();

  timeline = null;
  gsapContext = null;

  if (dialogRef.value?.open) {
    dialogRef.value.close();
  }
});
</script>

<style scoped>
.modal,
.modal-box,
.modal-backdrop {
  transition: none;
}

.modal::backdrop {
  background: transparent;
}
</style>

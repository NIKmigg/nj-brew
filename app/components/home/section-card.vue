<template>
  <article
    ref="cardRef"
    class="card relative min-h-56 flex-1 cursor-pointer overflow-hidden bg-cover bg-center md:h-full md:min-h-0"
    :class="[data.background, active ? 'z-20' : 'z-0']"
    @mouseenter="emit('activate')"
    @mouseleave="emit('deactivate')"
    @focusin="emit('activate')"
    @focusout="handleFocusOut"
    @click="handleCardClick"
    @keydown.esc.stop="emit('close')"
  >
    <div class="card-body relative isolate flex min-h-56 items-center justify-center overflow-hidden px-6 py-10 text-center md:h-full md:min-h-0">
      <div ref="overlayRef" class="pointer-events-none absolute left-1/2 top-1/2 z-0 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black blur-3xl" />

      <div class="relative z-10 flex w-full max-w-md flex-col items-center">
        <button
          ref="titleRef"
          type="button"
          class="max-w-full rounded-lg bg-transparent p-2 text-center text-neutral-content outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          :aria-expanded="active"
          :aria-pressed="pinned"
          :aria-controls="detailsId"
          :aria-label="actionLabel"
          @click.stop="emit('toggle')"
        >
          <h2 class="font-old-style text-4xl font-bold">
            {{ title }}
          </h2>
        </button>

        <div
          :id="detailsId"
          ref="detailsRef"
          class="card-details w-full overflow-hidden"
          :aria-hidden="active ? undefined : true"
          :inert="!active"
        >
          <div ref="detailsContentRef" class="card-details-content flex flex-col items-center pt-5">
            <p class="text-xl text-neutral-content md:text-2xl">
              {{ t(`home.cards.${data.slug}.description`) }}
            </p>

            <NuxtLink
              v-if="data.link"
              :to="localePath(`/${data.link}`)"
              class="btn btn-primary mt-6"
              :tabindex="active ? undefined : -1"
              @click.stop
            >
              {{ t(`nav.${data.link}`) }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { HomeCardSchema } from "@shared/schemas/home-card";

import { gsap } from "gsap";

const props = defineProps<{
  data: HomeCardSchema;
  active: boolean;
  pinned: boolean;
}>();
const emit = defineEmits<{
  activate: [];
  deactivate: [];
  toggle: [];
  close: [];
}>();
const OPEN_DURATION = 1.5;
const CLOSE_TIME_SCALE = 2.5;

const OPEN_EASE = "power3.out";
const CLOSE_EASE = "power3.in";

const { t } = useI18n();
const localePath = useLocalePath();

const cardRef = ref<HTMLElement | null>(null);
const overlayRef = ref<HTMLElement | null>(null);
const titleRef = ref<HTMLButtonElement | null>(null);
const detailsRef = ref<HTMLElement | null>(null);
const detailsContentRef = ref<HTMLElement | null>(null);

const componentId = useId().replace(/[^\w-]/g, "");
const detailsId = `home-card-details-${componentId}`;

const title = computed(() => {
  return t(`home.cards.${props.data.slug}.title`);
});

const actionLabel = computed(() => {
  if (props.pinned) {
    return t("home.cards.actions.collapse", {
      title: title.value,
    });
  }

  if (props.active) {
    return t("home.cards.actions.pin", {
      title: title.value,
    });
  }

  return t("home.cards.actions.expand", {
    title: title.value,
  });
});

let timeline: ReturnType<typeof gsap.timeline> | null = null;
let context: ReturnType<typeof gsap.context> | null = null;

function createTimeline() {
  const card = cardRef.value;
  const overlay = overlayRef.value;
  const titleElement = titleRef.value;
  const details = detailsRef.value;
  const detailsContent = detailsContentRef.value;

  if (
    !card
    || !overlay
    || !titleElement
    || !details
    || !detailsContent
  ) {
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const duration = reducedMotion ? 0.01 : OPEN_DURATION;

  context = gsap.context(() => {
    gsap.set(card, {
      flexGrow: 1,
      scale: 1,
      transformOrigin: "center center",
    });

    gsap.set(titleElement, {
      y: 0,
      scale: 1,
    });

    gsap.set(details, {
      height: 0,
      overflow: "hidden",
      visibility: "visible",
    });

    gsap.set(detailsContent, {
      autoAlpha: 0,
      y: reducedMotion ? 0 : 32,
      scale: reducedMotion ? 1 : 0.96,
    });

    gsap.set(overlay, {
      autoAlpha: 0.35,
      scale: 0.35,
      transformOrigin: "center center",
    });

    timeline = gsap.timeline({
      paused: true,
      onComplete: clearWillChange,
      onReverseComplete: clearWillChange,
    });

    /*
     * Desktop:
     * Die Card wird horizontal breiter.
     *
     * Mobile:
     * Ohne feste Parent-Höhe hat flexGrow kaum Einfluss.
     * Dort wächst die Card durch die Höhe der Details.
     */
    timeline.to(card, {
      flexGrow: 2,
      scale: reducedMotion ? 1 : 1.015,
      force3D: true,
      duration,
      ease: reducedMotion ? "none" : OPEN_EASE,
      easeReverse: reducedMotion ? "none" : CLOSE_EASE,
    }, 0);

    /*
     * Der Titel bewegt sich nach oben.
     *
     * Zusätzlich wird er durch die wachsenden Details
     * automatisch im normalen Layout nach oben geschoben.
     */
    timeline.to(titleElement, {
      y: reducedMotion ? 0 : -10,
      scale: reducedMotion ? 1 : 0.98,
      force3D: true,
      duration,
      ease: reducedMotion ? "none" : OPEN_EASE,
      easeReverse: reducedMotion ? "none" : CLOSE_EASE,
    }, 0);

    /*
     * Die Details wachsen von 0 auf ihre natürliche Höhe.
     * Dadurch funktioniert die Card auch mobil ohne
     * eine fest eingestellte Höhe.
     */
    timeline.to(details, {
      height: "auto",
      duration: reducedMotion ? 0.01 : 0.65,
      ease: reducedMotion ? "none" : OPEN_EASE,
      easeReverse: reducedMotion ? "none" : CLOSE_EASE,
    }, 0.04);

    /*
     * Beschreibung und Link fliegen von unten ein.
     * Die Opacity verwendet keine Elastic-Ease.
     */
    timeline.to(detailsContent, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      force3D: true,
      duration: reducedMotion ? 0.01 : 0.4,
      ease: reducedMotion ? "none" : "power3.out",
      easeReverse: reducedMotion ? "none" : "power2.in",
    }, 0.17);

    timeline.to(overlay, {
      scale: 1.8,
      force3D: true,
      duration,
      ease: reducedMotion ? "none" : OPEN_EASE,
      easeReverse: reducedMotion ? "none" : CLOSE_EASE,
    }, 0);

    timeline.to(overlay, {
      autoAlpha: 0.55,
      duration,
      ease: reducedMotion ? "none" : "power3.out",
      easeReverse: reducedMotion ? "none" : "power2.in",
    }, 0);

    timeline.progress(props.active ? 1 : 0).pause();
  }, card);
}

function animateCard(open: boolean) {
  if (!timeline) {
    return;
  }

  setWillChange();

  if (open) {
    timeline.timeScale(1).play();
  }
  else {
    timeline.timeScale(CLOSE_TIME_SCALE).reverse();
  }
}

function getAnimationTargets() {
  return [
    cardRef.value,
    overlayRef.value,
    titleRef.value,
    detailsRef.value,
    detailsContentRef.value,
  ].filter((element): element is HTMLElement => element instanceof HTMLElement);
}

function setWillChange() {
  gsap.set(getAnimationTargets(), {
    willChange: "transform, opacity, height, flex-grow",
  });
}

function clearWillChange() {
  gsap.set(getAnimationTargets(), {
    willChange: "auto",
  });
}

function handleFocusOut(event: FocusEvent) {
  const card = cardRef.value;
  const nextTarget = event.relatedTarget;

  if (
    card
    && nextTarget instanceof Node
    && card.contains(nextTarget)
  ) {
    return;
  }

  emit("deactivate");
}

function handleCardClick(event: MouseEvent) {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return;
  }

  /*
   * Links und der Titel-Button behandeln ihren
   * eigenen Klick. Der restliche Card-Bereich
   * fixiert oder schließt die Card.
   */
  if (target.closest("a, button")) {
    return;
  }

  emit("toggle");
}

watch(
  () => props.active,
  (active) => {
    animateCard(active);
  },
  {
    flush: "post",
  },
);

onMounted(() => {
  createTimeline();
});

onBeforeUnmount(() => {
  timeline?.kill();
  context?.revert();

  timeline = null;
  context = null;
});
</script>

<style scoped>
.card-details {
  height: 0;
  overflow: hidden;
}

.card-details-content {
  visibility: hidden;
  opacity: 0;
  transform: translate3d(0, 2rem, 0) scale(0.96);
}
</style>

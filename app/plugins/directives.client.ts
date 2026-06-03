import type { DirectiveBinding } from "vue";

type RevealOptions = {
  duration?: number;
  ease?: string;
  markers?: boolean;
  stagger?: number;
  start?: string;
  toggleActions?: string;
  type?: "chars" | "words" | "lines";
  yPercent?: number;
};

type RevealElement = HTMLElement & {
  __revealCleanup?: () => void;
  __revealFrame?: number;
};

type GsapTools = {
  gsap: typeof import("gsap").default;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
  SplitText: typeof import("gsap/SplitText").default;
};

const defaultOptions = {
  duration: 0.8,
  ease: "power2.out",
  markers: false,
  stagger: 0.025,
  start: "top 85%",
  toggleActions: "play reverse play reverse",
  type: "chars",
  yPercent: 100,
} satisfies Required<RevealOptions>;

function getTargets(
  split: ReturnType<GsapTools["SplitText"]["create"]>,
  type: Required<RevealOptions>["type"],
) {
  if (type === "lines") {
    return split.lines;
  }

  if (type === "words") {
    return split.words;
  }

  return split.chars;
}

function cleanupReveal(el: RevealElement) {
  if (el.__revealFrame !== undefined) {
    cancelAnimationFrame(el.__revealFrame);
  }

  el.__revealCleanup?.();
  delete el.__revealCleanup;
  delete el.__revealFrame;
}

function createSplitReveal(
  el: RevealElement,
  binding: DirectiveBinding<RevealOptions | undefined>,
  tools: GsapTools,
  trigger: HTMLElement = el,
) {
  cleanupReveal(el);

  const options = {
    ...defaultOptions,
    ...(binding.value ?? {}),
  };

  el.__revealFrame = requestAnimationFrame(() => {
    let split: ReturnType<GsapTools["SplitText"]["create"]> | undefined;

    const context = tools.gsap.context(() => {
      split = tools.SplitText.create(el, {
        type: options.type,
      });
      const targets = getTargets(split, options.type);

      tools.gsap.set(el, {
        autoAlpha: 1,
      });

      tools.gsap.set(targets, {
        autoAlpha: 0,
        yPercent: options.yPercent,
      });

      tools.gsap.to(targets, {
        autoAlpha: 1,
        duration: options.duration,
        ease: options.ease,
        stagger: options.stagger,
        yPercent: 0,
        scrollTrigger: {
          markers: options.markers,
          start: options.start,
          toggleActions: options.toggleActions,
          trigger,
        },
      });
    }, el);

    el.__revealCleanup = () => {
      context.revert();
      split?.revert();
      tools.ScrollTrigger.refresh();
    };

    tools.ScrollTrigger.refresh();
  });
}

function createSectionReveal(
  section: RevealElement,
  binding: DirectiveBinding<RevealOptions | undefined>,
  tools: GsapTools,
) {
  cleanupReveal(section);

  section.__revealFrame = requestAnimationFrame(() => {
    const targets = section.querySelectorAll<HTMLElement>("[data-split]");

    targets.forEach((target) => {
      createSplitReveal(
        target as RevealElement,
        binding,
        tools,
        section,
      );
    });

    section.__revealCleanup = () => {
      section
        .querySelectorAll<RevealElement>("[data-split]")
        .forEach(cleanupReveal);
      tools.ScrollTrigger.refresh();
    };

    tools.ScrollTrigger.refresh();
  });
}

export default defineNuxtPlugin({
  name: "reveal-directives",
  dependsOn: ["gsap"],
  setup(nuxtApp) {
    const tools = {
      gsap: nuxtApp.$gsap,
      ScrollTrigger: nuxtApp.$ScrollTrigger,
      SplitText: nuxtApp.$SplitText,
    } as GsapTools;

    nuxtApp.vueApp.directive("split-reveal", {
      mounted(el: RevealElement, binding: DirectiveBinding<RevealOptions | undefined>) {
        createSplitReveal(el, binding, tools);
      },

      beforeUnmount(el: RevealElement) {
        cleanupReveal(el);
      },
    });

    nuxtApp.vueApp.directive("section-reveal", {
      mounted(el: RevealElement, binding: DirectiveBinding<RevealOptions | undefined>) {
        createSectionReveal(el, binding, tools);
      },

      beforeUnmount(el: RevealElement) {
        cleanupReveal(el);
      },
    });
  },
});

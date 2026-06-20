import type { DirectiveBinding } from "vue";

type RevealOptions = {
  duration?: number;
  ease?: string;
  markers?: boolean;
  stagger?: number;
  start?: string;
  toggleActions?: string;
  type?: SplitTypeOption;
  yPercent?: number;
};

type SplitType = "chars" | "words" | "lines";
type SplitTypeOption = SplitType | "char" | "word" | "line";

type SplitTargetOptions = RevealOptions & {
  aria?: "auto" | "hidden" | "none";
  charsClass?: string;
  linesClass?: string;
  mask?: SplitTypeOption;
  smartWrap?: boolean;
  tag?: string;
  wordsClass?: string;
};

type ResolvedRevealOptions = Required<Omit<RevealOptions, "type">> & {
  type: SplitType;
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
} satisfies ResolvedRevealOptions;

const splitTypeMap = {
  char: "chars",
  chars: "chars",
  line: "lines",
  lines: "lines",
  word: "words",
  words: "words",
} satisfies Record<SplitTypeOption, SplitType>;

function getTargets(
  split: ReturnType<GsapTools["SplitText"]["create"]>,
  type: SplitType,
) {
  if (type === "lines") {
    return split.lines;
  }

  if (type === "words") {
    return split.words;
  }

  return split.chars;
}

function isSplitType(value: unknown): value is SplitTypeOption {
  return typeof value === "string" && value in splitTypeMap;
}

function normalizeSplitType(type: unknown): SplitType {
  return isSplitType(type) ? splitTypeMap[type] : defaultOptions.type;
}

function parseDataValue(value: string): unknown {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  const numberValue = Number(value);

  if (!Number.isNaN(numberValue) && value !== "") {
    return numberValue;
  }

  return value.replace(/^["']|["']$/g, "");
}

function parseObjectOptions(value: string) {
  const options: Record<string, unknown> = {};
  const entries = value.replace(/^\{|\}$/g, "").split(",");

  entries.forEach((entry) => {
    const [rawKey, ...rawValue] = entry.split(":");
    const key = rawKey?.trim().replace(/^["']|["']$/g, "");
    const optionValue = rawValue.join(":").trim();

    if (!key || !optionValue) {
      return;
    }

    options[key] = parseDataValue(optionValue);
  });

  return options;
}

function parseSplitOptions(el: HTMLElement): Partial<SplitTargetOptions> {
  const rawOptions = el.dataset.split?.trim();

  if (!rawOptions) {
    return {};
  }

  if (isSplitType(rawOptions)) {
    return {
      type: rawOptions,
    };
  }

  try {
    return JSON.parse(rawOptions) as Partial<SplitTargetOptions>;
  }
  catch {
    return parseObjectOptions(rawOptions) as Partial<SplitTargetOptions>;
  }
}

function resolveOptions(
  bindingOptions: RevealOptions | undefined,
  splitOptions: Partial<SplitTargetOptions>,
) {
  return {
    ...defaultOptions,
    ...(bindingOptions ?? {}),
    ...splitOptions,
    type: normalizeSplitType(splitOptions.type ?? bindingOptions?.type),
  };
}

function getSplitTextOptions(options: ResolvedRevealOptions & Partial<SplitTargetOptions>) {
  const splitOptions: SplitText.Vars = {
    type: options.type,
  };

  if (options.aria !== undefined) {
    splitOptions.aria = options.aria;
  }

  if (options.charsClass !== undefined) {
    splitOptions.charsClass = options.charsClass;
  }

  if (options.linesClass !== undefined) {
    splitOptions.linesClass = options.linesClass;
  }

  if (options.mask !== undefined) {
    splitOptions.mask = normalizeSplitType(options.mask);
  }

  if (options.smartWrap !== undefined) {
    splitOptions.smartWrap = options.smartWrap;
  }

  if (options.tag !== undefined) {
    splitOptions.tag = options.tag;
  }

  if (options.wordsClass !== undefined) {
    splitOptions.wordsClass = options.wordsClass;
  }

  return splitOptions;
}

function cleanupReveal(el: RevealElement) {
  if (el.__revealFrame !== undefined) {
    cancelAnimationFrame(el.__revealFrame);
  }

  el.__revealCleanup?.();
  delete el.__revealCleanup;
  delete el.__revealFrame;
}

function convertNewlinesToBr(el: HTMLElement) {
  el.innerHTML = el.innerHTML.replace(/\n/g, "<br>");
}

function createSplitReveal(
  el: RevealElement,
  binding: DirectiveBinding<RevealOptions | undefined>,
  tools: GsapTools,
  trigger: HTMLElement = el,
) {
  cleanupReveal(el);

  const options = resolveOptions(binding.value, parseSplitOptions(el));

  el.__revealFrame = requestAnimationFrame(() => {
    let split: ReturnType<GsapTools["SplitText"]["create"]> | undefined;

    const context = tools.gsap.context(() => {
      convertNewlinesToBr(el);

      split = tools.SplitText.create(el, getSplitTextOptions(options));
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

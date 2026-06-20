type PageSeoOptions = {
  titleKey?: string;
  descriptionKey?: string;
  title?: MaybeRefOrGetter<string>;
  description?: MaybeRefOrGetter<string>;
  image?: MaybeRefOrGetter<string | undefined>;
  robots?: MaybeRefOrGetter<string>;
};

export function usePageSeo(options: PageSeoOptions = {}) {
  const route = useRoute();
  const { t, te } = useI18n();

  const title = computed(() => {
    const explicitTitle = options.title ? toValue(options.title) : "";
    const key = options.titleKey ?? route.meta.titleKey;

    if (explicitTitle)
      return explicitTitle;

    return typeof key === "string" && te(key) ? t(key) : t("seo.default.title");
  });

  const description = computed(() => {
    const explicitDescription = options.description ? toValue(options.description) : "";
    const key = options.descriptionKey ?? route.meta.descriptionKey;

    if (explicitDescription)
      return explicitDescription;

    return typeof key === "string" && te(key) ? t(key) : t("seo.default.description");
  });

  useSeoMeta({
    title,
    ogTitle: title,
    description,
    ogDescription: description,
    ogImage: () => toValue(options.image) ?? "/logo.webp",
    twitterCard: "summary_large_image",
    robots: () => toValue(options.robots) ?? "index, follow",
  });
}

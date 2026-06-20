type DateInput = Date | number | string | null | undefined;

const dateTimeFormatOptionsByLocale = {
  de: {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    year: "numeric",
  },
  en: {
    day: "2-digit",
    hour: "numeric",
    hour12: true,
    minute: "2-digit",
    month: "2-digit",
    year: "numeric",
  },
} satisfies Record<string, Intl.DateTimeFormatOptions>;

const intlLocaleByAppLocale = {
  de: "de-DE",
  en: "en-US",
} as const;

export function useFormatDate() {
  const { locale } = useI18n();

  function formatDateTime(value: DateInput) {
    if (!value)
      return "";

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime()))
      return "";

    const appLocale = locale.value === "en" ? "en" : "de";

    return new Intl.DateTimeFormat(
      intlLocaleByAppLocale[appLocale],
      dateTimeFormatOptionsByLocale[appLocale],
    ).format(date);
  }

  return { formatDateTime };
}

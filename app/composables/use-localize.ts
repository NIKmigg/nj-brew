import type { LocalizedString } from "@shared/schemas/i18n";

export function useLocalize() {
  const { locale } = useI18n();

  function localize(value: LocalizedString) {
    return value[locale.value as keyof LocalizedString] ?? value.de;
  }

  return { localize };
}

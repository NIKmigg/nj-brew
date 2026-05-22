// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

import "./server/lib/env";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxtjs/color-mode",
    "@nuxtjs/i18n",
    "@pinia/nuxt",
    "@vee-validate/nuxt",
    "@nuxt/fonts",
  ],
  eslint: {
    config: {
      standalone: false,
    },
  },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss() as any],
  },
  colorMode: {
    dataValue: "theme",
  },
  i18n: {
    defaultLocale: "de",
    strategy: "prefix_except_default",
    locales: [
      {
        code: "de",
        language: "de-DE",
        name: "Deutsch",
        file: "de.json",
      },
      {
        code: "en",
        language: "en-US",
        name: "English",
        file: "en.json",
      },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
  },
  fonts: {
    families: [
      {
        name: "Macondo",
        provider: "google",
      },
    ],
  },
});

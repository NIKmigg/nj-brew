import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from "pathe";

import "./server/lib/env";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  alias: {
    "@server": resolve(__dirname, "./server"),
    "@shared": resolve(__dirname, "./shared"),
  },
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

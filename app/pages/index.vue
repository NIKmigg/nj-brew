<template>
  <div>
    <div class="fixed inset-0 -z-1">
      <div
        class="home-hero-bg h-full w-full"
        :style="{
          maskImage: 'radial-gradient(ellipse at bottom, black 80%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse at bottom, black 80%, transparent 100%)',
        }"
      />
    </div>

    <section class="hero min-h-screen -mt-28 relative">
      <div class="hero-overlay bg-black/30" />
      <div class="hero-content text-neutral-content text-center">
        <div class="max-w-md">
          <h1 class="mb-5 text-5xl font-bold font-old-style">
            {{ $t("home.title") }}
          </h1>
          <p class="mb-5">
            {{ $t("home.body") }}
          </p>
          <button class="btn btn-primary">
            {{ $t("home.cta") }}
          </button>
        </div>
      </div>
    </section>
    <WaveCard class="bg-black/30" />
    <section class="bg-base-200 py-16">
      <div class="container my-auto text-center mx-auto max-w-3xl">
        <p class="text-4xl font-bold mb-4 font-old-style">
          Willkommen Reisender!
        </p>
        <p>
          In der Taverne von NJ Brew findest du die besten Rezepte für deine Braukünste.
          Egal, ob du ein erfahrener Braumeister oder ein neugieriger Anfänger bist, wir haben etwas für jeden Geschmack.
          Tauche ein in die Welt des Brauens und entdecke neue Aromen und Techniken. Prost!
        </p>
      </div>
    </section>
    <section class="relative bg-base-200 py-16">
      <div class="flex flex-col md:flex-row gap-5 min-h-125 md:h-125 max-w-7xl mx-auto">
        <HomeSectionCard
          v-for="item in items"
          :key="item.id"
          :data="item"
          :active="active === item.id"
          class="flex-1"
          @activate="active = item.id"
          @deactivate="active = null"
        />
      </div>
    </section>
    <WaveCard class="rotate-180 bg-base-100/80" />
    <section class="bg-base-100/80 py-16">
      <div class="container my-auto text-center mx-auto max-w-3xl">
        <p class="text-4xl font-bold mb-4 font-old-style">
          Der Met des Hauses
        </p>
        <p>
          Wenn Ihr Euch nicht entscheiden könnt, beginnt mit dem Favoriten unserer Gäste. Dieser klassische Honigmet vereint die natürliche Süße ausgewählter Honige mit einer ausgewogenen Gärung und einem angenehm milden Abgang.
          <br><br>
          Ein zeitloses Rezept, das seit vielen Monden die Krüge unserer Taverne füllt und bereits zahlreiche angehende Metbrauer inspiriert hat.
          <br><br>
          Vielleicht wird es auch Euer neuer Favorit.
        </p>
      </div>
      <div class="card bg-base-100 shadow-sm flex-1 max-w-xl mx-auto mt-10">
        <div class="card-body gap-3">
          <h2 class="card-title text-base">
            Rezept: Der Met des Hauses
          </h2>
          <div class="card-body p-3">
            Hier kommt noch was ;)
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { HomeCardSchema } from "@shared/schemas/home-card";
import { ref } from "vue";

const active = ref<number | null>(null);

const items: HomeCardSchema[] = [
  {
    id: 1,
    slug: "tavern",
    background: "tavern-hero-bg",
  },
  {
    id: 2,
    slug: "brewery",
    background: "brewery-hero-bg",
    link: "generator",
  },
  {
    id: 3,
    slug: "market",
    background: "market-hero-bg",
    link: "market",
  },
];
</script>

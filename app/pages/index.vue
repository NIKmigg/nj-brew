<template>
  <div>
    <section
      class="home-hero-bg hero min-h-screen -mt-28 relative"
      :style="{
        maskImage: 'radial-gradient(ellipse at bottom, black 80%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse at bottom, black 80%, transparent 100%)',
      }"
    >
      <div
        class="absolute bottom-0 left-0 w-full overflow-hidden leading-none"
      >
        <svg
          viewBox="0 0 1440 120"
          class="block w-full h-24 text-base-200"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="
            M0,40
            C100,100 200,0 300,40
            C400,80 500,10 600,50
            C700,90 800,0 900,40
            C1000,90 1100,10 1200,50
            C1300,90 1380,20 1440,40
            L1440,120
            L0,120
            Z
          "
          />
        </svg>
      </div>
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
    <section>
      <div class="container my-auto text-center mx-auto py-16 max-w-3xl">
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
    <section class="flex flex-col md:flex-row gap-5 min-h-125 md:h-125 py-16 max-w-7xl mx-auto">
      <HomeSectionCard
        v-for="item in items"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        :active="active === item.id"
        :background="item.background"
        :link="item.link"
        @activate="active = item.id"
        @deactivate="active = null"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const active = ref<number | null>(null);

const items = [
  {
    id: 1,
    title: "Taverne",
    description: "Entdecke unsere vielfältige Auswahl an Rezepten, die von traditionellen bis zu modernen Kreationen reichen. Egal, ob du ein Anfänger oder ein erfahrener Braumeister bist, hier findest du Inspiration für dein nächstes Brauprojekt.",
    background: "tavern-hero-bg",
  },
  {
    id: 2,
    title: "Brauerei",
    description: "Lerne die Kunst des Brauens kennen und entdecke die Geheimnisse hinter der Herstellung von Bier. Von der Auswahl der Zutaten bis hin zum Brauprozess bieten wir dir wertvolle Einblicke und Tipps, um dein eigenes Bier zu brauen.",
    background: "brewery-hero-bg",
    link: "generator",
  },
  {
    id: 3,
    title: "Markt",
    description: "Finde die besten Zutaten und Ausrüstung für dein Brauhobby. Unser Markt bietet eine sorgfältig ausgewählte Auswahl an Malzen, Hopfen, Hefe und Brauzubehör, damit du alles hast, was du brauchst, um dein perfektes Bier zu brauen.",
    background: "market-hero-bg",
    link: "market",
  },
];
</script>

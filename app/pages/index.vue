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

    <section v-section-reveal class="hero min-h-screen -mt-28 relative">
      <div class="hero-overlay bg-black/30" />
      <div class="hero-content text-neutral-content text-center">
        <div class="max-w-md">
          <h1 data-split class="mb-5 text-5xl font-bold font-old-style">
            {{ $t("home.title") }}
          </h1>
          <p data-split="{ type: 'word', stagger: 0.015 }" class="mb-5">
            {{ $t("home.body") }}
          </p>
          <GsapMagneticButton
            :to="localePath('/generator')"
            mode="attract"
            class="btn btn-primary"
            :strength="28"
            :activation-distance="90"
          >
            {{ $t("home.cta") }}
          </GsapMagneticButton>
        </div>
      </div>
    </section>
    <WaveCard class="bg-black/30" />
    <section v-section-reveal class="bg-base-200 py-16">
      <div class="container my-auto text-center mx-auto max-w-3xl px-4">
        <p data-split class="text-4xl font-bold mb-4 font-old-style">
          {{ $t('home.welcome') }}
        </p>
        <p data-split="{ type: 'word', stagger: 0.015 }">
          {{ $t('home.intro') }}
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
    <section v-section-reveal class="bg-base-100/80 py-16">
      <div class="container my-auto text-center mx-auto max-w-3xl px-4">
        <p data-split class="text-4xl font-bold mb-4 font-old-style">
          {{ $t('home.housemead.title') }}
        </p>
        <p data-split="{ type: 'word', stagger: 0.015 }">
          {{ $t('home.housemead.intro') }}
          <br><br>
          {{ $t('home.housemead.body') }}
          <br><br>
          {{ $t('home.housemead.outro') }}
        </p>
      </div>
      <div class="card bg-base-100 shadow-sm flex-1 max-w-xl mx-auto mt-10">
        <div class="card-body gap-3">
          <h2 class="card-title text-base">
            {{ $t('home.housemead.cardTitle') }}
          </h2>
          <div class="card-body p-3">
            {{ $t('home.housemead.cardBody') }}
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
const localePath = useLocalePath();

definePageMeta({
  titleKey: "seo.home.title",
  descriptionKey: "seo.home.description",
});

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

<template>
  <div
    class="home-hero-bg hero min-h-screen -mt-28"
    :style="{
      maskImage: 'radial-gradient(ellipse at bottom, black 80%, transparent 100%)',
      WebkitMaskImage: 'radial-gradient(ellipse at bottom, black 80%, transparent 100%)',
    }"
  >
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
  </div>
</template>

<template>
  <div
    class="relative min-h-screen overflow-hidden bg-cover bg-center bg-fixed"
    style="background-image: url('background.png')"
  >
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

    <!-- Content -->
    <div class="relative z-10">
      <section
        class="flex min-h-screen flex-col items-center justify-center px-4 text-center"
      >
        <h1 class="text-6xl font-bold text-white drop-shadow-lg">
          Viking Tavern
        </h1>

        <p class="mt-4 max-w-2xl text-lg text-zinc-200">
          Willkommen in der Methalle.
        </p>
      </section>
    </div>
  </div>
</template>

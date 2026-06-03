<template>
  <div>
    <section class="py-16">
      <div class="container my-auto text-center mx-auto max-w-3xl">
        <p class="text-4xl font-bold mb-4 font-old-style">
          Willkommen auf dem Markt!
        </p>
        <p>
          Auf dem Markt findest du eine Vielzahl von Produkten, die von talentierten Braumeistern angeboten werden. Stöbere durch die Auswahl und entdecke einzigartige Zutaten, exklusive Rezepte und handgefertigte Brauzubehör. Egal, ob du nach seltenen Hopfensorten, speziellen Malzen oder einzigartigen Hefestämmen suchst, hier wirst du fündig. Unterstütze die Braukunst und finde die perfekten Zutaten für dein nächstes Brauprojekt. Viel Spaß beim Einkaufen!
        </p>
      </div>
    </section>
    <WaveCard />
    <section class="bg-base-200 py-16">
      <div class="container my-auto text-center mx-auto max-w-7xl">
        <div class="container my-auto text-center mx-auto max-w-3xl mb-8">
          <p class="text-4xl font-bold mb-4 font-old-style">
            Stöbere durch alle Produkte...
          </p>
          <p>
            ... oder finde genau das, was du suchst! Benutze die Suche oder den Filter.
            <br>
            SDer Ladenbesitzer hat alles ordentlich sortiert, damit du schnell findest, was du brauchst.
          </p>
        </div>
        <div class="mb-8 flex justify-center">
          <label class="input input-neutral border-none w-100">
            <Icon name="mdi:magnify" class="text-xl" />
            <input
              type="search"
              required
              placeholder="Suchen..."
              class=""
            >
          </label>
          <button
            type="button"
            class="btn btn-ghost btn-circle ml-4 hover:bg-neutral"
          >
            <Icon
              name="mdi:filter"
              class="text-2xl cursor-pointer"
            />
          </button>
        </div>
        <div
          v-if="pending"
          class="flex justify-center"
        >
          <span class="loading loading-spinner loading-lg" />
        </div>

        <div
          v-else-if="error"
          class="alert alert-error"
        >
          <span>{{ error.message }}</span>
        </div>

        <div v-else class="flex flex-wrap gap-8 justify-center h-auto">
          <NuxtLink
            v-for="product in safeProducts"
            :key="product.id"
            :to="`/market/${product.slug}`"
          >
            <MarketProductCard :product="product" />
          </NuxtLink>
        </div>
      </div>
    </section>
    <WaveCard class="rotate-180 bg-base-100/80" />
    <section class="bg-base-100/80 py-16">
      <div class="container my-auto text-center mx-auto max-w-3xl">
        <p class="text-4xl font-bold mb-4 font-old-style">
          Noch Fragen?
        </p>
        <p>
          Wenn du Fragen zu einem Produkt hast oder mehr über die Braukunst erfahren möchtest, zögere nicht, uns zu kontaktieren. Unser Team steht dir gerne zur Verfügung, um dir bei deinen Brauprojekten zu helfen und dich mit Rat und Tat zu unterstützen. Kontaktiere uns einfach über unser Kontaktformular oder sende uns eine E-Mail. Wir freuen uns darauf, von dir zu hören und dir bei deinem Brauabenteuer zu helfen!
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { SelectProductSchema } from "@shared/schemas/product";

const toast = useToast();

definePageMeta({
  middleware: "auth",
});

const {
  data: products,
  pending,
  error,
  refresh,
} = await useFetch<SelectProductSchema[]>("/api/products");

const safeProducts = computed(
  () => products.value ?? [],
);

let interval: ReturnType<typeof setInterval>;

onMounted(() => {
  toast.show("Der Markt wird umgebaut! Einige Funktionen könnten vorübergehend nicht verfügbar sein.", "warning", 9000);
  interval = setInterval(() => {
    refresh();
  }, 60_000);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

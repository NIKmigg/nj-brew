<template>
  <form
    class="space-y-6"
    @submit="onSubmit"
  >
    <div>
      <label class="block mb-1 font-medium">
        Name
      </label>

      <input
        v-model="name"
        v-bind="nameAttrs"
        type="text"
        class="w-full border rounded px-3 py-2"
      >

      <p
        v-if="errors.name"
        class="text-red-500 text-sm mt-1"
      >
        {{ errors.name }}
      </p>
    </div>

    <div>
      <label class="block mb-1 font-medium">
        Beschreibung
      </label>

      <textarea
        v-model="description"
        v-bind="descriptionAttrs"
        class="w-full border rounded px-3 py-2"
        rows="5"
      />

      <p
        v-if="errors.description"
        class="text-red-500 text-sm mt-1"
      >
        {{ errors.description }}
      </p>
    </div>

    <div>
      <label class="block mb-1 font-medium">
        Preis
      </label>

      <input
        v-model="price"
        v-bind="priceAttrs"
        type="number"
        step="0.01"
        min="0"
        class="w-full border rounded px-3 py-2"
      >

      <p
        v-if="errors.price"
        class="text-red-500 text-sm mt-1"
      >
        {{ errors.price }}
      </p>
    </div>

    <div>
      <label class="block mb-1 font-medium">
        Lagerbestand
      </label>

      <input
        v-model="stock"
        v-bind="stockAttrs"
        type="number"
        min="0"
        class="w-full border rounded px-3 py-2"
      >

      <p
        v-if="errors.stock"
        class="text-red-500 text-sm mt-1"
      >
        {{ errors.stock }}
      </p>
    </div>

    <div>
      <label class="block mb-1 font-medium">
        Bild URL
      </label>

      <input
        v-model="imageUrl"
        v-bind="imageUrlAttrs"
        type="text"
        class="w-full border rounded px-3 py-2"
      >

      <p
        v-if="errors.imageUrl"
        class="text-red-500 text-sm mt-1"
      >
        {{ errors.imageUrl }}
      </p>
    </div>

    <button
      type="submit"
      :disabled="isLoading"
      class="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
    >
      {{ isLoading ? "Speichern..." : "Produkt speichern" }}
    </button>
  </form>
</template>

<script setup lang="ts">
import type { InsertProductSchema } from "@shared/schemas/product";
import { insertProductSchema } from "@shared/schemas/product";

import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";

const props = defineProps<{
  initialValues?: Partial<InsertProductSchema>;
}>();

const emit = defineEmits<{
  submitted: [];
}>();

const { $csrfFetch } = useNuxtApp();

const isLoading = ref(false);

const validationSchema = toTypedSchema(insertProductSchema);

const { defineField, handleSubmit, errors, resetForm } = useForm({
  validationSchema,

  initialValues: {
    name: props.initialValues?.name ?? "",
    description: props.initialValues?.description ?? "",
    price: props.initialValues?.price ?? 0,
    stock: props.initialValues?.stock ?? 1,
    imageUrl: props.initialValues?.imageUrl ?? "",
  },
});

const [name, nameAttrs] = defineField("name");
const [description, descriptionAttrs] = defineField("description");
const [price, priceAttrs] = defineField("price");
const [stock, stockAttrs] = defineField("stock");
const [imageUrl, imageUrlAttrs] = defineField("imageUrl");

const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true;

    await $csrfFetch("/api/products", {
      method: "POST",
      body: {
        ...values,

        imageUrl: values.imageUrl
          ? `/products/${values.imageUrl}`
          : null,
      },
    });

    emit("submitted");

    resetForm();
  }
  catch (error) {
    console.error(error);
  }
  finally {
    isLoading.value = false;
  }
});
</script>

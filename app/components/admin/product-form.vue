<template>
  <form class="space-y-4" @submit.prevent="onSubmit">
    <div>
      <label class="block mb-1 font-medium">
        Name
      </label>

      <input
        v-model="name"
        type="text"
        class="w-full border rounded px-3 py-2"
      >

      <p
        v-if="errors.name"
        class="text-sm text-red-500 mt-1"
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
        class="w-full border rounded px-3 py-2"
      />

      <p
        v-if="errors.description"
        class="text-sm text-red-500 mt-1"
      >
        {{ errors.description }}
      </p>
    </div>

    <div>
      <label class="block mb-1 font-medium">
        Preis
      </label>

      <input
        v-model.number="price"
        type="number"
        step="0.01"
        class="w-full border rounded px-3 py-2"
      >

      <p
        v-if="errors.price"
        class="text-sm text-red-500 mt-1"
      >
        {{ errors.price }}
      </p>
    </div>

    <div>
      <label class="block mb-1 font-medium">
        Lagerbestand
      </label>

      <input
        v-model.number="stock"
        type="number"
        class="w-full border rounded px-3 py-2"
      >

      <p
        v-if="errors.stock"
        class="text-sm text-red-500 mt-1"
      >
        {{ errors.stock }}
      </p>
    </div>

    <button
      type="submit"
      :disabled="loading"
      class="btn btn-primary w-full"
    >
      {{ loading ? "Speichern..." : "Produkt anlegen" }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { insertProductSchema } from "@shared/schemas/product";
import { toTypedSchema } from "@vee-validate/zod";

import { useForm } from "vee-validate";

const emit = defineEmits<{
  created: [];
}>();

const { $csrfFetch } = useNuxtApp();

const loading = ref(false);

const {
  defineField,
  errors,
  handleSubmit,
  resetForm,
  setErrors,
} = useForm({
  validationSchema: toTypedSchema(insertProductSchema),
  initialValues: {
    name: "",
    description: "",
    price: 0,
    stock: 0,
  },
});

const [name] = defineField("name");
const [description] = defineField("description");
const [price] = defineField("price");
const [stock] = defineField("stock");

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;

  try {
    await $csrfFetch("/api/products", {
      method: "POST",
      body: values,
    });

    resetForm();

    emit("created");
  }
  catch (error: any) {
    // Backend Validation Errors übernehmen
    if (error?.data?.data) {
      setErrors(error.data.data);
    }
    else {
      console.error(error);
    }
  }
  finally {
    loading.value = false;
  }
});
</script>

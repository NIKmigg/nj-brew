<template>
  <form
    class="space-y-6"
    @submit="onSubmit"
  >
    <div>
      <label class="block mb-1 font-medium" for="product-name-de">
        {{ $t("admin.product.nameDe") }}
      </label>

      <input
        v-bind="nameDeAttrs"
        id="product-name-de"
        v-model="nameDe"
        type="text"
        class="w-full border rounded px-3 py-2"
        :aria-invalid="errors['name.de'] ? 'true' : 'false'"
      >

      <p
        v-if="errors['name.de']"
        class="text-red-500 text-sm mt-1"
      >
        {{ errors["name.de"] }}
      </p>
    </div>

    <div>
      <label class="block mb-1 font-medium" for="product-name-en">
        {{ $t("admin.product.nameEn") }}
      </label>

      <input
        v-bind="nameEnAttrs"
        id="product-name-en"
        v-model="nameEn"
        type="text"
        class="w-full border rounded px-3 py-2"
        :aria-invalid="errors['name.en'] ? 'true' : 'false'"
      >

      <p
        v-if="errors['name.en']"
        class="text-red-500 text-sm mt-1"
      >
        {{ errors["name.en"] }}
      </p>
    </div>

    <div>
      <label class="block mb-1 font-medium" for="product-description-de">
        {{ $t("admin.product.descriptionDe") }}
      </label>

      <textarea
        v-bind="descriptionDeAttrs"
        id="product-description-de"
        v-model="descriptionDe"
        class="w-full border rounded px-3 py-2"
        rows="5"
        :aria-invalid="errors['description.de'] ? 'true' : 'false'"
      />

      <p
        v-if="errors['description.de']"
        class="text-red-500 text-sm mt-1"
      >
        {{ errors["description.de"] }}
      </p>
    </div>

    <div>
      <label class="block mb-1 font-medium" for="product-description-en">
        {{ $t("admin.product.descriptionEn") }}
      </label>

      <textarea
        v-bind="descriptionEnAttrs"
        id="product-description-en"
        v-model="descriptionEn"
        class="w-full border rounded px-3 py-2"
        rows="5"
        :aria-invalid="errors['description.en'] ? 'true' : 'false'"
      />

      <p
        v-if="errors['description.en']"
        class="text-red-500 text-sm mt-1"
      >
        {{ errors["description.en"] }}
      </p>
    </div>

    <div>
      <label class="block mb-1 font-medium" for="product-price">
        {{ $t("admin.product.price") }}
      </label>

      <input
        v-bind="priceAttrs"
        id="product-price"
        v-model="price"
        type="number"
        step="0.01"
        min="0"
        class="w-full border rounded px-3 py-2"
        :aria-invalid="errors.price ? 'true' : 'false'"
      >

      <p
        v-if="errors.price"
        class="text-red-500 text-sm mt-1"
      >
        {{ errors.price }}
      </p>
    </div>

    <div>
      <label class="block mb-1 font-medium" for="product-stock">
        {{ $t("admin.product.stock") }}
      </label>

      <input
        v-bind="stockAttrs"
        id="product-stock"
        v-model="stock"
        type="number"
        min="0"
        class="w-full border rounded px-3 py-2"
        :aria-invalid="errors.stock ? 'true' : 'false'"
      >

      <p
        v-if="errors.stock"
        class="text-red-500 text-sm mt-1"
      >
        {{ errors.stock }}
      </p>
    </div>

    <div>
      <label class="block mb-1 font-medium" for="product-image-url">
        {{ $t("admin.product.imageUrl") }}
      </label>

      <input
        v-bind="imageUrlAttrs"
        id="product-image-url"
        v-model="imageUrl"
        type="text"
        class="w-full border rounded px-3 py-2"
        :aria-invalid="errors.imageUrl ? 'true' : 'false'"
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
      {{ isLoading ? $t("admin.product.saving") : $t("admin.product.save") }}
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
    name: props.initialValues?.name ?? { de: "", en: "" },
    description: props.initialValues?.description ?? { de: "", en: "" },
    price: props.initialValues?.price ?? 0,
    stock: props.initialValues?.stock ?? 1,
    imageUrl: props.initialValues?.imageUrl ?? "",
  },
});

const [nameDe, nameDeAttrs] = defineField("name.de");
const [nameEn, nameEnAttrs] = defineField("name.en");
const [descriptionDe, descriptionDeAttrs] = defineField("description.de");
const [descriptionEn, descriptionEnAttrs] = defineField("description.en");
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

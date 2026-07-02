import { z } from "zod";

export const addressSchema = z.object({
  firstName: z.string().min(1, { error: "checkout.validation.firstNameRequired" }),
  lastName: z.string().min(1, { error: "checkout.validation.lastNameRequired" }),
  email: z.email({ error: "checkout.validation.emailInvalid" }).min(1, { error: "checkout.validation.emailRequired" }),
  street: z.string().min(1, { error: "checkout.validation.streetRequired" }),
  houseNumber: z.string().min(1, { error: "checkout.validation.houseNumberRequired" }),
  postalCode: z.string().min(1, { error: "checkout.validation.postalCodeRequired" }),
  city: z.string().min(1, { error: "checkout.validation.cityRequired" }),
  country: z.string().min(1, { error: "checkout.validation.countryRequired" }),
});

export type Address = z.infer<typeof addressSchema>;

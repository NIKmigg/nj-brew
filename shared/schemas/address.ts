import { z } from "zod";

export const addressSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  street: z.string().min(1),
  houseNumber: z.string().min(1),
  postalCode: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
});

export type Address = z.infer<typeof addressSchema>;

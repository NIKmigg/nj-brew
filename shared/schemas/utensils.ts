import { z } from "zod";

export const utensilSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  icon: z.string(),
  to: z.string().optional(),
});

export type Utensil = z.infer<typeof utensilSchema>;

export const utensils = [
  { title: "Gärballon", icon: "mdi:bottle-tonic", to: "/market/gaerballon" },
  { title: "Braupaddel", icon: "mdi:spade", to: "/market/brau-paddel" },
  { title: "Messbecher", icon: "mdi:cup" },
  { title: "Feinwaage", icon: "mdi:scale" },
  { title: "Desinfizierendes Reinigungsmittel", icon: "mdi:spray-bottle" },
  {
    title: "Trichter",
    subtitle: "optional, zum einfachen Befüllen",
    icon: "mdi:filter-outline",
  },
  {
    title: "Gärglocke",
    subtitle: "falls nicht am Gärballon vorhanden",
    icon: "mdi:bell-outline",
  },
  {
    title: "Refraktometer",
    subtitle: "zum Bestimmen des Brix-Wertes",
    icon: "mdi:ruler",
  },
] satisfies Utensil[];

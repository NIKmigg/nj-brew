import { z } from "zod";

export const utensilSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  icon: z.string(),
  to: z.string().optional(),
});

export type Utensil = z.infer<typeof utensilSchema>;

export const utensils = [
  {
    title: "generator.utensils.fermentationBalloonTitle",
    icon: "mdi:bottle-tonic",
    to: "/market/gaerballon",
  },
  {
    title: "generator.utensils.brewingPaddleTitle",
    icon: "mdi:spade",
    to: "/market/brau-paddel",
  },
  {
    title: "generator.utensils.measuringCupTitle",
    icon: "mdi:cup",
  },
  {
    title: "generator.utensils.precisionScaleTitle",
    icon: "mdi:scale",
  },
  {
    title: "generator.utensils.sanitizingCleanerTitle",
    icon: "mdi:spray-bottle",
  },
  {
    title: "generator.utensils.funnelTitle",
    subtitle: "generator.utensils.funnelSubtitle",
    icon: "mdi:filter-outline",
  },
  {
    title: "generator.utensils.airlockTitle",
    subtitle: "generator.utensils.airlockSubtitle",
    icon: "mdi:bell-outline",
  },
  {
    title: "generator.utensils.refractometerTitle",
    subtitle: "generator.utensils.refractometerSubtitle",
    icon: "mdi:ruler",
  },
] satisfies Utensil[];

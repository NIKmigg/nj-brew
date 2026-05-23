import { z } from "zod";

export const meadRecipeInputSchema = z.object({
  targetVolumeL: z.number({ error: "generator.targetVolumeError" }).positive({ error: "generator.targetVolumeError" }),
  waterHardness_dH: z.number().min(0).optional(),
  useTannin: z.boolean().optional(),
});

export const meadRecipeOutputSchema = z.object({
  honey_g: z.number().positive(),
  water_L: z.number().positive(),
  yeast_g: z.number().positive(),
  nutrient_g: z.number().positive(),
  tannin_g: z.number().positive().optional(),

  estimatedABV: z.number().min(0).max(100),
  estimatedBrix: z.number().min(0),

  recommendOsmosis: z.boolean(),
  osmosisRatio: z.number().min(0).max(1).optional(),

  stepFeedHoney_g: z.number().positive(),
});

export type MeadRecipeInput = z.infer<typeof meadRecipeInputSchema>;
export type MeadRecipeOutput = z.infer<typeof meadRecipeOutputSchema>;

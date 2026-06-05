import { meadConstants } from "@server/db/schema/mead";
import { createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

export const updateMeadConstantsSchema = createUpdateSchema(meadConstants, {
  honeyPerL: field => field.positive(),
  volumePerKgHoney: field => field.positive(),
  yeastPerL: field => field.positive(),
  nutrientPerL: field => field.positive(),
  tanninPerL: field => field.positive(),
  stepFeedRatio: field => field.min(0.1).max(1),
  osmosisThreshold: field => field.positive(),
  targetHardness: field => field.positive(),
  estimatedBrix: field => field.positive(),
  estimatedAlc: field => field.positive(),
}).omit({
  id: true,
  honeyPerLDefault: true,
  volumePerKgHoneyDefault: true,
  yeastPerLDefault: true,
  nutrientPerLDefault: true,
  tanninPerLDefault: true,
  stepFeedRatioDefault: true,
  osmosisThresholdDefault: true,
  targetHardnessDefault: true,
  estimatedBrixDefault: true,
  estimatedAlcDefault: true,
  updatedAt: true,
});
export const meadConstantsSchema = createSelectSchema(meadConstants);

export type UpdateMeadConstantsSchema = z.infer<typeof updateMeadConstantsSchema>;
export type SelectMeadConstantsSchema = z.infer<typeof meadConstantsSchema>;

// --------------------------------------------------------
export const meadRecipeInputSchema = z.object({
  targetVolumeL: z.number({ error: "generator.inputs.targetVolumeError" }).positive({ error: "generator.inputs.targetVolumeError" }),
  waterHardness_dH: z.number().min(0).optional(),
  useTannin: z.boolean().optional(),
});

export const meadRecipeOutputSchema = z.object({
  honey_g: z.number().positive(),
  water_L: z.number().positive(),
  yeast_g: z.number().positive(),
  nutrient_g: z.number().positive(),
  tannin_g: z.number().positive().optional(),
  recommendOsmosis: z.boolean(),
  osmosisRatio: z.number().min(0).max(1).optional(),
  osmosisRationInPercent: z.number().min(0).max(100).optional(),
  tapWaterRatioInPercent: z.number().min(0).max(100).optional(),
  stepFeedHoney_g: z.number().positive(),
  estimatedBrix: z.number().positive(),
  estimatedAlc: z.number().positive(),
});

export type MeadRecipeInput = z.infer<typeof meadRecipeInputSchema>;
export type MeadRecipeOutput = z.infer<typeof meadRecipeOutputSchema>;

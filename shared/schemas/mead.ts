import { meadConstants } from "@server/db/schema/mead";
import { createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

export const updateMeadConstantsSchema = createUpdateSchema(meadConstants, {
  honeyPerL: field => field.min(0),

}).omit({
  id: true,
  updatedAt: true,
});

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
});

export type MeadRecipeInput = z.infer<typeof meadRecipeInputSchema>;
export type MeadRecipeOutput = z.infer<typeof meadRecipeOutputSchema>;

export const honeyPerL = 364;
export const volumePerKgHoney = 0.75;
export const yeastPerL = 0.5;
export const nutrientPerL = 0.375;
export const estimatedBrix = 26;
export const estimatedAlc = 14;

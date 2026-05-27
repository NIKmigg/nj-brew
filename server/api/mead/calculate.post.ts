import { getMeadConstants } from "@server/db/queries/mead";
import { meadRecipeInputSchema } from "@shared/schemas/mead";

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, meadRecipeInputSchema.parse);
  const c = await getMeadConstants();

  if (!c)
    throw createError({ statusCode: 500, message: "Konstanten nicht gefunden" });

  const { targetVolumeL: vol, waterHardness_dH: hardness, useTannin } = body;

  const honey_g = vol * c.honeyPerL;

  return {
    honey_g,
    water_L: vol - ((honey_g / 1000) * c.volumePerKgHoney),
    yeast_g: vol * c.yeastPerL,
    nutrient_g: vol * c.nutrientPerL,
    tannin_g: useTannin ? vol * c.tanninPerL : undefined,
    recommendOsmosis: (hardness ?? 0) > c.osmosisThreshold,
    osmosisRatio: hardness ? 1 - (c.targetHardness / hardness) : undefined,
    osmosisRationInPercent: hardness ? Math.max(0, Math.min(100, (1 - (c.targetHardness / hardness)) * 100)) : undefined,
    tapWaterRatioInPercent: hardness ? Math.max(0, Math.min(100, (c.targetHardness / hardness) * 100)) : undefined,
    stepFeedHoney_g: honey_g * c.stepFeedRatio,
    estimatedBrix: c.estimatedBrix,
    estimatedAlc: c.estimatedAlc,
  };
});

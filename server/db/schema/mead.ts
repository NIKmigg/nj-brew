import { integer, real, sqliteTable } from "drizzle-orm/sqlite-core";

export const meadConstants = sqliteTable("mead_constants", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  honeyPerL: real("honey_per_l").notNull().default(364),
  honeyPerLDefault: real("honey_per_l_default").notNull().default(364),

  volumePerKgHoney: real("volume_per_kg_honey").notNull().default(0.75),
  volumePerKgHoneyDefault: real("volume_per_kg_honey_default").notNull().default(0.75),

  yeastPerL: real("yeast_per_l").notNull().default(0.5),
  yeastPerLDefault: real("yeast_per_l_default").notNull().default(0.5),

  nutrientPerL: real("nutrient_per_l").notNull().default(0.375),
  nutrientPerLDefault: real("nutrient_per_l_default").notNull().default(0.375),

  tanninPerL: real("tannin_per_l").notNull().default(0.16),
  tanninPerLDefault: real("tannin_per_l_default").notNull().default(0.16),

  stepFeedRatio: real("step_feed_ratio").notNull().default(0.15),
  stepFeedRatioDefault: real("step_feed_ratio_default").notNull().default(0.15),

  osmosisThreshold: real("osmosis_threshold").notNull().default(15),
  osmosisThresholdDefault: real("osmosis_threshold_default").notNull().default(15),

  targetHardness: real("target_hardness").notNull().default(8),
  targetHardnessDefault: real("target_hardness_default").notNull().default(8),

  // Ideal values not used in calculation, just for information
  estimatedBrix: real("estimated_brix").notNull().default(26),
  estimatedBrixDefault: real("estimated_brix_default").notNull().default(26),
  estimatedAlc: real("estimated_alc").notNull().default(14),
  estimatedAlcDefault: real("estimated_alc_default").notNull().default(14),

  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
    .notNull(),
});

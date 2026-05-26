import { integer, real, sqliteTable } from "drizzle-orm/sqlite-core";

export const meadConstants = sqliteTable("mead_constants", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  honeyPerL: real("honey_per_l").notNull(),

  volumePerKgHoney: real("volume_per_kg_honey").notNull(),

  yeastPerL: real("yeast_per_l").notNull(),

  nutrientPerL: real("nutrient_per_l").notNull(),

  tanninPerL: real("tannin_per_l").notNull(),

  stepFeedRatio: real("step_feed_ratio").notNull(),

  osmosisThreshold: real("osmosis_threshold").notNull(),

  targetHardness: real("target_hardness").notNull(),

  // Ideal values not used in calculation, just for information
  estimatedBrix: real("estimated_brix").notNull(),
  estimatedAlc: real("estimated_alc").notNull(),

  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
    .notNull(),
});

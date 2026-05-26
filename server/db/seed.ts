import { db } from "../db";
import { meadConstants } from "./schema/mead";

await db.insert(meadConstants)
  .values({
    id: 1,
    honeyPerL: 364,
    volumePerKgHoney: 0.75,
    yeastPerL: 0.5,
    nutrientPerL: 0.375,
    tanninPerL: 0.16,
    stepFeedRatio: 0.15,
    osmosisThreshold: 15,
    targetHardness: 8,
    estimatedBrix: 26,
    estimatedAlc: 14,
  })
  .onConflictDoNothing();

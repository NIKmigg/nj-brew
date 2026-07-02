import { eq } from "drizzle-orm";
import { db } from "..";
import { meadConstants } from "../schema/mead";

export async function getMeadConstants() {
  return await db.query.meadConstants.findFirst();
}

export async function updateMeadConstants(values: Partial<typeof meadConstants.$inferInsert>) {
  return await db.update(meadConstants)
    .set(values)
    .where(eq(meadConstants.id, "default"));
}

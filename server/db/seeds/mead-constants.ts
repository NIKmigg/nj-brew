import { db } from "@server/db";
import { meadConstants } from "@server/db/schema/mead";

export async function seedMeadConstants() {
  await db.insert(meadConstants)
    .values({ id: "default" })
    .onConflictDoNothing();
}

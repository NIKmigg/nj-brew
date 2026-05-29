import { db } from "../db";
import { meadConstants } from "./schema/mead";

await db.insert(meadConstants)
  .values({ id: 1 })
  .onConflictDoNothing();

import { db } from "@server/db";
import { products } from "@server/db/schema";

export default defineEventHandler(async () => {
  return await db.select().from(products);
});

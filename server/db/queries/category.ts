import { db } from "..";
import { categories } from "../schema";

export async function findCategories() {
  return await db.select().from(categories);
}

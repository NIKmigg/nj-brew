import type { InsertProductSchema } from "~~/shared/schemas/product";
import { eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import slugify from "slugify";
import { db } from "..";
import { products } from "../schema";

export async function findProductBySlug(slug: string) {
  return await db.query.products.findFirst({
    where: eq(products.slug, slug),
  });
}

export async function createUniqueSlug(name: string) {
  const nanoid = customAlphabet(
    "abcdefghijklmnopqrstuvwxyz0123456789",
    5,
  );

  const baseSlug = slugify(name, {
    lower: true,
    strict: true,
  });

  let slug = baseSlug;

  while (await findProductBySlug(slug)) {
    slug = `${baseSlug}-${nanoid()}`;
  }

  return slug;
}

export async function insertProduct(insertable: InsertProductSchema, slug: string) {
  return await db.insert(products).values({
    ...insertable,
    slug,
  }).returning();
}

export async function findProducts() {
  return await db.query.products.findMany();
}

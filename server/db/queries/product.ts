import type { LocalizedString } from "@shared/schemas/i18n";
import type { InsertProductSchema, ProductFilters } from "@shared/schemas/product";
import { asc, desc, eq, gt, gte, like, lte } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import slugify from "slugify";
import { db } from "..";
import { products } from "../schema";

export async function findProductBySlug(slug: string) {
  return await db.query.products.findFirst({
    where: eq(products.slug, slug),
  });
}

export async function createUniqueSlug(name: LocalizedString) {
  const nanoid = customAlphabet(
    "abcdefghijklmnopqrstuvwxyz0123456789",
    5,
  );

  const baseSlug = slugify(name.de, {
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

export async function findProducts(filters: ProductFilters) {
  const orderBy = filters.sortBy === "name"
    ? filters.sortOrder === "desc" ? desc(products.name) : asc(products.name)
    : filters.sortBy === "price"
      ? filters.sortOrder === "desc" ? desc(products.price) : asc(products.price)
      : asc(products.id);

  return await db.query.products.findMany({
    with: { category: true },
    where: (table, { and }) => {
      const conditions = buildProductConditions(filters);
      return conditions.length ? and(...conditions) : undefined;
    },
    orderBy,
  });
}

function buildProductConditions(filters: ProductFilters) {
  const conditions = [];

  if (filters.search) {
    conditions.push(
      like(products.name, `%${filters.search}%`),
    );
  }
  if (filters.categoryId)
    conditions.push(eq(products.categoryId, filters.categoryId));
  if (filters.minPrice !== undefined)
    conditions.push(gte(products.price, filters.minPrice));
  if (filters.maxPrice !== undefined)
    conditions.push(lte(products.price, filters.maxPrice));

  if (filters.inStock)
    conditions.push(gt(products.stock, 0));

  return conditions;
}

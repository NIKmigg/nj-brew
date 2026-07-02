import type { LocalizedString } from "@shared/schemas/i18n";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { categories } from "./categories";

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),

  slug: text("slug").notNull().unique(),

  name: text("name", { mode: "json" }).notNull().$type<LocalizedString>(),

  description: text("description", { mode: "json" }).$type<LocalizedString>(),

  price: real("price").notNull(),

  stock: integer("stock").default(0).notNull(),

  imageUrl: text("image_url"),

  categoryId: integer("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),

  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),

  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
    .notNull(),
});

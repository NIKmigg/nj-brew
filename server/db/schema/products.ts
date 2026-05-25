import {
  index,
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

//
// PRODUCTS
//
export const products = sqliteTable("products", {
  id: integer("id").primaryKey({
    autoIncrement: true,
  }),

  slug: text("slug")
    .notNull()
    .unique(),

  name: text("name").notNull(),

  description: text("description"),

  imageUrl: text("image_url"),

  isActive: integer("is_active", {
    mode: "boolean",
  })
    .default(true)
    .notNull(),

  createdAt: integer("created_at", {
    mode: "timestamp",
  })
    .$defaultFn(() => new Date())
    .notNull(),

  updatedAt: integer("updated_at", {
    mode: "timestamp",
  })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
    .notNull(),
});

//
// PRODUCT VARIANTS
//
export const productVariants = sqliteTable(
  "product_variants",
  {
    id: integer("id").primaryKey({
      autoIncrement: true,
    }),

    productId: integer("product_id")
      .notNull()
      .references(() => products.id, {
        onDelete: "cascade",
      }),

    //
    // z.B.:
    // 5ml
    // 10ml
    // 1L
    //
    name: text("name").notNull(),

    sku: text("sku").unique(),

    price: real("price").notNull(),

    stock: integer("stock")
      .default(0)
      .notNull(),

    isDefault: integer("is_default", {
      mode: "boolean",
    })
      .default(false)
      .notNull(),
  },
  table => [
    index("pv_product_idx")
      .on(table.productId),
  ],
);

//
// CATEGORIES
//
export const categories = sqliteTable(
  "categories",
  {
    id: integer("id").primaryKey({
      autoIncrement: true,
    }),

    name: text("name").notNull(),

    slug: text("slug")
      .notNull()
      .unique(),
  },
);

//
// PRODUCT <-> CATEGORY
//
export const productCategories = sqliteTable(
  "product_categories",
  {
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, {
        onDelete: "cascade",
      }),

    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, {
        onDelete: "cascade",
      }),
  },
  table => [
    primaryKey({
      columns: [
        table.productId,
        table.categoryId,
      ],
    }),

    index("pc_product_idx")
      .on(table.productId),

    index("pc_category_idx")
      .on(table.categoryId),
  ],
);

//
// TAGS
//
export const tags = sqliteTable("tags", {
  id: integer("id").primaryKey({
    autoIncrement: true,
  }),

  name: text("name").notNull(),

  slug: text("slug")
    .notNull()
    .unique(),
});

//
// PRODUCT <-> TAGS
//
export const productTags = sqliteTable(
  "product_tags",
  {
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, {
        onDelete: "cascade",
      }),

    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, {
        onDelete: "cascade",
      }),
  },
  table => [
    primaryKey({
      columns: [
        table.productId,
        table.tagId,
      ],
    }),

    index("pt_product_idx")
      .on(table.productId),

    index("pt_tag_idx")
      .on(table.tagId),
  ],
);

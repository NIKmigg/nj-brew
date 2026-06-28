ALTER TABLE `cart` RENAME TO `carts`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_carts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_carts`("id", "user_id", "created_at", "updated_at") SELECT "id", "user_id", "created_at", "updated_at" FROM `carts`;--> statement-breakpoint
DROP TABLE `carts`;--> statement-breakpoint
ALTER TABLE `__new_carts` RENAME TO `carts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `cart_userId_idx` ON `carts` (`user_id`);--> statement-breakpoint
CREATE TABLE `__new_cart_items` (
	`id` text PRIMARY KEY NOT NULL,
	`cart_id` text NOT NULL,
	`product_id` text NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`cart_id`) REFERENCES `carts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_cart_items`("id", "cart_id", "product_id", "quantity", "created_at", "updated_at") SELECT "id", "cart_id", "product_id", "quantity", "created_at", "updated_at" FROM `cart_items`;--> statement-breakpoint
DROP TABLE `cart_items`;--> statement-breakpoint
ALTER TABLE `__new_cart_items` RENAME TO `cart_items`;--> statement-breakpoint
CREATE INDEX `cartItem_cartId_idx` ON `cart_items` (`cart_id`);--> statement-breakpoint
CREATE INDEX `cartItem_productId_idx` ON `cart_items` (`product_id`);--> statement-breakpoint
CREATE TABLE `__new_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_categories`("id", "name", "created_at") SELECT "id", "name", "created_at" FROM `categories`;--> statement-breakpoint
DROP TABLE `categories`;--> statement-breakpoint
ALTER TABLE `__new_categories` RENAME TO `categories`;--> statement-breakpoint
CREATE TABLE `__new_mead_constants` (
	`id` text PRIMARY KEY NOT NULL,
	`honey_per_l` real DEFAULT 364 NOT NULL,
	`honey_per_l_default` real DEFAULT 364 NOT NULL,
	`volume_per_kg_honey` real DEFAULT 0.75 NOT NULL,
	`volume_per_kg_honey_default` real DEFAULT 0.75 NOT NULL,
	`yeast_per_l` real DEFAULT 0.5 NOT NULL,
	`yeast_per_l_default` real DEFAULT 0.5 NOT NULL,
	`nutrient_per_l` real DEFAULT 0.375 NOT NULL,
	`nutrient_per_l_default` real DEFAULT 0.375 NOT NULL,
	`tannin_per_l` real DEFAULT 0.16 NOT NULL,
	`tannin_per_l_default` real DEFAULT 0.16 NOT NULL,
	`step_feed_ratio` real DEFAULT 0.15 NOT NULL,
	`step_feed_ratio_default` real DEFAULT 0.15 NOT NULL,
	`osmosis_threshold` real DEFAULT 15 NOT NULL,
	`osmosis_threshold_default` real DEFAULT 15 NOT NULL,
	`target_hardness` real DEFAULT 8 NOT NULL,
	`target_hardness_default` real DEFAULT 8 NOT NULL,
	`estimated_brix` real DEFAULT 26 NOT NULL,
	`estimated_brix_default` real DEFAULT 26 NOT NULL,
	`estimated_alc` real DEFAULT 14 NOT NULL,
	`estimated_alc_default` real DEFAULT 14 NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_mead_constants`("id", "honey_per_l", "honey_per_l_default", "volume_per_kg_honey", "volume_per_kg_honey_default", "yeast_per_l", "yeast_per_l_default", "nutrient_per_l", "nutrient_per_l_default", "tannin_per_l", "tannin_per_l_default", "step_feed_ratio", "step_feed_ratio_default", "osmosis_threshold", "osmosis_threshold_default", "target_hardness", "target_hardness_default", "estimated_brix", "estimated_brix_default", "estimated_alc", "estimated_alc_default", "updated_at") SELECT "id", "honey_per_l", "honey_per_l_default", "volume_per_kg_honey", "volume_per_kg_honey_default", "yeast_per_l", "yeast_per_l_default", "nutrient_per_l", "nutrient_per_l_default", "tannin_per_l", "tannin_per_l_default", "step_feed_ratio", "step_feed_ratio_default", "osmosis_threshold", "osmosis_threshold_default", "target_hardness", "target_hardness_default", "estimated_brix", "estimated_brix_default", "estimated_alc", "estimated_alc_default", "updated_at" FROM `mead_constants`;--> statement-breakpoint
DROP TABLE `mead_constants`;--> statement-breakpoint
ALTER TABLE `__new_mead_constants` RENAME TO `mead_constants`;--> statement-breakpoint
CREATE TABLE `__new_order_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` text NOT NULL,
	`product_id` text,
	`product_slug` text NOT NULL,
	`product_name` text NOT NULL,
	`unit_price` real NOT NULL,
	`quantity` integer NOT NULL,
	`line_total` real NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_order_items`("id", "order_id", "product_id", "product_slug", "product_name", "unit_price", "quantity", "line_total", "created_at") SELECT "id", "order_id", "product_id", "product_slug", "product_name", "unit_price", "quantity", "line_total", "created_at" FROM `order_items`;--> statement-breakpoint
DROP TABLE `order_items`;--> statement-breakpoint
ALTER TABLE `__new_order_items` RENAME TO `order_items`;--> statement-breakpoint
CREATE INDEX `orderItems_orderId_idx` ON `order_items` (`order_id`);--> statement-breakpoint
CREATE INDEX `orderItems_productId_idx` ON `order_items` (`product_id`);--> statement-breakpoint
CREATE TABLE `__new_products` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`price` real NOT NULL,
	`stock` integer DEFAULT 0 NOT NULL,
	`image_url` text,
	`category_id` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_products`("id", "slug", "name", "description", "price", "stock", "image_url", "category_id", "created_at", "updated_at") SELECT "id", "slug", "name", "description", "price", "stock", "image_url", "category_id", "created_at", "updated_at" FROM `products`;--> statement-breakpoint
DROP TABLE `products`;--> statement-breakpoint
ALTER TABLE `__new_products` RENAME TO `products`;--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);--> statement-breakpoint
ALTER TABLE `user` ADD `address` text;--> statement-breakpoint
ALTER TABLE `orders` ADD `billing_address` text NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `shipping_address` text NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `billing_name`;--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `billing_email`;--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `billing_street`;--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `billing_postal_code`;--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `billing_city`;--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `billing_country`;--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `shipping_name`;--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `shipping_email`;--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `shipping_street`;--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `shipping_postal_code`;--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `shipping_city`;--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `shipping_country`;
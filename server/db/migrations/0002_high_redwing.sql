ALTER TABLE `products` ADD `slug` text NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `updated_at` integer NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);
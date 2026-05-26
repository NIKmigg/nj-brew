CREATE TABLE `mead_constants` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`honey_per_l` real NOT NULL,
	`volume_per_kg_honey` real NOT NULL,
	`yeast_per_l` real NOT NULL,
	`nutrient_per_l` real NOT NULL,
	`tannin_per_l` real NOT NULL,
	`step_feed_ratio` real NOT NULL,
	`osmosis_threshold` real NOT NULL,
	`target_hardness` real NOT NULL,
	`estimated_brix` real NOT NULL,
	`estimated_alc` real NOT NULL,
	`updated_at` integer NOT NULL
);

PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_mead_constants` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
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
PRAGMA foreign_keys=ON;
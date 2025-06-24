CREATE TABLE `tag_conflicts` (
	`id` text PRIMARY KEY NOT NULL,
	`tag_id_1` text NOT NULL,
	`tag_id_2` text NOT NULL,
	`conflict_type` text NOT NULL,
	`description` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`tag_id_1`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tag_id_2`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tag_conflicts_unique_pair` ON `tag_conflicts` (`tag_id_1`,`tag_id_2`);
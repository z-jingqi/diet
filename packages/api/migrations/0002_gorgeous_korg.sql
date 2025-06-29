PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_chat_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`messages` text NOT NULL,
	`current_tags` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_chat_sessions`("id", "user_id", "title", "messages", "current_tags", "created_at", "updated_at", "deleted_at") SELECT "id", "user_id", "title", "messages", "current_tags", "created_at", "updated_at", "deleted_at" FROM `chat_sessions`;--> statement-breakpoint
DROP TABLE `chat_sessions`;--> statement-breakpoint
ALTER TABLE `__new_chat_sessions` RENAME TO `chat_sessions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_tag_conflicts` (
	`id` text PRIMARY KEY NOT NULL,
	`tag_id_1` text NOT NULL,
	`tag_id_2` text NOT NULL,
	`conflict_type` text NOT NULL,
	`description` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`tag_id_1`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id_2`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_tag_conflicts`("id", "tag_id_1", "tag_id_2", "conflict_type", "description", "created_at") SELECT "id", "tag_id_1", "tag_id_2", "conflict_type", "description", "created_at" FROM `tag_conflicts`;--> statement-breakpoint
DROP TABLE `tag_conflicts`;--> statement-breakpoint
ALTER TABLE `__new_tag_conflicts` RENAME TO `tag_conflicts`;--> statement-breakpoint
CREATE TABLE `__new_tags` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`category_id` text NOT NULL,
	`ai_prompt` text,
	`restrictions` text,
	`sort_order` integer DEFAULT 0,
	`is_active` integer DEFAULT true,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`category_id`) REFERENCES `tag_categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_tags`("id", "name", "description", "category_id", "ai_prompt", "restrictions", "sort_order", "is_active", "created_at", "updated_at") SELECT "id", "name", "description", "category_id", "ai_prompt", "restrictions", "sort_order", "is_active", "created_at", "updated_at" FROM `tags`;--> statement-breakpoint
DROP TABLE `tags`;--> statement-breakpoint
ALTER TABLE `__new_tags` RENAME TO `tags`;
CREATE TABLE `content` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`type` text(255) NOT NULL,
	`slug` text(255) NOT NULL,
	`published_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `content_id_unique` ON `content` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `content_reference` ON `content` (`type`,`slug`);--> statement-breakpoint
CREATE TABLE `content_metadata` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`key` text(255) NOT NULL,
	`value` text NOT NULL,
	`related_content_id` text(36) NOT NULL,
	FOREIGN KEY (`related_content_id`) REFERENCES `content`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `content_metadata_id_unique` ON `content_metadata` (`id`);
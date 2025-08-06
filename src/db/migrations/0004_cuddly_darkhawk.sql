ALTER TABLE "trackers" ADD COLUMN "leave_time" time NOT NULL;--> statement-breakpoint
ALTER TABLE "trackers" DROP COLUMN "start_time";--> statement-breakpoint
ALTER TABLE "trackers" DROP COLUMN "end_time";
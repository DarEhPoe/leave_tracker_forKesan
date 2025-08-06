ALTER TABLE "trackers" ADD COLUMN "totaltime" integer;--> statement-breakpoint
ALTER TABLE "trackers" DROP COLUMN "return_time";--> statement-breakpoint
ALTER TABLE "trackers" DROP COLUMN "leave_time";
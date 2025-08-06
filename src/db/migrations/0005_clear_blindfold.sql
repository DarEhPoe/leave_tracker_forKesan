ALTER TABLE "trackers" ALTER COLUMN "leave_time" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "trackers" ADD COLUMN "leave_date" date NOT NULL;--> statement-breakpoint
ALTER TABLE "trackers" ADD COLUMN "return_date" date NOT NULL;--> statement-breakpoint
ALTER TABLE "trackers" ADD COLUMN "leaveday" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "trackers" ADD COLUMN "return_time" time;
ALTER TABLE "trackers" ADD COLUMN "approved" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "trackers" ADD COLUMN "received" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "trackers" DROP COLUMN "approve";
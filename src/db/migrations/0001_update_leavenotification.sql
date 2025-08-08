-- Update leavenotification table structure
-- Drop the old notification column and add new columns
ALTER TABLE "leavenotification" DROP COLUMN IF EXISTS "notification";

-- Add new columns if they don't exist
ALTER TABLE "leavenotification" ADD COLUMN IF NOT EXISTS "full_name" varchar(255) NOT NULL DEFAULT '';
ALTER TABLE "leavenotification" ADD COLUMN IF NOT EXISTS "program" varchar(255) NOT NULL DEFAULT '';
ALTER TABLE "leavenotification" ADD COLUMN IF NOT EXISTS "travel_with" varchar(255) NOT NULL DEFAULT '';
ALTER TABLE "leavenotification" ADD COLUMN IF NOT EXISTS "description" text NOT NULL DEFAULT '';
ALTER TABLE "leavenotification" ADD COLUMN IF NOT EXISTS "leave_date" date NOT NULL DEFAULT CURRENT_DATE;
ALTER TABLE "leavenotification" ADD COLUMN IF NOT EXISTS "arrival_date" date NOT NULL DEFAULT CURRENT_DATE;

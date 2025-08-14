ALTER TABLE "leavenotification" DROP CONSTRAINT "leavenotification_program_id_employee_id_fk";
--> statement-breakpoint
ALTER TABLE "leavenotification" DROP COLUMN "program_id";
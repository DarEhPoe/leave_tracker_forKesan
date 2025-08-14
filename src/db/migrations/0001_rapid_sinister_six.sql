ALTER TABLE "leavenotification" ADD COLUMN "department_id" integer;--> statement-breakpoint
ALTER TABLE "leavenotification" ADD COLUMN "program_id" integer;--> statement-breakpoint
ALTER TABLE "leavenotification" ADD CONSTRAINT "leavenotification_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leavenotification" ADD CONSTRAINT "leavenotification_program_id_employee_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."employee"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leavenotification" DROP COLUMN "program";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { leavenotification } from "@/db/schema";
import { z } from "zod";

export const insertLeaveNotificationSchema = createInsertSchema(
  leavenotification,
  {
    notification: () => z.string().min(1, "notification is required"),
    employeeId: () =>
      z.union([z.number(), z.string().min(1, "employeeId is required")]),
  }
);

export const selectLeaveNotificationSchema = createSelectSchema(leavenotification);

export type insertLeaveNotificationSchemaType = typeof insertLeaveNotificationSchema._type;
export type selectLeaveNotificationSchemaType = typeof selectLeaveNotificationSchema._type;

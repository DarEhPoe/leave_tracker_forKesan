import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { leavenotification } from "@/db/schema";
import { z } from "zod";

export const insertLeaveNotificationSchema = createInsertSchema(
  leavenotification,
  {
    fullName: () => z.string().min(1, "Full name is required"),
    activityType: () => z.string().min(1, "Activity type is required"),
    departmentId: () => z.number(),
    travelWith: () => z.string().min(1, "Travel with is required"),
    description: () => z.string().min(1, "Description is required"),
    leaveDate: () => z.string().min(1, "Leave date is required"),
    arrivalDate: () => z.string().min(1, "Arrival date is required"),
    employeeId: () =>
      z.union([z.number(), z.string().min(1, "Employee ID is required")]),
  }
);

export const selectLeaveNotificationSchema = createSelectSchema(leavenotification);

export type insertLeaveNotificationSchemaType = typeof insertLeaveNotificationSchema._type;
export type selectLeaveNotificationSchemaType = typeof selectLeaveNotificationSchema._type;

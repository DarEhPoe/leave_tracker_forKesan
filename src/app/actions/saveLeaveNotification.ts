"use server";
import { eq } from "drizzle-orm";
import { flattenValidationErrors } from "next-safe-action";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { leavenotification } from "@/db/schema";
import { actionClient } from "@/lib/safe-action";
import {
  insertLeaveNotificationSchema,
  type insertLeaveNotificationSchemaType,
} from "@/zod-schemas/leavenotification";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const saveLeaveNotification = actionClient
  .metadata({ actionName: "saveLeaveNotificationAction" })
  .schema(insertLeaveNotificationSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({
    parsedInput: notification,
  }: {
    parsedInput: insertLeaveNotificationSchemaType;
  }) => {
    const { isAuthenticated } = getKindeServerSession();
    const isAuth = await isAuthenticated();

    if (!isAuth) redirect("/login");

    const employeeId = Number(notification.employeeId);

    if (!notification.id || notification.id === 0) {
      const inserted = await db.insert(leavenotification).values({
        fullName: notification.fullName,
        program: notification.program,
        travelWith: notification.travelWith,
        description: notification.description,
        leaveDate: notification.leaveDate,
        arrivalDate: notification.arrivalDate,
        employeeId,
      }).returning();

      return { 
        message: `Your leave notification has been created successfully`, 
        id: inserted[0]?.id,
        fullName: inserted[0]?.fullName,
        program: inserted[0]?.program,
        travelWith: inserted[0]?.travelWith,
        description: inserted[0]?.description,
        leaveDate: inserted[0]?.leaveDate,
        arrivalDate: inserted[0]?.arrivalDate,
      };
    }

    const updated = await db
      .update(leavenotification)
      .set({
        fullName: notification.fullName,
        program: notification.program,
        travelWith: notification.travelWith,
        description: notification.description,
        leaveDate: notification.leaveDate,
        arrivalDate: notification.arrivalDate,
        employeeId,
      })
      .where(eq(leavenotification.id, notification.id))
      .returning();

    return { 
      message: `Your leave notification has been updated successfully`, 
      id: notification.id,
      fullName: updated[0]?.fullName,
      program: updated[0]?.program,
      travelWith: updated[0]?.travelWith,
      description: updated[0]?.description,
      leaveDate: updated[0]?.leaveDate,
      arrivalDate: updated[0]?.arrivalDate,
    };
  });

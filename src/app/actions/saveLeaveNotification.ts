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
        notification: notification.notification,
        employeeId,
      }).returning();

      return { message: `Your leave notification has been created successfully`, id: inserted[0]?.id , notification:inserted[0]?.notification};
    }

    await db
      .update(leavenotification)
      .set({
        notification: notification.notification,
        employeeId,
      })
      .where(eq(leavenotification.id, notification.id))
      .returning();

    return { message: `Your leave notification has been updated successfully` ,id:leavenotification.id};
  });

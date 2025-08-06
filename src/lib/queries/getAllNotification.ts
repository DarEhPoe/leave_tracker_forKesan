import { db } from "@/db";
import { leavenotification, employee } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export async function getAllNotification() {
    const results = await db.select({
        id: leavenotification.id,
        notificationDate: leavenotification.createdAt,
        employeeId: leavenotification.employeeId,
        employeeName: employee.name, // Assuming `name` is a field in `employee`
        notification: leavenotification.notification,
    })
    .from(leavenotification)
    .leftJoin(employee, eq(leavenotification.employeeId, employee.id))
    .orderBy(asc(leavenotification.updatedAt));

    return results;
}

export type getAllNotificationType = Awaited<ReturnType<typeof getAllNotification>>;

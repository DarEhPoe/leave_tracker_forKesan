import {db} from "@/db"
import {leavenotification, employee, departments} from "@/db/schema"
import {eq,asc} from "drizzle-orm" 

export async function getNotification(id:number) {
    const results = await db.select({
        id: leavenotification.id,
        notificationDate: leavenotification.createdAt,
        employeeId: leavenotification.employeeId,
        employeeName: employee.name,
        fullName: leavenotification.fullName,
        program: departments.name,
        activityType: leavenotification.activityType,
        travelWith: leavenotification.travelWith,
        description: leavenotification.description,
        leaveDate: leavenotification.leaveDate,
        arrivalDate: leavenotification.arrivalDate,
        createdAt: leavenotification.createdAt,
    })
    .from(leavenotification)
    .leftJoin(employee, eq(leavenotification.employeeId, employee.id))
    .leftJoin(departments, eq(leavenotification.departmentId, departments.id))
    .where(eq(leavenotification.id, id))
    .orderBy(asc(leavenotification.updatedAt));

    return results[0];
}

export type getNotificationType = Awaited<ReturnType<typeof getNotification>>;
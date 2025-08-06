
import {db} from "@/db"
import {employee,departments} from "@/db/schema"
import {asc,eq} from "drizzle-orm"

export async function getAllEmployee() {
    const results=await db.select({
        id:employee.id,
        employeesDate:employee.createdAt,
        departmentId:employee.departmentId,
        name:employee.name,
        program:departments.name,
    })
        .from(employee)
        .leftJoin(departments, eq(employee.departmentId, departments.id))
        .orderBy(asc(employee.updatedAt))
        
    return results;
}


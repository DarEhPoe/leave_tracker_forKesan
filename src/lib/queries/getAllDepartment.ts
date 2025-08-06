
import {db} from "@/db"
import {departments} from "@/db/schema"
import {asc} from "drizzle-orm"

export async function getAllDepartment() {
    const results=await db.select({
        id:departments.id,
        departmentsDate:departments.createdAt,
        name:departments.name,
        
    })
        .from(departments)
        .orderBy(asc(departments.updatedAt))
        
    return results;
}
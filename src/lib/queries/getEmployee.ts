import {db} from "@/db"
import {employee} from "@/db/schema"
import {eq,asc} from "drizzle-orm" 

export async function getEmployee(id:number) {
    const results=await db.select()
        .from(employee)
        .where(eq(employee.id,id))
        .orderBy(asc(employee.updatedAt))

    return results[0];
}
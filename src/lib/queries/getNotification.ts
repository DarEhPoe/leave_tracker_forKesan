import {db} from "@/db"
import {leavenotification} from "@/db/schema"
import {eq,asc} from "drizzle-orm" 

export async function getNotification(id:number) {
    const results=await db.select()
        .from(leavenotification)
        .where(eq(leavenotification.id,id))
        .orderBy(asc(leavenotification.updatedAt))

    return results[0];
}
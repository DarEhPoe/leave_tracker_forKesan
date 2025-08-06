import {db} from "@/db"
import {trackertypes} from "@/db/schema"
import {eq,asc} from "drizzle-orm" 

export async function getTrackerType(id:number) {
    const results=await db.select()
        .from(trackertypes)
        .where(eq(trackertypes.id,id))
        .orderBy(asc(trackertypes.updatedAt))

    return results[0];
}
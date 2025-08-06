
import {db} from "@/db"
import {trackertypes} from "@/db/schema"
import {asc} from "drizzle-orm"

export async function getAllTrackerType() {
    const results=await db.select({
        id:trackertypes.id,
        trackertypesDate:trackertypes.createdAt,
        name:trackertypes.name,
        
    })
        .from(trackertypes)
        .orderBy(asc(trackertypes.updatedAt))
        
    return results;
}
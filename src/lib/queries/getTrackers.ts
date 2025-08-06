
import {db} from "@/db"
import {trackers} from "@/db/schema"
import {eq} from "drizzle-orm" 

export async function getTracker(id:number) {
    const tracker=await db.select()
        .from(trackers)
        .where(eq(trackers.id,id))

    return tracker[0];
}
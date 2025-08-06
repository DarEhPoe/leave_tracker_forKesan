
import { db } from "@/db";
import { trackertypes } from "@/db/schema";
import {ilike,or} from "drizzle-orm"

export async function getTrackerTypeSearchResults(searchText:string) {
    const results=await db.select({
        id:trackertypes.id,
        trackertypesDate:trackertypes.createdAt,
        name:trackertypes.name,
        

    })
    .from(trackertypes)
    .where(or(
        ilike(trackertypes.name,`%${searchText}%`)))
    .orderBy(trackertypes.updatedAt)
    return results;
    
}
export type TrackerTypeSearchResultsType=Awaited<ReturnType<typeof getTrackerTypeSearchResults>>

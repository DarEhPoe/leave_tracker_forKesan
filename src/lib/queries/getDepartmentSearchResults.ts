
import { db } from "@/db";
import { departments } from "@/db/schema";
import {ilike,or} from "drizzle-orm"

export async function getDepartmentSearchResults(searchText:string) {
    const results=await db.select({
        id:departments.id,
        departmentsDate:departments.createdAt,
        name:departments.name,
        

    })
    .from(departments)
    .where(or(
        ilike(departments.name,`%${searchText}%`)))
    .orderBy(departments.updatedAt)
    return results;
    
}
export type DepartmentSearchResultsType=Awaited<ReturnType<typeof getDepartmentSearchResults>>

import { db } from "@/db";
import { trackertypes } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function deleteTrackerTypes(id: number) {
    await db.delete(trackertypes).where(eq(trackertypes.id, id));
}

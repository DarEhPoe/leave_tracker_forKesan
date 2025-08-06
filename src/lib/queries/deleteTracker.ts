import { db } from "@/db";
import { trackers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function deleteTracker(id: number) {
    await db.delete(trackers).where(eq(trackers.id, id));
}

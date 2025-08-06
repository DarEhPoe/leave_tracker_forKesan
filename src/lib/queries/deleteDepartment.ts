import { db } from "@/db";
import { departments } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function deleteDepartment(id: number) {
    await db.delete(departments).where(eq(departments.id, id));
}

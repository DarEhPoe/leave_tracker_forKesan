import { db } from "@/db";
import { employee } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function deleteEmployee(id: number) {
    await db.delete(employee).where(eq(employee.id, id));
}

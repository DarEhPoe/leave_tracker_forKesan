import { db } from "@/db";
import { departments } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getDepartment(id: number) {
  const results = await db
    .select()
    .from(departments)
    .where(eq(departments.id, id));

  return results[0]; // Return the first (and only) matching department
}

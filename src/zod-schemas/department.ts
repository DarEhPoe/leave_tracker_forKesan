
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { departments } from "@/db/schema"

export const insertDepartmentSchema = createInsertSchema(
    departments, {
        name: (schema) => schema.min(1, "Deparment Name is required"),
        
    }
)

export const selectDepartmentSchema = createSelectSchema(departments);
export type insertDepartmentSchemaType = typeof insertDepartmentSchema._type;
export type selectDepartmentSchemaType = typeof selectDepartmentSchema._type;
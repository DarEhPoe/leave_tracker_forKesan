
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { employee } from "@/db/schema"
import {z} from "zod"

export const insertEmployeeSchema = createInsertSchema(
    employee, {
        name: (schema) => schema.min(1, "Employee is required"),
        departmentId: z
        .union([z.number(), z.string().min(1)])
        .refine((val) => val !== "" && val !== null && val !== undefined, {
          message: "Employee Name is required",
        }),
    }
)

export const selectEmployeeSchema = createSelectSchema(employee);

export type insertEmployeeSchemaType = typeof insertEmployeeSchema._type;
export type selectEmployeeSchemaType = typeof selectEmployeeSchema._type;
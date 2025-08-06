
import { trackers } from "@/db/schema";
import { createInsertSchema,createSelectSchema } from "drizzle-zod";
import {z} from "zod"

export const insertTrackerSchema = createInsertSchema(trackers, {
    id: z.union([z.number(), z.literal("(New)")]),
    employeeId: z
      .union([z.number(), z.string().min(1)])
      .refine((val) => val !== "" && val !== null && val !== undefined, {
        message: "Employee Name is required",
      }),
  
    trackertypeId: z
      .union([z.number(), z.string().min(1)])
      .refine((val) => val !== "" && val !== null && val !== undefined, {
        message: "Tracker Name is required",
      }),

      leaveday:z
      .union([z.number(), z.string().min(1)])
      .refine((val) => val !== "" && val !== null && val !== undefined, {
        message: "Total day leave is required",
      }),

      leaveDate: () =>
        z
          .string()
          .nonempty("Leave Date is required")
          .regex(
            /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
            "Invalid date format (YYYY-MM-DD)"
          )
          .refine(
            (value) => {
              const date = new Date(value);
              return !isNaN(date.getTime()) && date.toISOString().startsWith(value);
            },
            {
              message: "Invalid date",
            }
          ),

      returnDate:() =>
        z
          .string()
          .nonempty("Return Date is required")
          .regex(
            /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
            "Invalid date format (YYYY-MM-DD)"
          )
          .refine(
            (value) => {
              const date = new Date(value);
              return !isNaN(date.getTime()) && date.toISOString().startsWith(value);
            },
            {
              message: "Invalid date",
            }
          ),
      
      
    })
export const seletTrackerSchema=createSelectSchema(trackers)
export type insertTrackerSchemaType=typeof insertTrackerSchema._type;
export type selectTrackerSchemaType=typeof seletTrackerSchema._type;
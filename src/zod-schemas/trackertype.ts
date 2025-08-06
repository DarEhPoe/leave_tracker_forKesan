
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { trackertypes } from "@/db/schema"

export const insertTrackerTypeSchema = createInsertSchema(
    trackertypes, {
        name: (schema) => schema.min(1, "Name is required"),
        
    }
)

export const selectTrackerTypeSchema = createSelectSchema(trackertypes);

export type insertTrackerTypeSchemaType = typeof insertTrackerTypeSchema._type;
export type selectTrackerTypeSchemaType = typeof selectTrackerTypeSchema._type;
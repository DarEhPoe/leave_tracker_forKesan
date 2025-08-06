"use server"
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { trackers } from "@/db/schema";
import { actionClient } from "@/lib/safe-action";
import { z } from "zod";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const approveSchema = z.object({
  id: z.number(),
});

export const approveTrackerAction = actionClient
  .metadata({ actionName: "approveTrackerAction" })
  .schema(approveSchema)
  .action(async ({ parsedInput }) => {
    const { isAuthenticated } = getKindeServerSession();
    const isAuth = await isAuthenticated();
    if (!isAuth) redirect("/login");

    const result = await db
      .update(trackers)
      .set({ approved: true })
      .where(eq(trackers.id, parsedInput.id))
      .returning({ approvedId: trackers.id });

    return { message: `Tracker ID #${result[0].approvedId} approved.` };
  });

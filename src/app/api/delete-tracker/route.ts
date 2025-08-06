// app/api/delete-tracker/route.ts

import { deleteTracker } from "@/lib/queries/deleteTracker";

export async function POST(req: Request) {
  const { id } = await req.json();
  await deleteTracker(id);
  return new Response("Deleted", { status: 200 });
}

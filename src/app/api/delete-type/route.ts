// app/api/delete-tracker/route.ts

import { deleteTrackerTypes } from "@/lib/queries/deleteTrackerType";

export async function POST(req: Request) {
  const { id } = await req.json();
  await deleteTrackerTypes(id);
  return new Response("Deleted", { status: 200 });
}

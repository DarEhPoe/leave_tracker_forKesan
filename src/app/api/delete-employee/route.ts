// app/api/delete-tracker/route.ts

import { deleteEmployee } from "@/lib/queries/deleteEmployee";

export async function POST(req: Request) {
  const { id } = await req.json();
  await deleteEmployee(id);
  return new Response("Deleted", { status: 200 });
}

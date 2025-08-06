// app/api/delete-tracker/route.ts

import { deleteDepartment } from "@/lib/queries/deleteDepartment";

export async function POST(req: Request) {
  const { id } = await req.json();
  await deleteDepartment(id);
  return new Response("Deleted", { status: 200 });
}

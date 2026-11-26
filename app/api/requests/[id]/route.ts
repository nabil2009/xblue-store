import { NextResponse } from "next/server";
import { getUser, isAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase";
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!isAdmin(await getUser())) return NextResponse.json({ error: "ليس لديك صلاحية" }, { status: 403 });
  const { status } = await req.json();
  if (!["review", "accepted", "working", "done", "rejected"].includes(status)) return NextResponse.json({ error: "حالة غير صالحة" }, { status: 400 });
  const { error } = await db().from("requests").update({ status }).eq("id", params.id);
  return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json({ ok: true });
}

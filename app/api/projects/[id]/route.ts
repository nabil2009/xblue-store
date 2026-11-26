import { NextResponse } from "next/server";
import { getUser, isAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase";
const FIELDS = ["name", "image_url", "short_desc", "full_desc", "features", "requirements", "download_url", "video_url", "category", "version", "hidden"];
const pick = (b: any) => Object.fromEntries(FIELDS.filter(k => k in b).map(k => [k, b[k]]));
const deny = () => NextResponse.json({ error: "ليس لديك صلاحية" }, { status: 403 });
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!isAdmin(await getUser())) return deny();
  const b = pick(await req.json());
  if ("download_url" in b && !/^https?:\/\//.test(b.download_url)) return NextResponse.json({ error: "رابط غير صالح" }, { status: 400 });
  const { error } = await db().from("projects").update(b).eq("id", params.id);
  return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json({ ok: true });
}
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (!isAdmin(await getUser())) return deny();
  const { error } = await db().from("projects").delete().eq("id", params.id);
  return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json({ ok: true });
}

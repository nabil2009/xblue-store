import { NextResponse } from "next/server";
import { getUser, isAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase";
export async function POST(req: Request) {
  if (!isAdmin(await getUser())) return NextResponse.json({ error: "ليس لديك صلاحية" }, { status: 403 });
  const f = (await req.formData()).get("file") as File | null;
  if (!f || !f.type.startsWith("image/")) return NextResponse.json({ error: "الملف يجب أن يكون صورة" }, { status: 400 });
  if (f.size > 4 * 1024 * 1024) return NextResponse.json({ error: "الحد الأقصى 4MB" }, { status: 400 });
  const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${(f.name.split(".").pop() || "png").replace(/\W/g, "")}`;
  const s = db();
  const { error } = await s.storage.from("projects").upload(name, Buffer.from(await f.arrayBuffer()), { contentType: f.type });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ url: s.storage.from("projects").getPublicUrl(name).data.publicUrl });
}

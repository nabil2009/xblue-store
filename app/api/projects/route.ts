import { NextResponse } from "next/server";
import { getUser, isAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase";
const FIELDS = ["name", "image_url", "short_desc", "full_desc", "features", "requirements", "download_url", "video_url", "category", "version", "hidden"];
const pick = (b: any) => Object.fromEntries(FIELDS.filter(k => k in b).map(k => [k, b[k]]));
export async function POST(req: Request) {
  if (!isAdmin(await getUser())) return NextResponse.json({ error: "ليس لديك صلاحية" }, { status: 403 });
  const b = pick(await req.json());
  if (!b.name || !/^https?:\/\//.test(b.download_url || "")) return NextResponse.json({ error: "الاسم ورابط التحميل (http/https) مطلوبان" }, { status: 400 });
  const { data, error } = await db().from("projects").insert({ ...b, is_premium: false }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

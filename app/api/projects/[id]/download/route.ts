import { NextResponse } from "next/server";
import { db } from "@/lib/supabase";
export const dynamic = "force-dynamic";
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const s = db();
  const { data: p } = await s.from("projects").select("download_url,downloads").eq("id", params.id).eq("hidden", false).maybeSingle();
  if (!p || !/^https?:\/\//.test(p.download_url)) return NextResponse.redirect(new URL("/projects", req.url));
  await s.from("projects").update({ downloads: (p.downloads || 0) + 1 }).eq("id", params.id);
  return NextResponse.redirect(p.download_url);
}

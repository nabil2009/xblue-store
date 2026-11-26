import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/supabase";
import { STATUS } from "@/lib/content";
export const dynamic = "force-dynamic";
export default async function Profile() {
  const u = await getUser(); if (!u) redirect("/");
  const { data } = await db().from("requests").select("*").eq("discord_id", u.id).order("created_at", { ascending: false });
  return (
    <div className="max-w-3xl mx-auto up">
      <div className="glass !transform-none p-6 flex items-center gap-4"><img src={u.image} className="h-20 w-20 rounded-full border-2 border-pink" alt="" /><div><h1 className="text-2xl font-black">{u.name}</h1><p className="opacity-70">@{u.username}</p><p className="opacity-50 text-xs">ID: {u.id}</p></div></div>
      <h2 className="text-xl font-black mt-8 mb-3">طلباتي</h2>
      {data?.length ? <div className="space-y-3">{data.map((r: any) => <div key={r.id} className="glass !transform-none p-4 flex justify-between"><span>#{r.id} — {r.bot_name}</span><span className="text-pink">{STATUS[r.status]}</span></div>)}</div> : <p className="opacity-60">لا توجد طلبات.</p>}
    </div>
  );
}

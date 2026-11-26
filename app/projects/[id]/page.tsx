import { notFound } from "next/navigation";
import ProjectCard from "@/components/ProjectCard";
import CopyButton from "@/components/CopyButton";
import { CATS } from "@/lib/content";
import { db } from "@/lib/supabase";
export const dynamic = "force-dynamic";
const yt = (u: string) => { const m = u?.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/); return m ? `https://www.youtube.com/embed/${m[1]}` : null; };
export default async function Detail({ params }: { params: { id: string } }) {
  const { data: p } = await db().from("projects").select("*").eq("id", params.id).eq("hidden", false).maybeSingle();
  if (!p) notFound();
  const { data: sim } = await db().from("projects").select("*").eq("category", p.category).eq("hidden", false).neq("id", p.id).limit(3);
  const v = yt(p.video_url);
  return (
    <div className="up max-w-4xl mx-auto">
      {p.image_url && <img src={p.image_url} alt={p.name} className="w-full max-h-[420px] object-cover rounded-3xl border border-violet/40" />}
      <h1 className="text-4xl font-black neon mt-6">{p.name} <small className="text-sm text-white/60">v{p.version}</small></h1>
      <p className="text-pink mt-1">{CATS[p.category] || p.category} • ⬇ {p.downloads}</p>
      <p className="mt-5 whitespace-pre-line opacity-90">{p.full_desc || p.short_desc}</p>
      {p.features && <div className="glass !transform-none p-5 mt-5"><h3 className="font-black mb-2">المميزات</h3><p className="whitespace-pre-line opacity-85">{p.features}</p></div>}
      {p.requirements && <div className="glass !transform-none p-5 mt-5"><h3 className="font-black mb-2">متطلبات التشغيل</h3><p className="whitespace-pre-line opacity-85">{p.requirements}</p></div>}
      {v && <iframe src={v} className="w-full aspect-video rounded-2xl mt-5" allowFullScreen />}
      <div className="flex gap-3 mt-6 flex-wrap"><a href={`/api/projects/${p.id}/download`} className="btn">تحميل المشروع</a><CopyButton text={p.download_url} /></div>
      {!!sim?.length && <><h2 className="text-2xl font-black mt-12 mb-4">مشاريع مشابهة</h2><div className="grid sm:grid-cols-3 gap-4">{sim.map((s: any) => <ProjectCard key={s.id} p={s} />)}</div></>}
    </div>
  );
}

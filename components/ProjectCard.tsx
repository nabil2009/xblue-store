import Link from "next/link";
import { CATS } from "@/lib/content";
export default function ProjectCard({ p }: { p: any }) {
  return (
    <div className="glass overflow-hidden flex flex-col">
      {p.image_url ? <img src={p.image_url} alt={p.name} className="h-44 w-full object-cover" /> : <div className="h-44 bg-violet/20" />}
      <div className="p-5 flex flex-col gap-2 flex-1">
        <div className="flex justify-between text-xs"><span className="text-pink">{CATS[p.category] || p.category}</span><span className="opacity-60">{new Date(p.created_at).toLocaleDateString("ar")}</span></div>
        <h3 className="font-black text-lg">{p.name}</h3>
        <p className="text-sm opacity-75 flex-1">{p.short_desc}</p>
        <p className="text-xs opacity-60">⬇ {p.downloads} تحميل</p>
        <div className="flex gap-2"><a href={`/api/projects/${p.id}/download`} className="btn !py-2 flex-1 text-center">تحميل</a><Link href={`/projects/${p.id}`} className="btn btn-ghost !py-2">التفاصيل</Link></div>
      </div>
    </div>
  );
}

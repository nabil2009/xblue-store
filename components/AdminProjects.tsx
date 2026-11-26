"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATS } from "@/lib/content";
const empty = { name: "", image_url: "", short_desc: "", full_desc: "", features: "", requirements: "", download_url: "", video_url: "", category: "bot", version: "1.0.0" };
export default function AdminProjects({ projects }: { projects: any[] }) {
  const r = useRouter(); const [f, setF] = useState<any>(empty); const [edit, setEdit] = useState<number | null>(null);
  const [prev, setPrev] = useState<string>(""); const [file, setFile] = useState<File | null>(null); const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  const set = (k: string, v: any) => setF((s: any) => ({ ...s, [k]: v }));
  const pickFile = (x?: File) => { if (x) { setFile(x); setPrev(URL.createObjectURL(x)); } };
  async function save() {
    setBusy(true); setMsg("");
    try {
      let image_url = f.image_url;
      if (file) { const fd = new FormData(); fd.append("file", file); const u = await fetch("/api/upload", { method: "POST", body: fd }); const j = await u.json(); if (!u.ok) throw new Error(j.error); image_url = j.url; }
      const body = JSON.stringify({ ...f, image_url });
      const res = await fetch(edit ? `/api/projects/${edit}` : "/api/projects", { method: edit ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body });
      const j = await res.json(); if (!res.ok) throw new Error(j.error);
      setF(empty); setEdit(null); setFile(null); setPrev(""); setMsg("تم الحفظ ✓"); r.refresh();
    } catch (e: any) { setMsg(e.message || "خطأ"); } finally { setBusy(false); }
  }
  async function del(id: number) { if (!confirm("هل أنت متأكد من حذف المشروع؟")) return; await fetch(`/api/projects/${id}`, { method: "DELETE" }); r.refresh(); }
  async function toggle(p: any) { await fetch(`/api/projects/${p.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ hidden: !p.hidden }) }); r.refresh(); }
  return (
    <div className="space-y-8">
      <div className="glass !transform-none p-6 space-y-3">
        <h2 className="font-black text-xl">{edit ? "تعديل المشروع" : "انشر مشروع جديد"}</h2>
        <input className="inp" placeholder="اسم المشروع *" value={f.name} onChange={e => set("name", e.target.value)} />
        <label onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); pickFile(e.dataTransfer.files[0]); }} className="block border-2 border-dashed border-violet rounded-xl p-6 text-center cursor-pointer">
          {prev || f.image_url ? <img src={prev || f.image_url} className="max-h-40 mx-auto rounded-lg" alt="" /> : "اسحب الصورة هنا أو اضغط للاختيار"}
          <input type="file" accept="image/*" className="hidden" onChange={e => pickFile(e.target.files?.[0])} />
        </label>
        <input className="inp" placeholder="وصف قصير" value={f.short_desc} onChange={e => set("short_desc", e.target.value)} />
        <textarea className="inp h-28" placeholder="وصف كامل" value={f.full_desc} onChange={e => set("full_desc", e.target.value)} />
        <textarea className="inp h-20" placeholder="المميزات (سطر لكل ميزة)" value={f.features} onChange={e => set("features", e.target.value)} />
        <textarea className="inp h-20" placeholder="متطلبات التشغيل" value={f.requirements} onChange={e => set("requirements", e.target.value)} />
        <input className="inp" placeholder="رابط التحميل * (مباشر / Discord / Google Drive / MediaFire)" value={f.download_url} onChange={e => set("download_url", e.target.value)} />
        <input className="inp" placeholder="رابط فيديو شرح YouTube (اختياري)" value={f.video_url} onChange={e => set("video_url", e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <select className="inp" value={f.category} onChange={e => set("category", e.target.value)}>{Object.entries(CATS).map(([k, v]) => <option key={k} value={k} className="bg-black">{v}</option>)}</select>
          <input className="inp" placeholder="الإصدار 1.0.0" value={f.version} onChange={e => set("version", e.target.value)} />
        </div>
        <p className="text-sm opacity-60">النوع: مجاني (دائماً في هذا القسم)</p>
        {msg && <p className="text-pink">{msg}</p>}
        <div className="flex gap-2"><button className="btn" disabled={busy} onClick={save}>{busy ? "..." : edit ? "حفظ التعديلات" : "نشر"}</button>{edit && <button className="btn btn-ghost" onClick={() => { setEdit(null); setF(empty); setPrev(""); }}>إلغاء</button>}</div>
      </div>
      <div className="glass !transform-none p-4 overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-pink text-right"><th>الاسم</th><th>التصنيف</th><th>تحميلات</th><th>الحالة</th><th>إجراءات</th></tr></thead><tbody>
        {projects.map(p => <tr key={p.id} className="border-t border-violet/20"><td className="py-2">{p.name}</td><td>{CATS[p.category]}</td><td>{p.downloads}</td><td>{p.hidden ? "مخفي" : "ظاهر"}</td>
          <td className="space-x-2 space-x-reverse"><button className="underline" onClick={() => { setEdit(p.id); setF({ ...empty, ...p }); setPrev(""); setFile(null); scrollTo({ top: 0, behavior: "smooth" }); }}>تعديل</button><button className="underline" onClick={() => toggle(p)}>{p.hidden ? "إظهار" : "إخفاء"}</button><button className="underline text-red-400" onClick={() => del(p.id)}>حذف</button></td></tr>)}
      </tbody></table></div>
    </div>
  );
}

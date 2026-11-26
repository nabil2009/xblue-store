"use client";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
const FEATS = ["إدارة", "حماية", "ترحيب", "اقتصاد", "تذاكر", "موسيقى", "ذكاء اصطناعي", "أخرى"];
const BUDGETS = ["أقل من 50 ريال", "50-150 ريال", "150-300 ريال", "أكثر من 300 ريال", "أتفق مع الإدارة"];
export default function RequestForm() {
  const { data, status } = useSession();
  const [f, setF] = useState<any>({ features: [], budget: BUDGETS[4], contact: "ديسكورد" });
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null); const [busy, setBusy] = useState(false);
  const set = (k: string, v: any) => setF((s: any) => ({ ...s, [k]: v }));
  if (status === "loading") return null;
  if (!data) return <div className="glass !transform-none p-8 text-center"><p className="mb-4">لازم تسجّل دخولك بالديسكورد قبل إرسال الطلب</p><button className="btn" onClick={() => signIn("discord")}>تسجيل دخول بالديسكورد</button></div>;
  async function send() {
    setBusy(true); setMsg(null);
    const r = await fetch("/api/requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    const j = await r.json(); setBusy(false);
    if (r.ok) { setMsg({ ok: true, t: `تم إرسال طلبك للإدارة، سيتم التواصل معك على ديسكورد قريباً — رقم الطلب #${j.id}` }); setF({ features: [], budget: BUDGETS[4], contact: "ديسكورد" }); }
    else setMsg({ ok: false, t: j.error || "حدث خطأ" });
  }
  return (
    <div className="glass !transform-none p-6 space-y-4 max-w-3xl mx-auto">
      <input className="inp" placeholder="اسم البوت *" value={f.bot_name || ""} onChange={e => set("bot_name", e.target.value)} />
      <textarea className="inp h-36" placeholder="فكرة البوت / ماذا تريد أن يفعل؟ *" value={f.idea || ""} onChange={e => set("idea", e.target.value)} />
      <div><p className="mb-2 font-bold">المميزات المطلوبة</p><div className="flex flex-wrap gap-2">{FEATS.map(x => <label key={x} className={`px-3 py-1 rounded-full border cursor-pointer ${f.features.includes(x) ? "bg-violet border-pink" : "border-violet/50"}`}><input type="checkbox" className="hidden" checked={f.features.includes(x)} onChange={() => set("features", f.features.includes(x) ? f.features.filter((y: string) => y !== x) : [...f.features, x])} />{x}</label>)}</div></div>
      <input className="inp" placeholder="نوع السيرفر الذي سيعمل عليه البوت" value={f.server_type || ""} onChange={e => set("server_type", e.target.value)} />
      <select className="inp" value={f.budget} onChange={e => set("budget", e.target.value)}>{BUDGETS.map(b => <option key={b} className="bg-black">{b}</option>)}</select>
      <input className="inp" placeholder="مدة التسليم المطلوبة" value={f.deadline || ""} onChange={e => set("deadline", e.target.value)} />
      <select className="inp" value={f.contact} onChange={e => set("contact", e.target.value)}><option className="bg-black">ديسكورد</option><option className="bg-black">واتساب</option></select>
      <textarea className="inp h-24" placeholder="ملاحظات إضافية" value={f.notes || ""} onChange={e => set("notes", e.target.value)} />
      {msg && <p className={`p-3 rounded-xl ${msg.ok ? "bg-green-500/20" : "bg-red-500/20"}`}>{msg.t}</p>}
      <button className="btn w-full" disabled={busy} onClick={send}>{busy ? "جارٍ الإرسال..." : "إرسال الطلب للإدارة"}</button>
    </div>
  );
}

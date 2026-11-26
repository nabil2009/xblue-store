"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { STATUS } from "@/lib/content";
export default function AdminRequests({ requests }: { requests: any[] }) {
  const r = useRouter(); const [open, setOpen] = useState<number | null>(null);
  async function st(id: number, status: string) { await fetch(`/api/requests/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }); r.refresh(); }
  return (
    <div className="space-y-3">{requests.length === 0 && <p className="opacity-60 text-center">لا توجد طلبات.</p>}
      {requests.map(q => (
        <div key={q.id} className="glass !transform-none p-4">
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <button className="font-bold text-right" onClick={() => setOpen(open === q.id ? null : q.id)}>#{q.id} — {q.bot_name} <small className="opacity-60">({q.display_name} @{q.username})</small></button>
            <select className="inp !w-auto" value={q.status} onChange={e => st(q.id, e.target.value)}>{Object.entries(STATUS).map(([k, v]) => <option key={k} value={k} className="bg-black">{v}</option>)}</select>
          </div>
          {open === q.id && <div className="mt-3 text-sm space-y-1 opacity-90">
            <p>🆔 ديسكورد: {q.discord_id}</p><p>💡 الفكرة: {q.idea}</p><p>⚙️ المميزات: {q.features?.join("، ") || "—"}</p><p>🖥️ السيرفر: {q.server_type}</p>
            <p>💰 الميزانية: {q.budget}</p><p>⏰ المدة: {q.deadline}</p><p>📞 التواصل: {q.contact}</p><p>📝 ملاحظات: {q.notes}</p><p>🔔 الويب هوك: {q.webhook_ok ? "أُرسل" : "فشل"}</p><p>🕒 {new Date(q.created_at).toLocaleString("ar")}</p></div>}
        </div>))}
    </div>
  );
}

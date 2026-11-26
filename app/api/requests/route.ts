import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/supabase";
const cut = (s: any, n = 1000) => (String(s || "—").trim() || "—").slice(0, n);
export async function POST(req: Request) {
  const u = await getUser();
  if (!u) return NextResponse.json({ error: "سجّل دخولك بالديسكورد أولاً" }, { status: 401 });
  const b = await req.json();
  if (!b.bot_name?.trim() || !b.idea?.trim()) return NextResponse.json({ error: "اسم البوت والفكرة مطلوبان" }, { status: 400 });
  const row = { discord_id: u.id, username: u.username, display_name: u.name, avatar: u.image, bot_name: cut(b.bot_name, 100), idea: cut(b.idea, 4000),
    features: Array.isArray(b.features) ? b.features.slice(0, 10).map((x: any) => cut(x, 40)) : [], server_type: cut(b.server_type, 200), budget: cut(b.budget, 60),
    deadline: cut(b.deadline, 100), contact: cut(b.contact, 40), notes: cut(b.notes, 2000), status: "review" };
  const s = db();
  const { data, error } = await s.from("requests").insert(row).select().single();
  if (error) return NextResponse.json({ error: "تعذر حفظ الطلب: " + error.message }, { status: 500 });
  const now = new Date();
  const embed = {
    title: "🔥 طلب مشروع مدفوع جديد | xBlue Studio", color: 0xa100f2, thumbnail: { url: u.image }, timestamp: now.toISOString(),
    fields: [
      { name: "👤 العضو", value: `${u.name} (@${u.username})\nID: ${u.id}`, inline: false },
      { name: "🤖 اسم البوت", value: cut(row.bot_name, 1000), inline: true },
      { name: "🆔 رقم الطلب", value: `#${data.id}`, inline: true },
      { name: "💡 الفكرة", value: cut(row.idea, 1000) },
      { name: "⚙️ المميزات المطلوبة", value: row.features.length ? row.features.join("، ") : "—" },
      { name: "💰 الميزانية", value: row.budget, inline: true },
      { name: "⏰ مدة التسليم", value: row.deadline, inline: true },
      { name: "📞 طريقة التواصل", value: row.contact, inline: true },
      { name: "📝 ملاحظات", value: cut(row.notes, 1000) },
    ],
    footer: { text: `xBlue Studio | تم الإرسال من الموقع | ${now.toLocaleString("ar-SA")}` },
  };
  let ok = false;
  try {
    const r = await fetch(process.env.DISCORD_WEBHOOK_URL!, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: "xBlue Studio", embeds: [embed] }) });
    ok = r.ok;
  } catch {}
  await s.from("requests").update({ webhook_ok: ok }).eq("id", data.id);
  if (!ok) return NextResponse.json({ error: "تم حفظ طلبك لكن تعذر إشعار الإدارة تلقائياً. رقم طلبك #" + data.id + " — سنراجعه من لوحة التحكم.", id: data.id }, { status: 502 });
  return NextResponse.json({ ok: true, id: data.id });
}

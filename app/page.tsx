import Link from "next/link";
import PageNav from "@/components/PageNav";
import { db } from "@/lib/supabase";
export const dynamic = "force-dynamic";
export default async function Home({ searchParams }: { searchParams: { denied?: string } }) {
  let count = 0, dl = 0;
  try { const { data } = await db().from("projects").select("downloads").eq("hidden", false); count = data?.length || 0; dl = (data || []).reduce((s: number, p: any) => s + (p.downloads || 0), 0); } catch {}
  return (
    <div>
      {searchParams.denied && <div className="glass !transform-none p-4 mb-6 text-center text-pink font-bold">ليس لديك صلاحية</div>}
      <section className="relative rounded-3xl overflow-hidden text-center py-20 px-4 bg-cover bg-center" style={{ backgroundImage: "url(/banner.png)" }}>
        <div className="absolute inset-0 bg-[#0A0612]/80" />
        <div className="relative up">
          <img src="/logo.png" alt="xBlue Studio" className="h-32 w-32 object-contain bg-transparent mx-auto float drop-shadow-[0_0_25px_#A100F2]" />
          <h1 className="text-5xl md:text-7xl font-black mt-4 neon">xBlue Studio</h1>
          <p className="mt-4 text-xl opacity-85">مجتمع برمجة عربي — مشاريع مجانية، بوتات مخصصة، ومبرمجون يساعدونك</p>
          <div className="mt-8 flex gap-3 justify-center flex-wrap"><Link href="/join" className="btn">انضم إلينا</Link><Link href="/projects" className="btn btn-ghost">المشاريع المجانية</Link></div>
        </div>
      </section>
      <section className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10 text-center">
        {[["مشروع مجاني", count], ["تحميل", dl], ["رتب", 4]].map(([l, v]) => <div key={l as string} className="glass p-6"><div className="text-4xl font-black neon">{v}</div><div className="opacity-70">{l}</div></div>)}
      </section>
      <section className="grid md:grid-cols-3 gap-4 mt-10">
        {[["🤖", "بوتات جاهزة", "حمّلها مجاناً وشغّلها"], ["💼", "طلب مخصص", "نبني لك بوتك الخاص"], ["💬", "مجتمع نشط", "مبرمجون عرب بانتظارك"]].map(([i, t, d]) => <div key={t} className="glass p-6"><div className="text-4xl">{i}</div><h3 className="font-black text-xl mt-2">{t}</h3><p className="opacity-70">{d}</p></div>)}
      </section>
      <div className="text-center mt-10"><Link href="/custom-project" className="btn">اطلب مشروعك الآن</Link></div>
      <PageNav path="/" />
    </div>
  );
}

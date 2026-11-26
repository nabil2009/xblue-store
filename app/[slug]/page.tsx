import { notFound } from "next/navigation";
import { PAGES } from "@/lib/content";
import Accordion from "@/components/Accordion";
import PageNav from "@/components/PageNav";
export const dynamicParams = false;
export const generateStaticParams = () => Object.keys(PAGES).map(slug => ({ slug }));
export default function Page({ params }: { params: { slug: string } }) {
  const p = PAGES[params.slug]; if (!p) notFound();
  return (
    <div className="up">
      <h1 className="text-4xl md:text-6xl font-black neon text-center">{p.title}</h1>
      <p className="text-center opacity-70 mt-2 mb-10">{p.sub}</p>
      {p.kind === "cards" && <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{p.items.map(([t, d]) => <div key={t} className="glass p-6"><h3 className="font-black text-xl mb-2">{t}</h3><p className="opacity-75">{d}</p></div>)}</div>}
      {p.kind === "accordion" && <Accordion items={p.items} />}
      {p.kind === "join" && <div className="text-center"><a className="btn text-xl" href={process.env.NEXT_PUBLIC_DISCORD_INVITE || "#"} target="_blank">الدخول للسيرفر</a></div>}
      <PageNav path={`/${params.slug}`} />
    </div>
  );
}

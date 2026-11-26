import ProjectCard from "@/components/ProjectCard";
import PageNav from "@/components/PageNav";
import { db } from "@/lib/supabase";
export const dynamic = "force-dynamic";
export default async function Projects() {
  const { data } = await db().from("projects").select("*").eq("hidden", false).order("created_at", { ascending: false });
  return (
    <div className="up">
      <h1 className="text-4xl md:text-6xl font-black neon text-center">المشاريع المجانية</h1>
      <p className="text-center opacity-70 mt-2 mb-10">مشاريع ننشرها بأنفسنا، مجانية للجميع</p>
      {data?.length ? <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{data.map((p: any) => <ProjectCard key={p.id} p={p} />)}</div> : <p className="text-center opacity-60">لا توجد مشاريع منشورة بعد.</p>}
      <PageNav path="/projects" />
    </div>
  );
}

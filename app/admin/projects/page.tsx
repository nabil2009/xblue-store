import { redirect } from "next/navigation";
import Link from "next/link";
import { getUser, isAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase";
import AdminProjects from "@/components/AdminProjects";
export const dynamic = "force-dynamic";
export default async function Page() {
  if (!isAdmin(await getUser())) redirect("/?denied=1");
  const { data } = await db().from("projects").select("*").order("created_at", { ascending: false });
  return <div><div className="flex justify-between mb-6"><h1 className="text-3xl font-black neon">لوحة المشاريع</h1><Link href="/admin/requests" className="btn btn-ghost">الطلبات</Link></div><AdminProjects projects={data || []} /></div>;
}

import { redirect } from "next/navigation";
import Link from "next/link";
import { getUser, isAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase";
import AdminRequests from "@/components/AdminRequests";
export const dynamic = "force-dynamic";
export default async function Page() {
  if (!isAdmin(await getUser())) redirect("/?denied=1");
  const { data } = await db().from("requests").select("*").order("created_at", { ascending: false });
  return <div><div className="flex justify-between mb-6"><h1 className="text-3xl font-black neon">طلبات المشاريع المدفوعة</h1><Link href="/admin/projects" className="btn btn-ghost">المشاريع</Link></div><AdminRequests requests={data || []} /></div>;
}

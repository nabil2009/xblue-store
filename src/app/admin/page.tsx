import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function Admin() {
  const a = await requireAdmin();
  if (!a) notFound();
  const [users, projects, downloads, revenue] = await Promise.all([
    db.user.count(), db.project.count(), db.downloadLog.count(), db.purchase.aggregate({ _sum: { pricePaid: true } }),
  ]);
  const stats: [string, number][] = [["Users", users], ["Projects", projects], ["Downloads", downloads], ["Revenue (Coins)", revenue._sum.pricePaid ?? 0]];
  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Admin dashboard</h1>
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map(([l, n]) => (<div key={l} className="glass p-5"><div className="text-3xl font-bold text-cyan">{n}</div><div className="text-sm text-white/60">{l}</div></div>))}
      </div>
    </main>
  );
}

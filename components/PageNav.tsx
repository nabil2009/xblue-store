import Link from "next/link";
import { NAV } from "@/lib/content";
export default function PageNav({ path }: { path: string }) {
  const i = NAV.findIndex(n => n.href === path); if (i < 0) return null;
  const prev = NAV[i - 1], next = NAV[i + 1];
  return (
    <div className="flex justify-between mt-14 gap-3">
      {prev ? <Link href={prev.href} className="btn btn-ghost">→ الصفحة السابقة</Link> : <span />}
      {next ? <Link href={next.href} className="btn">الصفحة التالية ←</Link> : <span />}
    </div>
  );
}

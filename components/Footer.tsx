import Link from "next/link";
import { NAV } from "@/lib/content";
export default function Footer() {
  return (
    <footer className="border-t border-violet/30 mt-16 py-10 text-center">
      <img src="/logo.png" alt="" className="h-14 w-14 object-contain bg-transparent mx-auto mb-3" />
      <div className="flex flex-wrap gap-4 justify-center text-sm mb-4">{NAV.map(n => <Link key={n.href} href={n.href} className="hover:text-pink">{n.label}</Link>)}</div>
      <p className="opacity-60 text-sm">© {new Date().getFullYear()} xBlue Studio — جميع الحقوق محفوظة</p>
    </footer>
  );
}

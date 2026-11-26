"use client";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { NAV } from "@/lib/content";
export default function Header() {
  const { data } = useSession(); const u: any = data?.user;
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-bg/70 border-b border-violet/30">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4 flex-wrap">
        <Link href="/" className="flex items-center gap-2 font-black text-xl">
          <img src="/logo.png" alt="xBlue Studio" className="h-10 w-10 object-contain bg-transparent" /> <span className="neon">xBlue Studio</span>
        </Link>
        <nav className="flex gap-4 text-sm overflow-x-auto flex-1 order-3 lg:order-none w-full lg:w-auto whitespace-nowrap">
          {NAV.map(n => <Link key={n.href} href={n.href} className="hover:text-pink">{n.label}</Link>)}
        </nav>
        {u ? (
          <div className="flex items-center gap-2 text-sm">
            <Link href="/profile" className="flex items-center gap-2"><img src={u.image} className="h-9 w-9 rounded-full border border-pink" alt="" /><span>{u.name}<br /><small className="opacity-60">@{u.username}</small></span></Link>
            <button className="btn btn-ghost !py-1 !px-3" onClick={() => signOut({ callbackUrl: "/" })}>خروج</button>
          </div>
        ) : <button className="btn" onClick={() => signIn("discord")}>تسجيل دخول بالديسكورد</button>}
      </div>
    </header>
  );
}

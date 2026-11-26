"use client";
import { useState } from "react";
export default function CopyButton({ text }: { text: string }) {
  const [d, setD] = useState(false);
  return <button className="btn btn-ghost" onClick={() => { navigator.clipboard.writeText(text); setD(true); setTimeout(() => setD(false), 1500); }}>{d ? "تم النسخ ✓" : "نسخ رابط التحميل"}</button>;
}

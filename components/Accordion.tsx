"use client";
import { useState } from "react";
export default function Accordion({ items }: { items: [string, string][] }) {
  const [o, setO] = useState<number | null>(0);
  return <div className="space-y-3">{items.map(([q, a], i) => (
    <div key={i} className="glass !transform-none"><button className="w-full text-right p-5 font-bold flex justify-between" onClick={() => setO(o === i ? null : i)}><span>{q}</span><span className="text-pink">{o === i ? "−" : "+"}</span></button>
      {o === i && <p className="px-5 pb-5 opacity-80">{a}</p>}</div>))}</div>;
}

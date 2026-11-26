"use client";
import { useEffect, useRef } from "react";
export default function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!, x = c.getContext("2d")!; let id = 0;
    const fit = () => { c.width = innerWidth; c.height = innerHeight; }; fit(); addEventListener("resize", fit);
    const ps = Array.from({ length: 50 }, () => ({ x: Math.random() * c.width, y: Math.random() * c.height, r: Math.random() * 2 + .5, v: Math.random() * .4 + .1, p: Math.random() > .5 }));
    const loop = () => { x.clearRect(0, 0, c.width, c.height);
      ps.forEach(p => { p.y -= p.v; if (p.y < 0) p.y = c.height; x.beginPath(); x.arc(p.x, p.y, p.r, 0, 7); x.fillStyle = p.p ? "#A100F2" : "#FF00B8"; x.shadowBlur = 10; x.shadowColor = x.fillStyle as string; x.fill(); });
      id = requestAnimationFrame(loop); }; loop();
    return () => { cancelAnimationFrame(id); removeEventListener("resize", fit); };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 -z-10 pointer-events-none" />;
}

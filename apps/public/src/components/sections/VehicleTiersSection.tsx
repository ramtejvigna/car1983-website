"use client";

import { useRef, MouseEvent } from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const TIERS = [
  { tier: "ECONOMY", desc: "Everyday value",   price: "from $7",  dark: false, tag: "Popular" },
  { tier: "COMFORT", desc: "Premium comfort",  price: "from $12", dark: false, tag: null },
  { tier: "XL",      desc: "Groups & luggage", price: "from $15", dark: false, tag: "Group" },
  { tier: "LUXURY",  desc: "Executive travel", price: "from $26", dark: true,  tag: "Premium" },
];

function TierCard({
  tier, desc, price, dark, tag, delay,
}: (typeof TIERS)[number] & { delay: number }) {

  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -14;
    el.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) scale(1.03)`;
  }

  function onLeave() {
    if (ref.current) ref.current.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
  }

  return (
    <ScrollReveal delay={delay} direction="up" distance={28}>
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ transition: "transform 0.3s ease" }}
        className={`relative rounded-3xl p-7 border cursor-pointer overflow-hidden group ${
          dark
            ? "bg-[#0f0f0f] border-white/8 hover:border-[#795BFB]/35"
            : "bg-[#f5f5f5] border-transparent hover:border-[#795BFB]/25 hover:shadow-lg"
        }`}
      >
        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-3xl"
          style={{ background: dark ? "radial-gradient(circle at 60% 20%, rgba(121,91,251,0.07) 0%, transparent 65%)" : "radial-gradient(circle at 60% 20%, rgba(121,91,251,0.04) 0%, transparent 65%)" }}
          aria-hidden="true"
        />

        {tag && (
          <span className="inline-block text-[9px] font-black uppercase tracking-[0.18em] text-white bg-[#795BFB] px-2.5 py-1 rounded-full mb-4">
            {tag}
          </span>
        )}
        {!tag && <div className="h-7 mb-0" />}

        <h3 className={`text-2xl font-black mb-1 tracking-tight ${dark ? "text-white" : "text-black"}`}>
          {tier}
        </h3>
        <p className={`text-sm mb-5 ${dark ? "text-white/40" : "text-gray-500"}`}>{desc}</p>

        <div className="flex items-center justify-between mt-auto">
          <span className={`text-lg font-black ${dark ? "text-[#795BFB]" : "text-[#795BFB]"}`}>
            {price}
          </span>
          <span className={`text-xs font-semibold border rounded-xl px-3 py-1.5 transition-colors duration-200 group-hover:border-[#795BFB]/60 group-hover:text-[#795BFB] ${
            dark ? "border-white/12 text-white/30" : "border-gray-200 text-gray-400"
          }`}>
            Book →
          </span>
        </div>
      </div>
    </ScrollReveal>
  );
}

export function VehicleTiersSection() {
  return (
    <section className="py-28 bg-black" aria-label="Vehicle tiers">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <ScrollReveal className="text-center mb-16">
          <span className="inline-block text-[11px] font-bold text-white/50 border border-white/12 px-3.5 py-1.5 rounded-full tracking-widest uppercase mb-5">
            Vehicle Tiers
          </span>
          <h2 className="text-5xl sm:text-6xl font-black text-white leading-[0.92] tracking-tight">
            Five Tiers.{" "}
            <span className="text-[#795BFB]">One App.</span>
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TIERS.map((t, i) => (
            <TierCard key={t.tier} {...t} delay={i * 90} />
          ))}
        </div>
      </div>
    </section>
  );
}

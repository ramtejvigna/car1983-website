import { AlertTriangle, BadgeCheck, Navigation, Shield, Clock, CreditCard } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { LucideIcon } from "lucide-react";

const FEATURES: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: AlertTriangle, title: "One-Tap SOS",          desc: "Panic or silent emergency alerts sent instantly to our ops team and your emergency contacts." },
  { icon: BadgeCheck,    title: "Verified Drivers",     desc: "Every driver passes background checks, license verification, and vehicle inspection before going live." },
  { icon: Navigation,    title: "Live GPS Tracking",    desc: "Share your trip link with anyone. Real-time position updates every few seconds via our WebSocket layer." },
  { icon: Shield,        title: "Encrypted Payments",   desc: "All transactions are handled by Stripe. We never store raw card numbers — PCI-DSS compliant end-to-end." },
  { icon: Clock,         title: "24 / 7 Support",       desc: "Human support available around the clock. Average first-response under 4 minutes." },
  { icon: CreditCard,    title: "Dispute Resolution",   desc: "Formal dispute flow with a dedicated review queue. Most cases closed within 24 hours." },
];

export function SafetySection() {
  return (
    <section className="py-16 sm:py-28 bg-[#080808]" aria-label="Safety features">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        <div className="grid lg:grid-cols-[1fr_2fr] gap-16 items-start">

          {/* Sticky left */}
          <ScrollReveal className="lg:sticky lg:top-28">
            <span className="inline-block text-[11px] font-bold text-white/40 border border-white/12 px-3 py-1.5 rounded-full tracking-widest uppercase mb-5">
              Safety First
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[0.92] tracking-tight">
              Built for trust.
              <br />
              <span className="text-[#795BFB]">Designed for</span>
              <br />
              peace of mind.
            </h2>
            <p className="text-white/30 text-sm leading-relaxed mt-5 max-w-xs">
              Multiple layers of safety, woven into every ride from booking to drop-off.
            </p>
          </ScrollReveal>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <ScrollReveal key={f.title} delay={i * 80} direction="up">
                  <div className="group border border-white/8 rounded-2xl p-6 hover:border-[#795BFB]/30 hover:bg-white/[0.02] transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-[#795BFB]/8 border border-[#795BFB]/12 flex items-center justify-center mb-4 group-hover:bg-[#795BFB]/15 transition-colors duration-300">
                      <Icon className="w-5 h-5 text-[#795BFB]/60 group-hover:text-[#795BFB] transition-colors duration-300" />
                    </div>
                    <h3 className="font-bold text-white text-base mb-1.5">{f.title}</h3>
                    <p className="text-sm text-white/35 leading-relaxed">{f.desc}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

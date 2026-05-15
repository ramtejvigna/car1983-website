import { CheckCircle2 } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const PERKS = [
  "Set your own hours — drive when you want",
  "Real-time earnings dashboard",
  "Weekly direct deposit payouts",
  "Instant trip acceptance or decline",
  "In-app navigation included",
];

export function DriveWithUsSection() {
  return (
    <section className="py-28 bg-gradient-to-br from-[#795BFB] to-[#5e3edb] overflow-hidden" aria-label="Drive with us">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        {/* Background decoration */}
        <div
          className="absolute right-0 top-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }}
          aria-hidden="true"
        />

        <div className="relative grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <ScrollReveal>
            <span className="inline-block text-[11px] font-bold text-white/60 border border-white/25 px-3.5 py-1.5 rounded-full tracking-widest uppercase mb-5">
              For Drivers
            </span>
            <h2 className="text-5xl sm:text-6xl font-black text-white leading-[0.92] tracking-tight mb-5">
              Earn on your
              <br />
              schedule.
            </h2>
            <p className="text-white/65 text-base leading-relaxed mb-10 max-w-sm">
              Join 500+ verified Car 1983 drivers. Flexible hours, transparent earnings, and an app built
              for professionals.
            </p>
            <a
              href="/driver"
              className="inline-flex items-center gap-2.5 bg-black text-white font-bold text-sm px-7 py-4 rounded-2xl hover:bg-[#111] hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-0.5"
            >
              Start Driving
              <span className="text-white/40">→</span>
            </a>
          </ScrollReveal>

          {/* Right: perk list */}
          <div className="space-y-3">
            {PERKS.map((p, i) => (
              <ScrollReveal key={p} delay={i * 90} direction="right">
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm border border-white/12 rounded-2xl px-5 py-4 hover:bg-white/15 transition-all duration-200">
                  <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />
                  <span className="text-white font-medium text-sm">{p}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

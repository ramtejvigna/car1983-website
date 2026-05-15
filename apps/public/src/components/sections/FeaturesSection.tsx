import { Zap, Navigation, BadgeCheck, CreditCard } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { LucideIcon } from "lucide-react";

const FEATURES: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Zap,         title: "Smart Matching",     desc: "Our engine finds the closest, highest-rated driver for your tier within seconds, using live GPS and H3 geo-indexing." },
  { icon: Navigation,  title: "Live GPS Tracking",  desc: "Watch your driver on the map in real time. Share a tracking link with friends or family for every trip." },
  { icon: BadgeCheck,  title: "Rating & Disputes",  desc: "Transparent two-way ratings. Formal dispute resolution with a real review team, not a chatbot." },
  { icon: CreditCard,  title: "Saved Cards",        desc: "Securely save up to 5 payment methods via Stripe. One-tap checkout on every booking." },
];

export function FeaturesSection() {
  return (
    <section className="py-16 sm:py-28 bg-[#fafafa] border-t border-gray-100" aria-label="App features">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <ScrollReveal className="text-center mb-16">
          <span className="inline-block text-[11px] font-bold text-white bg-[#795BFB] px-3.5 py-1.5 rounded-full tracking-widest uppercase mb-5">
            App Features
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-black leading-[0.92] tracking-tight">
            Everything you need,
            <br />
            <span className="text-[#795BFB]">nothing you don&apos;t.</span>
          </h2>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <ScrollReveal key={f.title} delay={i * 100} direction="up">
                <div className="group bg-white rounded-3xl p-7 border border-gray-100 hover:border-[#795BFB]/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="w-10 h-10 rounded-xl bg-[#795BFB] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-[0_6px_20px_rgba(121,91,251,0.35)]">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-black text-black text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

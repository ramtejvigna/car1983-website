import { ScrollReveal } from "@/components/ui/ScrollReveal";

const STEPS = [
  {
    n: "01",
    title: "Download & Sign Up",
    desc: "Get the app on iOS or Android. Create your account with just your phone number — no passwords, no friction.",
  },
  {
    n: "02",
    title: "Choose Your Tier",
    desc: "Pick from Moto, Economy, Comfort, XL, or Luxury. See upfront pricing and your driver's live rating before confirming.",
  },
  {
    n: "03",
    title: "Ride & Pay",
    desc: "Track your driver live on the map. Pay with a saved Stripe-secured card in one tap, then rate your trip.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-16 sm:py-28 bg-white" aria-label="How it works">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-16 items-start">

          {/* Sticky left */}
          <ScrollReveal className="lg:sticky lg:top-28">
            <span className="inline-block text-[11px] font-bold text-white bg-[#795BFB] px-3.5 py-1.5 rounded-full tracking-widest uppercase mb-5">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-black leading-[0.92] tracking-tight">
              Three steps to your
              <br />
              <span className="text-[#795BFB]">perfect ride.</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mt-5 max-w-xs">
              We designed the simplest booking experience in the industry — and the safest.
            </p>
          </ScrollReveal>

          {/* Steps */}
          <div className="space-y-4">
            {STEPS.map((s, i) => (
              <ScrollReveal key={s.n} delay={i * 120} direction="left">
                <div
                  className={`relative flex gap-4 sm:gap-7 items-start p-5 sm:p-8 rounded-3xl overflow-hidden transition-all duration-300 hover:scale-[1.01] ${
                    i === 1
                      ? "bg-black shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
                      : "bg-gray-50 hover:bg-gray-100/70 hover:shadow-md"
                  }`}
                >
                  {/* Accent glow on active */}
                  {i === 1 && (
                    <div
                      className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
                      style={{ background: "radial-gradient(circle, #795BFB 0%, transparent 70%)" }}
                      aria-hidden="true"
                    />
                  )}

                  {/* Step number */}
                  <span
                    className={`text-5xl sm:text-6xl font-black leading-none flex-shrink-0 select-none ${
                      i === 1 ? "text-[#795BFB]" : "text-gray-150"
                    }`}
                    style={{ color: i === 1 ? "#795BFB" : "rgba(0,0,0,0.08)" }}
                  >
                    {s.n}
                  </span>

                  <div className="relative">
                    <div className="flex items-center gap-2.5 mb-2">
                      <h3 className={`text-xl font-black ${i === 1 ? "text-white" : "text-black"}`}>
                        {s.title}
                      </h3>
                    </div>
                    <p className={`text-sm leading-relaxed ${i === 1 ? "text-white/50" : "text-gray-500"}`}>
                      {s.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

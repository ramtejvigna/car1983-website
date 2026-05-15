"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Marcus Johnson",
    handle: "@marcus_j",
    role: "Daily Commuter",
    initial: "M",
    text: "I've tried every ride-hailing app in the city. Car 1983 is in a different league. LUXURY tier actually feels luxurious — always the same two drivers, both phenomenal.",
    stars: 5,
    tier: "LUXURY",
  },
  {
    name: "Sofia Chen",
    handle: "@sofiac",
    role: "Business Traveler",
    initial: "S",
    text: "The one-tap SOS and live share link made my company switch Car 1983 for all executive travel. Safety features are genuinely enterprise-grade.",
    stars: 5,
    tier: "COMFORT",
  },
  {
    name: "Tariq Al-Rashid",
    handle: "@tariqrides",
    role: "Weekend Rider",
    initial: "T",
    text: "Economy fare, but the driver was 4.9 stars and the car was spotless. Upfront pricing — I knew exactly what I'd pay before I booked. No surprises.",
    stars: 5,
    tier: "ECONOMY",
  },
];

export function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const [progressKey, setProgressKey] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((a) => (a + 1) % TESTIMONIALS.length);
      setProgressKey((k) => k + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  function pick(i: number) {
    setActive(i);
    setProgressKey((k) => k + 1);
  }

  return (
    <section className="py-28 bg-white" aria-label="Customer testimonials">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">

        <div className="text-center mb-16">
          <span className="inline-block text-[11px] font-bold text-white bg-[#795BFB] px-3.5 py-1.5 rounded-full tracking-widest uppercase mb-5">
            Testimonials
          </span>
          <h2 className="text-5xl sm:text-6xl font-black text-black leading-[0.92] tracking-tight">
            Riders love{" "}
            <span className="text-[#795BFB]">Car 1983.</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.name}
              onClick={() => pick(i)}
              className={`text-left rounded-3xl p-7 border transition-all duration-400 cursor-pointer ${
                i === active
                  ? "bg-black border-transparent shadow-2xl scale-[1.01]"
                  : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-md"
              }`}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.stars)].map((_, s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${i === active ? "fill-[#FB5D5E] text-[#FB5D5E]" : "fill-amber-400 text-amber-400"}`}
                  />
                ))}
              </div>

              {/* Text */}
              <p className={`text-sm leading-relaxed mb-6 ${i === active ? "text-white/75" : "text-gray-600"}`}>
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 ${
                  i === active ? "bg-[#795BFB] text-white" : "bg-gray-100 text-gray-600"
                }`}>
                  {t.initial}
                </div>
                <div>
                  <p className={`text-sm font-bold leading-none mb-0.5 ${i === active ? "text-white" : "text-black"}`}>
                    {t.name}
                  </p>
                  <p className={`text-[11px] ${i === active ? "text-white/35" : "text-gray-400"}`}>
                    {t.role} · {t.tier}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Progress indicators */}
        <div className="flex items-center justify-center gap-2.5">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => pick(i)}
              aria-label={`Testimonial ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-400 overflow-hidden ${
                i === active ? "w-12 bg-gray-200" : "w-4 bg-gray-200"
              }`}
            >
              {i === active && (
                <div
                  key={progressKey}
                  className="h-full bg-[#795BFB] animate-progress-bar origin-left"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

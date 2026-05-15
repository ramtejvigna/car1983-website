import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

const STATS = [
  { to: 50, suffix: "K+", label: "Rides Completed", decimals: 0 },
  { to: 4.9, suffix: "★", label: "Average App Rating", decimals: 1 },
  { to: 500, suffix: "+", label: "Verified Drivers", decimals: 0 },
  { to: null, display: "24/7", label: "Customer Support" },
] as const;

export function StatsSection() {
  return (
    <section className="bg-white border-b border-gray-100" aria-label="Key statistics">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`text-center px-4 ${
                i < 3 ? "md:border-r md:border-gray-100" : ""
              }`}
            >
              <p className="text-5xl font-black text-black tracking-tight tabular-nums leading-none mb-2">
                {s.to !== null ? (
                  <AnimatedCounter
                    to={s.to}
                    suffix={s.suffix}
                    decimals={s.decimals ?? 0}
                  />
                ) : (
                  <span>{s.display}</span>
                )}
              </p>
              <p className="text-sm text-gray-400 font-medium">{s.label}</p>
              {/* Accent underline */}
              <div className="mt-3 mx-auto w-8 h-0.5 rounded-full bg-[#795BFB]/30" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

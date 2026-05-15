import { Navigation, Star, AlertTriangle } from "lucide-react";
import { StoreButton } from "@/components/ui/StoreButtons";

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-black overflow-hidden flex flex-col" aria-label="Hero">

      {/* ── Ambient orbs ─────────────────────────────────────────────── */}
      <div
        className="absolute -top-48 -right-24 w-[680px] h-[680px] rounded-full blur-[120px] opacity-[0.18] bg-[#795BFB] animate-orb-1 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -left-16 w-[440px] h-[440px] rounded-full blur-[100px] opacity-[0.09] bg-[#FB5D5E] animate-orb-2 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 right-1/4 w-[220px] h-[220px] rounded-full blur-[80px] opacity-[0.07] bg-[#00BB39] animate-orb-3 pointer-events-none"
        aria-hidden="true"
      />

      {/* ── Dot grid ─────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
        aria-hidden="true"
      />

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="relative flex-1 flex items-center max-w-7xl mx-auto w-full px-5 sm:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center w-full py-20 lg:py-28">

          {/* ── Left: Copy ─────────────────────────────────────────── */}
          <div>

            {/* Live badge */}
            <div
              className="inline-flex items-center gap-3 border border-white/12 bg-white/[0.04] backdrop-blur-sm rounded-full px-4 py-2 mb-10 animate-fade-up"
              style={{ animationDelay: "50ms" }}
            >
              <div className="relative flex items-center justify-center w-2.5 h-2.5">
                <span className="w-2 h-2 rounded-full bg-[#00BB39] block" />
                <span className="absolute w-2 h-2 rounded-full bg-[#00BB39] animate-pulse-ring" />
              </div>
              <span className="text-[11px] font-semibold text-white/55 tracking-[0.15em] uppercase">
                Est. 1983 · Now Digital
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-[clamp(52px,8vw,90px)] font-black text-white leading-[0.87] tracking-tight animate-fade-up"
              style={{ animationDelay: "150ms" }}
            >
              Every Ride,
            </h1>
            <h1
              className="text-[clamp(52px,8vw,90px)] font-black text-[#795BFB] leading-[0.87] tracking-tight mb-8 animate-fade-up"
              style={{ animationDelay: "260ms" }}
            >
              Elevated.
            </h1>

            <p
              className="text-[17px] text-white/45 leading-relaxed mb-10 max-w-[400px] animate-fade-up"
              style={{ animationDelay: "370ms" }}
            >
              Five vehicle tiers, real-time GPS matching, built-in SOS safety, and
              Stripe-secured payments — trusted since 1983.
            </p>

            {/* Trust pills */}
            <div
              className="flex flex-wrap gap-2 mb-10 animate-fade-up"
              style={{ animationDelay: "470ms" }}
            >
              {["4.9★ App Rating", "50K+ Rides", "Verified Drivers", "24/7 Support"].map((b) => (
                <span
                  key={b}
                  className="text-[11px] font-medium text-white/50 border border-white/12 rounded-full px-3.5 py-1.5 hover:border-[#795BFB]/50 hover:text-white/70 transition-all duration-300 cursor-default"
                >
                  {b}
                </span>
              ))}
            </div>

            {/* Store CTAs */}
            <div
              className="flex flex-wrap gap-3 animate-fade-up"
              style={{ animationDelay: "560ms" }}
            >
              <StoreButton variant="apple" dark size="md" />
              <StoreButton variant="google" dark size="md" />
            </div>
          </div>

          {/* ── Right: App mockup ────────────────────────────────────── */}
          <div
            className="hidden lg:flex items-center justify-center relative h-[600px] animate-fade-in-right"
            style={{ animationDelay: "350ms" }}
          >
            {/* Rotating outer ring */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              aria-hidden="true"
            >
              <div className="w-[460px] h-[460px] rounded-full border border-[#795BFB]/12 animate-spin-slow" />
            </div>
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              aria-hidden="true"
            >
              <div className="w-[340px] h-[340px] rounded-full border border-[#795BFB]/7" />
            </div>

            {/* ── Main booking card ──────────────────────────────────── */}
            <div className="relative z-10 animate-float-slow">
              <div className="w-[290px] bg-[#0b0b0b] rounded-[28px] border border-white/10 p-5 shadow-[0_40px_100px_rgba(0,0,0,0.9)]">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-[9px] text-white/25 uppercase tracking-[0.18em] mb-0.5">
                      Active Booking
                    </p>
                    <p className="text-sm font-bold text-white">Choose your tier</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-[#795BFB] flex items-center justify-center shadow-[0_0_20px_rgba(121,91,251,0.7)]">
                    <Navigation className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="space-y-1.5 mb-5">
                  {[
                    { tier: "ECONOMY", price: "$7.50",  eta: "3 min", active: false },
                    { tier: "COMFORT", price: "$12.00", eta: "4 min", active: true  },
                    { tier: "XL",      price: "$15.50", eta: "6 min", active: false },
                    { tier: "LUXURY",  price: "$26.00", eta: "8 min", active: false },
                  ].map((r) => (
                    <div
                      key={r.tier}
                      className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors duration-200 ${
                        r.active
                          ? "bg-[#795BFB] shadow-[0_4px_18px_rgba(121,91,251,0.45)]"
                          : "bg-white/5 hover:bg-white/8"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div>
                          <p className="text-[11px] font-bold leading-none text-white mb-0.5">{r.tier}</p>
                          <p className={`text-[9px] ${r.active ? "text-white/65" : "text-white/30"}`}>
                            {r.eta} away
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs font-black ${r.active ? "text-white" : "text-white/55"}`}>
                        {r.price}
                      </span>
                    </div>
                  ))}
                </div>

                <button className="w-full bg-[#795BFB] text-white font-black text-sm py-3 rounded-xl hover:bg-[#6849ea] hover:shadow-[0_0_22px_rgba(121,91,251,0.55)] transition-all duration-300">
                  Confirm Ride
                </button>
              </div>
            </div>

            {/* ── Floating driver card ──────────────────────────────── */}
            <div className="absolute left-0 top-16 w-52 bg-[#0b0b0b] border border-white/10 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.7)] animate-float-reverse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-[#795BFB]/20 border border-[#795BFB]/35 flex items-center justify-center font-black text-sm text-[#795BFB]">
                  W
                </div>
                <div>
                  <p className="text-[11px] font-bold text-white">Willie Tanner</p>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-[#FB5D5E] text-[#FB5D5E]" />
                    ))}
                    <span className="text-[9px] text-white/30 ml-1">4.8</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-[#00BB39]/8 border border-[#00BB39]/20 rounded-lg px-2.5 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00BB39] flex-shrink-0" />
                <span className="text-[10px] font-semibold text-[#00BB39]">En route · 3 min</span>
              </div>
            </div>

            {/* ── Floating fare card ──────────────────────────────────── */}
            <div className="absolute right-0 bottom-20 w-44 bg-[#795BFB] rounded-2xl p-4 shadow-[0_20px_50px_rgba(121,91,251,0.5)] animate-float">
              <p className="text-[9px] font-bold text-white/50 uppercase tracking-[0.12em] mb-1">
                Est. Fare
              </p>
              <p className="text-3xl font-black text-white leading-none mb-1">$12.00</p>
              <p className="text-[10px] text-white/60">COMFORT · 8.4 km</p>
              <div className="mt-2.5 h-px bg-white/20" />
              <p className="text-[10px] text-white/60 mt-2">
                Arrives in <strong className="text-white">4 min</strong>
              </p>
            </div>

            {/* ── SOS badge ───────────────────────────────────────────── */}
            <div className="absolute right-8 top-8 w-10 h-10 bg-[#FB5D5E]/10 border border-[#FB5D5E]/25 rounded-full flex items-center justify-center animate-border-pulse">
              <AlertTriangle className="w-5 h-5 text-[#FB5D5E]" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Scroll cue ───────────────────────────────────────────────── */}
      <div
        className="relative flex justify-center pb-12 animate-fade-in"
        style={{ animationDelay: "1200ms" }}
      >
        <div className="flex flex-col items-center gap-2 text-white/20">
          <span className="text-[9px] tracking-[0.25em] uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  );
}

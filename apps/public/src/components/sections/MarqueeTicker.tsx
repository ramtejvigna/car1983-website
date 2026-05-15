const ITEMS = [
  "ECONOMY", "COMFORT", "XL", "LUXURY",
  "50K+ RIDES", "4.9★ RATED", "VERIFIED DRIVERS", "EST. 1983",
  "STRIPE SECURED", "SOS PROTECTED", "24 / 7 SUPPORT",
];

export function MarqueeTicker() {
  // Duplicate for seamless loop
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div
      className="overflow-hidden bg-[#795BFB] py-4 select-none"
      aria-hidden="true"
    >
      <div className="flex gap-0 animate-marquee whitespace-nowrap will-change-transform">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-5 text-[11px] font-bold text-white/75 tracking-[0.2em] uppercase px-5"
          >
            {item}
            <span className="text-white/25 text-[8px]">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

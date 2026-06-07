export function RevenueChart() {
  return (
    <article className="bg-white rounded-2xl border border-[#e8e9f0] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight m-0">Revenue Overview</h2>
          <p className="text-[14px] text-[#6d7385] mt-1 m-0">Monthly revenue and ride statistics</p>
        </div>
        <div className="flex items-center gap-4 text-[13px] font-semibold text-[#70758b] shrink-0">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-violet-500 inline-block" aria-hidden /> Revenue
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-sky-400 inline-block" aria-hidden /> Rides
          </span>
        </div>
      </div>

      <svg className="w-full h-[270px] mt-4" viewBox="0 0 760 270" role="img" aria-label="Revenue and rides chart">
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8364ff" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#8364ff" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="ridesFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#27a8ff" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#27a8ff" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        {Array.from({ length: 5 }, (_, i) => (
          <line key={`h${i}`} x1="20" y1={26 + i * 55} x2="740" y2={26 + i * 55} className="chart-grid-line" />
        ))}
        {Array.from({ length: 10 }, (_, i) => (
          <line key={`v${i}`} x1={20 + i * 80} y1="24" x2={20 + i * 80} y2="246" className="chart-grid-line" />
        ))}

        <path className="chart-area-blue" d="M20,220 C80,230 90,150 180,160 C250,165 280,130 340,150 C410,175 455,140 520,125 C585,118 620,90 700,105 C720,110 735,95 740,92 L740,246 L20,246 Z" />
        <path className="chart-area-violet" d="M20,175 C85,220 105,110 175,130 C255,150 260,82 340,90 C430,105 450,38 530,72 C600,106 620,20 695,44 C720,50 732,30 740,24 L740,246 L20,246 Z" />

        <path className="chart-line chart-line-blue" d="M20,220 C80,230 90,150 180,160 C250,165 280,130 340,150 C410,175 455,140 520,125 C585,118 620,90 700,105 C720,110 735,95 740,92" />
        <path className="chart-line chart-line-violet" d="M20,175 C85,220 105,110 175,130 C255,150 260,82 340,90 C430,105 450,38 530,72 C600,106 620,20 695,44 C720,50 732,30 740,24" />
      </svg>
    </article>
  );
}

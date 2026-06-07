const SEGMENTS = [
  { label: "Premium", dot: "bg-violet-500" },
  { label: "Economy", dot: "bg-sky-400" },
  { label: "XL", dot: "bg-[#d7dcef]" },
];

export function DonutChart() {
  return (
    <article className="bg-white rounded-2xl border border-[#e8e9f0] p-5 flex flex-col">
      <h2 className="text-2xl font-extrabold tracking-tight m-0">Vehicle Distribution</h2>
      <p className="text-[14px] text-[#6d7385] mt-1">Rides by vehicle category</p>

      <div
        className="relative size-52 rounded-full mx-auto mt-6 bg-[conic-gradient(#8a63f6_0deg_184deg,#26a0df_184deg_318deg,#d7dcef_318deg_360deg)]"
        aria-hidden
      >
        <div className="absolute inset-7 rounded-full bg-white" />
      </div>

      <div className="flex justify-center flex-wrap gap-4 mt-5 text-[13px] font-semibold text-[#70758b]">
        {SEGMENTS.map(({ label, dot }) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className={`size-2.5 rounded-full inline-block ${dot}`} aria-hidden />
            {label}
          </span>
        ))}
      </div>
    </article>
  );
}

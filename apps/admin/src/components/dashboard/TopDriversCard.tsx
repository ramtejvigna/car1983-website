import { TOP_DRIVERS } from "./data";
import { Icon } from "./Icon";
import { PanelHeader } from "./PanelHeader";

export function TopDriversCard() {
  return (
    <article className="bg-white rounded-2xl border border-[#e8e9f0] overflow-hidden">
      <PanelHeader title="Top Drivers" subtitle="This month's best performers" icon="award" />

      <div className="divide-y divide-[#e6e8ef]">
        {TOP_DRIVERS.map((driver) => (
          <div key={driver.name} className="grid grid-cols-[auto_auto_minmax(0,1fr)_auto] items-center gap-4 px-7 py-6">
            <span
              className={[
                "size-12 rounded-full flex items-center justify-center text-xl font-extrabold",
                driver.rank <= 3 ? "bg-violet-500 text-white" : "bg-[#f3f4f8] text-[#6d7385]",
                driver.rank === 2 ? "bg-violet-300 text-[#202838]" : "",
                driver.rank === 3 ? "bg-violet-700" : "",
              ].join(" ")}
            >
              {driver.rank}
            </span>
            <span className="size-14 rounded-full border-4 border-[#ebe7f7] bg-violet-300 text-[#202838] flex items-center justify-center text-xl font-semibold">
              {driver.initials}
            </span>

            <div className="min-w-0">
              <h3 className="text-xl font-extrabold text-[#202838] truncate m-0">{driver.name}</h3>
              <p className="mt-2 flex flex-wrap items-center gap-2 text-[16px] font-medium text-[#6d7385] m-0">
                <Icon name="star" className="size-5 fill-violet-500 text-violet-500" />
                {driver.rating}
                <span aria-hidden>|</span>
                {driver.trips} trips
              </p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-extrabold text-violet-500 tracking-tight m-0">{driver.earnings}</p>
              <p className="mt-2 flex items-center justify-end gap-1 text-sm font-extrabold text-emerald-600 m-0">
                <Icon name="trend" className="size-4" />
                {driver.growth}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="w-full border-t border-[#e6e8ef] px-7 py-5 text-lg font-extrabold text-violet-500 hover:bg-violet-50 transition-colors">
        View all drivers -&gt;
      </button>
    </article>
  );
}

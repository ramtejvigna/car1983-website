import { RECENT_RIDES, STATUS_STYLES } from "./data";
import { Icon } from "./Icon";
import { PanelHeader } from "./PanelHeader";

export function RecentRidesCard() {
  return (
    <article className="bg-white rounded-2xl border border-[#e8e9f0] overflow-hidden">
      <PanelHeader title="Recent Rides" subtitle="Live feed of the latest ride activity" />

      <div className="divide-y divide-[#e6e8ef]">
        {RECENT_RIDES.map((ride) => (
          <div key={ride.id} className="grid gap-4 px-7 py-5 md:grid-cols-[minmax(0,1fr)_auto]">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-sm font-bold text-violet-500">{ride.id}</span>
                <span className={`rounded-full border px-3 py-1 text-sm font-extrabold ${STATUS_STYLES[ride.status]}`}>
                  {ride.status}
                </span>
                <span className="text-[15px] font-semibold text-[#6d7385]">{ride.vehicle}</span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-7 gap-y-2 text-[17px] font-semibold text-[#273041]">
                <span className="flex items-center gap-2">
                  <Icon name="user" className="size-4 text-[#6d7385]" />
                  {ride.rider}
                </span>
                <span className="flex items-center gap-2">
                  <Icon name="car" className="size-4 text-[#6d7385]" />
                  {ride.driver}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-[15px] font-medium text-[#6d7385]">
                <span className="flex items-center gap-2">
                  <Icon name="location" className="size-4 text-emerald-500" />
                  {ride.pickup}
                </span>
                <span aria-hidden>{"->"}</span>
                <span className="flex items-center gap-2">
                  <Icon name="pin" className="size-4 text-red-500" />
                  {ride.dropoff}
                </span>
              </div>
            </div>

            <div className="flex md:flex-col items-start md:items-end justify-between gap-2">
              <p className="flex items-center gap-2 text-2xl font-extrabold tracking-tight m-0 text-[#202838]">
                <Icon name="dollar" className="size-6 text-violet-500" />
                {ride.fare.replace("$", "")}
              </p>
              <p className="flex items-center gap-1.5 text-[15px] font-semibold text-[#6d7385] m-0 whitespace-nowrap">
                <Icon name="clock" className="size-4" />
                {ride.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

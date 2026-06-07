"use client";

import { AuthenticatedLayout } from "../components/dashboard/AuthenticatedLayout";
import ActiveRidesMap from "../components/ActiveRidesMapLoader";
import { ACTIVITY_STATS, TOP_STATS } from "../components/dashboard/data";
import { DonutChart } from "../components/dashboard/DonutChart";
import { Icon } from "../components/dashboard/Icon";
import { RecentRidesCard } from "../components/dashboard/RecentRidesCard";
import { RevenueChart } from "../components/dashboard/RevenueChart";
import { MiniCardWidget, StatCardWidget } from "../components/dashboard/StatCards";
import { TopDriversCard } from "../components/dashboard/TopDriversCard";

export default function DashboardPage() {
  return (
    <AuthenticatedLayout>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-[2.6rem] font-extrabold tracking-tight leading-none m-0">
            Dashboard
          </h1>
          <p className="mt-2 text-[15px] text-[#6d7385] m-0">
            Welcome back! Here&apos;s your platform overview.
          </p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[13px] font-semibold px-3.5 py-2 whitespace-nowrap">
          <Icon name="trend" className="size-4" />
          System Status: Operational
        </span>
      </div>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3" aria-label="Key metrics">
        {TOP_STATS.map((stat) => (
          <StatCardWidget key={stat.label} {...stat} />
        ))}
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3" aria-label="Activity summary">
        {ACTIVITY_STATS.map((stat) => (
          <MiniCardWidget key={stat.label} {...stat} />
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] gap-3" aria-label="Charts">
        <RevenueChart />
        <DonutChart />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-5" aria-label="Operations feed">
        <RecentRidesCard />
        <TopDriversCard />
        <ActiveRidesMap />
      </section>
    </AuthenticatedLayout>
  );
}

import { Icon } from "./Icon";

const HEADER_ACTIONS = [
  { icon: "bell" as const, label: "Notifications" },
  { icon: "settings" as const, label: "Settings" },
];

export function Header() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <label className="relative flex-1 min-w-[240px] max-w-[460px]" aria-label="Search">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#72698c] pointer-events-none" aria-hidden>
          <Icon name="search" className="size-4" />
        </span>
        <input
          type="search"
          placeholder="Search users, drivers, rides..."
          className="w-full h-11 pl-9 pr-4 rounded-xl border border-[#cfc3ee] bg-[linear-gradient(180deg,#d7c6f7_0%,#ccb4ed_100%)] text-[15px] text-[#4a4f63] placeholder:text-[#6d6c87] focus:outline-none focus:ring-2 focus:ring-violet-300/60"
        />
      </label>

      <div className="flex items-center gap-2.5">
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[13px] font-semibold px-3 py-1.5 whitespace-nowrap">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden />
          Live
        </span>

        {HEADER_ACTIONS.map(({ icon, label }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            title={label}
            className="size-9 rounded-full border border-[#e5e7f0] bg-white text-[#6f7487] flex items-center justify-center hover:bg-violet-50 transition-colors"
          >
            <Icon name={icon} className="size-4" />
          </button>
        ))}

        <button
          type="button"
          className="flex items-center gap-2 rounded-full border border-[#e5e7f0] bg-white pl-1.5 pr-4 py-1 hover:bg-violet-50 transition-colors"
        >
          <span className="size-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-sm font-bold shrink-0">
            A
          </span>
          <span className="text-left leading-tight">
            <strong className="block text-[13px] font-bold text-[#40475a]">Admin User</strong>
            <small className="block text-[11px] text-[#6d7385]">Super Admin</small>
          </span>
        </button>
      </div>
    </header>
  );
}

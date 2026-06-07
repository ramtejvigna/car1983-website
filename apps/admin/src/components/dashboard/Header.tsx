import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { toTitleCase } from "@car1983/utils";
import { Icon } from "./Icon";

const HEADER_ACTIONS = [
  { icon: "bell" as const, label: "Notifications" },
  { icon: "settings" as const, label: "Settings" },
];

export function Header() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initial = user?.fullName ? user.fullName[0].toUpperCase() : "A";
  const formattedRole = user?.role ? toTitleCase(user.role.replace(/_/g, " ")) : "Super Admin";

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 relative z-30">
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

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-full border border-[#e5e7f0] bg-white pl-1.5 pr-4 py-1 hover:bg-violet-50 transition-colors cursor-pointer"
          >
            <span className="size-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-sm font-bold shrink-0 animate-in zoom-in-50 duration-200">
              {initial}
            </span>
            <span className="text-left leading-tight">
              <strong className="block text-[13px] font-bold text-[#40475a]">
                {user?.fullName || "Admin User"}
              </strong>
              <small className="block text-[11px] text-[#6d7385]">{formattedRole}</small>
            </span>
            <svg
              className={`size-3 text-[#6d7385] transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-[#e4e2ec] bg-white p-2 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-[#f0f1f6] mb-1">
                <p className="text-xs text-[#8c88a5]">Logged in as</p>
                <p className="text-xs font-semibold text-[#40475a] truncate">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  void logout();
                }}
                className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-[#ff5f58] hover:bg-red-50 transition-colors cursor-pointer"
              >
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

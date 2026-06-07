"use client";

import { useState } from "react";
import { NAV_ITEMS } from "./data";
import { Icon } from "./Icon";

export function Sidebar({
  activeItem,
  onSelect,
}: {
  activeItem: string;
  onSelect: (item: string) => void;
}) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    NAV_ITEMS.reduce<Record<string, boolean>>((acc, item) => {
      if (item.children) {
        acc[item.label] = false;
      }

      return acc;
    }, {}),
  );

  function toggleGroup(label: string) {
    setOpenGroups((current) => ({
      ...current,
      [label]: !current[label],
    }));
  }

  return (
    <aside className="group/sidebar hidden lg:flex w-20 hover:w-[292px] focus-within:w-[292px] shrink-0 sticky top-0 h-screen flex-col overflow-y-auto overflow-x-hidden bg-[linear-gradient(180deg,#f6f4fb_0%,#f2f0f8_100%)] border-r border-[#d9d7e4] px-3.5 py-5 transition-[width] duration-200 ease-out">
      <div className="flex items-center gap-2.5 px-1 mb-4">
        <span className="size-9 shrink-0 rounded-xl flex items-center justify-center bg-[linear-gradient(140deg,#b99dff,#8764e9)] font-heading font-bold text-white text-sm">
          C
        </span>
        <div className="max-w-0 overflow-hidden opacity-0 transition-all duration-150 group-hover/sidebar:max-w-[180px] group-hover/sidebar:opacity-100 group-focus-within/sidebar:max-w-[180px] group-focus-within/sidebar:opacity-100">
          <p className="m-0 font-extrabold text-xl tracking-wide leading-none">CAR 1983</p>
          <p className="m-0 mt-0.5 text-[10px] tracking-[0.15em] text-[#82849a]">ADMIN PANEL</p>
        </div>
      </div>

      <nav aria-label="Main navigation" className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ label, children, icon }) => {
          const isOpen = children ? openGroups[label] : false;
          const isActive = activeItem === label;

          return (
            <div key={label}>
              <button
                type="button"
                title={label}
                aria-label={label}
                aria-expanded={children ? isOpen : undefined}
                onClick={() => {
                  onSelect(label);

                  if (children) {
                    toggleGroup(label);
                  }
                }}
                className={[
                  "flex items-center gap-2.5 w-full text-left rounded-xl px-3 py-2.5 text-[15px] font-semibold border transition-colors duration-150 cursor-pointer",
                  isActive
                    ? "bg-[#e6def8] border-[#d9cdf6] text-violet-600"
                    : "text-[#3b3f52] border-transparent hover:bg-violet-50 hover:text-violet-600",
                ].join(" ")}
              >
                <Icon
                  name={icon}
                  className={["size-5 shrink-0", isActive ? "text-violet-600" : "text-[#6d7385]"].join(" ")}
                />
                <span className="min-w-0 max-w-0 flex-1 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-150 group-hover/sidebar:max-w-[190px] group-hover/sidebar:opacity-100 group-focus-within/sidebar:max-w-[190px] group-focus-within/sidebar:opacity-100">
                  {label}
                </span>
                {children ? (
                  <span
                    className={[
                      "opacity-0 transition-all duration-150 group-hover/sidebar:opacity-100 group-focus-within/sidebar:opacity-100",
                      isOpen ? "rotate-180" : "",
                    ].join(" ")}
                  >
                    <Icon name="chevron" className="size-4 shrink-0 text-[#6d7385]" />
                  </span>
                ) : null}
              </button>

              {children && isOpen ? (
                <div className="ml-8 mt-1.5 mb-3 hidden border-l border-[#deddea] pl-4 group-hover/sidebar:flex group-focus-within/sidebar:flex flex-col gap-1.5">
                  {children.map((child) => {
                    const childKey = `${label}/${child.label}`;
                    const isChildActive = activeItem === childKey;

                    return (
                      <button
                        key={child.label}
                        type="button"
                        title={child.label}
                        onClick={() => onSelect(childKey)}
                        className={[
                          "cursor-pointer w-full rounded-2xl px-4 py-2.5 text-left text-[15px] font-semibold whitespace-nowrap transition-colors",
                          isChildActive && child.emphasis === "strong"
                            ? "bg-violet-400 text-[#202838]"
                            : isChildActive
                              ? "bg-[#e8ddf5] text-[#62697a]"
                              : "text-[#6d7385] hover:bg-violet-50 hover:text-violet-600",
                        ].join(" ")}
                      >
                        {child.label}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

import { TONE_ICON_BG, TONE_TEXT } from "./data";
import { Icon } from "./Icon";
import type { MiniCard, StatCard } from "./types";

export function StatCardWidget({ label, value, delta, tone }: StatCard) {
  return (
    <article className="bg-white rounded-2xl border border-[#e8e9f0] p-4">
      <div className="flex items-center justify-between mb-4">
        <span className={`size-11 rounded-xl flex items-center justify-center ${TONE_ICON_BG[tone]}`} aria-hidden>
          <Icon name="star" className="size-5" />
        </span>
        <span className="rounded-full bg-emerald-50 text-emerald-600 text-[13px] font-bold px-2.5 py-1">
          {delta}
        </span>
      </div>
      <p className="text-[2.4rem] font-extrabold tracking-tight leading-none m-0">{value}</p>
      <p className="mt-1.5 text-[14px] text-[#6d7385] m-0">{label}</p>
    </article>
  );
}

export function MiniCardWidget({ label, value, tone }: MiniCard) {
  return (
    <article className="bg-white rounded-2xl border border-[#e8e9f0] p-4">
      <p className={`text-[14px] font-bold m-0 ${TONE_TEXT[tone]}`}>{label}</p>
      <p className="text-[2.2rem] font-extrabold tracking-tight leading-none mt-2 m-0">{value}</p>
    </article>
  );
}

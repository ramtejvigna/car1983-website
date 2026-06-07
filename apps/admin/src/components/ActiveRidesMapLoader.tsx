'use client';

/**
 * Client Component wrapper — required because `dynamic(..., { ssr: false })`
 * is not permitted in Server Components (Next.js 16+).
 * Leaflet accesses `window` at import time, so SSR must be disabled.
 */
import dynamic from 'next/dynamic';

const ActiveRidesMap = dynamic(() => import('./ActiveRidesMap'), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-2xl border border-[#e8e9f0] h-[524px] xl:col-span-2 flex items-center justify-center">
      <span className="text-[15px] font-semibold text-[#6d7385]">Loading map…</span>
    </div>
  ),
});

export default ActiveRidesMap;

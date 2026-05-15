import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-5 text-center">
      <div className="w-16 h-16 rounded-full bg-[#CCFF33] flex items-center justify-center mb-8">
        <span className="text-2xl font-black text-black">?</span>
      </div>
      <h1 className="text-5xl font-black text-black tracking-tight mb-3">404</h1>
      <p className="text-lg text-gray-500 mb-8 max-w-sm">
        This page doesn&apos;t exist. Let&apos;s get you back on track.
      </p>
      <Link
        href="/"
        className="inline-flex items-center bg-black text-white font-bold rounded-full px-7 py-3 hover:opacity-80 transition-opacity"
      >
        Back to Home
      </Link>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to your error tracking service (e.g. Sentry) here
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-5 text-center">
      <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mb-8">
        <span className="text-2xl font-black text-[#CCFF33]">!</span>
      </div>
      <h1 className="text-3xl font-black text-black tracking-tight mb-3">
        Something went wrong
      </h1>
      <p className="text-gray-500 mb-8 max-w-sm">
        An unexpected error occurred. Please try again or go back to the
        homepage.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="inline-flex items-center bg-black text-white font-bold rounded-full px-7 py-3 hover:opacity-80 transition-opacity"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="inline-flex items-center border-2 border-black text-black font-bold rounded-full px-7 py-3 hover:bg-gray-50 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

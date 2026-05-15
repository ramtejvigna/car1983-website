"use client";

import { useEffect } from "react";

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-5 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Something went wrong
      </h1>
      <p className="text-gray-500 mb-6 text-sm">
        {error.digest ? `Error ID: ${error.digest}` : "An unexpected error occurred."}
      </p>
      <button
        onClick={reset}
        className="text-sm font-medium text-blue-600 hover:underline"
      >
        Try again
      </button>
    </div>
  );
}

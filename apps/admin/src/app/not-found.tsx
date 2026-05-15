import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not Found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-5 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
      <p className="text-gray-500 mb-6">Page not found.</p>
      <Link
        href="/"
        className="text-sm font-medium text-blue-600 hover:underline"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}

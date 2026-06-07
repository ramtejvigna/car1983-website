"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_30%_-20%,#f4f1ff_0%,#efedf4_60%)]">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
          <p className="text-sm font-semibold text-[#6d7385]">Verifying Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Determine active item based on pathname
  let activeItem = "Dashboard";
  if (pathname.startsWith("/users/riders")) {
    activeItem = "User Management/All Riders";
  } else if (pathname.startsWith("/users/drivers")) {
    activeItem = "Driver Management/All Drivers";
  } else if (pathname.startsWith("/users")) {
    activeItem = "User Management";
  }

  const handleSelect = (item: string) => {
    if (item === "Dashboard") {
      router.push("/");
    } else if (item.startsWith("User Management/All Riders") || item === "User Management") {
      router.push("/users/riders");
    } else if (item.startsWith("Driver Management/All Drivers") || item === "Driver Management") {
      router.push("/users/drivers");
    }
  };

  return (
    <div className="flex min-h-screen bg-[radial-gradient(circle_at_30%_-20%,#f4f1ff_0%,#efedf4_60%)] font-sans">
      <Sidebar activeItem={activeItem} onSelect={handleSelect} />

      <div className="flex-1 flex flex-col min-w-0 px-6 py-5 gap-5">
        <Header />
        <main className="flex flex-col gap-4">{children}</main>
      </div>
    </div>
  );
}

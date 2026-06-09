"use client";

import { AuthenticatedLayout } from "@/components/dashboard/AuthenticatedLayout";
import { DriverManagementPanel } from "@/components/dashboard/DriverManagementPanel";

export default function DriversPage() {
  return (
    <AuthenticatedLayout>
      <DriverManagementPanel />
    </AuthenticatedLayout>
  );
}

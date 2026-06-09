"use client";

import { AuthenticatedLayout } from "@/components/dashboard/AuthenticatedLayout";
import { RiderManagementPanel } from "@/components/dashboard/RiderManagementPanel";

export default function RidersPage() {
  return (
    <AuthenticatedLayout>
      <RiderManagementPanel />
    </AuthenticatedLayout>
  );
}

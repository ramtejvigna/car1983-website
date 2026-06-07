"use client";

import { AuthenticatedLayout } from "@/components/dashboard/AuthenticatedLayout";
import { UserManagementPanel } from "@/components/dashboard/UserManagementPanel";

export default function DriversPage() {
  return (
    <AuthenticatedLayout>
      <UserManagementPanel roleHint="DRIVER" />
    </AuthenticatedLayout>
  );
}

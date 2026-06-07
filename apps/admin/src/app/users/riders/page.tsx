"use client";

import { AuthenticatedLayout } from "@/components/dashboard/AuthenticatedLayout";
import { UserManagementPanel } from "@/components/dashboard/UserManagementPanel";

export default function RidersPage() {
  return (
    <AuthenticatedLayout>
      <UserManagementPanel roleHint="RIDER" />
    </AuthenticatedLayout>
  );
}

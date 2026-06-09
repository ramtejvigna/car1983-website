import { adminFetch, parseUserDetails } from "@/components/dashboard/user-management-utils";

/** Maps to driver-service GET /v1/driver/internal/profile/:driverId */
export async function fetchDriverProfile(driverId: string, token: string) {
  const json = await adminFetch<unknown>(`/api/admin/drivers/${driverId}/profile`, token);
  return parseUserDetails<Record<string, unknown>>(json);
}

/** Maps to driver-service GET /v1/driver/internal/stats/:driverId */
export async function fetchDriverStats(driverId: string, token: string) {
  const json = await adminFetch<unknown>(`/api/admin/drivers/${driverId}/stats`, token);
  return parseUserDetails<{
    driverId: string;
    rating: number;
    totalTrips: number;
    completedTrips: number;
    acceptanceRate: number;
    cancellationRate: number;
    vehicleType: string;
  }>(json);
}

/** Account status + verification metadata from admin user-management */
export async function fetchDriverAccount(driverId: string, token: string) {
  const json = await adminFetch<unknown>(`/api/admin/users/${driverId}`, token);
  return parseUserDetails<Record<string, unknown>>(json);
}

/** Maps to driver-service PATCH /v1/driver/internal/approve/:driverId */
export async function approveDriver(driverId: string, token: string, notes?: string) {
  return adminFetch(`/api/admin/drivers/${driverId}/approve`, token, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ notes: notes ?? "" }),
  });
}

/** Maps to driver-service PATCH /v1/driver/internal/reject/:driverId */
export async function rejectDriver(driverId: string, token: string, reason: string) {
  return adminFetch(`/api/admin/drivers/${driverId}/reject`, token, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ reason }),
  });
}

export async function assignDriverVerification(verificationId: string, token: string) {
  return adminFetch(`/api/admin/drivers/verification/${verificationId}/assign`, token, { method: "POST" });
}

export type DriverDocumentType = "license" | "insurance" | "registration" | "background";
export type DriverDocumentReviewStatus = "APPROVED" | "REJECTED" | "NEEDS_CLARIFICATION";

export async function reviewDriverDocument(
  verificationId: string,
  token: string,
  payload: {
    documentType: DriverDocumentType;
    status: DriverDocumentReviewStatus;
    notes?: string;
  },
) {
  return adminFetch(`/api/admin/drivers/verification/${verificationId}/document`, token, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
}

import { NextRequest } from "next/server";
import { proxyToAdminService } from "@/lib/admin-service-proxy";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  const { userId } = await context.params;
  return proxyToAdminService(request, `/v1/admin/users/${userId}/block`, { method: "PATCH" });
}

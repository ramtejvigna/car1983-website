import { NextRequest } from "next/server";
import { proxyToAdminService } from "@/lib/admin-service-proxy";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  const { userId } = await context.params;
  return proxyToAdminService(request, `/v1/admin/users/${userId}`);
}

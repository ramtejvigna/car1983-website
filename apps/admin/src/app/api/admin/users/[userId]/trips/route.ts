import { NextRequest } from "next/server";
import { proxyToAdminService } from "@/lib/admin-service-proxy";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
  return proxyToAdminService(request, `/v1/admin/users/${userId}/trips`);
}

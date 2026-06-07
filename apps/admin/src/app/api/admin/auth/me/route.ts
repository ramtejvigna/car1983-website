import { NextRequest } from "next/server";
import { proxyToAdminService } from "@/lib/admin-service-proxy";

export async function GET(request: NextRequest) {
  return proxyToAdminService(request, "/v1/admin/auth/me");
}

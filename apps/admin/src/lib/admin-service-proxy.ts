import { NextRequest, NextResponse } from "next/server";

const ADMIN_SERVICE_URL =
  process.env.ADMIN_SERVICE_URL ??
  process.env.NEXT_PUBLIC_ADMIN_SERVICE_URL ??
  "http://localhost:3004";

function resolveAuthorization(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  if (authorization) {
    return authorization;
  }

  const tokenFromHeader = request.headers.get("x-admin-token");
  if (tokenFromHeader) {
    return tokenFromHeader.startsWith("Bearer ") ? tokenFromHeader : `Bearer ${tokenFromHeader}`;
  }

  const tokenFromCookie = request.cookies.get("admin_token")?.value;
  if (tokenFromCookie) {
    return tokenFromCookie.startsWith("Bearer ") ? tokenFromCookie : `Bearer ${tokenFromCookie}`;
  }

  return null;
}

function buildBackendUrl(path: string, request: NextRequest) {
  const query = request.nextUrl.searchParams.toString();
  return `${ADMIN_SERVICE_URL}${path}${query ? `?${query}` : ""}`;
}

export async function proxyToAdminService(
  request: NextRequest,
  path: string,
  init?: RequestInit,
  options?: { skipAuth?: boolean },
) {
  let authorization = null;
  if (!options?.skipAuth) {
    authorization = resolveAuthorization(request);
    if (!authorization) {
      return NextResponse.json(
        {
          message: "Admin token is required. Provide it via x-admin-token header or admin_token cookie.",
        },
        { status: 401 },
      );
    }
  }

  try {
    const requestBody = init?.body ?? (request.method === "GET" ? undefined : await request.text());
    const contentType = request.headers.get("content-type") ?? "application/json";

    const response = await fetch(buildBackendUrl(path, request), {
      method: init?.method ?? request.method,
      body: requestBody,
      cache: "no-store",
      headers: {
        ...(authorization ? { authorization } : {}),
        ...(requestBody !== undefined ? { "content-type": contentType } : {}),
        ...(init?.headers ?? {}),
      },
    });

    const text = await response.text();

    if (!text) {
      return new NextResponse(null, { status: response.status });
    }

    try {
      const data = JSON.parse(text) as unknown;
      return NextResponse.json(data, { status: response.status });
    } catch {
      return new NextResponse(text, {
        status: response.status,
        headers: { "content-type": response.headers.get("content-type") ?? "text/plain" },
      });
    }
  } catch {
    return NextResponse.json(
      {
        message: "Unable to reach admin-service. Check ADMIN_SERVICE_URL and backend availability.",
      },
      { status: 502 },
    );
  }
}

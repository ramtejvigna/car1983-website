import { NextRequest, NextResponse } from "next/server";
import { proxyToAdminService } from "@/lib/admin-service-proxy";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const response = await proxyToAdminService(
      request,
      "/v1/admin/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "content-type": "application/json",
        },
      },
      { skipAuth: true }
    );

    if (response.status !== 200) {
      return response;
    }

    const data = await response.json();
    const { accessToken, expiresIn, admin } = data;

    const res = NextResponse.json({ accessToken, admin });

    // Set cookie on response
    res.cookies.set("admin_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: expiresIn || 3600,
    });

    return res;
  } catch (error) {
    console.error("Login API route error:", error);
    return NextResponse.json(
      { message: "Internal server error during login" },
      { status: 500 }
    );
  }
}

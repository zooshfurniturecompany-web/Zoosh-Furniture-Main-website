import { NextResponse } from "next/server";
import { getSessionCookieOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const cookieOptions = getSessionCookieOptions();
    const response = NextResponse.json({ success: true, message: "Logged out successfully" });

    // Clear session cookie
    response.cookies.set({
      name: cookieOptions.name,
      value: "",
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      path: cookieOptions.path,
      maxAge: 0
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}

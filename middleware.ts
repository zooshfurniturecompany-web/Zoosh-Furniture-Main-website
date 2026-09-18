import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "zoosh_admin_session";
const DEFAULT_SECRET = "zoosh_admin_cryptographic_secret_key_v2_2026";

function getSecretKey(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    DEFAULT_SECRET
  );
}

async function isTokenValid(token: string): Promise<boolean> {
  try {
    if (!token || !token.includes(".")) return false;
    const [payloadB64, signatureB64] = token.split(".");
    if (!payloadB64 || !signatureB64) return false;

    const secret = getSecretKey();
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    // Base64URL decode signature
    let sigBase64 = signatureB64.replace(/-/g, "+").replace(/_/g, "/");
    while (sigBase64.length % 4) sigBase64 += "=";
    const sigBytes = Uint8Array.from(atob(sigBase64), (c) => c.charCodeAt(0));

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      enc.encode(payloadB64)
    );

    if (!isValid) return false;

    // Base64URL decode payload and check expiry
    let payloadStr = payloadB64.replace(/-/g, "+").replace(/_/g, "/");
    while (payloadStr.length % 4) payloadStr += "=";
    const payload = JSON.parse(atob(payloadStr));

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes (except /login)
  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const valid = sessionCookie ? await isTokenValid(sessionCookie) : false;

    if (!valid) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect /api/admin routes
  if (pathname.startsWith("/api/admin")) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const valid = sessionCookie ? await isTokenValid(sessionCookie) : false;

    if (!valid) {
      return NextResponse.json(
        { error: "Unauthorized. Admin authentication required." },
        { status: 401 }
      );
    }
  }

  // If user visits /login and already has a valid session, redirect to /admin
  if (pathname === "/login") {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const valid = sessionCookie ? await isTokenValid(sessionCookie) : false;

    if (valid) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/login"
  ]
};

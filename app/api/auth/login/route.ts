import { NextResponse } from "next/server";
import {
  getAdminCredentials,
  createSessionToken,
  getSessionCookieOptions,
  checkRateLimit,
  recordFailedAttempt,
  clearFailedAttempts
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // 1. Extract IP for rate limiting
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    // 2. Check rate limit
    const limitCheck = checkRateLimit(ip);
    if (!limitCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed login attempts. Please wait ${limitCheck.waitSeconds} seconds before trying again.`,
          locked: true,
          waitSeconds: limitCheck.waitSeconds
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { username, email, password } = body;
    const inputIdentifier = (username || email || "").trim();
    const inputPassword = (password || "").trim();

    if (!inputIdentifier || !inputPassword) {
      return NextResponse.json(
        { error: "Username/Email and Password are required." },
        { status: 400 }
      );
    }

    // 3. Verify single admin credentials
    const { email: configuredEmail, password: configuredPassword } = getAdminCredentials();

    const isIdentifierValid =
      inputIdentifier.toLowerCase() === configuredEmail.toLowerCase() ||
      inputIdentifier.toLowerCase() === "admin" ||
      inputIdentifier.toLowerCase() === "zoosh";

    const isPasswordValid = inputPassword === configuredPassword;

    if (!isIdentifierValid || !isPasswordValid) {
      const attemptResult = recordFailedAttempt(ip);
      if (attemptResult.locked) {
        return NextResponse.json(
          {
            error: `Incorrect credentials. Account locked for 15 minutes due to too many failed attempts.`,
            locked: true,
            waitSeconds: attemptResult.waitSeconds
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          error: `Invalid admin credentials. ${attemptResult.attemptsLeft} attempt(s) remaining before temporary lockout.`,
          attemptsLeft: attemptResult.attemptsLeft
        },
        { status: 401 }
      );
    }

    // 4. Success - Clear failed attempts
    clearFailedAttempts(ip);

    // 5. Create secure signed session token
    const token = createSessionToken(configuredEmail);
    const cookieOptions = getSessionCookieOptions();

    const response = NextResponse.json(
      {
        success: true,
        user: {
          email: configuredEmail,
          name: "Zoosh Administrator",
          role: "admin"
        }
      },
      { status: 200 }
    );

    // Set HTTP-Only Secure Cookie
    response.cookies.set({
      name: cookieOptions.name,
      value: token,
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      path: cookieOptions.path,
      maxAge: cookieOptions.maxAge
    });

    return response;
  } catch (err: any) {
    console.error("Login route error:", err);
    return NextResponse.json(
      { error: "Authentication service error. Please try again." },
      { status: 500 }
    );
  }
}

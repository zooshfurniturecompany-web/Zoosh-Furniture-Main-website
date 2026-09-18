import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "zoosh_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days

// Default fallback credentials for initial login if environment variables are not yet set
const DEFAULT_ADMIN_EMAIL = "admin@zoosh.in";
const DEFAULT_ADMIN_PASSWORD = "zoosh@admin2026!";
const DEFAULT_SECRET = "zoosh_admin_cryptographic_secret_key_v2_2026";

function getSecretKey(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    DEFAULT_SECRET
  );
}

export function getAdminCredentials() {
  const email =
    process.env.ADMIN_EMAIL ||
    process.env.ADMIN_USERNAME ||
    DEFAULT_ADMIN_EMAIL;
  const password =
    process.env.ADMIN_PASSWORD ||
    DEFAULT_ADMIN_PASSWORD;

  return { email, password };
}

// In-memory rate limiting for brute-force protection
interface RateLimitRecord {
  attempts: number;
  lockedUntil: number;
  firstAttemptAt: number;
}

const loginAttempts = new Map<string, RateLimitRecord>();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const WINDOW_DURATION_MS = 15 * 60 * 1000;

export function checkRateLimit(ip: string): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record) return { allowed: true };

  // Check lockout
  if (record.lockedUntil > now) {
    const waitSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, waitSeconds };
  }

  // If window expired, reset
  if (now - record.firstAttemptAt > WINDOW_DURATION_MS) {
    loginAttempts.delete(ip);
    return { allowed: true };
  }

  if (record.attempts >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
    const waitSeconds = Math.ceil(LOCKOUT_DURATION_MS / 1000);
    return { allowed: false, waitSeconds };
  }

  return { allowed: true };
}

export function recordFailedAttempt(ip: string): { attemptsLeft: number; locked: boolean; waitSeconds?: number } {
  const now = Date.now();
  let record = loginAttempts.get(ip);

  if (!record || (now - record.firstAttemptAt > WINDOW_DURATION_MS)) {
    record = { attempts: 1, lockedUntil: 0, firstAttemptAt: now };
    loginAttempts.set(ip, record);
    return { attemptsLeft: MAX_FAILED_ATTEMPTS - 1, locked: false };
  }

  record.attempts += 1;
  if (record.attempts >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
    return {
      attemptsLeft: 0,
      locked: true,
      waitSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000)
    };
  }

  return { attemptsLeft: MAX_FAILED_ATTEMPTS - record.attempts, locked: false };
}

export function clearFailedAttempts(ip: string) {
  loginAttempts.delete(ip);
}

// ==========================================
// CRYPTOGRAPHIC SESSION TOKEN HANDLING
// ==========================================

export interface AdminSession {
  email: string;
  role: "admin";
  iat: number;
  exp: number;
}

export function createSessionToken(email: string): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: AdminSession = {
    email,
    role: "admin",
    iat: now,
    exp: now + SESSION_DURATION_SECONDS
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", getSecretKey())
    .update(encodedPayload)
    .digest("base64url");

  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string): AdminSession | null {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;

  try {
    const [encodedPayload, signature] = token.split(".");
    if (!encodedPayload || !signature) return null;

    const expectedSignature = createHmac("sha256", getSecretKey())
      .update(encodedPayload)
      .digest("base64url");

    // Timing-safe comparison to prevent timing attacks
    const sigBuffer = Buffer.from(signature);
    const expSigBuffer = Buffer.from(expectedSignature);

    if (sigBuffer.length !== expSigBuffer.length) return null;
    if (!timingSafeEqual(sigBuffer, expSigBuffer)) return null;

    const payload: AdminSession = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf-8")
    );

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null; // Expired
    }

    return payload;
  } catch (err) {
    return null;
  }
}

export function getSessionCookieOptions() {
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_DURATION_SECONDS
  };
}

export async function getServerSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifySessionToken(token);
  } catch (e) {
    return null;
  }
}

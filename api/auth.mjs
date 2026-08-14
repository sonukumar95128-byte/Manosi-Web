// Admin authentication: one shared password, verified against a scrypt hash
// held in an environment variable, exchanged for a signed session cookie.
//
// Nothing secret is stored in the database or the repo. Generate the values with
//   npm run auth:set-password
// then put ADMIN_PASSWORD_HASH and SESSION_SECRET in .env.local and in the
// Vercel project's Environment Variables.

import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "manosi_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

export function authConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD_HASH && process.env.SESSION_SECRET);
}

/**
 * True only for a real scrypt hash. Pasting the plain password into
 * ADMIN_PASSWORD_HASH is an easy mistake and otherwise shows up as an endless
 * "Incorrect password", so callers surface this as its own error.
 */
export function passwordHashValid(stored = process.env.ADMIN_PASSWORD_HASH) {
  const parts = String(stored || "").split(":");
  return parts.length === 3 && parts[0] === "scrypt" && parts[1].length === 32 && parts[2].length === 128;
}

// ---- password ---------------------------------------------------------------

export function hashPassword(password, salt = randomBytes(16).toString("hex")) {
  const derived = scryptSync(String(password), salt, 64).toString("hex");
  return `scrypt:${salt}:${derived}`;
}

export function verifyPassword(password, stored) {
  const parts = String(stored || "").split(":");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const [, salt, expected] = parts;
  const actual = scryptSync(String(password), salt, 64).toString("hex");
  const a = Buffer.from(actual, "hex");
  const b = Buffer.from(expected, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

// ---- session token ----------------------------------------------------------

function sign(payload) {
  return createHmac("sha256", process.env.SESSION_SECRET).update(payload).digest("base64url");
}

export function createSessionToken(now = Date.now()) {
  const payload = `${now + SESSION_TTL_MS}.${randomBytes(8).toString("hex")}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token) {
  const raw = String(token || "");
  const lastDot = raw.lastIndexOf(".");
  if (lastDot === -1) return false;

  const payload = raw.slice(0, lastDot);
  const signature = raw.slice(lastDot + 1);
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  const expiry = Number(payload.split(".")[0]);
  return Number.isFinite(expiry) && expiry > Date.now();
}

// ---- cookies ----------------------------------------------------------------

export function parseCookies(header) {
  return Object.fromEntries(
    String(header || "")
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        return index === -1 ? [part, ""] : [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      }),
  );
}

export function sessionCookie(token, { secure = true } = {}) {
  const maxAge = Math.floor(SESSION_TTL_MS / 1000);
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure ? "; Secure" : ""}`;
}

export function clearedCookie({ secure = true } = {}) {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure ? "; Secure" : ""}`;
}

export function isAuthenticated(cookieHeader) {
  if (!authConfigured()) return false;
  return verifySessionToken(parseCookies(cookieHeader)[SESSION_COOKIE]);
}

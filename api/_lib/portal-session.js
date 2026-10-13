import { createHash, randomBytes } from "node:crypto";

export const PORTAL_COOKIE = "santiel_portal_session";

export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export function createSessionToken() {
  return randomBytes(32).toString("hex");
}

export function hashSessionToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

export function readSessionToken(req) {
  const cookieHeader = req.headers.cookie || "";

  const cookies = cookieHeader.split(";");

  for (const cookie of cookies) {
    const separator = cookie.indexOf("=");

    if (separator === -1) continue;

    const name = cookie.slice(0, separator).trim();
    const value = cookie.slice(separator + 1).trim();

    if (name !== PORTAL_COOKIE) continue;

    if (!/^[a-f0-9]{64}$/.test(value)) {
      return null;
    }

    return value;
  }

  return null;
}

export function setSessionCookie(res, token) {
  const maxAge = Math.floor(SESSION_DURATION_MS / 1000);

  const secure = process.env.NODE_ENV === "production";

  const cookie = [
    `${PORTAL_COOKIE}=${token}`,
    "HttpOnly",
    "Path=/",
    "SameSite=Strict",
    `Max-Age=${maxAge}`,
    ...(secure ? ["Secure"] : []),
  ].join("; ");

  res.setHeader("Set-Cookie", cookie);
}

export function clearSessionCookie(res) {
  const secure = process.env.NODE_ENV === "production";

  const cookie = [
    `${PORTAL_COOKIE}=`,
    "HttpOnly",
    "Path=/",
    "SameSite=Strict",
    "Max-Age=0",
    ...(secure ? ["Secure"] : []),
  ].join("; ");

  res.setHeader("Set-Cookie", cookie);
}

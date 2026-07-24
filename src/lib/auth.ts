import { createHash, timingSafeEqual } from "crypto";

export const SESSION_COOKIE = "heirloom_session";

export function passwordMatches(input: string): boolean {
  const expected = process.env.APP_PASSWORD ?? "";
  if (!expected) return false;

  const inputHash = createHash("sha256").update(input).digest();
  const expectedHash = createHash("sha256").update(expected).digest();
  return timingSafeEqual(inputHash, expectedHash);
}

export function sanitizeNextPath(path: string | null | undefined): string {
  if (!path) return "/";
  if (!path.startsWith("/") || path.startsWith("//")) return "/";
  return path;
}

"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, passwordMatches, sanitizeNextPath } from "@/lib/auth";

const NINETY_DAYS = 60 * 60 * 24 * 90;

export async function login(formData: FormData) {
  const password = (formData.get("password") as string) ?? "";
  const next = sanitizeNextPath(formData.get("next") as string);

  // Slow down automated guessing.
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (!passwordMatches(password)) {
    redirect(`/login?error=1&next=${encodeURIComponent(next)}`);
  }

  const jar = await cookies();
  jar.set(SESSION_COOKIE, process.env.APP_SESSION_SECRET ?? "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: NINETY_DAYS,
  });

  redirect(next);
}

export async function logout() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect("/login");
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarLink({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  const pathname = usePathname();
  const active = isActivePath(pathname, href);

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "bg-secondary-soft text-secondary-foreground"
          : "text-foreground-muted hover:bg-surface-muted"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

export function TabLink({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  const pathname = usePathname();
  const active = isActivePath(pathname, href);

  return (
    <Link
      href={href}
      className={`flex flex-1 flex-col items-center gap-1 rounded-full py-1.5 text-xs font-medium transition-colors ${
        active ? "text-primary" : "text-foreground-muted"
      }`}
    >
      <span
        className={`flex items-center justify-center rounded-full px-4 py-1 ${
          active ? "bg-accent" : ""
        }`}
      >
        {icon}
      </span>
      {label}
    </Link>
  );
}

import { AppShell } from "@/components/app-shell";

// Every page here sits behind AppShell, which reads live data (the user's
// name) on every request, so none of them can be statically prerendered anyway.
export const dynamic = "force-dynamic";

export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}

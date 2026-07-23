import Link from "next/link";
import { Home, Users, Calendar, Archive, Settings, Plus } from "lucide-react";
import { SidebarLink, TabLink } from "@/components/nav-link";
import { Avatar } from "@/components/avatar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:flex md:w-64 md:flex-col md:gap-6 md:border-r md:border-border md:bg-surface md:p-6">
        <div className="flex items-center gap-2">
          <span className="font-display text-xl font-bold text-primary">Heirloom CRM</span>
        </div>

        <div className="flex items-center gap-3">
          <Avatar name="Alex" size="md" />
          <div>
            <p className="text-sm font-semibold">Welcome back</p>
            <p className="text-xs text-foreground-muted">Stay connected</p>
          </div>
        </div>

        <Link
          href="/reminders/new"
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          <Plus size={18} />
          Add Reminder
        </Link>

        <nav className="flex flex-col gap-1">
          <SidebarLink href="/" icon={<Home size={18} />} label="Home" />
          <SidebarLink href="/contacts" icon={<Users size={18} />} label="Contacts" />
          <SidebarLink href="/calendar" icon={<Calendar size={18} />} label="Calendar" />
          <SidebarLink href="/archive" icon={<Archive size={18} />} label="Archive" />
        </nav>

        <div className="mt-auto">
          <SidebarLink href="/settings" icon={<Settings size={18} />} label="Settings" />
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <main className="flex-1 pb-24 md:pb-0">{children}</main>

        <nav className="fixed inset-x-0 bottom-0 z-20 flex items-center gap-1 border-t border-border bg-surface-muted px-2 py-2 md:hidden">
          <TabLink href="/" icon={<Home size={20} />} label="Home" />
          <TabLink href="/contacts" icon={<Users size={20} />} label="Contacts" />
          <TabLink href="/calendar" icon={<Calendar size={20} />} label="Calendar" />
        </nav>

        <Link
          href="/reminders/new"
          className="fixed bottom-20 right-5 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-colors hover:bg-primary-hover md:hidden"
          aria-label="Add reminder"
        >
          <Plus size={26} />
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Hourglass } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { ReminderCard } from "@/components/reminder-card";
import { getPendingReminders, getCatchUpContacts } from "@/lib/queries";
import { formatDate, relativeToNow } from "@/lib/format";

export default async function HomePage() {
  const [reminders, catchUp] = await Promise.all([getPendingReminders(), getCatchUpContacts()]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <p className="text-sm text-foreground-muted">{formatDate(new Date())}</p>
      <h1 className="font-display mt-1 text-3xl font-bold">Hi, Alex!</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Here&apos;s who might appreciate reaching out today. Take your time.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-[1fr_280px]">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Pending Reminders</h2>
            <Link href="/calendar" className="text-sm font-medium text-secondary-foreground hover:underline">
              View Calendar
            </Link>
          </div>

          {reminders.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-dashed border-border p-6 text-center text-sm text-foreground-muted">
              Nothing pending. Enjoy the calm.
            </p>
          ) : (
            <div className="mt-4 flex flex-col gap-3">
              {reminders.map((reminder) => (
                <ReminderCard key={reminder.id} reminder={reminder} />
              ))}
            </div>
          )}
        </div>

        <aside className="rounded-2xl bg-surface-muted p-4">
          <div className="flex items-center gap-2">
            <Hourglass size={18} className="text-secondary-foreground" />
            <h3 className="font-display font-semibold">It&apos;s been a while</h3>
          </div>
          <p className="mt-1 text-xs text-foreground-muted">People you haven&apos;t talked to recently.</p>

          {catchUp.length === 0 ? (
            <p className="mt-4 text-sm text-foreground-muted">You&apos;re all caught up!</p>
          ) : (
            <ul className="mt-4 flex flex-col gap-3">
              {catchUp.map(({ contact, days }) => (
                <li key={contact.id}>
                  <Link
                    href={`/contacts/${contact.id}`}
                    className="flex items-center gap-3 rounded-xl px-1 py-1 hover:bg-surface"
                  >
                    <Avatar name={contact.name} avatarUrl={contact.avatarUrl} size="sm" />
                    <div>
                      <p className="text-sm font-medium">{contact.name}</p>
                      <p className="text-xs text-foreground-muted">{relativeToNow(new Date(Date.now() - days * 86400000))}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
}

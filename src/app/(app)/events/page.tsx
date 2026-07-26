import Link from "next/link";
import { Plus, Tag } from "lucide-react";
import { getEventsWithReminderCounts } from "@/lib/queries";
import { formatEventDateRange } from "@/lib/format";

export default async function EventsPage() {
  const events = await getEventsWithReminderCounts();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold">Events</h1>
        <Link
          href="/events/new"
          className="hidden items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover md:flex"
        >
          <Plus size={18} />
          New Event
        </Link>
      </div>
      <p className="mt-1 text-sm text-foreground-muted">
        Contexts like a trip or a get-together that reminders can be tied to instead of a fixed date.
      </p>

      <Link
        href="/events/new"
        className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover md:hidden"
      >
        <Plus size={18} />
        New Event
      </Link>

      {events.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-border p-6 text-center text-sm text-foreground-muted">
          No events yet. Create one for a trip or occasion, then add people to it whenever you like.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-primary"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-soft text-secondary-foreground">
                  <Tag size={16} />
                </span>
                <div>
                  <p className="font-display font-semibold">{event.name}</p>
                  <p className="text-xs text-foreground-muted">
                    {formatEventDateRange(event.date, event.endDate)}
                  </p>
                </div>
              </div>
              <p className="mt-3 border-t border-border pt-3 text-xs text-foreground-muted">
                {event._count.reminders} {event._count.reminders === 1 ? "person" : "people"} linked
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

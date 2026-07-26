import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil, Trash2, UserPlus, MessageSquare, Coffee, Phone, MoreHorizontal, Check } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { DangerButton } from "@/components/danger-button";
import { getEventDetail } from "@/lib/queries";
import { deleteEvent, completeReminder } from "@/lib/actions";
import { formatDate } from "@/lib/format";
import { ACTION_LABELS, type ActionType } from "@/lib/constants";

const ACTION_ICONS: Record<ActionType, typeof MessageSquare> = {
  message: MessageSquare,
  meetup: Coffee,
  checkin: Phone,
  other: MoreHorizontal,
};

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventDetail(id);
  if (!event) notFound();

  const pending = event.reminders.filter((r) => r.status === "pending");
  const done = event.reminders.filter((r) => r.status === "done");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
      <Link href="/events" className="inline-flex items-center gap-1 text-sm text-foreground-muted hover:text-foreground">
        <ArrowLeft size={16} />
        Back to Events
      </Link>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">{event.name}</h1>
          <p className="mt-1 text-sm text-foreground-muted">
            {event.date ? formatDate(event.date) : "No date set"}
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/events/${event.id}/edit`}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground-muted hover:bg-surface-muted"
          >
            <Pencil size={16} />
            Edit
          </Link>
          <form action={deleteEvent}>
            <input type="hidden" name="id" value={event.id} />
            <DangerButton
              confirmMessage={`Delete "${event.name}"? This also removes the ${event.reminders.length} reminder(s) linked to it. This cannot be undone.`}
              className="flex items-center gap-1.5 rounded-xl border border-urgent/40 bg-urgent-soft px-4 py-2 text-sm font-semibold text-urgent hover:brightness-95"
            >
              <Trash2 size={16} />
              Delete
            </DangerButton>
          </form>
        </div>
      </div>

      {event.notes && (
        <section className="mt-6 rounded-2xl bg-surface-muted p-5">
          <h2 className="font-display font-semibold">Notes</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-foreground-muted">{event.notes}</p>
        </section>
      )}

      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">People</h2>
          <Link
            href={`/reminders/new?eventContextId=${event.id}`}
            className="flex items-center gap-1.5 rounded-xl bg-secondary-soft px-3 py-1.5 text-sm font-semibold text-secondary-foreground hover:brightness-95"
          >
            <UserPlus size={16} />
            Add Person
          </Link>
        </div>

        {pending.length === 0 && done.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-border p-6 text-center text-sm text-foreground-muted">
            No one linked yet. Add a person whenever you&apos;re ready.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {pending.map((r) => {
              const Icon = ACTION_ICONS[r.actionType as ActionType] ?? MoreHorizontal;
              return (
                <div
                  key={r.id}
                  className={`flex items-center justify-between gap-3 rounded-2xl bg-surface p-4 shadow-sm ${
                    r.priority === "urgent" ? "border-l-4 border-urgent" : "border border-border"
                  }`}
                >
                  <Link href={`/contacts/${r.contactId}`} className="flex items-center gap-3">
                    <Avatar name={r.contact.name} avatarUrl={r.contact.avatarUrl} size="md" />
                    <div>
                      <p className="font-display font-semibold">{r.contact.name}</p>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-soft px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                        <Icon size={12} />
                        {ACTION_LABELS[r.actionType as ActionType] ?? "Other"}
                      </span>
                    </div>
                  </Link>
                  <form action={completeReminder}>
                    <input type="hidden" name="id" value={r.id} />
                    <button
                      type="submit"
                      className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
                    >
                      <Check size={14} />
                      Done
                    </button>
                  </form>
                </div>
              );
            })}

            {done.map((r) => (
              <div key={r.id} className="flex items-center gap-3 rounded-2xl border border-border bg-surface-muted p-4 opacity-70">
                <Avatar name={r.contact.name} avatarUrl={r.contact.avatarUrl} size="sm" />
                <div>
                  <p className="text-sm font-medium">{r.contact.name}</p>
                  <p className="text-xs text-foreground-muted">
                    {ACTION_LABELS[r.actionType as ActionType] ?? "Other"} · Done
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

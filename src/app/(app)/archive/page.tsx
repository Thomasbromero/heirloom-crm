import { Avatar } from "@/components/avatar";
import { getArchivedReminders } from "@/lib/queries";
import { ACTION_LABELS, type ActionType } from "@/lib/constants";
import { formatShortDate } from "@/lib/format";

export default async function ArchivePage() {
  const reminders = await getArchivedReminders();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
      <h1 className="font-display text-3xl font-bold">Archive</h1>
      <p className="mt-1 text-sm text-foreground-muted">Reminders you&apos;ve already taken care of.</p>

      {reminders.length === 0 ? (
        <p className="mt-10 text-center text-sm text-foreground-muted">Nothing completed yet.</p>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {reminders.map((r) => (
            <li key={r.id} className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
              <Avatar name={r.contact.name} avatarUrl={r.contact.avatarUrl} size="sm" />
              <div className="flex-1">
                <p className="text-sm font-medium">{r.contact.name}</p>
                <p className="text-xs text-foreground-muted">
                  {ACTION_LABELS[r.actionType as ActionType] ?? r.actionType}
                  {r.eventContext ? ` · ${r.eventContext.name}` : ""}
                </p>
              </div>
              {r.completedAt && (
                <span className="text-xs text-foreground-muted">{formatShortDate(r.completedAt)}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

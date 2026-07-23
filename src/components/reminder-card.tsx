import { MessageSquare, Coffee, Phone, MoreHorizontal, Check, Clock3 } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { completeReminder, snoozeReminder } from "@/lib/actions";
import { dueLabel } from "@/lib/format";
import { ACTION_LABELS, type ActionType } from "@/lib/constants";
import type { getPendingReminders } from "@/lib/queries";

type ReminderWithRelations = Awaited<ReturnType<typeof getPendingReminders>>[number];

const ACTION_ICONS: Record<ActionType, typeof MessageSquare> = {
  message: MessageSquare,
  meetup: Coffee,
  checkin: Phone,
  other: MoreHorizontal,
};

export function ReminderCard({ reminder, showContact = true }: { reminder: ReminderWithRelations; showContact?: boolean }) {
  const actionType = reminder.actionType as ActionType;
  const Icon = ACTION_ICONS[actionType] ?? MoreHorizontal;
  const urgent = reminder.priority === "urgent";
  const due = reminder.dueDate ? dueLabel(reminder.dueDate) : null;

  return (
    <div
      className={`rounded-2xl bg-surface p-4 shadow-sm ${
        urgent ? "border-l-4 border-urgent" : "border border-border"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {showContact && <Avatar name={reminder.contact.name} avatarUrl={reminder.contact.avatarUrl} size="md" />}
          <div>
            {showContact && <p className="font-display font-semibold">{reminder.contact.name}</p>}
            <p className="text-sm text-foreground-muted">
              {reminder.eventContext ? `Context: ${reminder.eventContext.name}` : due?.label}
            </p>
          </div>
        </div>
        {urgent && (
          <span className="whitespace-nowrap rounded-full bg-urgent-soft px-3 py-1 text-xs font-semibold text-urgent">
            High Priority
          </span>
        )}
      </div>

      {reminder.note && <p className="mt-2 text-sm text-foreground-muted">{reminder.note}</p>}

      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-soft px-3 py-1 text-xs font-medium text-secondary-foreground">
          <Icon size={14} />
          {ACTION_LABELS[actionType] ?? "Other"}
        </span>

        <div className="flex items-center gap-2">
          {reminder.dueDate && (
            <form action={snoozeReminder}>
              <input type="hidden" name="id" value={reminder.id} />
              <button
                type="submit"
                className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground-muted hover:bg-surface-muted"
              >
                <Clock3 size={14} />
                Snooze
              </button>
            </form>
          )}
          <form action={completeReminder}>
            <input type="hidden" name="id" value={reminder.id} />
            <button
              type="submit"
              className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
            >
              <Check size={14} />
              Done
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

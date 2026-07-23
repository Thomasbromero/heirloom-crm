"use client";

import { useState } from "react";
import { MessageSquare, Coffee, Phone, MoreHorizontal } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { createReminder } from "@/lib/actions";
import { ACTION_TYPES, ACTION_LABELS, type ActionType } from "@/lib/constants";

type Contact = { id: string; name: string; avatarUrl: string | null };
type EventContext = { id: string; name: string };

const ACTION_ICONS: Record<ActionType, typeof MessageSquare> = {
  message: MessageSquare,
  meetup: Coffee,
  checkin: Phone,
  other: MoreHorizontal,
};

export function ReminderForm({
  contacts,
  eventContexts,
  initialContactId,
}: {
  contacts: Contact[];
  eventContexts: EventContext[];
  initialContactId?: string;
}) {
  const [contactId, setContactId] = useState(initialContactId ?? contacts[0]?.id ?? "");
  const [actionType, setActionType] = useState<ActionType>("message");
  const [timingMode, setTimingMode] = useState<"date" | "event">("date");
  const [eventChoice, setEventChoice] = useState(eventContexts[0]?.id ?? "__new__");
  const [priority, setPriority] = useState<"normal" | "urgent">("normal");

  return (
    <form action={createReminder} className="mt-6 flex flex-col gap-6">
      <input type="hidden" name="contactId" value={contactId} />
      <input type="hidden" name="actionType" value={actionType} />
      <input type="hidden" name="timingMode" value={timingMode} />
      <input type="hidden" name="priority" value={priority} />

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">Who is this for?</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {contacts.map((c) => (
            <button
              type="button"
              key={c.id}
              onClick={() => setContactId(c.id)}
              className="flex flex-col items-center gap-1"
            >
              <Avatar name={c.name} avatarUrl={c.avatarUrl} size="md" ringed={contactId === c.id} />
              <span className="max-w-[64px] truncate text-xs text-foreground-muted">{c.name.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">What&apos;s the plan?</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {ACTION_TYPES.map((type) => {
            const Icon = ACTION_ICONS[type];
            const active = actionType === type;
            return (
              <button
                type="button"
                key={type}
                onClick={() => setActionType(type)}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                  active ? "border-primary bg-primary text-white" : "border-border bg-surface text-foreground-muted"
                }`}
              >
                <Icon size={16} />
                {ACTION_LABELS[type]}
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">When?</h2>
        <div className="mt-3 flex gap-2 rounded-full bg-surface-muted p-1">
          <button
            type="button"
            onClick={() => setTimingMode("date")}
            className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
              timingMode === "date" ? "bg-surface shadow-sm" : "text-foreground-muted"
            }`}
          >
            Specific Date
          </button>
          <button
            type="button"
            onClick={() => setTimingMode("event")}
            className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
              timingMode === "event" ? "bg-surface shadow-sm" : "text-foreground-muted"
            }`}
          >
            Linked to Event
          </button>
        </div>

        {timingMode === "date" ? (
          <div key="date-fields" className="mt-3 grid grid-cols-2 gap-3">
            <input
              type="date"
              name="dueDate"
              required={timingMode === "date"}
              className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
            <input
              type="time"
              name="dueTime"
              defaultValue="09:00"
              className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
        ) : (
          <div key="event-fields" className="mt-3 flex flex-col gap-3">
            <select
              value={eventChoice}
              onChange={(e) => setEventChoice(e.target.value)}
              className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary"
            >
              {eventContexts.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name}
                </option>
              ))}
              <option value="__new__">+ New context...</option>
            </select>

            {eventChoice === "__new__" ? (
              <input
                key="new-event-name"
                type="text"
                name="newEventName"
                placeholder="e.g. Trip to Argentina"
                required={timingMode === "event"}
                className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            ) : (
              <input key="existing-event-id" type="hidden" name="eventContextId" value={eventChoice} />
            )}
          </div>
        )}
      </section>

      <section className="flex items-center justify-between rounded-xl bg-surface-muted px-4 py-3">
        <div>
          <p className="text-sm font-semibold">Mark as Urgent</p>
          <p className="text-xs text-foreground-muted">Highlights this in your daily view</p>
        </div>
        <button
          type="button"
          onClick={() => setPriority(priority === "urgent" ? "normal" : "urgent")}
          className={`h-7 w-12 rounded-full p-1 transition-colors ${priority === "urgent" ? "bg-primary" : "bg-border"}`}
        >
          <span
            className={`block h-5 w-5 rounded-full bg-white transition-transform ${
              priority === "urgent" ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </section>

      <section>
        <label className="text-sm font-semibold uppercase tracking-wide text-foreground-muted" htmlFor="note">
          Notes (optional)
        </label>
        <textarea
          id="note"
          name="note"
          rows={3}
          placeholder="Add conversational cues, gift ideas, or past topics..."
          className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
      </section>

      <button
        type="submit"
        disabled={!contactId}
        className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-50"
      >
        Save Reminder
      </button>
    </form>
  );
}

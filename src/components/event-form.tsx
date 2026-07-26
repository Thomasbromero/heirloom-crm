type EventFormValues = {
  id?: string;
  name?: string;
  date?: Date | null;
  notes?: string | null;
};

function toDateInputValue(date?: Date | null) {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export function EventForm({
  action,
  event,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  event?: EventFormValues;
  submitLabel: string;
}) {
  return (
    <form action={action} className="mt-6 flex flex-col gap-5">
      {event?.id && <input type="hidden" name="id" value={event.id} />}

      <div>
        <label className="text-sm font-semibold" htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          required
          defaultValue={event?.name ?? ""}
          className="mt-1.5 w-full min-w-0 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
          placeholder="e.g. Trip to Argentina"
        />
      </div>

      <div>
        <label className="text-sm font-semibold" htmlFor="date">Date (optional)</label>
        <input
          id="date"
          name="date"
          type="date"
          defaultValue={toDateInputValue(event?.date)}
          className="mt-1.5 w-full min-w-0 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
        <p className="mt-1 text-xs text-foreground-muted">Leave blank if you don&apos;t have a date yet.</p>
      </div>

      <div>
        <label className="text-sm font-semibold" htmlFor="notes">Notes (optional)</label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={event?.notes ?? ""}
          className="mt-1.5 w-full min-w-0 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
          placeholder="Anything worth remembering about this event..."
        />
      </div>

      <button
        type="submit"
        className="mt-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-hover"
      >
        {submitLabel}
      </button>
    </form>
  );
}

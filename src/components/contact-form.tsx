import { CIRCLES, CIRCLE_LABELS, type Circle } from "@/lib/constants";

type ContactFormValues = {
  id?: string;
  name?: string;
  firstName?: string | null;
  lastName?: string | null;
  circle?: string;
  howMet?: string | null;
  birthday?: Date | null;
  phone?: string | null;
  email?: string | null;
  preferredContact?: string | null;
  notes?: string | null;
};

function toDateInputValue(date?: Date | null) {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

// Older contacts only have a combined `name`. Split it as a best-effort
// fallback so editing them still pre-fills sensible first/last names.
function defaultFirstName(contact?: ContactFormValues) {
  if (contact?.firstName) return contact.firstName;
  return contact?.name?.split(" ")[0] ?? "";
}

function defaultLastName(contact?: ContactFormValues) {
  if (contact?.lastName) return contact.lastName;
  return contact?.name?.split(" ").slice(1).join(" ") ?? "";
}

export function ContactForm({
  action,
  contact,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  contact?: ContactFormValues;
  submitLabel: string;
}) {
  const defaultCircleIndex = contact?.circle
    ? CIRCLES.indexOf(contact.circle as Circle)
    : 1;

  return (
    <form action={action} className="mt-6 flex flex-col gap-5">
      {contact?.id && <input type="hidden" name="id" value={contact.id} />}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold" htmlFor="firstName">First name</label>
          <input
            id="firstName"
            name="firstName"
            required
            defaultValue={defaultFirstName(contact)}
            className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
            placeholder="First name"
          />
        </div>
        <div>
          <label className="text-sm font-semibold" htmlFor="lastName">Last name</label>
          <input
            id="lastName"
            name="lastName"
            defaultValue={defaultLastName(contact)}
            className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
            placeholder="Last name (optional)"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold">Circle</label>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {CIRCLES.map((c, i) => (
            <label key={c} className="cursor-pointer">
              <input
                type="radio"
                name="circle"
                value={c}
                defaultChecked={i === (defaultCircleIndex === -1 ? 1 : defaultCircleIndex)}
                className="peer sr-only"
              />
              <span className="rounded-full bg-surface-muted px-4 py-1.5 text-sm font-medium text-foreground-muted peer-checked:bg-primary peer-checked:text-white">
                {CIRCLE_LABELS[c]}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold" htmlFor="howMet">How you met (optional)</label>
        <input
          id="howMet"
          name="howMet"
          defaultValue={contact?.howMet ?? ""}
          className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
          placeholder="Coffee shop downtown, college, work..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold" htmlFor="birthday">Birthday</label>
          <input
            id="birthday"
            name="birthday"
            type="date"
            defaultValue={toDateInputValue(contact?.birthday)}
            className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-sm font-semibold" htmlFor="preferredContact">Reach them via</label>
          <input
            id="preferredContact"
            name="preferredContact"
            defaultValue={contact?.preferredContact ?? ""}
            className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
            placeholder="WhatsApp, Instagram..."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold" htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            defaultValue={contact?.phone ?? ""}
            className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-sm font-semibold" htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={contact?.email ?? ""}
            className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold" htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          defaultValue={contact?.notes ?? ""}
          className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
          placeholder="Conversational cues, gift ideas, things to remember..."
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

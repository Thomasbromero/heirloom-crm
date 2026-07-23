import { createContact } from "@/lib/actions";
import { CIRCLES, CIRCLE_LABELS } from "@/lib/constants";

export default function NewContactPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-8 md:px-8">
      <h1 className="font-display text-3xl font-bold">New Contact</h1>
      <p className="mt-1 text-sm text-foreground-muted">Who do you want to keep track of?</p>

      <form action={createContact} className="mt-6 flex flex-col gap-5">
        <div>
          <label className="text-sm font-semibold" htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            required
            className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
            placeholder="Full name"
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Circle</label>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {CIRCLES.map((c, i) => (
              <label key={c} className="cursor-pointer">
                <input type="radio" name="circle" value={c} defaultChecked={i === 1} className="peer sr-only" />
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
              className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-sm font-semibold" htmlFor="preferredContact">Reach them via</label>
            <input
              id="preferredContact"
              name="preferredContact"
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
              className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-sm font-semibold" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
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
            className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
            placeholder="Conversational cues, gift ideas, things to remember..."
          />
        </div>

        <button
          type="submit"
          className="mt-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          Save Contact
        </button>
      </form>
    </div>
  );
}

import Link from "next/link";
import { Search, UserPlus } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { getContacts } from "@/lib/queries";
import { relativeToNow } from "@/lib/format";
import { CIRCLES, CIRCLE_LABELS } from "@/lib/constants";

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; circle?: string }>;
}) {
  const { q, circle } = await searchParams;
  const contacts = await getContacts(q, circle);

  const chips = [{ value: "all", label: "All" }, ...CIRCLES.map((c) => ({ value: c, label: CIRCLE_LABELS[c] }))];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold">Contacts</h1>
        <Link
          href="/contacts/new"
          className="hidden items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover md:flex"
        >
          <UserPlus size={18} />
          Add Contact
        </Link>
      </div>

      <form className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between" action="/contacts">
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <Link
              key={chip.value}
              href={`/contacts?${new URLSearchParams({ ...(q ? { q } : {}), circle: chip.value }).toString()}`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                (circle ?? "all") === chip.value
                  ? "bg-primary text-white"
                  : "bg-surface-muted text-foreground-muted hover:bg-border"
              }`}
            >
              {chip.label}
            </Link>
          ))}
        </div>

        <div className="relative">
          {circle && <input type="hidden" name="circle" value={circle} />}
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
          <input
            type="text"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search contacts..."
            className="w-full rounded-full border border-border bg-surface py-2 pl-9 pr-4 text-sm outline-none focus:border-primary md:w-64"
          />
        </div>
      </form>

      <Link
        href="/contacts/new"
        className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover md:hidden"
      >
        <UserPlus size={18} />
        Add Contact
      </Link>

      {contacts.length === 0 ? (
        <p className="mt-10 text-center text-sm text-foreground-muted">No contacts match yet.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {contacts.map((contact) => (
            <Link
              key={contact.id}
              href={`/contacts/${contact.id}`}
              className="rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-primary"
            >
              <div className="flex items-center gap-3">
                <Avatar name={contact.name} avatarUrl={contact.avatarUrl} size="md" />
                <div>
                  <p className="font-display font-semibold">{contact.name}</p>
                  <span className="mt-0.5 inline-block rounded-full bg-secondary-soft px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                    {CIRCLE_LABELS[contact.circle as keyof typeof CIRCLE_LABELS] ?? contact.circle}
                  </span>
                </div>
              </div>
              <p className="mt-3 border-t border-border pt-3 text-xs text-foreground-muted">
                Last contacted: {relativeToNow(contact.lastContact)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

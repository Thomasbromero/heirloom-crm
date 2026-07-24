import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Cake, Phone, Mail, MessageCircle, Bell, PlusCircle } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { ReminderCard } from "@/components/reminder-card";
import { getContactDetail } from "@/lib/queries";
import { getPendingReminders } from "@/lib/queries";
import { logInteraction } from "@/lib/actions";
import { birthdayLabel, formatShortDate, whatsappLink } from "@/lib/format";
import { CIRCLE_LABELS, INTERACTION_TYPES, INTERACTION_LABELS, type Circle } from "@/lib/constants";

export default async function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contact = await getContactDetail(id);
  if (!contact) notFound();

  const allPending = await getPendingReminders();
  const reminders = allPending.filter((r) => r.contactId === id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <Link href="/contacts" className="inline-flex items-center gap-1 text-sm text-foreground-muted hover:text-foreground">
        <ArrowLeft size={16} />
        Back to Contacts
      </Link>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={contact.name} avatarUrl={contact.avatarUrl} size="xl" ringed />
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">{contact.name}</h1>
            <span className="mt-1 inline-block rounded-full bg-secondary-soft px-3 py-0.5 text-xs font-medium text-secondary-foreground">
              {CIRCLE_LABELS[contact.circle as Circle] ?? contact.circle}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/reminders/new?contactId=${contact.id}`}
            className="flex items-center gap-1.5 rounded-xl bg-secondary-soft px-4 py-2 text-sm font-semibold text-secondary-foreground hover:brightness-95"
          >
            <Bell size={16} />
            Remind Me
          </Link>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <section className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="font-display font-semibold">About {contact.name.split(" ")[0]}</h2>
            <dl className="mt-3 flex flex-col gap-3 text-sm">
              {contact.birthday && (
                <div className="flex items-center gap-3">
                  <Cake size={16} className="text-foreground-muted" />
                  <span>{birthdayLabel(contact.birthday)}</span>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-foreground-muted" />
                    <span>{contact.phone}</span>
                  </div>
                  <a
                    href={whatsappLink(contact.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-secondary-soft px-3 py-1 text-xs font-semibold text-secondary-foreground hover:brightness-95"
                  >
                    WhatsApp
                  </a>
                </div>
              )}
              {contact.email && (
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-foreground-muted" />
                  <span>{contact.email}</span>
                </div>
              )}
              {contact.preferredContact && (
                <div className="flex items-center gap-3">
                  <MessageCircle size={16} className="text-foreground-muted" />
                  <span>{contact.preferredContact}</span>
                </div>
              )}
              {contact.howMet && (
                <div className="text-foreground-muted">Met: {contact.howMet}</div>
              )}
            </dl>
          </section>

          <section className="rounded-2xl bg-surface-muted p-5">
            <h2 className="font-display font-semibold">Notes</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-foreground-muted">
              {contact.notes || "No notes yet."}
            </p>
          </section>

          {reminders.length > 0 && (
            <section>
              <h2 className="font-display font-semibold">Open Reminders</h2>
              <div className="mt-3 flex flex-col gap-3">
                {reminders.map((r) => (
                  <ReminderCard key={r.id} reminder={r} showContact={false} />
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <section className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="font-display flex items-center gap-2 font-semibold">
              <PlusCircle size={18} />
              Log an Interaction
            </h2>
            <form action={logInteraction} className="mt-3 flex flex-col gap-3">
              <input type="hidden" name="contactId" value={contact.id} />
              <div className="flex flex-wrap gap-2">
                {INTERACTION_TYPES.map((t, i) => (
                  <label key={t} className="cursor-pointer">
                    <input type="radio" name="type" value={t} defaultChecked={i === 0} className="peer sr-only" />
                    <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-foreground-muted peer-checked:bg-primary peer-checked:text-white">
                      {INTERACTION_LABELS[t]}
                    </span>
                  </label>
                ))}
              </div>
              <textarea
                name="note"
                rows={2}
                placeholder="What did you talk about?"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="self-start rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
              >
                Add to Timeline
              </button>
            </form>
          </section>

          <section>
            <h2 className="font-display font-semibold">Timeline</h2>
            {contact.interactions.length === 0 ? (
              <p className="mt-3 text-sm text-foreground-muted">No interactions logged yet.</p>
            ) : (
              <ol className="mt-3 flex flex-col gap-4 border-l border-border pl-4">
                {contact.interactions.map((interaction) => (
                  <li key={interaction.id} className="relative">
                    <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
                    <p className="text-xs text-foreground-muted">{formatShortDate(interaction.date)}</p>
                    <p className="text-sm font-medium">
                      {INTERACTION_LABELS[interaction.type as keyof typeof INTERACTION_LABELS] ?? interaction.type}
                    </p>
                    {interaction.note && <p className="text-sm text-foreground-muted">{interaction.note}</p>}
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

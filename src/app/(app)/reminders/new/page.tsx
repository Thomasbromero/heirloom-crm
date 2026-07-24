import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ReminderForm } from "@/components/reminder-form";
import { prisma } from "@/lib/prisma";
import { getEventContexts } from "@/lib/queries";

export default async function NewReminderPage({
  searchParams,
}: {
  searchParams: Promise<{ contactId?: string }>;
}) {
  const { contactId } = await searchParams;

  const [contacts, eventContexts] = await Promise.all([
    prisma.contact.findMany({ select: { id: true, name: true, avatarUrl: true }, orderBy: { name: "asc" } }),
    getEventContexts(),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-8">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-foreground-muted hover:text-foreground">
        <ArrowLeft size={16} />
        Cancel
      </Link>

      <h1 className="font-display mt-4 text-3xl font-bold">New Reminder</h1>
      <p className="mt-1 text-sm text-foreground-muted">Who and what do you want to remember?</p>

      {contacts.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-border p-6 text-center text-sm text-foreground-muted">
          Add a contact first before creating a reminder.{" "}
          <Link href="/contacts/new" className="font-semibold text-primary hover:underline">
            Add Contact
          </Link>
        </p>
      ) : (
        <ReminderForm contacts={contacts} eventContexts={eventContexts} initialContactId={contactId} />
      )}
    </div>
  );
}

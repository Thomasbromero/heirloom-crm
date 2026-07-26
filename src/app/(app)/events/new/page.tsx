import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EventForm } from "@/components/event-form";
import { createEvent } from "@/lib/actions";

export default function NewEventPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-8 md:px-8">
      <Link href="/events" className="inline-flex items-center gap-1 text-sm text-foreground-muted hover:text-foreground">
        <ArrowLeft size={16} />
        Back to Events
      </Link>

      <h1 className="font-display mt-4 text-3xl font-bold">New Event</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Create it now, add people to it whenever you&apos;re ready.
      </p>

      <EventForm action={createEvent} submitLabel="Create Event" />
    </div>
  );
}

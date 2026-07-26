import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { EventForm } from "@/components/event-form";
import { getEventDetail } from "@/lib/queries";
import { updateEvent } from "@/lib/actions";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventDetail(id);
  if (!event) notFound();

  return (
    <div className="mx-auto max-w-lg px-4 py-8 md:px-8">
      <Link
        href={`/events/${event.id}`}
        className="inline-flex items-center gap-1 text-sm text-foreground-muted hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to {event.name}
      </Link>

      <h1 className="font-display mt-4 text-3xl font-bold">Edit Event</h1>

      <EventForm action={updateEvent} event={event} submitLabel="Save Changes" />
    </div>
  );
}

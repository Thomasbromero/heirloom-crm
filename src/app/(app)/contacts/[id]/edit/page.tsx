import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getContactDetail } from "@/lib/queries";
import { updateContact } from "@/lib/actions";
import { ContactForm } from "@/components/contact-form";

export default async function EditContactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contact = await getContactDetail(id);
  if (!contact) notFound();

  return (
    <div className="mx-auto max-w-lg px-4 py-8 md:px-8">
      <Link
        href={`/contacts/${contact.id}`}
        className="inline-flex items-center gap-1 text-sm text-foreground-muted hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to {contact.name}
      </Link>

      <h1 className="font-display mt-4 text-3xl font-bold">Edit Contact</h1>

      <ContactForm action={updateContact} contact={contact} submitLabel="Save Changes" />
    </div>
  );
}

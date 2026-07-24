import { createContact } from "@/lib/actions";
import { ContactForm } from "@/components/contact-form";

export default function NewContactPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-8 md:px-8">
      <h1 className="font-display text-3xl font-bold">New Contact</h1>
      <p className="mt-1 text-sm text-foreground-muted">Who do you want to keep track of?</p>

      <ContactForm action={createContact} submitLabel="Save Contact" />
    </div>
  );
}

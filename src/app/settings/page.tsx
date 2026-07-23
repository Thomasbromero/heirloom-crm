import { AlertTriangle } from "lucide-react";
import { getAppSettings } from "@/lib/queries";
import { setAppName, resetAllData } from "@/lib/actions";
import { DangerButton } from "@/components/danger-button";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getAppSettings();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-8">
      <h1 className="font-display text-3xl font-bold">Settings</h1>
      <p className="mt-2 text-sm text-foreground-muted">
        Notifications are coming in a later version. For now, this is where the basics live.
      </p>

      <section className="mt-8 rounded-2xl border border-border bg-surface p-5">
        <h2 className="font-display font-semibold">Your name</h2>
        <p className="mt-1 text-sm text-foreground-muted">Shown in greetings around the app.</p>
        <form action={setAppName} className="mt-4 flex gap-3">
          <input
            name="name"
            required
            defaultValue={settings?.name ?? ""}
            className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            Save
          </button>
        </form>
      </section>

      <section className="mt-8 rounded-2xl border border-urgent/40 bg-urgent-soft p-5">
        <h2 className="font-display flex items-center gap-2 font-semibold text-urgent">
          <AlertTriangle size={18} />
          Danger zone
        </h2>
        <p className="mt-1 text-sm text-foreground-muted">
          Permanently deletes every contact, reminder, event, and interaction, and forgets your name (you&apos;ll go through the welcome screen again). This cannot be undone.
        </p>
        <form action={resetAllData} className="mt-4">
          <DangerButton
            confirmMessage="This will permanently delete ALL contacts, reminders, and history, and reset your name. This cannot be undone. Are you sure?"
            className="rounded-xl bg-urgent px-4 py-2.5 text-sm font-semibold text-white hover:brightness-95"
          >
            Reset everything to zero
          </DangerButton>
        </form>
      </section>
    </div>
  );
}

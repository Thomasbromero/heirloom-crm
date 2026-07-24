import { completeOnboarding } from "@/lib/actions";

export default function OnboardingPage() {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col items-center justify-center px-4 py-8 text-center">
      <span className="font-display text-2xl font-bold text-primary">Heirloom CRM</span>
      <h1 className="font-display mt-4 text-3xl font-bold">Welcome!</h1>
      <p className="mt-2 text-sm text-foreground-muted">
        Before we get started, what should we call you?
      </p>

      <form action={completeOnboarding} className="mt-6 flex w-full flex-col gap-4">
        <input
          name="name"
          required
          autoFocus
          placeholder="Your name"
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-center text-sm outline-none focus:border-primary"
        />
        <button
          type="submit"
          className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          Let&apos;s go
        </button>
      </form>
    </div>
  );
}

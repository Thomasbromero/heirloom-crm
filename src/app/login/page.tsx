import { login } from "@/lib/auth-actions";
import { sanitizeNextPath } from "@/lib/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const safeNext = sanitizeNextPath(next);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 text-center">
      <span className="font-display text-2xl font-bold text-primary">Heirloom CRM</span>
      <h1 className="font-display mt-4 text-3xl font-bold">Enter password</h1>
      <p className="mt-2 text-sm text-foreground-muted">This app is private. Enter the password to continue.</p>

      <form action={login} className="mt-6 flex w-full flex-col gap-4">
        <input type="hidden" name="next" value={safeNext} />
        <input
          name="password"
          type="password"
          required
          autoFocus
          placeholder="Password"
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-center text-sm outline-none focus:border-primary"
        />
        {error && <p className="text-sm text-urgent">Wrong password. Try again.</p>}
        <button
          type="submit"
          className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          Unlock
        </button>
      </form>
    </div>
  );
}

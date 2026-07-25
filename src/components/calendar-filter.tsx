"use client";

import { useRouter } from "next/navigation";

type ContactOption = { id: string; name: string };

export function CalendarFilter({
  contacts,
  year,
  month,
  selectedContactId,
}: {
  contacts: ContactOption[];
  year: number;
  month: number;
  selectedContactId?: string;
}) {
  const router = useRouter();

  return (
    <select
      value={selectedContactId ?? "all"}
      onChange={(e) => {
        const params = new URLSearchParams({ year: String(year), month: String(month) });
        if (e.target.value !== "all") params.set("contactId", e.target.value);
        router.push(`/calendar?${params.toString()}`);
      }}
      className="rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
    >
      <option value="all">All contacts</option>
      {contacts.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </select>
  );
}

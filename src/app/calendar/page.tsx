import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { getRemindersForMonth } from "@/lib/queries";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function buildGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: { date: Date; inMonth: boolean }[] = [];

  for (let i = startOffset - 1; i >= 0; i--) {
    cells.push({ date: new Date(year, month - 1, daysInPrevMonth - i), inMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), inMonth: true });
  }
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1].date;
    const next = new Date(last);
    next.setDate(next.getDate() + 1);
    cells.push({ date: next, inMonth: false });
  }

  const weeks: (typeof cells)[] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const { year: yearParam, month: monthParam } = await searchParams;
  const now = new Date();
  const year = yearParam ? parseInt(yearParam, 10) : now.getFullYear();
  const month = monthParam ? parseInt(monthParam, 10) : now.getMonth();

  const reminders = await getRemindersForMonth(year, month);
  const remindersByDay = new Map<number, typeof reminders>();
  for (const r of reminders) {
    if (!r.dueDate) continue;
    const day = r.dueDate.getDate();
    remindersByDay.set(day, [...(remindersByDay.get(day) ?? []), r]);
  }

  const weeks = buildGrid(year, month);
  const prev = month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 };
  const next = month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">
          {MONTH_NAMES[month]} {year}
        </h1>
        <div className="flex gap-2">
          <Link
            href={`/calendar?year=${prev.year}&month=${prev.month}`}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-surface-muted"
          >
            <ChevronLeft size={18} />
          </Link>
          <Link
            href={`/calendar?year=${next.year}&month=${next.month}`}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-surface-muted"
          >
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-px overflow-hidden rounded-2xl border border-border bg-border text-center text-xs font-semibold text-foreground-muted">
        {WEEKDAYS.map((d) => (
          <div key={d} className="bg-surface-muted py-2">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-b-2xl border-x border-b border-border bg-border">
        {weeks.flat().map(({ date, inMonth }, i) => {
          const dayReminders = inMonth ? remindersByDay.get(date.getDate()) ?? [] : [];
          const isToday =
            date.toDateString() === now.toDateString();

          return (
            <div
              key={i}
              className={`min-h-24 bg-surface p-1.5 sm:min-h-28 ${inMonth ? "" : "opacity-40"}`}
            >
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                  isToday ? "bg-primary font-semibold text-white" : "text-foreground-muted"
                }`}
              >
                {date.getDate()}
              </span>

              <div className="mt-1 flex flex-col gap-1">
                {dayReminders.slice(0, 2).map((r) => (
                  <Link
                    key={r.id}
                    href={`/contacts/${r.contactId}`}
                    className={`flex items-center gap-1 truncate rounded-md px-1 py-0.5 text-[10px] font-medium sm:text-xs ${
                      r.priority === "urgent"
                        ? "bg-urgent-soft text-urgent"
                        : "bg-secondary-soft text-secondary-foreground"
                    }`}
                  >
                    <Avatar name={r.contact.name} avatarUrl={r.contact.avatarUrl} size="sm" />
                    <span className="truncate">{r.contact.name.split(" ")[0]}</span>
                  </Link>
                ))}
                {dayReminders.length > 2 && (
                  <span className="text-[10px] text-foreground-muted">+{dayReminders.length - 2} more</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-foreground-muted">
        Only reminders with a specific date show here. Reminders linked to an event (like a trip) appear on your{" "}
        <Link href="/" className="font-medium text-secondary-foreground hover:underline">
          Home
        </Link>{" "}
        dashboard instead.
      </p>
    </div>
  );
}

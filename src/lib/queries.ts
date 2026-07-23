import { prisma } from "@/lib/prisma";
import { CATCH_UP_THRESHOLD_DAYS } from "@/lib/constants";
import { daysBetween } from "@/lib/format";

export async function getPendingReminders() {
  const reminders = await prisma.reminder.findMany({
    where: { status: "pending" },
    include: { contact: true, eventContext: true },
    orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
  });

  return reminders.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority === "urgent" ? -1 : 1;
    const aTime = a.dueDate?.getTime() ?? Infinity;
    const bTime = b.dueDate?.getTime() ?? Infinity;
    return aTime - bTime;
  });
}

export async function getArchivedReminders() {
  return prisma.reminder.findMany({
    where: { status: "done" },
    include: { contact: true, eventContext: true },
    orderBy: { completedAt: "desc" },
  });
}

export async function getContactLastContactMap() {
  const contacts = await prisma.contact.findMany({
    include: { interactions: { orderBy: { date: "desc" }, take: 1 } },
  });

  return new Map(
    contacts.map((c) => [c.id, c.interactions[0]?.date ?? c.createdAt] as const)
  );
}

export async function getCatchUpContacts(limit = 5) {
  const lastContactMap = await getContactLastContactMap();
  const now = new Date();

  const stale = [...lastContactMap.entries()]
    .map(([contactId, lastDate]) => ({ contactId, lastDate, days: daysBetween(lastDate, now) }))
    .filter((c) => c.days >= CATCH_UP_THRESHOLD_DAYS)
    .sort((a, b) => b.days - a.days)
    .slice(0, limit);

  const contacts = await prisma.contact.findMany({
    where: { id: { in: stale.map((s) => s.contactId) } },
  });

  const contactMap = new Map(contacts.map((c) => [c.id, c]));

  return stale
    .map((s) => ({ contact: contactMap.get(s.contactId)!, days: s.days }))
    .filter((s) => s.contact);
}

export async function getContacts(search?: string, circle?: string) {
  const contacts = await prisma.contact.findMany({
    where: {
      ...(circle && circle !== "all" ? { circle } : {}),
      ...(search
        ? { name: { contains: search } }
        : {}),
    },
    include: { interactions: { orderBy: { date: "desc" }, take: 1 } },
    orderBy: { name: "asc" },
  });

  return contacts.map((c) => ({
    ...c,
    lastContact: c.interactions[0]?.date ?? c.createdAt,
  }));
}

export async function getContactDetail(id: string) {
  const contact = await prisma.contact.findUnique({
    where: { id },
    include: {
      reminders: {
        where: { status: "pending" },
        include: { eventContext: true },
        orderBy: { createdAt: "asc" },
      },
      interactions: { orderBy: { date: "desc" } },
    },
  });

  return contact;
}

export async function getEventContexts() {
  return prisma.eventContext.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getUpcomingBirthdays(withinDays = 60) {
  const contacts = await prisma.contact.findMany({ where: { birthday: { not: null } } });
  const now = new Date();

  return contacts
    .map((c) => {
      const bday = c.birthday!;
      const next = new Date(now.getFullYear(), bday.getMonth(), bday.getDate());
      if (daysBetween(now, next) < 0) next.setFullYear(now.getFullYear() + 1);
      return { contact: c, next, daysAway: daysBetween(now, next) };
    })
    .filter((c) => c.daysAway <= withinDays)
    .sort((a, b) => a.daysAway - b.daysAway);
}

export async function getRemindersForMonth(year: number, month: number) {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 1);

  return prisma.reminder.findMany({
    where: { dueDate: { gte: start, lt: end } },
    include: { contact: true, eventContext: true },
    orderBy: { dueDate: "asc" },
  });
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { uploadAvatar } from "@/lib/blob";

export async function setAppName(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  if (!name) return;

  await prisma.appSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", name },
    update: { name },
  });

  revalidatePath("/", "layout");
}

export async function completeOnboarding(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  if (!name) return;

  await prisma.appSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", name },
    update: { name },
  });

  revalidatePath("/", "layout");
  redirect("/");
}

export async function resetAllData() {
  await prisma.contact.deleteMany();
  await prisma.eventContext.deleteMany();
  await prisma.appSettings.deleteMany();

  revalidatePath("/", "layout");
  redirect("/");
}

function combineName(firstName: string, lastName: string): string {
  return lastName ? `${firstName} ${lastName}` : firstName;
}

export async function createContact(formData: FormData) {
  const firstName = (formData.get("firstName") as string)?.trim();
  if (!firstName) return;
  const lastName = (formData.get("lastName") as string)?.trim() ?? "";

  const circle = (formData.get("circle") as string) || "friends";
  const howMet = (formData.get("howMet") as string)?.trim() || null;
  const birthdayStr = formData.get("birthday") as string;
  const phone = (formData.get("phone") as string)?.trim() || null;
  const email = (formData.get("email") as string)?.trim() || null;
  const preferredContact = (formData.get("preferredContact") as string)?.trim() || null;
  const notes = (formData.get("notes") as string)?.trim() || null;
  const avatarUrl = await uploadAvatar(formData.get("avatar") as File | null);

  const contact = await prisma.contact.create({
    data: {
      name: combineName(firstName, lastName),
      firstName,
      lastName: lastName || null,
      avatarUrl,
      circle,
      howMet,
      birthday: birthdayStr ? new Date(birthdayStr) : null,
      phone,
      email,
      preferredContact,
      notes,
    },
  });

  revalidatePath("/contacts");
  revalidatePath("/");
  redirect(`/contacts/${contact.id}`);
}

export async function updateContact(formData: FormData) {
  const id = formData.get("id") as string;
  const firstName = (formData.get("firstName") as string)?.trim();
  if (!id || !firstName) return;
  const lastName = (formData.get("lastName") as string)?.trim() ?? "";

  const circle = (formData.get("circle") as string) || "friends";
  const howMet = (formData.get("howMet") as string)?.trim() || null;
  const birthdayStr = formData.get("birthday") as string;
  const phone = (formData.get("phone") as string)?.trim() || null;
  const email = (formData.get("email") as string)?.trim() || null;
  const preferredContact = (formData.get("preferredContact") as string)?.trim() || null;
  const notes = (formData.get("notes") as string)?.trim() || null;
  const avatarUrl = await uploadAvatar(formData.get("avatar") as File | null);

  await prisma.contact.update({
    where: { id },
    data: {
      name: combineName(firstName, lastName),
      firstName,
      lastName: lastName || null,
      ...(avatarUrl ? { avatarUrl } : {}),
      circle,
      howMet,
      birthday: birthdayStr ? new Date(birthdayStr) : null,
      phone,
      email,
      preferredContact,
      notes,
    },
  });

  revalidatePath("/contacts");
  revalidatePath("/");
  revalidatePath(`/contacts/${id}`);
  redirect(`/contacts/${id}`);
}

export async function deleteContact(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.contact.delete({ where: { id } });

  revalidatePath("/contacts");
  revalidatePath("/");
  redirect("/contacts");
}

function parseEventDates(formData: FormData) {
  const dateStr = formData.get("date") as string;
  const endDateStr = formData.get("endDate") as string;

  const date = dateStr ? new Date(`${dateStr}T12:00`) : null;
  // An end date only means something once there's a start date to range from.
  const endDate = date && endDateStr ? new Date(`${endDateStr}T12:00`) : null;

  return { date, endDate };
}

export async function createEvent(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  if (!name) return;

  const { date, endDate } = parseEventDates(formData);
  const notes = (formData.get("notes") as string)?.trim() || null;

  const event = await prisma.eventContext.create({
    data: { name, date, endDate, notes },
  });

  revalidatePath("/events");
  revalidatePath("/");
  redirect(`/events/${event.id}`);
}

export async function updateEvent(formData: FormData) {
  const id = formData.get("id") as string;
  const name = (formData.get("name") as string)?.trim();
  if (!id || !name) return;

  const { date, endDate } = parseEventDates(formData);
  const notes = (formData.get("notes") as string)?.trim() || null;

  await prisma.eventContext.update({
    where: { id },
    data: { name, date, endDate, notes },
  });

  revalidatePath("/events");
  revalidatePath(`/events/${id}`);
  revalidatePath("/");
  redirect(`/events/${id}`);
}

export async function removeReminder(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  const reminder = await prisma.reminder.delete({ where: { id } });

  revalidatePath("/events");
  if (reminder.eventContextId) revalidatePath(`/events/${reminder.eventContextId}`);
  revalidatePath("/");
  revalidatePath("/calendar");
  revalidatePath(`/contacts/${reminder.contactId}`);
}

export async function deleteEvent(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.reminder.deleteMany({ where: { eventContextId: id } });
  await prisma.eventContext.delete({ where: { id } });

  revalidatePath("/events");
  revalidatePath("/");
  revalidatePath("/calendar");
  redirect("/events");
}

export async function createReminder(formData: FormData) {
  const contactId = formData.get("contactId") as string;
  const actionType = formData.get("actionType") as string;
  if (!contactId || !actionType) return;

  const timingMode = formData.get("timingMode") as string;
  const priority = formData.get("priority") === "urgent" ? "urgent" : "normal";
  const note = (formData.get("note") as string)?.trim() || null;

  let dueDate: Date | null = null;
  let eventContextId: string | null = null;

  if (timingMode === "event") {
    const newEventName = (formData.get("newEventName") as string)?.trim();
    const existingEventId = formData.get("eventContextId") as string;

    if (newEventName) {
      const created = await prisma.eventContext.create({ data: { name: newEventName } });
      eventContextId = created.id;
    } else if (existingEventId) {
      eventContextId = existingEventId;
    }
  } else {
    const dateStr = formData.get("dueDate") as string;
    const timeStr = (formData.get("dueTime") as string) || "09:00";
    if (dateStr) dueDate = new Date(`${dateStr}T${timeStr}`);
  }

  await prisma.reminder.create({
    data: { contactId, actionType, dueDate, eventContextId, priority, note },
  });

  revalidatePath("/");
  revalidatePath("/calendar");
  revalidatePath(`/contacts/${contactId}`);
  redirect("/");
}

export async function completeReminder(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  const reminder = await prisma.reminder.update({
    where: { id },
    data: { status: "done", completedAt: new Date() },
  });

  revalidatePath("/");
  revalidatePath("/calendar");
  revalidatePath("/archive");
  revalidatePath(`/contacts/${reminder.contactId}`);
}

export async function snoozeReminder(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  const reminder = await prisma.reminder.findUnique({ where: { id } });
  if (!reminder) return;

  const base = reminder.dueDate && reminder.dueDate > new Date() ? reminder.dueDate : new Date();
  const nextDay = new Date(base);
  nextDay.setDate(nextDay.getDate() + 1);

  await prisma.reminder.update({ where: { id }, data: { dueDate: nextDay } });

  revalidatePath("/");
  revalidatePath("/calendar");
  revalidatePath(`/contacts/${reminder.contactId}`);
}

export async function logInteraction(formData: FormData) {
  const contactId = formData.get("contactId") as string;
  const type = formData.get("type") as string;
  if (!contactId || !type) return;

  const note = (formData.get("note") as string)?.trim() || null;
  const dateStr = (formData.get("date") as string)?.trim() || "";
  const timeStr = (formData.get("time") as string)?.trim() || "";
  const hasTime = timeStr.length > 0;

  // Date defaults to today when omitted. Time is only recorded when given;
  // date-only entries anchor to noon so the calendar day never shifts across
  // timezones, and their time is never displayed (hasTime stays false).
  let date: Date;
  if (dateStr && timeStr) {
    date = new Date(`${dateStr}T${timeStr}`);
  } else if (dateStr) {
    date = new Date(`${dateStr}T12:00`);
  } else if (timeStr) {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    date = new Date(`${y}-${m}-${d}T${timeStr}`);
  } else {
    date = new Date();
  }

  await prisma.interaction.create({
    data: { contactId, type, note, date, hasTime },
  });

  revalidatePath(`/contacts/${contactId}`);
  revalidatePath("/");
}

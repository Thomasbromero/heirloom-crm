"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createContact(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  if (!name) return;

  const circle = (formData.get("circle") as string) || "friends";
  const howMet = (formData.get("howMet") as string)?.trim() || null;
  const birthdayStr = formData.get("birthday") as string;
  const phone = (formData.get("phone") as string)?.trim() || null;
  const email = (formData.get("email") as string)?.trim() || null;
  const preferredContact = (formData.get("preferredContact") as string)?.trim() || null;
  const notes = (formData.get("notes") as string)?.trim() || null;

  const contact = await prisma.contact.create({
    data: {
      name,
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
  const dateStr = formData.get("date") as string;

  await prisma.interaction.create({
    data: { contactId, type, note, date: dateStr ? new Date(dateStr) : new Date() },
  });

  revalidatePath(`/contacts/${contactId}`);
  revalidatePath("/");
}

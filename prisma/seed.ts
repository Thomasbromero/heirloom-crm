import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function daysFromNow(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

async function main() {
  await prisma.interaction.deleteMany();
  await prisma.reminder.deleteMany();
  await prisma.eventContext.deleteMany();
  await prisma.contact.deleteMany();

  const eleanor = await prisma.contact.create({
    data: {
      name: "Eleanor Vance",
      circle: "close",
      howMet: "College",
      birthday: new Date(1978, 9, 14),
      phone: "(503) 555-0198",
      email: "eleanor.v@example.com",
      preferredContact: "WhatsApp",
      notes: "Known since college. Always remembers to check in on rainy days. Enjoys artisanal coffee and long hikes.",
    },
  });

  const lucas = await prisma.contact.create({
    data: {
      name: "Lucas G.",
      circle: "friends",
      howMet: "Coffee shop downtown",
      birthday: new Date(1995, 9, 14),
      preferredContact: "WhatsApp",
      notes: "Met at the coffee shop downtown. Talked about his recent trip to Japan and looking into photography. Loves matcha lattes. Needs recommendations for a good beginner camera setup.",
    },
  });

  const sofia = await prisma.contact.create({
    data: {
      name: "Sofia R.",
      circle: "friends",
      preferredContact: "Instagram",
    },
  });

  const mateo = await prisma.contact.create({
    data: {
      name: "Mateo S.",
      circle: "family",
      preferredContact: "Phone call",
    },
  });

  const marcus = await prisma.contact.create({
    data: {
      name: "Marcus Thorne",
      circle: "friends",
      preferredContact: "Email",
    },
  });

  const sarah = await prisma.contact.create({
    data: {
      name: "Sarah Jenkins",
      circle: "acquaintances",
      preferredContact: "Email",
    },
  });

  await prisma.contact.create({
    data: {
      name: "David Kim",
      circle: "acquaintances",
      preferredContact: "WhatsApp",
    },
  });

  const tripArgentina = await prisma.eventContext.create({
    data: {
      name: "Trip to Argentina",
      date: daysFromNow(60),
      notes: "Yearly trip back home.",
    },
  });

  const newJob = await prisma.eventContext.create({
    data: {
      name: "New Job",
      date: daysFromNow(1),
    },
  });

  await prisma.reminder.create({
    data: {
      contactId: lucas.id,
      actionType: "message",
      dueDate: daysAgo(2),
      priority: "urgent",
      note: "Feeling down lately, check in on him.",
      status: "pending",
    },
  });

  await prisma.reminder.create({
    data: {
      contactId: sofia.id,
      actionType: "meetup",
      eventContextId: tripArgentina.id,
      priority: "normal",
      note: "See her when I'm back home.",
      status: "pending",
    },
  });

  await prisma.reminder.create({
    data: {
      contactId: mateo.id,
      actionType: "checkin",
      eventContextId: newJob.id,
      priority: "normal",
      note: "Ask how the new job is going.",
      status: "pending",
    },
  });

  await prisma.reminder.create({
    data: {
      contactId: lucas.id,
      actionType: "other",
      dueDate: daysFromNow(7),
      priority: "normal",
      note: "Follow up on matcha recipe.",
      status: "pending",
    },
  });

  await prisma.interaction.create({
    data: {
      contactId: eleanor.id,
      type: "meetup",
      note: "Met at Stumptown. She seemed stressed about the new project at work. Follow up next week to see how the presentation went.",
      date: daysAgo(12),
    },
  });

  await prisma.interaction.create({
    data: {
      contactId: eleanor.id,
      type: "call",
      note: "Brief chat to coordinate weekend plans. David is coming along to the coast.",
      date: daysAgo(26),
    },
  });

  await prisma.interaction.create({
    data: {
      contactId: eleanor.id,
      type: "message",
      note: "Sent birthday reminder note to self.",
      date: daysAgo(50),
    },
  });

  await prisma.interaction.create({
    data: {
      contactId: lucas.id,
      type: "call",
      note: "Talked on the phone for an hour catching up.",
      date: daysAgo(2),
    },
  });

  await prisma.interaction.create({
    data: {
      contactId: lucas.id,
      type: "meetup",
      note: "Met up for coffee at The Roastery.",
      date: daysAgo(20),
    },
  });

  await prisma.interaction.create({
    data: {
      contactId: marcus.id,
      type: "message",
      date: daysAgo(7),
    },
  });

  await prisma.interaction.create({
    data: {
      contactId: sarah.id,
      type: "message",
      date: daysAgo(65),
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

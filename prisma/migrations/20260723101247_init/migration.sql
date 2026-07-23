-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "circle" TEXT NOT NULL,
    "howMet" TEXT,
    "birthday" TIMESTAMP(3),
    "phone" TEXT,
    "email" TEXT,
    "preferredContact" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventContext" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventContext_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3),
    "eventContextId" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "note" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interaction" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "note" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Interaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_eventContextId_fkey" FOREIGN KEY ("eventContextId") REFERENCES "EventContext"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

export const CIRCLES = ["close", "family", "friends", "work", "acquaintances"] as const;
export type Circle = (typeof CIRCLES)[number];

export const CIRCLE_LABELS: Record<Circle, string> = {
  close: "Close",
  family: "Family",
  friends: "Friends",
  work: "Work",
  acquaintances: "Acquaintances",
};

export const ACTION_TYPES = ["message", "meetup", "checkin", "other"] as const;
export type ActionType = (typeof ACTION_TYPES)[number];

export const ACTION_LABELS: Record<ActionType, string> = {
  message: "Message",
  meetup: "Meet up",
  checkin: "Check in",
  other: "Other",
};

export const PRIORITIES = ["normal", "urgent"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const REMINDER_STATUSES = ["pending", "done"] as const;
export type ReminderStatus = (typeof REMINDER_STATUSES)[number];

export const INTERACTION_TYPES = ["message", "call", "meetup", "other"] as const;
export type InteractionType = (typeof INTERACTION_TYPES)[number];

export const INTERACTION_LABELS: Record<InteractionType, string> = {
  message: "Message",
  call: "Call",
  meetup: "Meetup",
  other: "Other",
};

export const CATCH_UP_THRESHOLD_DAYS = 30;

const DAY_MS = 1000 * 60 * 60 * 24;

export function whatsappLink(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://api.whatsapp.com/send/?phone=${digits}&text&type=phone_number&app_absent=0`;
}

export function daysBetween(a: Date, b: Date): number {
  const start = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const end = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((end.getTime() - start.getTime()) / DAY_MS);
}

export function relativeToNow(date: Date): string {
  const diff = daysBetween(date, new Date());
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff === -1) return "Tomorrow";
  if (diff > 1 && diff < 30) return `${diff} days ago`;
  if (diff < -1 && diff > -30) return `In ${Math.abs(diff)} days`;
  if (diff >= 30 && diff < 365) return `${Math.round(diff / 30)} mo ago`;
  if (diff <= -30 && diff > -365) return `In ${Math.round(Math.abs(diff) / 30)} mo`;
  if (diff >= 365) return `${Math.round(diff / 365)}y ago`;
  return `In ${Math.round(Math.abs(diff) / 365)}y`;
}

export function dueLabel(date: Date): { label: string; overdue: boolean } {
  const diff = daysBetween(new Date(), date);
  if (diff < 0) return { label: `Overdue ${Math.abs(diff)}d`, overdue: true };
  if (diff === 0) return { label: "Due today", overdue: false };
  if (diff === 1) return { label: "Tomorrow", overdue: false };
  return { label: `In ${diff} days`, overdue: false };
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function birthdayLabel(birthday: Date): string {
  const now = new Date();
  const next = new Date(now.getFullYear(), birthday.getMonth(), birthday.getDate());
  if (next < now) next.setFullYear(now.getFullYear() + 1);
  const diff = daysBetween(now, next);
  const monthDay = birthday.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  if (diff === 0) return `${monthDay} (today!)`;
  if (diff <= 30) return `${monthDay} (in ${diff} days)`;
  return monthDay;
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const AVATAR_PALETTE = [
  { bg: "#dcead9", fg: "#33513d" },
  { bg: "#f6dedb", fg: "#7a2620" },
  { bg: "#e3dcf1", fg: "#4a3a7a" },
  { bg: "#fbe7c6", fg: "#7a5a20" },
  { bg: "#d9e7f2", fg: "#28516e" },
];

export function avatarColor(name: string): { bg: string; fg: string } {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

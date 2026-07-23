import Image from "next/image";
import { avatarColor, initials } from "@/lib/format";

const SIZES = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 88,
};

export function Avatar({
  name,
  avatarUrl,
  size = "md",
  ringed = false,
}: {
  name: string;
  avatarUrl?: string | null;
  size?: keyof typeof SIZES;
  ringed?: boolean;
}) {
  const px = SIZES[size];
  const ring = ringed ? "ring-2 ring-primary ring-offset-2 ring-offset-surface" : "";

  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={name}
        width={px}
        height={px}
        className={`rounded-full object-cover shrink-0 ${ring}`}
        style={{ width: px, height: px }}
      />
    );
  }

  const { bg, fg } = avatarColor(name);
  const fontSize = px <= 32 ? 12 : px <= 40 ? 14 : px <= 56 ? 18 : 28;

  return (
    <div
      className={`rounded-full flex items-center justify-center font-display font-semibold shrink-0 ${ring}`}
      style={{ width: px, height: px, backgroundColor: bg, color: fg, fontSize }}
    >
      {initials(name)}
    </div>
  );
}

import { put } from "@vercel/blob";
import sharp from "sharp";

// Returns undefined when no file was actually chosen, so callers can
// leave the existing avatarUrl untouched instead of overwriting it.
export async function uploadAvatar(file: File | null): Promise<string | undefined> {
  if (!file || file.size === 0) return undefined;

  const buffer = Buffer.from(await file.arrayBuffer());
  const resized = await sharp(buffer)
    .resize(400, 400, { fit: "cover" })
    .jpeg({ quality: 82 })
    .toBuffer();

  const blob = await put(`avatars/${crypto.randomUUID()}.jpg`, resized, {
    access: "public",
    contentType: "image/jpeg",
  });

  return blob.url;
}

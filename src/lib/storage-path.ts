const SAFE_EXT = new Set(["jpg", "jpeg", "png", "webp", "gif"]);

/** Storage object key: ASCII-only, no leading slash, Supabase/S3-safe */
export function buildStorageObjectPath(
  userId: string,
  originalFilename: string,
  mimeType: string
): string {
  const safeUserId = userId.replace(/[^a-zA-Z0-9-_]/g, "");
  if (!safeUserId) {
    throw new Error("Invalid user id for upload path");
  }

  let ext = originalFilename.split(".").pop()?.toLowerCase() || "";
  if (!ext || !SAFE_EXT.has(ext)) {
    ext = mimeType.split("/").pop() || "jpg";
    if (ext === "jpeg") ext = "jpg";
  }
  if (!SAFE_EXT.has(ext)) {
    ext = "jpg";
  }

  const filename = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
  return `uploads/${safeUserId}/${filename}`;
}

export function getStorageBucketName(): string {
  return process.env.SUPABASE_STORAGE_BUCKET?.trim() || "trip-images";
}

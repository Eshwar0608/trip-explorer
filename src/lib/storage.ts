import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES, MAX_IMAGES } from "@/lib/images";
import {
  buildStorageObjectPath,
  getStorageBucketName,
} from "@/lib/storage-path";
import { getSupabaseAdmin } from "@/lib/supabase";

export function storagePathFromPublicUrl(publicUrl: string): string | null {
  const bucket = getStorageBucketName();
  const marker = `/storage/v1/object/public/${bucket}/`;
  const index = publicUrl.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(publicUrl.slice(index + marker.length));
}

async function ensureBucketExists() {
  const supabase = getSupabaseAdmin();
  const bucket = getStorageBucketName();

  const { data: buckets, error: listError } =
    await supabase.storage.listBuckets();

  if (listError) {
    throw new Error(
      `Cannot access Supabase Storage (${listError.message}). Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.`
    );
  }

  if (buckets?.some((b) => b.name === bucket)) {
    return;
  }

  const { error: createError } = await supabase.storage.createBucket(bucket, {
    public: true,
    fileSizeLimit: MAX_IMAGE_BYTES,
  });

  if (createError && !createError.message.toLowerCase().includes("already exists")) {
    throw new Error(
      `Storage bucket "${bucket}" does not exist. Create a public bucket named "${bucket}" in Supabase → Storage, or fix SUPABASE_STORAGE_BUCKET. (${createError.message})`
    );
  }
}

export async function uploadImageFiles(
  files: File[],
  userId: string
): Promise<string[]> {
  if (!userId) {
    throw new Error("You must be signed in to upload images");
  }

  if (files.length > MAX_IMAGES) {
    throw new Error(`Maximum ${MAX_IMAGES} images allowed`);
  }

  await ensureBucketExists();

  const supabase = getSupabaseAdmin();
  const bucket = getStorageBucketName();
  const urls: string[] = [];

  for (const file of files) {
    if (
      !ALLOWED_IMAGE_TYPES.includes(
        file.type as (typeof ALLOWED_IMAGE_TYPES)[number]
      )
    ) {
      throw new Error("Invalid file type");
    }
    if (file.size > MAX_IMAGE_BYTES) {
      throw new Error("File too large (max 5 MB each)");
    }

    const path = buildStorageObjectPath(userId, file.name, file.type);
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
      contentType: file.type,
      upsert: false,
      cacheControl: "3600",
    });

    if (error) {
      const hint =
        error.message.includes("Invalid") || error.message.includes("path")
          ? ` Use bucket "${bucket}" and ensure NEXT_PUBLIC_SUPABASE_URL is https://YOUR_REF.supabase.co`
          : "";
      throw new Error(`${error.message}${hint}`);
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return urls;
}

export async function deleteImageFromStorage(publicUrl: string): Promise<void> {
  const path = storagePathFromPublicUrl(publicUrl);
  if (!path) {
    throw new Error("Invalid image URL");
  }

  const supabase = getSupabaseAdmin();
  const bucket = getStorageBucketName();
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    throw new Error(error.message);
  }
}

export const MAX_IMAGES = 6;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

export function validateImageFiles(files: File[]): string | null {
  if (files.length > MAX_IMAGES) {
    return `You can upload up to ${MAX_IMAGES} images`;
  }

  for (const file of files) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
      return "Only JPEG, PNG, WebP, and GIF images are allowed";
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return "Each image must be under 5 MB";
    }
  }

  return null;
}

import { validateImageFiles } from "@/lib/images";

export async function uploadImages(files: File[]): Promise<string[]> {
  const validationError = validateImageFiles(files);
  if (validationError) {
    throw new Error(validationError);
  }

  if (files.length === 0) {
    return [];
  }

  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file);
  }

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to upload images");
  }

  return data.urls as string[];
}

"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deletePlaceImage, deleteReviewImage } from "@/actions/images";

type AdminImageGalleryProps = {
  type: "place" | "review";
  entityId: string;
  images: string[];
  alt: string;
  className?: string;
};

export function AdminImageGallery({
  type,
  entityId,
  images,
  alt,
  className,
}: AdminImageGalleryProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (!images.length) return null;

  function handleDelete(imageUrl: string) {
    if (!confirm("Delete this image? This cannot be undone.")) return;

    startTransition(async () => {
      const result =
        type === "place"
          ? await deletePlaceImage(entityId, imageUrl)
          : await deleteReviewImage(entityId, imageUrl);

      if (result.error) {
        alert(result.error);
        return;
      }

      router.refresh();
    });
  }

  return (
    <div
      className={
        className ?? "grid grid-cols-2 gap-2 sm:grid-cols-3"
      }
    >
      {images.map((url, index) => (
        <div
          key={url}
          className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
        >
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full w-full"
          >
            <Image
              src={url}
              alt={`${alt} ${index + 1}`}
              fill
              className="object-cover transition-opacity group-hover:opacity-90"
              sizes="(max-width: 768px) 50vw, 240px"
            />
          </a>
          <button
            type="button"
            disabled={pending}
            onClick={() => handleDelete(url)}
            className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-destructive-foreground shadow hover:bg-destructive/90 disabled:opacity-50"
            aria-label="Delete image"
            title="Delete image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

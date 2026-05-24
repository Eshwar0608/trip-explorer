import Image from "next/image";

type ImageGalleryProps = {
  images: string[];
  alt: string;
  className?: string;
};

export function ImageGallery({ images, alt, className }: ImageGalleryProps) {
  if (!images.length) return null;

  return (
    <div
      className={
        className ??
        "grid grid-cols-2 gap-2 sm:grid-cols-3"
      }
    >
      {images.map((url, index) => (
        <a
          key={url}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="relative aspect-square overflow-hidden rounded-lg border bg-muted transition-opacity hover:opacity-90"
        >
          <Image
            src={url}
            alt={`${alt} ${index + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 240px"
          />
        </a>
      ))}
    </div>
  );
}

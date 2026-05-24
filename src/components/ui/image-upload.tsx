"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MAX_IMAGES, validateImageFiles } from "@/lib/images";

type ImageUploadProps = {
  files: File[];
  onChange: (files: File[]) => void;
  label?: string;
  disabled?: boolean;
};

export function ImageUpload({
  files,
  onChange,
  label = "Photos",
  disabled = false,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  function addFiles(fileList: FileList | null) {
    if (!fileList || disabled) return;

    setError("");
    const incoming = Array.from(fileList);
    const combined = [...files, ...incoming].slice(0, MAX_IMAGES);
    const validationError = validateImageFiles(combined);

    if (validationError) {
      setError(validationError);
      return;
    }

    onChange(combined);
  }

  function removeAt(index: number) {
    setError("");
    onChange(files.filter((_, i) => i !== index));
  }

  const canAddMore = files.length < MAX_IMAGES;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <Label>{label}</Label>
        <span className="text-xs text-muted-foreground">
          {files.length}/{MAX_IMAGES} · max 5 MB each
        </span>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="relative aspect-square overflow-hidden rounded-lg border bg-muted"
            >
              {previewUrls[index] && (
                <Image
                  src={previewUrls[index]}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="120px"
                  unoptimized
                />
              )}
              <button
                type="button"
                onClick={() => removeAt(index)}
                disabled={disabled}
                className="absolute right-1 top-1 rounded-full bg-background/90 p-0.5 shadow hover:bg-background"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {canAddMore && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            disabled={disabled}
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            className="w-full sm:w-auto"
          >
            <ImagePlus className="mr-2 h-4 w-4" />
            {files.length === 0 ? "Add photos" : "Add more photos"}
          </Button>
        </>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

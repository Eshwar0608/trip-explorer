"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LocationSelect } from "@/components/places/location-select";
import { ImageUpload } from "@/components/ui/image-upload";
import { uploadImages } from "@/lib/upload-images";

export default function AddPlacePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [distance, setDistance] = useState("");
  const [famousFor, setFamousFor] = useState("");
  const [description, setDescription] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dashboardHref =
    session?.user?.role === "admin"
      ? "/dashboard/admin"
      : "/dashboard/customer";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    let images: string[] = [];
    if (imageFiles.length > 0) {
      try {
        images = await uploadImages(imageFiles);
      } catch (uploadError) {
        setLoading(false);
        setError(
          uploadError instanceof Error
            ? uploadError.message
            : "Failed to upload images"
        );
        return;
      }
    }

    const res = await fetch("/api/places", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        state,
        district,
        city,
        distanceFromBusStation: parseFloat(distance),
        famousFor,
        description,
        images,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to submit place");
      return;
    }

    const role =
      session?.user?.role ??
      (await fetch("/api/auth/session").then((r) => r.json()))?.user?.role;

    router.push(
      role === "admin"
        ? "/dashboard/admin/pending"
        : "/dashboard/customer/submissions"
    );
    router.refresh();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href={dashboardHref}>← Back to dashboard</Link>
        </Button>
      </div>

      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Add a Popular Place</CardTitle>
          <CardDescription>
            Submit a place for admin approval. Once approved, it will appear
            publicly and you can add a review.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Place Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Marina Beach"
              />
            </div>

            <LocationSelect
              state={state}
              district={district}
              city={city}
              onStateChange={setState}
              onDistrictChange={setDistrict}
              onCityChange={setCity}
            />

            <div className="space-y-2">
              <Label htmlFor="distance">
                Distance from Main Bus Station (km)
              </Label>
              <Input
                id="distance"
                type="number"
                step="0.1"
                min="0"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="famousFor">Famous For</Label>
              <Input
                id="famousFor"
                value={famousFor}
                onChange={(e) => setFamousFor(e.target.value)}
                required
                placeholder="e.g. Sunrise views, street food"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                minLength={10}
                rows={5}
                placeholder="Describe the place, how to reach it, best time to visit..."
              />
            </div>

            <div className="rounded-lg border border-dashed p-4">
              <ImageUpload
                files={imageFiles}
                onChange={setImageFiles}
                label="Place photos (optional)"
                disabled={loading}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? "Submitting..." : "Submit for approval"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

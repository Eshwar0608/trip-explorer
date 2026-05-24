import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { MapPin, Bus, Star } from "lucide-react";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { averageRating, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReviewForm } from "@/components/reviews/review-form";
import { Separator } from "@/components/ui/separator";
import { ImageGallery } from "@/components/ui/image-gallery";
import { AdminImageGallery } from "@/components/admin/admin-image-gallery";

export const dynamic = "force-dynamic";

export default async function PlaceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  const place = await prisma.place.findUnique({
    where: { id: params.id },
    include: {
      reviews: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
      createdBy: { select: { name: true } },
    },
  });

  if (!place) notFound();

  if (
    place.status !== "approved" &&
    (!session ||
      (session.user.role !== "admin" && session.user.id !== place.createdById))
  ) {
    notFound();
  }

  const avg = averageRating(place.reviews.map((r) => r.rating));
  const isAdmin = session?.user?.role === "admin";
  const canReview =
    session?.user?.role === "customer" &&
    place.status === "approved" &&
    !place.reviews.some((r) => r.userId === session.user.id);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <Badge variant={place.status === "approved" ? "success" : "warning"}>
            {place.status}
          </Badge>
          {place.reviews.length > 0 && (
            <span className="flex items-center gap-1 text-amber-600">
              <Star className="h-4 w-4 fill-amber-400" />
              {avg.toFixed(1)} · {place.reviews.length} reviews
            </span>
          )}
        </div>

        <h1 className="text-4xl font-bold">{place.name}</h1>
        <p className="mt-2 flex items-center gap-1 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {place.city}, {place.district}, {place.state}
        </p>

        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-1 rounded-full bg-muted px-3 py-1">
            <Bus className="h-4 w-4" />
            {place.distanceFromBusStation} km from main bus station
          </span>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
            Famous for: {place.famousFor}
          </span>
        </div>

        <p className="mt-8 leading-relaxed text-muted-foreground">
          {place.description}
        </p>

        {place.images.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 text-lg font-semibold">Photos</h2>
            {isAdmin ? (
              <AdminImageGallery
                type="place"
                entityId={place.id}
                images={place.images}
                alt={place.name}
              />
            ) : (
              <ImageGallery images={place.images} alt={place.name} />
            )}
          </div>
        )}

        {place.status === "approved" && canReview && (
          <div className="mt-10 rounded-xl border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">Write a review</h2>
            <ReviewForm placeId={place.id} />
          </div>
        )}

        {session?.user?.role === "customer" && place.status === "approved" && !canReview && place.reviews.some((r) => r.userId === session.user.id) && (
          <p className="mt-6 text-sm text-muted-foreground">
            You have already reviewed this place.
          </p>
        )}

        {!session && place.status === "approved" && (
          <div className="mt-8 rounded-lg bg-muted/50 p-4 text-center">
            <p className="text-sm text-muted-foreground">
              <Link href="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>{" "}
              to leave a review
            </p>
          </div>
        )}

        <Separator className="my-10" />

        <h2 className="text-xl font-semibold">Reviews</h2>
        {place.reviews.length === 0 ? (
          <p className="mt-4 text-muted-foreground">No reviews yet.</p>
        ) : (
          <ul className="mt-6 space-y-6">
            {place.reviews.map((review) => (
              <li key={review.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {review.user.name || "Traveler"}
                  </span>
                  <span className="flex items-center gap-1 text-amber-600">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </span>
                </div>
                <p className="mt-2 text-muted-foreground">{review.comment}</p>
                {review.images.length > 0 && (
                  <div className="mt-4">
                    {isAdmin ? (
                      <AdminImageGallery
                        type="review"
                        entityId={review.id}
                        images={review.images}
                        alt={`Review by ${review.user.name || "Traveler"}`}
                      />
                    ) : (
                      <ImageGallery
                        images={review.images}
                        alt={`Review by ${review.user.name || "Traveler"}`}
                      />
                    )}
                  </div>
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatDate(review.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10">
          <Button variant="outline" asChild>
            <Link href="/places">← Back to places</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

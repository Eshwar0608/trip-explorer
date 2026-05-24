import Link from "next/link";
import { Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewActions } from "@/components/admin/review-actions";
import { formatDate } from "@/lib/utils";
import { AdminImageGallery } from "@/components/admin/admin-image-gallery";

export const dynamic = "force-dynamic";

export default async function ManageReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: {
      place: { select: { id: true, name: true, city: true } },
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold">All Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-muted-foreground">No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-base">
                    {review.user.name || review.user.email}
                  </CardTitle>
                  <Link
                    href={`/places/${review.place.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {review.place.name} · {review.place.city}
                  </Link>
                </div>
                <span className="flex items-center gap-0.5 text-amber-600">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </span>
              </CardHeader>
              <CardContent className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-muted-foreground">{review.comment}</p>
                  {review.images.length > 0 && (
                    <div className="mt-4 max-w-xl">
                      <AdminImageGallery
                        type="review"
                        entityId={review.id}
                        images={review.images}
                        alt={`Review on ${review.place.name}`}
                      />
                    </div>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
                <ReviewActions reviewId={review.id} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

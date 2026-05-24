import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceActions } from "@/components/admin/place-actions";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function ApprovedPlacesPage() {
  const places = await prisma.place.findMany({
    where: { status: "approved" },
    include: {
      reviews: { select: { id: true } },
      createdBy: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold">Approved Places</h2>

      {places.length === 0 ? (
        <p className="text-muted-foreground">No approved places yet.</p>
      ) : (
        <div className="space-y-4">
          {places.map((place) => (
            <Card key={place.id}>
              <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4">
                <div>
                  <CardTitle>{place.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {place.city}, {place.state} · {place.reviews.length} reviews
                  </p>
                </div>
                <Badge variant="success">approved</Badge>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center justify-between gap-4">
                <Button variant="link" className="px-0" asChild>
                  <Link href={`/places/${place.id}`}>View public page</Link>
                </Button>
                <PlaceActions placeId={place.id} showApprove={false} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

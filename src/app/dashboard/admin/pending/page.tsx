import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceActions } from "@/components/admin/place-actions";
import { formatDate } from "@/lib/utils";
import { AdminImageGallery } from "@/components/admin/admin-image-gallery";

export const dynamic = "force-dynamic";

export default async function PendingPlacesPage() {
  const places = await prisma.place.findMany({
    where: { status: "pending" },
    include: {
      createdBy: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold">Pending Place Requests</h2>

      {places.length === 0 ? (
        <p className="text-muted-foreground">No pending requests.</p>
      ) : (
        <div className="space-y-4">
          {places.map((place) => (
            <Card key={place.id}>
              <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4">
                <div>
                  <CardTitle>{place.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {place.city}, {place.district}, {place.state}
                  </p>
                </div>
                <Badge variant="warning">pending</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  <p>
                    <span className="font-medium">Famous for:</span>{" "}
                    {place.famousFor}
                  </p>
                  <p>
                    <span className="font-medium">Bus station:</span>{" "}
                    {place.distanceFromBusStation} km
                  </p>
                  <p className="sm:col-span-2">
                    <span className="font-medium">Description:</span>{" "}
                    {place.description}
                  </p>
                  {place.images.length > 0 && (
                    <div className="sm:col-span-2">
                      <p className="mb-2 font-medium">Photos</p>
                      <AdminImageGallery
                        type="place"
                        entityId={place.id}
                        images={place.images}
                        alt={place.name}
                      />
                    </div>
                  )}
                  <p>
                    <span className="font-medium">Submitted by:</span>{" "}
                    {place.createdBy.name || place.createdBy.email}
                  </p>
                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {formatDate(place.createdAt)}
                  </p>
                </div>
                <PlaceActions placeId={place.id} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

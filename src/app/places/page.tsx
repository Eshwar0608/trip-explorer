import { prisma } from "@/lib/prisma";
import { PlaceCard } from "@/components/places/place-card";

export const dynamic = "force-dynamic";

export default async function PlacesPage() {
  const places = await prisma.place.findMany({
    where: { status: "approved" },
    include: { reviews: { select: { rating: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Explore Places</h1>
        <p className="mt-2 text-muted-foreground">
          Browse approved destinations across India
        </p>
      </div>

      {places.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <p className="text-muted-foreground">
            No approved places yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((place) => (
            <PlaceCard key={place.id} {...place} />
          ))}
        </div>
      )}
    </div>
  );
}

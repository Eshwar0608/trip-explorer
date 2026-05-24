import { prisma } from "@/lib/prisma";
import { PlacesExplorer } from "@/components/places/places-explorer";

export const dynamic = "force-dynamic";

export default async function PlacesPage() {
  const places = await prisma.place.findMany({
    where: { status: "approved" },
    select: {
      id: true,
      name: true,
      city: true,
      state: true,
      district: true,
      famousFor: true,
      distanceFromBusStation: true,
      images: true,
      reviews: { select: { rating: true } },
    },
    orderBy: [{ state: "asc" }, { city: "asc" }, { name: "asc" }],
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Explore Places</h1>
        <p className="mt-2 text-muted-foreground">
          Browse approved destinations by state and city across India
        </p>
      </div>

      <PlacesExplorer places={places} />
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { PlaceCard } from "@/components/places/place-card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function SubmissionsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard/customer/submissions");
  }
  if (session.user.role !== "customer") {
    redirect("/dashboard/admin");
  }

  const places = await prisma.place.findMany({
    where: { createdById: session.user.id },
    include: { reviews: { select: { rating: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">My Submissions</h2>
        <Button asChild>
          <Link href="/dashboard/add-place">Add place</Link>
        </Button>
      </div>

      {places.length === 0 ? (
        <p className="text-muted-foreground">
          You haven&apos;t submitted any places yet.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((place) => (
            <div key={place.id}>
              <PlaceCard {...place} status={place.status} />
              {place.status === "approved" && (
                <Button variant="link" className="mt-2 px-0" asChild>
                  <Link href={`/places/${place.id}`}>View & review →</Link>
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

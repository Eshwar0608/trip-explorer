import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceCard } from "@/components/places/place-card";

export const dynamic = "force-dynamic";

export default async function CustomerDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const [pending, approved, rejected] = await Promise.all([
    prisma.place.count({
      where: { createdById: session.user.id, status: "pending" },
    }),
    prisma.place.count({
      where: { createdById: session.user.id, status: "approved" },
    }),
    prisma.place.count({
      where: { createdById: session.user.id, status: "rejected" },
    }),
  ]);

  const recentApproved = await prisma.place.findMany({
    where: { createdById: session.user.id, status: "approved" },
    include: { reviews: { select: { rating: true } } },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-600">{pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-600">{approved}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-destructive">{rejected}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <Button asChild>
          <Link href="/dashboard/customer/add-place">Add new place</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/customer/submissions">View submissions</Link>
        </Button>
      </div>

      {recentApproved.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold">
            Your approved places — add a review
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentApproved.map((place) => (
              <div key={place.id} className="space-y-2">
                <PlaceCard {...place} status="approved" />
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/places/${place.id}`}>Review this place</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

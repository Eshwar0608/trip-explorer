import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [pending, approved, reviews, places] = await Promise.all([
    prisma.place.count({ where: { status: "pending" } }),
    prisma.place.count({ where: { status: "approved" } }),
    prisma.review.count(),
    prisma.place.count(),
  ]);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Pending approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-600">{pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Approved places
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-600">{approved}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{reviews}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              All places
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{places}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-4">
        <Button asChild>
          <Link href="/dashboard/admin/pending">
            Review pending ({pending})
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/admin/approved">Manage approved</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/admin/reviews">Manage reviews</Link>
        </Button>
      </div>
    </div>
  );
}

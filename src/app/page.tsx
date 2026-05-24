import Link from "next/link";
import { Compass, MapPin, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { PlaceCard } from "@/components/places/place-card";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await prisma.place.findMany({
    where: { status: "approved" },
    include: { reviews: { select: { rating: true } } },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const stats = await Promise.all([
    prisma.place.count({ where: { status: "approved" } }),
    prisma.review.count(),
    prisma.user.count({ where: { role: "customer" } }),
  ]);

  return (
    <>
      <section className="gradient-hero px-4 py-20 text-white md:py-28">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Explore India, One Place at a Time
          </h1>
          <p className="mt-6 text-lg text-white/90 md:text-xl">
            Discover hidden gems, read honest reviews, and share your favorite
            destinations with fellow travelers.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/places">Browse Places</Link>
            </Button>
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
              asChild
            >
              <Link href="/register">Join Free</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              icon: MapPin,
              title: "Curated Destinations",
              desc: "Places submitted by locals and verified by our team.",
            },
            {
              icon: Star,
              title: "Trusted Reviews",
              desc: "Real ratings from travelers who visited the spot.",
            },
            {
              icon: Users,
              title: "Community Driven",
              desc: "Add places you love and help others discover them.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border bg-card p-6 text-center shadow-sm"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted/30 px-4 py-16">
        <div className="container mx-auto">
          <div className="mb-10 flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-bold">
                <Compass className="h-7 w-7 text-primary" />
                Featured Places
              </h2>
              <p className="mt-1 text-muted-foreground">
                Recently approved destinations
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/places">View all</Link>
            </Button>
          </div>

          {featured.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No approved places yet. Be the first to{" "}
              <Link href="/register" className="text-primary underline">
                submit one
              </Link>
              !
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((place) => (
                <PlaceCard key={place.id} {...place} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-primary">{stats[0]}</p>
            <p className="text-sm text-muted-foreground">Places</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">{stats[1]}</p>
            <p className="text-sm text-muted-foreground">Reviews</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">{stats[2]}</p>
            <p className="text-sm text-muted-foreground">Travelers</p>
          </div>
        </div>
      </section>
    </>
  );
}

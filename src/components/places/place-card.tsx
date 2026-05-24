import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, Bus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { averageRating, cn } from "@/lib/utils";

type PlaceCardProps = {
  id: string;
  name: string;
  city: string;
  state: string;
  famousFor: string;
  distanceFromBusStation: number;
  reviews?: { rating: number }[];
  images?: string[];
  status?: string;
};

export function PlaceCard({
  id,
  name,
  city,
  state,
  famousFor,
  distanceFromBusStation,
  reviews = [],
  images = [],
  status,
}: PlaceCardProps) {
  const avg = averageRating(reviews.map((r) => r.rating));
  const isClickable = status === "approved" || !status;
  const href = isClickable ? `/places/${id}` : undefined;

  const card = (
    <Card
      className={cn(
        "overflow-hidden transition-shadow",
        isClickable && "group-hover:shadow-lg"
      )}
    >
      {images[0] && (
        <div className="relative aspect-[16/10] w-full bg-muted">
          <Image
            src={images[0]}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 400px"
          />
          {images.length > 1 && (
            <span className="absolute bottom-2 right-2 rounded-md bg-background/90 px-2 py-0.5 text-xs font-medium">
              +{images.length - 1} more
            </span>
          )}
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle
            className={cn(
              "line-clamp-1 text-lg",
              isClickable && "group-hover:text-primary"
            )}
          >
            {name}
          </CardTitle>
          {status && (
            <Badge
              variant={
                status === "approved"
                  ? "success"
                  : status === "pending"
                    ? "warning"
                    : "destructive"
              }
            >
              {status}
            </Badge>
          )}
        </div>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {city}, {state}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          Famous for: {famousFor}
        </p>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Bus className="h-4 w-4" />
            {distanceFromBusStation} km from bus station
          </span>
          {reviews.length > 0 && (
            <span className="flex items-center gap-1 font-medium text-amber-600">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {avg.toFixed(1)} ({reviews.length})
            </span>
          )}
        </div>
        {isClickable && (
          <span className="inline-block text-sm font-medium text-primary group-hover:underline">
            View details →
          </span>
        )}
      </CardContent>
    </Card>
  );

  if (!href) {
    return card;
  }

  return (
    <Link
      href={href}
      className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {card}
    </Link>
  );
}

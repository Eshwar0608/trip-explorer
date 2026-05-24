import Link from "next/link";
import { MapPin, Star, Bus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { averageRating } from "@/lib/utils";

type PlaceCardProps = {
  id: string;
  name: string;
  city: string;
  state: string;
  famousFor: string;
  distanceFromBusStation: number;
  reviews?: { rating: number }[];
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
  status,
}: PlaceCardProps) {
  const avg = averageRating(reviews.map((r) => r.rating));

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-1 text-lg group-hover:text-primary">
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
        {status === "approved" || !status ? (
          <Link
            href={`/places/${id}`}
            className="inline-block text-sm font-medium text-primary hover:underline"
          >
            View details →
          </Link>
        ) : null}
      </CardContent>
    </Card>
  );
}

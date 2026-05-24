import Link from "next/link";
import { MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2 font-bold text-primary">
            <MapPin className="h-5 w-5" />
            Weekend Plans
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Discover amazing places across India. Share reviews and help fellow
            travelers.
          </p>
          <div className="flex gap-4 text-sm">
            <Link href="/places" className="hover:text-primary">
              Explore
            </Link>
            <Link href="/login" className="hover:text-primary">
              Login
            </Link>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Weekend Plans. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

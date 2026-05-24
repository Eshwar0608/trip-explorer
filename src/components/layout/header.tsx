"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { MapPin, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const dashboardHref =
    session?.user?.role === "admin"
      ? "/dashboard/admin"
      : "/dashboard/customer";

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/places", label: "Explore" },
    ...(session?.user?.role === "admin" || session?.user?.role === "customer"
      ? [{ href: "/dashboard/add-place", label: "Add Place" }]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-primary">
          <MapPin className="h-6 w-6" />
          <span className="text-lg">Weekend Plans</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {session ? (
            <>
              <Button variant="ghost" asChild>
                <Link href={dashboardHref}>Dashboard</Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {session ? (
              <>
                <Link href={dashboardHref} onClick={() => setMobileOpen(false)}>
                  Dashboard
                </Link>
                <button
                  className="text-left text-sm text-destructive"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

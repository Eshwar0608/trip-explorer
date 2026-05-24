import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

const reviewSchema = z.object({
  placeId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5),
  images: z.array(z.string().url()).max(6).optional().default([]),
});

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reviews = await prisma.review.findMany({
    include: {
      place: { select: { name: true, city: true } },
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reviews);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = reviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const place = await prisma.place.findUnique({
      where: { id: parsed.data.placeId },
    });

    if (!place || place.status !== "approved") {
      return NextResponse.json(
        { error: "Reviews only allowed on approved places" },
        { status: 400 }
      );
    }

    const existing = await prisma.review.findFirst({
      where: {
        placeId: parsed.data.placeId,
        userId: session.user.id,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You already reviewed this place" },
        { status: 409 }
      );
    }

    const review = await prisma.review.create({
      data: {
        ...parsed.data,
        userId: session.user.id,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}

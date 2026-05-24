import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

const placeSchema = z.object({
  name: z.string().min(2),
  state: z.string().min(1),
  district: z.string().min(1),
  city: z.string().min(1),
  distanceFromBusStation: z.number().positive(),
  famousFor: z.string().min(2),
  description: z.string().min(10),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const userId = searchParams.get("userId");
  const session = await getServerSession(authOptions);

  const where: Record<string, unknown> = {};

  if (status) {
    where.status = status;
  } else if (!session || session.user.role !== "admin") {
    where.status = "approved";
  }

  if (userId) {
    where.createdById = userId;
  }

  const places = await prisma.place.findMany({
    where,
    include: {
      reviews: { select: { rating: true } },
      createdBy: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(places);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = placeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const place = await prisma.place.create({
      data: {
        ...parsed.data,
        createdById: session.user.id,
        status: "pending",
      },
    });

    return NextResponse.json(place, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create place" }, { status: 500 });
  }
}

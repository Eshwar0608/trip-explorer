import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const place = await prisma.place.findUnique({
    where: { id: params.id },
    include: {
      reviews: {
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      },
      createdBy: { select: { name: true } },
    },
  });

  if (!place) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (
    place.status !== "approved" &&
    (!session ||
      (session.user.role !== "admin" && session.user.id !== place.createdById))
  ) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(place);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { status } = body;

  if (!["approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const place = await prisma.place.update({
    where: { id: params.id },
    data: { status },
  });

  return NextResponse.json(place);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.place.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}

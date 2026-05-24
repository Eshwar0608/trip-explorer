"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function approvePlace(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return { error: "Unauthorized" };
  }

  await prisma.place.update({
    where: { id },
    data: { status: "approved" },
  });

  revalidatePath("/dashboard/admin");
  revalidatePath("/places");
  return { success: true };
}

export async function rejectPlace(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return { error: "Unauthorized" };
  }

  await prisma.place.update({
    where: { id },
    data: { status: "rejected" },
  });

  revalidatePath("/dashboard/admin");
  return { success: true };
}

export async function deletePlace(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return { error: "Unauthorized" };
  }

  await prisma.place.delete({ where: { id } });
  revalidatePath("/dashboard/admin");
  revalidatePath("/places");
  return { success: true };
}

"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function deleteReview(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return { error: "Unauthorized" };
  }

  await prisma.review.delete({ where: { id } });
  revalidatePath("/dashboard/admin/reviews");
  revalidatePath("/places");
  return { success: true };
}

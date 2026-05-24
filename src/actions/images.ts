"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { deleteImageFromStorage } from "@/lib/storage";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return null;
  }
  return session;
}

export async function deletePlaceImage(placeId: string, imageUrl: string) {
  if (!await requireAdmin()) {
    return { error: "Unauthorized" };
  }

  const place = await prisma.place.findUnique({ where: { id: placeId } });
  if (!place) {
    return { error: "Place not found" };
  }
  if (!place.images.includes(imageUrl)) {
    return { error: "Image not found" };
  }

  try {
    await deleteImageFromStorage(imageUrl);
  } catch {
    // Continue if file was already removed from storage
  }

  await prisma.place.update({
    where: { id: placeId },
    data: { images: place.images.filter((url) => url !== imageUrl) },
  });

  revalidatePath("/dashboard/admin/pending");
  revalidatePath("/dashboard/admin/approved");
  revalidatePath(`/places/${placeId}`);
  revalidatePath("/places");
  return { success: true };
}

export async function deleteReviewImage(reviewId: string, imageUrl: string) {
  if (!await requireAdmin()) {
    return { error: "Unauthorized" };
  }

  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { images: true, placeId: true },
  });

  if (!review) {
    return { error: "Review not found" };
  }
  if (!review.images.includes(imageUrl)) {
    return { error: "Image not found" };
  }

  try {
    await deleteImageFromStorage(imageUrl);
  } catch {
    // Continue if file was already removed from storage
  }

  await prisma.review.update({
    where: { id: reviewId },
    data: { images: review.images.filter((url) => url !== imageUrl) },
  });

  revalidatePath("/dashboard/admin/reviews");
  revalidatePath(`/places/${review.placeId}`);
  revalidatePath("/places");
  return { success: true };
}

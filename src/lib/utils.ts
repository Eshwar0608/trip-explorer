import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(new Date(date));
}

export function averageRating(ratings: number[]) {
  if (ratings.length === 0) return 0;
  return ratings.reduce((a, b) => a + b, 0) / ratings.length;
}

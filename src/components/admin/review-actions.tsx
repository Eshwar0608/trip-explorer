"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteReview } from "@/actions/reviews";

export function ReviewActions({ reviewId }: { reviewId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      variant="destructive"
      disabled={pending}
      onClick={() => {
        if (confirm("Delete this review?")) {
          startTransition(async () => {
            await deleteReview(reviewId);
            router.refresh();
          });
        }
      }}
    >
      Delete
    </Button>
  );
}

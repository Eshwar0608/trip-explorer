"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { approvePlace, rejectPlace, deletePlace } from "@/actions/places";

export function PlaceActions({
  placeId,
  showApprove = true,
}: {
  placeId: string;
  showApprove?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handle(action: () => Promise<{ error?: string; success?: boolean }>) {
    startTransition(async () => {
      await action();
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {showApprove && (
        <>
          <Button
            size="sm"
            disabled={pending}
            onClick={() => handle(() => approvePlace(placeId))}
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => handle(() => rejectPlace(placeId))}
          >
            Reject
          </Button>
        </>
      )}
      <Button
        size="sm"
        variant="destructive"
        disabled={pending}
        onClick={() => {
          if (confirm("Delete this place and all its reviews?")) {
            handle(() => deletePlace(placeId));
          }
        }}
      >
        Delete
      </Button>
    </div>
  );
}

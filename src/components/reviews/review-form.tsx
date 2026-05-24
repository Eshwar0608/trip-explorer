"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

export function ReviewForm({ placeId }: { placeId: string }) {
  const router = useRouter();
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        placeId,
        rating: parseInt(rating, 10),
        comment,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to submit review");
      return;
    }

    router.refresh();
    setComment("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <div className="space-y-2">
        <Label htmlFor="rating">Rating</Label>
        <Select
          id="rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} stars
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="comment">Your review</Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          minLength={5}
          rows={4}
          placeholder="Share your experience..."
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit review"}
      </Button>
    </form>
  );
}

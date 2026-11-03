"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { setNextUrl } from "@/lib/session-redirect";
import { cn } from "cn";

const RATINGS = [5, 4, 3, 2, 1];

export function ReviewForm({ studioId, user, onSubmitted }) {
  const pathname = usePathname();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const data = await apiFetch(`/studios/${studioId}/reviews`, {
        method: "POST",
        body: { rating, comment },
      });

      setSuccess("Review posted — thanks for sharing your experience.");
      setComment("");
      setRating(5);
      onSubmitted?.(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!user) {
    return (
      <div className="border-border bg-secondary/40 mt-6 rounded-xl border px-4 py-4 text-sm">
        <p className="text-muted-foreground">
          <Link
            href="/login"
            onClick={() => setNextUrl(pathname)}
            className="text-brand font-bold hover:underline"
          >
            Log in
          </Link>{" "}
          to leave a review. Reviews are limited to members with a completed
          booking at this studio.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-border bg-secondary/40 mt-6 rounded-xl border p-4"
    >
      <p className="text-sm font-bold">Leave a review</p>
      <p className="text-muted-foreground mt-1 text-xs">
        Only members with a completed booking at this studio can post. Each
        member can review a studio once.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-[140px_1fr]">
        <div>
          <label htmlFor="review-rating" className="block pb-2 text-xs font-bold">
            Rating
          </label>
          <select
            id="review-rating"
            value={rating}
            onChange={(event) => setRating(Number(event.target.value))}
            className="bg-card h-10 w-full rounded-lg border border-border px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {RATINGS.map((value) => (
              <option key={value} value={value}>
                {value} star{value === 1 ? "" : "s"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="review-comment" className="block pb-2 text-xs font-bold">
            Comment
          </label>
          <textarea
            id="review-comment"
            rows={3}
            required
            minLength={4}
            maxLength={800}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="What worked well? What should the next creator know?"
            className="bg-card w-full resize-y rounded-lg border border-border px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="text-destructive mt-3 text-sm">
          {error}
        </p>
      )}
      {success && (
        <p role="status" className="mt-3 text-sm text-emerald-500">
          {success}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-muted-foreground flex items-center gap-1 text-xs">
          <Star className="fill-star text-star size-3.5" aria-hidden="true" />
          {rating}.0 / 5
        </span>
        <button
          type="submit"
          disabled={isSubmitting || comment.trim().length < 4}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-9 cursor-pointer rounded-full px-4 text-xs font-bold"
          )}
        >
          {isSubmitting ? "Posting…" : "Post review"}
        </button>
      </div>
    </form>
  );
}

export default ReviewForm;

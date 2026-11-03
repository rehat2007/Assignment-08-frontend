"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { cn } from "cn";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const data = await apiFetch("/newsletter", {
        method: "POST",
        body: { email: email.trim() },
      });

      setMessage(data.message ?? "You're on the list.");
      setEmail("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (message) {
    return (
      <p role="status" className="text-footer-muted text-sm">
        {message}
      </p>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@email.com"
          className="text-footer-foreground placeholder:text-footer-muted focus-visible:border-brand focus-visible:ring-brand/50 h-11 min-w-0 flex-1 rounded-full border border-white/20 bg-transparent px-4 text-sm outline-none transition-colors focus-visible:ring-3"
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            buttonVariants({ size: "lg" }),
            "bg-brand h-11 shrink-0 rounded-full px-6 text-white hover:bg-brand/90 disabled:cursor-wait disabled:opacity-60"
          )}
        >
          {isSubmitting ? "Joining…" : "Join"}
        </Button>
      </form>
      {error && (
        <p role="alert" className="text-footer-muted pt-2 text-xs">
          {error}
        </p>
      )}
    </div>
  );
}

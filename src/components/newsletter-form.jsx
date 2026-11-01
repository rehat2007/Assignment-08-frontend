"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    // TODO: wire up to a server action / API route when the newsletter backend exists.
    setSubscribed(true);
  }

  if (subscribed) {
    return (
      <p role="status" className="text-sm text-muted-foreground">
        You&apos;re on the list — new studios and booking tips, once a month.
      </p>
    );
  }

  return (
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
        className="h-11 min-w-0 flex-1 rounded-full border border-border bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      <Button
        type="submit"
        className={cn(
          buttonVariants({ size: "lg" }),
          "h-11 shrink-0 rounded-full bg-brand px-6 text-white hover:bg-brand/90"
        )}
      >
        Join
      </Button>
    </form>
  );
}

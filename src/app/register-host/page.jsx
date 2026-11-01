"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { inputClass, labelClass } from "@/components/auth/shared";
import { buttonVariants } from "@/components/ui/button";
import { STUDIO_CATEGORIES } from "@/lib/studios";
import { cn } from "cn";

const AMENITIES = [
  "Wi-Fi",
  "Air conditioning",
  "Parking",
  "Green room",
  "Backdrops",
  "Softbox lighting",
  "Soundproofing",
  "Mixing console",
  "Kitchenette",
  "Props",
  "Restroom",
  "24h access",
];

const CATEGORY_OPTIONS = STUDIO_CATEGORIES.filter(({ value }) => value !== "all");

const fieldRowClass = "grid gap-x-6 gap-y-5 sm:grid-cols-2";

export default function RegisterHostPage() {
  const [selectedAmenities, setSelectedAmenities] = useState(() => new Set());
  const [submitted, setSubmitted] = useState(false);
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: "photo",
      hostName: "Ayesha Rahman",
      hostEmail: "ayesha@studiospace.dev",
    },
  });

  function toggleAmenity(amenity) {
    setSelectedAmenities((current) => {
      const next = new Set(current);
      if (next.has(amenity)) {
        next.delete(amenity);
      } else {
        next.add(amenity);
      }
      return next;
    });
  }

  function onSubmit() {
    // TODO: replace with a server action / API route that persists the listing.
    setSubmitted(true);
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page header */}
      <p className="text-brand text-xs font-bold tracking-[0.2em] uppercase">
        Add New Studio
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
        List your space
      </h1>
      <p className="text-muted-foreground mt-3">
        Fill in the details guests need to decide. You can edit everything
        later.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="bg-card mt-8 rounded-3xl border border-border p-6 sm:p-10"
      >
        {submitted && (
          <p
            role="status"
            className="mb-6 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-400"
          >
            Listing submitted — we review new spaces before they go live.
          </p>
        )}

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="listing-title" className={labelClass}>
              Title
            </label>
            <input
              id="listing-title"
              type="text"
              placeholder="e.g. North Light Photo Loft"
              className={inputClass}
              {...registerField("title", {
                required: "Please add a title.",
              })}
            />
            {errors.title && (
              <p className="text-destructive pt-2 text-sm">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Category + capacity */}
          <div className={fieldRowClass}>
            <div>
              <label htmlFor="listing-category" className={labelClass}>
                Category
              </label>
              <select
                id="listing-category"
                className={cn(inputClass, "bg-card")}
                {...registerField("category", {
                  required: "Please pick a category.",
                })}
              >
                {CATEGORY_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="listing-capacity" className={labelClass}>
                Max capacity
              </label>
              <input
                id="listing-capacity"
                type="number"
                placeholder="10"
                min={1}
                className={inputClass}
                {...registerField("capacity", {
                  required: "Please add the max capacity.",
                  min: { value: 1, message: "Capacity must be at least 1." },
                  valueAsNumber: true,
                })}
              />
              {errors.capacity && (
                <p className="text-destructive pt-2 text-sm">
                  {errors.capacity.message}
                </p>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className={fieldRowClass}>
            <div>
              <label htmlFor="listing-rate" className={labelClass}>
                Hourly rate ($)
              </label>
              <input
                id="listing-rate"
                type="number"
                placeholder="85"
                min={1}
                className={inputClass}
                {...registerField("hourlyRate", {
                  required: "Please add an hourly rate.",
                  min: { value: 1, message: "Rate must be at least $1." },
                  valueAsNumber: true,
                })}
              />
              {errors.hourlyRate && (
                <p className="text-destructive pt-2 text-sm">
                  {errors.hourlyRate.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="listing-deposit" className={labelClass}>
                Security deposit ($)
              </label>
              <input
                id="listing-deposit"
                type="number"
                placeholder="100"
                min={0}
                className={inputClass}
                {...registerField("securityDeposit", {
                  required: "Please add a security deposit.",
                  min: {
                    value: 0,
                    message: "Deposit cannot be negative.",
                  },
                  valueAsNumber: true,
                })}
              />
              {errors.securityDeposit && (
                <p className="text-destructive pt-2 text-sm">
                  {errors.securityDeposit.message}
                </p>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="listing-location" className={labelClass}>
              Location / address
            </label>
            <input
              id="listing-location"
              type="text"
              placeholder="Street, area, city"
              className={inputClass}
              {...registerField("location", {
                required: "Please add a location.",
              })}
            />
            {errors.location && (
              <p className="text-destructive pt-2 text-sm">
                {errors.location.message}
              </p>
            )}
          </div>

          {/* Image URL + upload */}
          <div className="space-y-3">
            <div>
              <label htmlFor="listing-image-url" className={labelClass}>
                Image URL
              </label>
              <input
                id="listing-image-url"
                type="url"
                placeholder="https://i.ibb.co/your-studio.jpg"
                className={inputClass}
                {...registerField("imageUrl", {
                  validate: (value) =>
                    !value ||
                    /^https?:\/\/\S+$/.test(value) ||
                    "Image URL must start with http(s)://",
                })}
              />
              {errors.imageUrl && (
                <p className="text-destructive pt-2 text-sm">
                  {errors.imageUrl.message}
                </p>
              )}
            </div>

            {/* TODO: wire the upload button to the imgbb API and paste the returned URL above. */}
            <div className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-border px-4 py-3">
              <p className="text-muted-foreground flex items-center gap-3 text-sm">
                <Plus className="size-4 shrink-0" aria-hidden="true" />
                Or upload to imgbb and paste the link above.
              </p>
              <button
                type="button"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "bg-brand/15 text-brand h-9 shrink-0 rounded-full px-4 font-bold hover:bg-brand/25"
                )}
              >
                Upload image
              </button>
            </div>
          </div>

          {/* Amenities */}
          <fieldset>
            <legend className={labelClass}>Amenities</legend>
            <div
              className="flex flex-wrap gap-2.5"
              role="group"
              aria-label="Amenities"
            >
              {AMENITIES.map((amenity) => {
                const isSelected = selectedAmenities.has(amenity);

                return (
                  <button
                    key={amenity}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => toggleAmenity(amenity)}
                    className={cn(
                      "h-9 rounded-full border px-4 text-sm font-semibold transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                      isSelected
                        ? "bg-brand border-transparent text-white"
                        : "hover:bg-accent/50 border-border bg-transparent"
                    )}
                  >
                    {amenity}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Overview */}
          <div>
            <label htmlFor="listing-overview" className={labelClass}>
              Detailed overview
            </label>
            <textarea
              id="listing-overview"
              rows={4}
              placeholder="Describe the space, equipment, rules and what makes it work for creators."
              className={cn(inputClass, "h-auto resize-y py-3")}
              {...registerField("overview", {
                required: "Please describe the space.",
              })}
            />
            {errors.overview && (
              <p className="text-destructive pt-2 text-sm">
                {errors.overview.message}
              </p>
            )}
          </div>

          {/* Host details */}
          <div className={fieldRowClass}>
            <div>
              <label htmlFor="listing-host-name" className={labelClass}>
                Host name
              </label>
              <input
                id="listing-host-name"
                type="text"
                className={inputClass}
                {...registerField("hostName", {
                  required: "Please add your name.",
                })}
              />
              {errors.hostName && (
                <p className="text-destructive pt-2 text-sm">
                  {errors.hostName.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="listing-host-email" className={labelClass}>
                Host email
              </label>
              <input
                id="listing-host-email"
                type="email"
                autoComplete="email"
                className={inputClass}
                {...registerField("hostEmail", {
                  required: "Please add your email.",
                })}
              />
              {errors.hostEmail && (
                <p className="text-destructive pt-2 text-sm">
                  {errors.hostEmail.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-brand h-11 rounded-full px-6 text-white hover:bg-brand/90"
            )}
          >
            Publish studio
          </button>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 rounded-full px-5"
            )}
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Check, ImageUp } from "lucide-react";
import { inputClass, labelClass } from "@/components/auth/shared";
import { buttonVariants } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { useAuthGuard } from "@/lib/auth-guard";
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

function RegisterHostForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editingId = searchParams.get("edit");
  const { user, isPending } = useAuthGuard("/register-host");
  const [selectedAmenities, setSelectedAmenities] = useState(() => new Set());
  const [isLoadingListing, setIsLoadingListing] = useState(Boolean(editingId));
  const [isUploading, setIsUploading] = useState(false);
  const [pageError, setPageError] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const {
    register: registerField,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      category: "photo",
      capacity: 10,
      hourlyRate: "",
      securityDeposit: 0,
      location: "",
      imageUrl: "",
      overview: "",
      hostName: "",
      hostEmail: "",
    },
  });

  useEffect(() => {
    if (!user) return;
    setValue("hostName", user.name ?? "");
    setValue("hostEmail", user.email ?? "");
  }, [user, setValue]);

  useEffect(() => {
    if (!editingId) return;

    const controller = new AbortController();

    apiFetch(`/api/studios/${encodeURIComponent(editingId)}`, {
      signal: controller.signal,
    })
      .then(({ studio }) => {
        reset({
          title: studio.name ?? "",
          category: studio.category ?? "photo",
          capacity: studio.capacity ?? 10,
          hourlyRate: studio.price ?? "",
          securityDeposit: studio.deposit ?? 0,
          location: studio.location ?? "",
          imageUrl: studio.image ?? "",
          overview: studio.description ?? "",
          hostName: studio.host?.name ?? "",
          hostEmail: studio.host?.email ?? "",
        });
        setSelectedAmenities(new Set(studio.amenities ?? []));
      })
      .catch((requestError) => {
        if (requestError.name !== "AbortError") setPageError(requestError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoadingListing(false);
      });

    return () => controller.abort();
  }, [editingId, reset]);

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

  async function onSubmit(values) {
    setPageError(null);

    const payload = {
      name: values.title.trim(),
      category: values.category,
      location: values.location.trim(),
      price: Number(values.hourlyRate),
      deposit: Number(values.securityDeposit),
      capacity: Number(values.capacity),
      minHours: 1,
      description: values.overview.trim(),
      amenities: [...selectedAmenities],
      image: values.imageUrl.trim() || null,
    };

    try {
      if (editingId) {
        await apiFetch(`/api/studios/${encodeURIComponent(editingId)}`, {
          method: "PATCH",
          body: payload,
        });
        router.push("/dashboard/listings");
      } else {
        const { studio } = await apiFetch("/api/studios", {
          method: "POST",
          body: payload,
        });
        router.push(`/studios/${studio.slug}`);
      }
    } catch (requestError) {
      setPageError(requestError.message);
    }
  }

  async function handleUpload(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploadError(null);

    if (file.size > 8 * 1024 * 1024) {
      setUploadError("Pick an image smaller than 8MB.");
      return;
    }

    setIsUploading(true);

    try {
      const dataUri = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Could not read that image."));
        reader.readAsDataURL(file);
      });

      const { url } = await apiFetch("/api/uploads", {
        method: "POST",
        body: { image: dataUri, name: file.name },
      });

      setValue("imageUrl", url, { shouldValidate: true });
    } catch (requestError) {
      setUploadError(requestError.message);
    } finally {
      setIsUploading(false);
    }
  }

  const imageUrlValue = useWatch({ control, name: "imageUrl" });

  if (isPending || !user) {
    return null;
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page header */}
      <p className="text-brand-strong text-xs font-bold tracking-[0.2em] uppercase">
        {editingId ? "Edit Studio" : "Add New Studio"}
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
        {editingId ? "Update your space" : "List your space"}
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
        {isLoadingListing && (
          <p
            role="status"
            className="text-muted-foreground mb-6 rounded-lg border border-border bg-secondary/50 px-3 py-2.5 text-sm"
          >
            Loading the existing listing…
          </p>
        )}

        {pageError && (
          <p
            role="alert"
            className="border-destructive/30 bg-destructive/10 text-destructive mb-6 rounded-lg border px-3 py-2.5 text-sm"
          >
            {pageError}
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
            className={cn(inputClass, "bg-transparent")}
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

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed border-border px-4 py-3">
              <p className="text-muted-foreground flex items-center gap-3 text-sm">
                <ImageUp className="size-4 shrink-0" aria-hidden="true" />
                Or upload to imgbb and use the returned link.
              </p>
              <label
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "bg-brand/15 text-brand h-9 cursor-pointer rounded-full px-4 font-bold hover:bg-brand/25",
                  isUploading && "pointer-events-none opacity-60"
                )}
              >
                {isUploading ? "Uploading…" : "Upload image"}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  disabled={isUploading}
                  onChange={handleUpload}
                />
              </label>
            </div>
            {uploadError && (
              <p role="alert" className="text-destructive text-sm">
                {uploadError}
              </p>
            )}

            {imageUrlValue && /^https?:\/\/\S+$/.test(imageUrlValue) && (
              /* eslint-disable-next-line @next/next/no-img-element -- host uploads are arbitrary external URLs, not configured Next image hosts */
              <img
                src={imageUrlValue}
                alt="Listing preview"
                className="border-border h-40 w-full rounded-xl border object-cover"
              />
            )}
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
                      "h-9 rounded-full border px-4 text-sm font-semibold transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50 hover:-translate-y-px hover:shadow-hover",
                      isSelected
                        ? "bg-soft border-brand text-soft-foreground"
                        : "hover:bg-accent/50 border-border bg-transparent"
                    )}
                  >
                    {isSelected && (
                      <Check className="size-3.5" aria-hidden="true" />
                    )}
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
            disabled={isSubmitting || isUploading || isLoadingListing}
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-brand h-11 cursor-pointer rounded-full px-6 text-white hover:bg-brand/90 disabled:cursor-wait disabled:opacity-60"
            )}
          >
            {isSubmitting
              ? editingId
                ? "Saving…"
                : "Publishing…"
              : editingId
                ? "Save changes"
                : "Publish studio"}
          </button>
          <Link
            href={editingId ? "/dashboard/listings" : "/"}
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

export default function RegisterHostPage() {
  return (
    <Suspense fallback={null}>
      <RegisterHostForm />
    </Suspense>
  );
}

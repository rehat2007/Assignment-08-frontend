"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Check, Music, X } from "lucide-react";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import {
  GoogleIcon,
  OrDivider,
  AuthSubmitButton,
  inputClass,
  labelClass,
} from "@/components/auth/shared";
import { cn } from "cn";

const PASSWORD_CHECKS = [
  { label: "Uppercase letter", test: (value) => /[A-Z]/.test(value) },
  { label: "Lowercase letter", test: (value) => /[a-z]/.test(value) },
  { label: "6+ characters", test: (value) => value.length >= 6 },
];

export function RegisterCard({ className, ...props }) {
  const router = useRouter();
  const [registered, setRegistered] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [isGooglePending, setIsGooglePending] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: "", email: "", photoUrl: "", password: "" },
  });

  const passwordRules = registerField("password", {
    required: "Please create a password.",
    validate: (value) =>
      PASSWORD_CHECKS.every(({ test }) => test(value)) ||
      "Password must meet all requirements below.",
  });

  async function onSubmit(values) {
    setServerError(null);

    const { error } = await authClient.signUp.email({
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password,
      image: values.photoUrl || undefined,
    });

    if (error) {
      const message = error.code?.startsWith("USER_ALREADY_EXISTS")
        ? "An account with this email already exists. Try logging in instead."
        : error.message || "Could not create your account. Please try again.";

      setServerError(message);
      toast.error(message);
      return;
    }

    // Better Auth creates the session cookie on sign-up, so the user is
    // logged in from here — send them straight to the homepage.
    setRegistered(true);
    toast.success("Account created — welcome to StudioSpace!");
    router.push("/");
  }

  async function handleGoogle() {
    setServerError(null);

    setIsGooglePending(true);
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
    setIsGooglePending(false);

    if (error) {
      const message =
        error.message || "Google sign-in is unavailable right now.";

      setServerError(message);
      toast.error(message);
    }
  }

  return (
    <div
      className={cn(
        "border-border grid overflow-hidden rounded-3xl border md:grid-cols-2",
        className
      )}
      {...props}
    >
      {/* Promo panel */}
      <div
        className="relative hidden overflow-hidden bg-neutral-950 bg-cover bg-center md:flex md:flex-col md:justify-between"
        style={{ backgroundImage: "url('/images/auth-register.jpg')" }}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-black/90 via-black/35 to-black/10"
        />

        <span className="relative grid flex-1 place-items-center">
          <Music
            className="size-24 text-white/90 drop-shadow-lg"
            strokeWidth={2.5}
            aria-hidden="true"
          />
        </span>

        <div className="relative p-8">
          <p className="text-2xl font-bold tracking-tight text-white">
            Join the studio network.
          </p>
          <p className="mt-2 text-white/80">
            Book rooms by the hour or list your own.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="p-8 sm:p-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Create your account
        </h1>
        <p className="text-muted-foreground mt-2">
          It takes less than a minute.
        </p>

        {registered && (
          <p
            role="status"
            className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-500"
          >
            Account created — signed in. Taking you home…
          </p>
        )}

        {serverError && !registered && (
          <p
            role="alert"
            className="border-destructive/30 bg-destructive/10 mt-4 rounded-lg border px-3 py-2.5 text-sm text-destructive"
          >
            {serverError}
          </p>
        )}

        <div className="mt-7 space-y-5">
          <div>
            <label htmlFor="register-name" className={labelClass}>
              Name
            </label>
            <input
              id="register-name"
              type="text"
              autoComplete="name"
              placeholder="Your full name"
              className={inputClass}
              {...registerField("name", {
                required: "Please tell us your name.",
              })}
            />
            {errors.name && (
              <p className="text-destructive pt-2 text-sm">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="register-email" className={labelClass}>
              Email
            </label>
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              placeholder="you@email.com"
              className={inputClass}
              {...registerField("email", {
                required: "Please enter your email.",
              })}
            />
            {errors.email && (
              <p className="text-destructive pt-2 text-sm">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="register-photo-url" className={labelClass}>
              Photo URL
            </label>
            <input
              id="register-photo-url"
              type="url"
              placeholder="https://i.ibb.co/your-photo.jpg"
              className={inputClass}
              {...registerField("photoUrl", {
                validate: (value) =>
                  !value ||
                  /^https?:\/\/\S+$/.test(value) ||
                  "Photo URL must start with http(s)://",
              })}
            />
            {errors.photoUrl && (
              <p className="text-destructive pt-2 text-sm">
                {errors.photoUrl.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="register-password" className={labelClass}>
              Password
            </label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              placeholder="Create a password"
              aria-describedby="register-password-rules"
              className={inputClass}
              {...passwordRules}
              onChange={(event) => {
                passwordRules.onChange(event);
                setPasswordValue(event.target.value);
              }}
            />
            <ul
              id="register-password-rules"
              className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 pt-2.5 text-sm"
            >
              {PASSWORD_CHECKS.map(({ label, test }) => {
                const passes = test(passwordValue);

                return (
                  <li key={label} className="flex items-center gap-1.5">
                    {passes ? (
                      <Check
                        className="size-3.5 text-emerald-400"
                        aria-hidden="true"
                      />
                    ) : (
                      <X className="size-3.5" aria-hidden="true" />
                    )}
                    <span className={cn(passes && "text-emerald-400")}>
                      {label}
                    </span>
                  </li>
                );
              })}
            </ul>
            {errors.password && (
              <p className="text-destructive pt-2 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <AuthSubmitButton
          type="submit"
          disabled={isSubmitting}
          className="mt-7"
        >
          {isSubmitting ? "Creating account…" : "Register"}
        </AuthSubmitButton>

        <OrDivider className="mt-6" />

        <AuthSubmitButton
          type="button"
          variant="outline"
          disabled={isGooglePending}
          onClick={handleGoogle}
          className="mt-6 border-border bg-transparent"
        >
          <GoogleIcon className="size-5" />
          {isGooglePending ? "Redirecting…" : "Continue with Google"}
        </AuthSubmitButton>

        <p className="text-muted-foreground pt-5 text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-brand font-bold outline-none focus-visible:ring-3 focus-visible:ring-ring/50 rounded-sm"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterCard;

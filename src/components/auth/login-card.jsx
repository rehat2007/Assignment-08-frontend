"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Film } from "lucide-react";
import { toast } from "sonner";
import {
  AuthSubmitButton,
  GoogleIcon,
  OrDivider,
  inputClass,
  labelClass,
} from "@/components/auth/shared";
import { authClient } from "@/lib/auth-client";
import { takeNextUrl } from "@/lib/session-redirect";
import { cn } from "cn";

// Test credentials shown in the promo box and pre-filled for examiners.
// These accounts are created by `npm run seed:demo` in studiospace_back_end.
const DEMO_PASSWORD = "Studio123";
const TEST_CREDENTIALS = {
  email: "host@studiospace.dev",
  password: DEMO_PASSWORD,
};
const DEMO_ACCOUNTS = [
  { label: "Host", email: "host@studiospace.dev" },
  { label: "Customer", email: "customer@studiospace.dev" },
  { label: "Reviewer", email: "maya@studiospace.dev" },
];

export function LoginCard({ className, ...props }) {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [isGooglePending, setIsGooglePending] = useState(false);
  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: TEST_CREDENTIALS,
  });

  async function onSubmit(values) {
    setServerError(null);

    const { error } = await authClient.signIn.email({
      email: values.email.trim(),
      password: values.password,
    });

    if (error) {
      const message =
        error.code === "INVALID_EMAIL_OR_PASSWORD"
          ? "Incorrect email or password. Try the examiner credentials above."
          : error.message || "Could not log you in. Please try again.";

      setServerError(message);
      toast.error(message);
      return;
    }

    // Better Auth sets the session cookie here — honor any guest redirect
    // intent (e.g. "Add New Studio" from the Host CTA), else go home.
    setLoggedIn(true);
    toast.success("Welcome back — you're signed in.");
    router.push(takeNextUrl() ?? "/");
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
        style={{ backgroundImage: "url('/images/auth-login.jpg')" }}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-black/90 via-black/35 to-black/10"
        />

        <span className="relative grid flex-1 place-items-center">
          <Film
            className="size-24 text-white/90 drop-shadow-lg"
            strokeWidth={2.5}
            aria-hidden="true"
          />
        </span>

        <div className="relative p-8">
          <p className="text-3xl font-bold tracking-tight text-white">
            Welcome back.
          </p>
          <p className="mt-2 text-white/80">
            Pick up where your last shoot left off.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="p-8 sm:p-10"
      >
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Log in
        </h1>
        <p className="text-muted-foreground mt-2">
          Enter your email and password to continue.
        </p>

        {/* Examiner help box */}
        <div className="bg-card mt-6 rounded-lg border border-border px-4 py-3.5">
          <p className="text-sm font-bold">Examiner test credentials</p>
          <p className="text-muted-foreground pt-0.5 text-sm">
            Password for every account: {DEMO_PASSWORD}
          </p>
          <ul className="text-muted-foreground pt-1.5 text-sm">
            {DEMO_ACCOUNTS.map(({ label, email }) => (
              <li key={email}>
                {label}: {email}
              </li>
            ))}
          </ul>
        </div>

        {loggedIn && (
          <p
            role="status"
            className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-500"
          >
            Logged in — taking you home…
          </p>
        )}

        {serverError && !loggedIn && (
          <p
            role="alert"
            className="border-destructive/30 bg-destructive/10 mt-4 rounded-lg border px-3 py-2.5 text-sm text-destructive"
          >
            {serverError}
          </p>
        )}

        <div className="mt-6 space-y-5">
          <div>
            <label htmlFor="login-email" className={labelClass}>
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
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
            <label htmlFor="login-password" className={labelClass}>
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              className={inputClass}
              {...registerField("password", {
                required: "Please enter your password.",
              })}
            />
            {errors.password && (
              <p className="text-destructive pt-2 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <p className="pt-4 text-right text-sm">
          <Link
            href="/forgot-password"
            className="text-muted-foreground rounded-sm outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 hover:text-foreground"
          >
            Forgot password?
          </Link>
        </p>

        <AuthSubmitButton
          type="submit"
          disabled={isSubmitting}
          className="mt-2"
        >
          {isSubmitting ? "Logging in…" : "Login"}
        </AuthSubmitButton>

        <OrDivider className="mt-5" />

        <AuthSubmitButton
          type="button"
          variant="outline"
          disabled={isGooglePending}
          onClick={handleGoogle}
          className="mt-5 border-border bg-transparent"
        >
          <GoogleIcon className="size-5" />
          {isGooglePending ? "Redirecting…" : "Continue with Google"}
        </AuthSubmitButton>

        <p className="text-muted-foreground pt-5 text-center text-sm">
          New to StudioSpace?{" "}
          <Link
            href="/register"
            className="text-brand font-bold rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginCard;

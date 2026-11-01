"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Film } from "lucide-react";
import {
  AuthSubmitButton,
  GoogleIcon,
  OrDivider,
  inputClass,
  labelClass,
} from "@/components/auth/shared";
import { cn } from "cn";

// Test credentials shown in the promo box and pre-filled for examiners.
const TEST_CREDENTIALS = {
  email: "ayesha@studiospace.dev",
  password: "Studio1",
};

export function LoginCard({ className, ...props }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: TEST_CREDENTIALS,
  });

  function onSubmit() {
    // TODO: replace with a server action / API route when auth exists.
    setLoggedIn(true);
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
      <div className="bg-linear-to-br relative hidden overflow-hidden from-[#f7b183] via-[#ef8d4f] to-[#6e3634] md:flex md:flex-col md:justify-between">
        <span
          aria-hidden="true"
          className="absolute -top-32 -right-20 size-80 rounded-full bg-white/15"
        />
        <span
          aria-hidden="true"
          className="absolute -right-24 bottom-24 size-56 rounded-full bg-white/10"
        />

        <span className="grid flex-1 place-items-center">
          <Film
            className="size-24 text-white"
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
            Email: {TEST_CREDENTIALS.email} · Password:{" "}
            {TEST_CREDENTIALS.password}
          </p>
        </div>

        {loggedIn && (
          <p
            role="status"
            className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-400"
          >
            Logged in — welcome back!
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

        <AuthSubmitButton type="submit" className="mt-2">
          Login
        </AuthSubmitButton>

        <OrDivider className="mt-5" />

        <AuthSubmitButton
          type="button"
          variant="outline"
          className="mt-5 border-border bg-transparent"
        >
          <GoogleIcon className="size-5" />
          Continue with Google
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

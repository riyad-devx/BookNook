
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  LogIn,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Toaster, toast } from "@/components/ui/toast";

/** Reads ?redirect= from the URL and only trusts same-origin paths. */
function getRedirectTarget() {
  if (typeof window === "undefined") return "/";

  const raw = new URLSearchParams(window.location.search).get("redirect");

  if (!raw) return "/";

  const target = new URL(raw, window.location.origin);

  if (target.origin !== window.location.origin) return "/";
  if (target.pathname === "/login" || target.pathname === "/register") {
    return "/";
  }

  return `${target.pathname}${target.search}${target.hash}`;
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const busy = loading || googleLoading;

  // Email Login
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (busy) return;

    setError("");
    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        const message = error.message || "Invalid email or password.";

        setError(message);

        toast.add({
          type: "error",
          title: "Login failed",
          description: message,
        });

        return;
      }

      if (data) {
        toast.add({
          type: "success",
          title: "Signed in",
          description: "Welcome back!",
        });

        router.replace(getRedirectTarget());
      }
    } catch {
      setError("Something went wrong. Please try again.");

      toast.add({
        type: "error",
        title: "Login failed",
        description: "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    if (busy) return;

    setError("");
    setGoogleLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: getRedirectTarget(),
      });

      if (error) {
        const message = error.message || "Google login failed. Please try again.";

        setError(message);
        toast.add({
          type: "error",
          title: "Google login failed",
          description: message,
        });
      }
    } catch {
      setError("Google login failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const inputClass =
    "h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-sm text-emerald-50 outline-none transition-colors placeholder:text-emerald-100/25 focus:border-emerald-300/40 focus-visible:ring-2 focus-visible:ring-emerald-300/20";

  return (
    <main className="min-w-0 flex-1">

      {/* Login Header */}
      <section className="relative w-full overflow-hidden border-b border-emerald-200/10 bg-[#04110b]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/35 to-transparent" />

          <div className="absolute -top-28 left-1/2 size-[24rem] -translate-x-1/2 rounded-full bg-emerald-500/[0.12] blur-[110px]" />
        </div>

        <div className="relative mx-auto w-full max-w-5xl px-4 py-10 text-center sm:px-6 sm:py-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-emerald-300/10 px-3 py-1 text-[10px] font-semibold tracking-[0.28em] text-emerald-200/90 uppercase">
            <LogIn className="size-3" />
            Welcome to BookNook
          </span>

          <h1 className="mt-4 font-heading text-3xl font-semibold tracking-[-0.03em] text-[#f7f4e9] sm:text-4xl">
            Welcome back
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-emerald-50/55">
            Login to your account and continue your reading journey.
          </p>
        </div>
      </section>

      {/* Login Form Section */}
      <section className="w-full">
        <div className="mx-auto w-full max-w-xl px-4 py-10 sm:px-6 sm:py-12">

          <form
            onSubmit={handleLogin}
            className="rounded-[1.75rem] border border-white/[0.09] bg-[#06120d]/80 p-5 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:p-8"
          >
            {error && (
              <p className="mb-5 rounded-xl border border-rose-400/25 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-200">
                {error}
              </p>
            )}

            <div className="space-y-5">

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="text-xs text-emerald-200/60"
                >
                  Email
                </label>

                <div className="relative mt-2">
                  <Mail className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-emerald-200/35" />

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="text-xs text-emerald-200/60"
                >
                  Password
                </label>

                <div className="relative mt-2">
                  <LockKeyhole className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-emerald-200/35" />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`${inputClass} pr-11 pl-10`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-emerald-200/50"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={busy}
              className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-300 via-emerald-400 to-lime-300 text-sm font-semibold text-emerald-950 shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <LogIn className="size-4" />
              )}

              {loading ? "Signing in..." : "Login"}
            </button>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-white/[0.08]" />
              <span className="text-xs text-emerald-100/30">OR</span>
              <span className="h-px flex-1 bg-white/[0.08]" />
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={busy}
              className="flex h-12 w-full items-center justify-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] text-sm text-emerald-50/80 transition hover:bg-white/[0.07] disabled:opacity-60"
            >
              Continue with Google
            </button>

            {/* Register Link */}
            <p className="mt-7 text-center text-sm text-emerald-100/45">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-emerald-300 hover:text-emerald-200"
              >
                Register
              </Link>
            </p>
          </form>
        </div>
      </section>

      <Toaster />
    </main>
  );
}

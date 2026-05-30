import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Loader2, Mail } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

type AuthMode = "signup" | "signin";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("signup");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const isSignup = mode === "signup";

  const redirectTo = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    return `${window.location.origin}/onboarding`;
  }, []);

  const resetStatus = () => setMessage(null);

  const handleModeChange = (nextMode: AuthMode) => {
    setMode(nextMode);
    resetStatus();
  };

  const handleGoogleAuth = async () => {
    resetStatus();
    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      setMessage({
        type: "error",
        text: "Google signup could not start. Check the Google provider settings in Supabase.",
      });
      setIsSubmitting(false);
    }
  };

  const handleEmailAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetStatus();
    setIsSubmitting(true);

    if (isSignup) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            full_name: fullName,
          },
        },
      });

      setIsSubmitting(false);

      if (error) {
        setMessage({ type: "error", text: error.message });
        return;
      }

      setMessage({
        type: "success",
        text: "Account created. Check your email to confirm your signup.",
      });
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsSubmitting(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }

    navigate({ to: "/dashboard" });
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden flex-col justify-between px-8 py-8 lg:flex">
          <Link to="/" className="flex items-center gap-3 text-lg font-bold">
            <img
              src="/nexora-logo.png"
              alt="Nexora"
              className="h-11 w-11 rounded-xl object-contain"
            />
            Nexora by BCI
          </Link>

          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              AI marketing engine
            </p>
            <h1 className="mt-5 text-5xl font-bold leading-tight tracking-tight">
              Start creating sharper content for your business.
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Sign up once, choose your business category, and generate campaign-ready captions,
              calendars, hashtags, and creative ideas from a focused dashboard.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm text-muted-foreground">
            {["Google OAuth", "Secure sessions", "Domain setup"].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-3"
              >
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-8 sm:px-6">
          <div className="w-full max-w-md rounded-lg border border-border/70 bg-card/80 p-6 shadow-2xl shadow-black/20 backdrop-blur sm:p-8">
            <div className="mb-8 flex items-center justify-between gap-4 lg:hidden">
              <Link to="/" className="flex items-center gap-3 font-bold">
                <img
                  src="/nexora-logo.png"
                  alt="Nexora"
                  className="h-10 w-10 rounded-xl object-contain"
                />
                Nexora
              </Link>
            </div>

            <div>
              <p className="text-sm font-medium text-primary">
                {isSignup ? "Create your account" : "Welcome back"}
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                {isSignup ? "Sign up to Nexora" : "Sign in to Nexora"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {isSignup
                  ? "Use Google for the fastest setup, or create an account with email."
                  : "Continue with Google or sign in with your email and password."}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 rounded-lg bg-muted p-1">
              <button
                type="button"
                onClick={() => handleModeChange("signup")}
                className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                  isSignup
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign up
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("signin")}
                className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                  !isSignup
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign in
              </button>
            </div>

            <Button
              type="button"
              variant="outline"
              className="mt-6 h-12 w-full justify-center gap-3 text-base"
              disabled={isSubmitting}
              onClick={handleGoogleAuth}
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <GoogleMark />}
              Continue with Google
            </Button>

            <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              <span className="h-px bg-border" />
              or
              <span className="h-px bg-border" />
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              {isSignup && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input
                    id="fullName"
                    autoComplete="name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Aarav Sharma"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@company.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Minimum 6 characters"
                  minLength={6}
                  required
                />
              </div>

              {message && (
                <p
                  className={`rounded-md border px-3 py-2 text-sm ${
                    message.type === "success"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                      : "border-destructive/40 bg-destructive/10 text-destructive-foreground"
                  }`}
                >
                  {message.text}
                </p>
              )}

              <Button
                type="submit"
                className="h-12 w-full justify-center gap-2 text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Mail className="h-5 w-5" />
                )}
                {isSignup ? "Create account" : "Sign in"}
                {!isSubmitting && <ArrowRight className="h-4 w-4" />}
              </Button>
            </form>

            <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
              By continuing, you agree to Nexora&apos;s{" "}
              <Link to="/terms" className="font-medium text-foreground hover:text-primary">
                Terms
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="font-medium text-foreground hover:text-primary">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
      <path
        d="M21.6 12.23c0-.78-.07-1.53-.2-2.23H12v4.22h5.37a4.6 4.6 0 0 1-1.99 3.02v2.51h3.22c1.89-1.74 3-4.3 3-7.52Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 4.96-.9 6.61-2.43l-3.22-2.51c-.9.6-2.03.95-3.39.95-2.6 0-4.8-1.76-5.59-4.12H3.08v2.6A9.98 9.98 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.41 13.9A6.04 6.04 0 0 1 6.1 12c0-.66.11-1.3.31-1.9V7.5H3.08A9.98 9.98 0 0 0 2 12c0 1.61.39 3.14 1.08 4.5l3.33-2.6Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.99c1.47 0 2.78.5 3.82 1.49l2.86-2.86C16.95 3.01 14.69 2 12 2a9.98 9.98 0 0 0-8.92 5.5l3.33 2.6C7.2 7.75 9.4 5.99 12 5.99Z"
        fill="#EA4335"
      />
    </svg>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Icon } from "@/components/icon";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    const supabase = createClient();

    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/");
        router.refresh();
      } else {
        const base = (email.split("@")[0] || "user").toLowerCase().replace(/[^a-z0-9]/g, "");
        const username = `${base || "user"}-${Math.random().toString(36).slice(2, 6)}`;
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: name.trim() || base, username } },
        });
        if (error) throw error;
        if (!data.session) {
          setNotice("Account created. Check your email to confirm, then sign in.");
          setMode("signin");
        } else {
          router.push("/");
          router.refresh();
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-line p-12 lg:flex">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(900px 500px at 20% 0%, rgba(47,107,255,0.22), transparent 60%), radial-gradient(700px 500px at 90% 100%, rgba(255,59,78,0.14), transparent 55%)",
          }}
        />
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white">
            <Icon name="playCircle" size={22} />
          </span>
          <span className="font-display text-xl font-black tracking-tight">WhosView</span>
        </div>
        <div className="max-w-md">
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight">
            See what your friends are watching. Watch it together.
          </h1>
          <p className="mt-4 text-muted">
            Live activity, shared lists, and synced watch parties — all in one place.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="h-2 w-2 animate-livedot rounded-full bg-live" />
          4 friends watching right now
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white">
                <Icon name="playCircle" size={22} />
              </span>
              <span className="font-display text-xl font-black tracking-tight">WhosView</span>
            </div>
          </div>

          <h2 className="font-display text-2xl font-bold tracking-tight">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {mode === "signin"
              ? "Sign in to pick up where you left off."
              : "Join and start sharing what you watch."}
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            {mode === "signup" && (
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ella"
                  autoComplete="name"
                  className="rounded-xl border border-line bg-panel2 px-3.5 py-2.5 text-sm outline-none ring-brand transition placeholder:text-muted/70 focus:border-transparent focus:ring-2"
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                autoComplete="email"
                className="rounded-xl border border-line bg-panel2 px-3.5 py-2.5 text-sm outline-none ring-brand transition placeholder:text-muted/70 focus:border-transparent focus:ring-2"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                className="rounded-xl border border-line bg-panel2 px-3.5 py-2.5 text-sm outline-none ring-brand transition placeholder:text-muted/70 focus:border-transparent focus:ring-2"
              />
            </div>

            {error && (
              <p role="alert" className="rounded-lg bg-live/10 px-3 py-2 text-sm text-live">
                {error}
              </p>
            )}
            {notice && (
              <p role="status" className="rounded-lg bg-brand-soft px-3 py-2 text-sm text-brand">
                {notice}
              </p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            {mode === "signin" ? "New to WhosView?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError(null);
                setNotice(null);
              }}
              className="font-semibold text-brand hover:underline"
            >
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Key } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Authentication failed. Check your credentials.");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error communicating with authentication service.");
      setLoading(false);
    }
  };

  const handleAutofillDev = () => {
    setEmail("admin@flashsolar.org");
    setPassword("FlashSolar2026!");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-midnight-950 text-ivory-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-midnight-800/40 rounded-full blur-2xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-4">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gold-500/40 bg-midnight-900 flex items-center justify-center p-1.5 shadow-lg group-hover:border-gold-400 transition-colors">
              <Image
                src="/images/logo.jpg"
                alt="Flash Solar Logo"
                width={36}
                height={36}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <span className="text-xl font-heading font-extrabold tracking-tight text-ivory-100 block leading-tight">
                FLASH <span className="text-gold-400">SOLAR</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest text-ivory-400 uppercase">
                Engineering Desk
              </span>
            </div>
          </Link>
        </div>

        <h2 className="text-center text-2xl font-heading font-bold text-ivory-100 tracking-tight">
          Administrative Control Center
        </h2>
        <p className="mt-1 text-center text-xs text-ivory-400">
          Secure access for authorized personnel and sales engineering
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-midnight-900 border border-midnight-700/80 py-8 px-6 sm:px-10 shadow-2xl rounded-2xl relative">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-950/60 border border-rose-700/60 flex items-start gap-3 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-ivory-300 uppercase tracking-wider">
                Corporate Email
              </label>
              <div className="mt-1.5 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ivory-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@flashsolar.org"
                  className="block w-full pl-10 pr-3 py-2.5 bg-midnight-950 border border-midnight-700 rounded-lg text-sm text-ivory-100 placeholder-midnight-500 focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-ivory-300 uppercase tracking-wider">
                Password
              </label>
              <div className="mt-1.5 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ivory-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 bg-midnight-950 border border-midnight-700 rounded-lg text-sm text-ivory-100 placeholder-midnight-500 focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-ivory-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Role-based session (24h)
              </span>
              <button
                type="button"
                onClick={handleAutofillDev}
                className="text-gold-400 hover:text-gold-300 font-mono text-[11px] underline flex items-center gap-1"
                title="Autofill development administrator credentials"
              >
                <Key className="w-3 h-3" />
                Dev Fill
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg bg-gold-500 text-midnight-950 text-sm font-semibold hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 focus:ring-offset-midnight-900 transition-colors shadow-lg disabled:opacity-60"
            >
              {loading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Development credentials helper banner */}
          <div className="mt-6 pt-5 border-t border-midnight-800 text-center">
            <p className="text-[11px] text-ivory-400">
              Development seed credentials:{" "}
              <code className="text-gold-400 font-mono">admin@flashsolar.org</code> /{" "}
              <code className="text-gold-400 font-mono">FlashSolar2026!</code>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-ivory-400 hover:text-gold-400 transition-colors inline-flex items-center gap-1"
          >
            ← Return to public website
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { KeyRound, ShieldAlert, CheckCircle2, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { BrandLogo } from "@/components/shared/brand-logo";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 12) {
      setError("New password must be at least 12 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to update password.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 1500);
    } catch {
      setError("Network error communicating with authentication service.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-midnight-950 text-ivory-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-gold-500 selection:text-midnight-950">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <BrandLogo variant="admin" subtitle="Security Desk" priority />
        </div>

        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border bg-amber-500/10 text-amber-300 border-amber-500/20 mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Temporary Credentials Detected</span>
          </div>
          <h2 className="text-2xl font-heading font-bold text-ivory-100 tracking-tight">
            Set Your Permanent Password
          </h2>
          <p className="text-xs text-ivory-400 max-w-sm mx-auto">
            You are signed in with a temporary password. Choose a secure, permanent password to continue to the Administrator Control Center.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-midnight-900 border border-midnight-700/80 py-8 px-6 sm:px-10 shadow-2xl rounded-2xl relative">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-950/60 border border-rose-700/60 flex items-start gap-3 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-5 p-3 rounded-lg bg-emerald-950/60 border border-emerald-700/60 flex items-start gap-3 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Password updated successfully! Redirecting to dashboard...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ivory-300 uppercase tracking-wider">
                Temporary Password
              </label>
              <div className="mt-1 relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ivory-400">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  placeholder="Enter temporary password"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-sm bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100 placeholder-ivory-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ivory-300 uppercase tracking-wider">
                New Permanent Password
              </label>
              <div className="mt-1 relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ivory-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={12}
                  placeholder="Min 12 chars (letters, numbers, symbols)"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-sm bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100 placeholder-ivory-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ivory-300 uppercase tracking-wider">
                Confirm Permanent Password
              </label>
              <div className="mt-1 relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ivory-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={12}
                  placeholder="Re-enter permanent password"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-sm bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100 placeholder-ivory-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-midnight-950 font-bold text-xs uppercase tracking-wider shadow-goldGlow transition-colors"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-midnight-950 border-t-transparent rounded-full animate-spin" />
                  <span>Updating Credentials...</span>
                </>
              ) : (
                <>
                  <span>Save Password & Enter Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

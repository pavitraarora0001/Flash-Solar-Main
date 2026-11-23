"use client";

import type { PutBlobResult } from "@vercel/blob";
import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Upload, ArrowLeft, CheckCircle2, ShieldCheck, Copy, Check } from "lucide-react";

export default function AvatarUploadPage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!inputFileRef.current?.files || inputFileRef.current.files.length === 0) {
      setError("Please select an avatar file to upload.");
      return;
    }

    const file = inputFileRef.current.files[0];
    setUploading(true);

    try {
      const response = await fetch(
        `/api/avatar/upload?filename=${encodeURIComponent(file.name)}`,
        {
          method: "POST",
          body: file,
        }
      );

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Upload failed with status ${response.status}`);
      }

      const newBlob = (await response.json()) as PutBlobResult;
      setBlob(newBlob);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = () => {
    if (!blob?.url) return;
    navigator.clipboard.writeText(blob.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-midnight-950 text-ivory-100 flex flex-col justify-center items-center p-6 selection:bg-gold-500 selection:text-midnight-950">
      <div className="w-full max-w-lg bg-midnight-900 border border-midnight-700/80 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-midnight-800">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs text-ivory-400 hover:text-gold-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Admin Dashboard</span>
          </Link>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" />
            Vercel Blob Powered
          </span>
        </div>

        <div>
          <h1 className="text-2xl font-heading font-extrabold text-ivory-100 flex items-center gap-2">
            <Upload className="w-6 h-6 text-gold-400" />
            <span>Upload Your Avatar</span>
          </h1>
          <p className="text-xs text-ivory-400 mt-1">
            Direct client streaming upload to Flash Solar Vercel Blob object storage.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex flex-col gap-2">
            <span>{error}</span>
            {error.includes("UNAUTHORIZED") && (
              <Link
                href="/admin/login"
                className="text-gold-400 hover:underline font-semibold inline-flex items-center gap-1"
              >
                Go to Admin Login &rarr;
              </Link>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-ivory-300">
              Select Avatar Image
            </label>
            <input
              name="file"
              ref={inputFileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              required
              className="w-full text-xs text-ivory-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-midnight-800 file:text-gold-400 hover:file:bg-midnight-750 file:cursor-pointer cursor-pointer bg-midnight-950 border border-midnight-700 rounded-lg p-2"
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full py-2.5 px-4 rounded-lg bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-midnight-950 font-bold text-xs uppercase tracking-wider shadow-goldGlow transition-colors flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-midnight-950 border-t-transparent rounded-full animate-spin" />
                <span>Uploading to Vercel Blob...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload to Blob</span>
              </>
            )}
          </button>
        </form>

        {blob && (
          <div className="p-4 rounded-xl bg-midnight-950 border border-gold-500/30 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Avatar Uploaded Successfully!</span>
            </div>

            <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-gold-500/50 shadow-goldGlow">
              <Image
                src={blob.url}
                alt="Uploaded Avatar"
                fill
                className="object-cover"
                unoptimized={false}
              />
            </div>

            <div className="space-y-1 text-xs">
              <span className="text-[11px] text-ivory-400 block">Public CDN URL:</span>
              <div className="flex items-center gap-2 bg-midnight-900 border border-midnight-800 rounded p-2">
                <a
                  href={blob.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-400 hover:underline truncate text-[11px] font-mono flex-1"
                >
                  {blob.url}
                </a>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-ivory-400 hover:text-white p-1"
                  title="Copy URL"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

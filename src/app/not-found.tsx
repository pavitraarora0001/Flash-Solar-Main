import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-midnight-950 text-ivory-100 px-6 py-24">
      <div className="max-w-md text-center space-y-6">
        <div className="w-16 h-16 bg-midnight-900 border border-midnight-700 rounded-full flex items-center justify-center mx-auto text-gold-500 shadow-md">
          <Compass className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-heading font-bold tracking-tight text-ivory-100">404 — Page Not Found</h1>
          <p className="text-ivory-400 text-sm leading-relaxed">
            The requested technical resource or page route does not exist or has been relocated as part of our platform upgrade.
          </p>
        </div>
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-gold-500 hover:bg-gold-600 text-midnight-950 font-semibold text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gold-500"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}

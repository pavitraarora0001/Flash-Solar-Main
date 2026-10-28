import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0B192C",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Flash Solar | Advanced Clean Energy Storage & DC Systems",
    template: "%s | Flash Solar",
  },
  description: "Specialized clean energy storage solutions, Flash Power Wall, and zero-loss DC microgrid architectures.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://flashsolar.org"),
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-gold-500 selection:text-navy-950">
        {children}
      </body>
    </html>
  );
}


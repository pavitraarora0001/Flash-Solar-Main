import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#061321",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Flash Solar | Advanced Clean Energy Storage & DC Systems",
    template: "%s | Flash Solar",
  },
  description:
    "Industrial-grade clean energy storage solutions, Flash Power Wall systems, and zero-loss direct-current microgrid architectures engineered for independent power resilience.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://flashsolar.org"),
  keywords: [
    "Flash Solar",
    "Flash Power Wall",
    "DC House",
    "Direct Current Microgrid",
    "LiFePO4 battery storage",
    "Clean energy storage",
    "Zero-loss solar",
  ],
  authors: [{ name: "Flash Solar Engineering" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://flashsolar.org",
    siteName: "Flash Solar",
    title: "Flash Solar | Advanced Clean Energy Storage & DC Systems",
    description:
      "Industrial-grade clean energy storage solutions, Flash Power Wall systems, and zero-loss direct-current microgrid architectures.",
  },
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
      <body className="min-h-screen bg-midnight-950 text-ivory-100 font-sans flex flex-col selection:bg-gold-500 selection:text-midnight-950">
        {children}
      </body>
    </html>
  );
}

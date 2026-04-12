import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const siteUrl = "https://postopp.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "PostOpp — Privacy-First Symptom Tracking for Veterans",
    template: "%s | PostOpp",
  },
  description:
    "Track post-operative symptoms privately on your device. No accounts, no cloud, no tracking — just a simple tool for veterans to log pain and share with their care team.",
  manifest: "/manifest.json",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    siteName: "PostOpp",
    title: "PostOpp — Privacy-First Symptom Tracking for Veterans",
    description:
      "Track post-operative symptoms privately on your device. No accounts, no cloud, no tracking — just a simple tool for veterans to log pain and share with their care team.",
    url: siteUrl,
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "PostOpp — Privacy-First Symptom Tracking for Veterans",
    description:
      "Track post-operative symptoms privately on your device. No accounts, no cloud, no tracking.",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PostOpp",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1a1a2e",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PostOpp",
  description:
    "Privacy-first post-operative symptom tracking app for veterans. All data stays on your device.",
  url: siteUrl,
  applicationCategory: "HealthApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern browser with IndexedDB support",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "One-tap symptom logging",
    "Pain scale tracking (1-10)",
    "Follow-up reminders",
    "Trend visualization",
    "PDF and JSON export",
    "Optional GPS tagging",
    "PIN lock and AES-256 encryption",
    "Works offline as a PWA",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <ClientLayout>{children}</ClientLayout>
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics gaId="G-Y792K19GC4" />
      </body>
    </html>
  );
}

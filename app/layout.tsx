import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { FavoritesProvider } from "@/context/FavoritesContext";

export const metadata: Metadata = {
  title: {
    default: "OnTrackAutomotiveGroup",
    template: "%s | OnTrackAutomotiveGroup",
  },
  description:
    "Your trusted source for quality pre-owned vehicles. Browse our extensive inventory of cars, trucks, and SUVs.",
  keywords: [
    "used cars",
    "pre-owned vehicles",
    "car dealership",
    "automotive",
    "car sales",
  ],
  authors: [{ name: "OnTrackAutomotiveGroup" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ontrackautomotivegroup.com",
    siteName: "OnTrackAutomotiveGroup",
    title: "OnTrackAutomotiveGroup",
    description: "Your trusted source for quality pre-owned vehicles",
    // images: [
    //   {
    //     url: "/og-image.jpg",
    //     width: 1200,
    //     height: 630,
    //     alt: "OnTrackAutomotiveGroup",
    //   },
    // ],
  },
  // twitter: {
  //   card: "summary_large_image",
  //   title: "OnTrack Automotive Group",
  //   description: "Your trusted source for quality pre-owned vehicles",
  //   images: ["/og-image.jpg"],
  // },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-chrome-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/android-chrome-512x512.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <FavoritesProvider>
          <Navbar />
          {children}
          <SpeedInsights />
          <Analytics />
          <Toaster />
          <Footer />
        </FavoritesProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
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
      <body>
        <FavoritesProvider>
          <Navbar />
          {children}
          <Toaster />
          <Footer />
        </FavoritesProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { AboutUs } from "@/components/AboutUs";
import { FeaturedListings } from "@/components/FeaturedListings";
import { HeroWithFilter } from "@/components/HeroWithFilter";
import HeroWithImage from "@/components/HeroWithImage";
import { HowItWorks } from "@/components/HowItWorks";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Welcome to OnTrackAutomotiveGroup. Find your perfect pre-owned vehicle from our extensive inventory of quality cars, trucks, and SUVs.",
  openGraph: {
    title: "OnTrackAutomotiveGroup - Quality Pre-owned Vehicles",
    description:
      "Find your perfect pre-owned vehicle from our extensive inventory of quality cars, trucks, and SUVs.",
  },
};

export default function Home() {
  return (
    <main>
      <h1 className="sr-only">OnTrackAutomotiveGroup</h1>
      <HeroWithImage />
      <HeroWithFilter />
      <AboutUs />
      <FeaturedListings />
      <HowItWorks />
    </main>
  );
}

import Favourites from "@/components/Favourites";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Favorite Cars",
  description:
    "View the cars you've marked as favorites at OnTrackAutomotiveGroup. Revisit your top picks and continue your journey toward the perfect vehicle.",
  openGraph: {
    title: "Your Favorite Cars | OnTrackAutomotiveGroup",
    description:
      "Browse the cars you've saved as favorites with OnTrackAutomotiveGroup. View details or book a test drive today.",
  },
};

export default function FavoritesPage() {
  return <Favourites />;
}

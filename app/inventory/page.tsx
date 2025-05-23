import type { Metadata } from "next";
import InventoryCarCard from "@/components/InventoryCarCard";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Inventory",
  description:
    "Browse our extensive inventory of quality pre-owned vehicles. Find the perfect car, truck, or SUV that matches your needs and budget.",
  openGraph: {
    title: "Vehicle Inventory - OnTrackAutomotiveGroup",
    description:
      "Browse our extensive inventory of quality pre-owned vehicles. Find the perfect car, truck, or SUV that matches your needs and budget.",
  },
};

const Inventory = () => {
  return (
    <>
      <Suspense>
        <InventoryCarCard />
      </Suspense>
    </>
  );
};

export default Inventory;

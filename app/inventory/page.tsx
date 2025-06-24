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
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<InventorySkeleton />}>
          <InventoryCarCard />
        </Suspense>
      </div>
    </div>
  );
};

// Simple skeleton to prevent layout shift
const InventorySkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="h-48 bg-gray-200 animate-pulse"></div>
          <div className="p-4 space-y-3">
            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Inventory;

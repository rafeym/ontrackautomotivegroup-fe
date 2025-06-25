import type { Metadata } from "next";
import InventoryCarCard from "@/components/InventoryCarCard";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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

// Proper skeleton that matches the actual InventoryCarCard layout
const InventorySkeleton = () => {
  return (
    <div className="relative">
      <div className="flex flex-col lg:flex-row px-4 py-8 gap-8">
        {/* Sidebar Skeleton */}
        <aside className="hidden lg:block w-64 sticky top-4 self-start">
          <div>
            <Skeleton className="h-6 w-16 mb-4" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="mb-6">
                <Skeleton className="h-3 w-24 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
            <div className="space-y-3 mt-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <section className="flex-1">
          {/* Sticky Header Skeleton */}
          <div className="sticky top-0 z-10 bg-white pb-4 pt-2 -mx-4 px-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                {/* Mobile Filters Text */}
                <div className="lg:hidden flex-1 mr-4">
                  <Skeleton className="h-4 w-48" />
                </div>

                {/* Sort Dropdown */}
                <div className="lg:ml-auto">
                  <Skeleton className="h-10 w-52" />
                </div>
              </div>

              {/* Mobile Filters Button */}
              <div className="lg:hidden">
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>

          {/* Car Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 content-start">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card
                key={i}
                className="hover:shadow-lg transition rounded-xl overflow-hidden group relative border"
              >
                <CardHeader className="p-0 relative">
                  <Skeleton className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                  {/* Heart button skeleton */}
                  <div className="absolute top-2 right-2">
                    <Skeleton className="w-8 h-8 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  {/* Title and availability badge */}
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-5 w-16 rounded" />
                  </div>

                  {/* Address line */}
                  <Skeleton className="h-3 w-2/3" />

                  {/* Mileage and price */}
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>

                  {/* Feature badges */}
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-5 w-16 rounded" />
                    <Skeleton className="h-5 w-20 rounded" />
                    <Skeleton className="h-5 w-18 rounded" />
                  </div>

                  {/* View Details button */}
                  <Skeleton className="h-10 w-full rounded mt-3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Inventory;

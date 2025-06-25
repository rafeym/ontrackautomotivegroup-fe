// components/SkeletonCard.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonCard = () => (
  <Card className="hover:shadow-lg transition rounded-xl overflow-hidden group relative border">
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
);

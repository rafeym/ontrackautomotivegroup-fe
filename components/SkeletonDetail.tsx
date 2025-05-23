import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const SkeletonDetail = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      {/* Left: Image Skeleton */}
      <div className="w-full lg:w-2/3 space-y-4">
        <Skeleton className="w-full h-[400px] rounded-lg" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="w-24 h-24 rounded" />
          ))}
        </div>
      </div>

      {/* Right: Car Details Skeleton */}
      <Card className="w-full lg:w-1/3 p-4 space-y-4">
        <CardContent className="space-y-2 p-0">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-6 w-1/3" />
          <div className="grid grid-cols-2 gap-2 mt-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
          <Skeleton className="h-6 w-24" />
          <div className="mt-4 space-y-1">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkeletonDetail;

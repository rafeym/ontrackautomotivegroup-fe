import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const SkeletonDetail = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      {/* Left: Image Skeleton */}
      <div className="w-full lg:w-2/3 space-y-4">
        <Skeleton className="w-full h-[400px] rounded-lg animate-pulse" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="w-24 h-24 rounded animate-pulse" />
          ))}
        </div>
        <div className="space-y-4 mt-8">
          <Skeleton className="h-6 w-32 animate-pulse" />
          <Skeleton className="h-4 w-full animate-pulse" />
          <Skeleton className="h-4 w-3/4 animate-pulse" />
        </div>
      </div>

      {/* Right: Car Details Skeleton */}
      <Card className="w-full lg:w-1/3 border-none shadow-lg">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-3/4 animate-pulse" />
            <Skeleton className="h-6 w-1/3 animate-pulse" />
            <Skeleton className="h-6 w-20 animate-pulse" />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-5 w-32 animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-3 w-16 animate-pulse" />
                  <Skeleton className="h-4 w-full animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-5 w-32 animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-3 w-16 animate-pulse" />
                  <Skeleton className="h-4 w-full animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkeletonDetail;

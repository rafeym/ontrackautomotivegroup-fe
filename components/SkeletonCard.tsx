// components/SkeletonCard.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonCard = () => (
  <Card className="rounded-md">
    <CardHeader className="p-0">
      <Skeleton className="w-full h-48 rounded-t-md" />
    </CardHeader>
    <CardContent className="p-4 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-10 w-full" />
    </CardContent>
  </Card>
);

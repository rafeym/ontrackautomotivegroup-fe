// components/SkeletonFilter.tsx
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonFilter = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Filters</h2>

      {/* Simulate 6 dropdowns */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="mb-6">
          <Skeleton className="h-3 w-24 mb-2" /> {/* Label placeholder */}
          <Skeleton className="h-5 w-full" /> {/* Dropdown placeholder */}
        </div>
      ))}

      {/* Simulate buttons */}
      <div className="space-y-3 mt-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
};

export default SkeletonFilter;

import { Badge } from "@/components/ui/badge";
import { FiltersState } from "./Filters";

interface ActiveFiltersProps {
  filters: FiltersState;
}

const ActiveFilters = ({ filters }: ActiveFiltersProps) => {
  const anyFilterSelected = Object.values(filters).some(
    (arr: string[]) => arr.length > 0
  );

  if (!anyFilterSelected) return null;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-muted-foreground">
        Active Filters:
      </span>
      <div className="flex flex-wrap gap-2">
        {Object.entries(filters).map(([category, values]) =>
          (values as string[]).map((value: string) => (
            <Badge
              key={`${category}-${value}`}
              variant="secondary"
              className="capitalize"
            >
              {value}
            </Badge>
          ))
        )}
      </div>
    </div>
  );
};

export default ActiveFilters;

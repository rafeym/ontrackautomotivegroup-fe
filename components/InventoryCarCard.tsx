"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Filters from "./Filters";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { getAllCarsQuery } from "@/lib/queries";
import { urlFor } from "@/lib/imageUrl";
import { Car } from "@/lib/types";
import { SkeletonCard } from "./SkeletonCard";
import SkeletonFilter from "./SkeletonFilter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { sanityClient, cachedSanityClient } from "@/lib/sanityClient";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";

const INITIAL_VISIBLE_COUNT = 6;
const LOAD_MORE_COUNT = 6;

const InventoryCarCard = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [pendingFilters, setPendingFilters] = useState<{
    make: string[];
    model: string[];
    year: string[];
    fuelType: string[];
    transmission: string[];
    bodyType: string[];
  }>({
    make: [],
    model: [],
    year: [],
    fuelType: [],
    transmission: [],
    bodyType: [],
  });

  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  // Restore scroll position and view more state on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedVisibleCount = sessionStorage.getItem(
        "inventory-visible-count"
      );
      const savedScrollPosition = sessionStorage.getItem(
        "inventory-scroll-position"
      );
      const savedSortBy = sessionStorage.getItem("inventory-sort-by");

      if (savedVisibleCount) {
        setVisibleCount(parseInt(savedVisibleCount));
      }

      if (savedSortBy) {
        setSortBy(savedSortBy);
      }

      // Restore scroll position after a short delay to ensure content is rendered
      if (savedScrollPosition) {
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedScrollPosition));
        }, 100);
      }
    }

    // Cleanup function to clear saved state when component unmounts
    return () => {
      // Only clear if we're navigating away from inventory (not just component re-render)
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/inventory")
      ) {
        sessionStorage.removeItem("inventory-visible-count");
        sessionStorage.removeItem("inventory-scroll-position");
        sessionStorage.removeItem("inventory-sort-by");
      }
    };
  }, []);

  // Save scroll position and view more state before navigation
  const handleCarClick = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "inventory-visible-count",
        visibleCount.toString()
      );
      sessionStorage.setItem(
        "inventory-scroll-position",
        window.scrollY.toString()
      );
      sessionStorage.setItem("inventory-sort-by", sortBy);
    }
  };

  // Clear saved state when filters are applied
  const clearSavedState = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("inventory-visible-count");
      sessionStorage.removeItem("inventory-scroll-position");
      sessionStorage.removeItem("inventory-sort-by");
    }
  };

  // Effect to handle URL parameters
  useEffect(() => {
    if (cars.length === 0) return; // Wait for cars to load

    const make = searchParams.get("make")?.split(",") || [];
    const model = searchParams.get("model")?.split(",") || [];
    const year = searchParams.get("year")?.split(",") || [];
    const fuelType = searchParams.get("fuelType")?.split(",") || [];
    const transmission = searchParams.get("transmission")?.split(",") || [];
    const bodyType = searchParams.get("bodyType")?.split(",") || [];

    const newFilters = {
      make,
      model,
      year,
      fuelType,
      transmission,
      bodyType,
    };

    setPendingFilters(newFilters);

    // Apply the filters
    const filtered = cars.filter((car) => {
      const matchMake = make.length === 0 || make.includes(car.make);
      const matchModel = model.length === 0 || model.includes(car.model);
      const matchYear = year.length === 0 || year.includes(car.year.toString());
      const matchFuelType =
        fuelType.length === 0 || fuelType.includes(car.fuelType ?? "");
      const matchTransmission =
        transmission.length === 0 ||
        transmission.includes(car.transmission ?? "");
      const matchBodyType =
        bodyType.length === 0 || bodyType.includes(car.bodyType ?? "");
      return (
        matchMake &&
        matchModel &&
        matchYear &&
        matchFuelType &&
        matchTransmission &&
        matchBodyType
      );
    });

    setFilteredCars(sortCars(filtered, sortBy));
  }, [searchParams, cars]);

  useEffect(() => {
    async function loadCars() {
      try {
        setIsInitialLoading(true);
        // Use cached client for initial data fetch
        const allCars: Car[] = await cachedSanityClient.fetch(getAllCarsQuery);
        setCars(allCars);
        setFilteredCars(sortCars(allCars, sortBy));
      } catch (error) {
        console.error("Error loading cars:", error);
      } finally {
        setIsInitialLoading(false);
      }
    }
    loadCars();

    // Only set up real-time listener if we need live updates
    const subscription = sanityClient
      .listen(getAllCarsQuery)
      .subscribe(async (update) => {
        // Only refetch if there's a relevant change
        if (
          update.transition === "update" ||
          update.transition === "appear" ||
          update.transition === "disappear"
        ) {
          const allCars: Car[] =
            await cachedSanityClient.fetch(getAllCarsQuery);
          setCars(allCars);
          setFilteredCars(sortCars(allCars, sortBy));
        }
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const sortCars = (carsToSort: Car[], sortKey: string) => {
    return [...carsToSort].sort((a, b) => {
      switch (sortKey) {
        case "newest":
          return b.year - a.year;
        case "oldest":
          return a.year - b.year;
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "mileage-low":
          return (a.mileage || 0) - (b.mileage || 0);
        case "mileage-high":
          return (b.mileage || 0) - (a.mileage || 0);
        default:
          return 0;
      }
    });
  };

  const handleApplyFilters = async (filters: typeof pendingFilters) => {
    const hasActiveFilters =
      filters.make.length > 0 ||
      filters.model.length > 0 ||
      filters.year.length > 0 ||
      filters.fuelType.length > 0 ||
      filters.transmission.length > 0 ||
      filters.bodyType.length > 0;

    // Update URL with filter parameters
    const params = new URLSearchParams();
    if (filters.make.length > 0) params.set("make", filters.make.join(","));
    if (filters.model.length > 0) params.set("model", filters.model.join(","));
    if (filters.year.length > 0) params.set("year", filters.year.join(","));
    if (filters.fuelType.length > 0)
      params.set("fuelType", filters.fuelType.join(","));
    if (filters.transmission.length > 0)
      params.set("transmission", filters.transmission.join(","));
    if (filters.bodyType.length > 0)
      params.set("bodyType", filters.bodyType.join(","));

    // Update URL without refreshing the page
    router.push(`${pathname}?${params.toString()}`, { scroll: false });

    if (hasActiveFilters) {
      setIsFiltering(true);
    }

    // Close the drawer immediately
    setIsDrawerOpen(false);

    const filterPromise = new Promise<void>((resolve) => {
      const filtered = cars.filter((car) => {
        const matchMake =
          filters.make.length === 0 || filters.make.includes(car.make);
        const matchModel =
          filters.model.length === 0 || filters.model.includes(car.model);
        const matchYear =
          filters.year.length === 0 ||
          filters.year.includes(car.year.toString());
        const matchFuelType =
          filters.fuelType.length === 0 ||
          filters.fuelType.includes(car.fuelType ?? "");
        const matchTransmission =
          filters.transmission.length === 0 ||
          filters.transmission.includes(car.transmission ?? "");
        const matchBodyType =
          filters.bodyType.length === 0 ||
          filters.bodyType.includes(car.bodyType ?? "");
        return (
          matchMake &&
          matchModel &&
          matchYear &&
          matchFuelType &&
          matchTransmission &&
          matchBodyType
        );
      });
      setFilteredCars(sortCars(filtered, sortBy));
      setVisibleCount(INITIAL_VISIBLE_COUNT);
      resolve();
    });

    await Promise.all([
      filterPromise,
      new Promise((resolve) => setTimeout(resolve, 500)),
    ]);

    setIsFiltering(false);

    // Scroll to top after filters are applied
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Clear saved state when filters are applied
    clearSavedState();
  };

  const handleResetFilters = () => {
    setPendingFilters({
      make: [],
      model: [],
      year: [],
      fuelType: [],
      transmission: [],
      bodyType: [],
    });
    setFilteredCars(sortCars(cars, sortBy));
    setVisibleCount(INITIAL_VISIBLE_COUNT);
    router.push(pathname, { scroll: false });

    // Clear saved state when filters are reset
    clearSavedState();
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    const sorted = sortCars(filteredCars, value);
    setFilteredCars(sorted);
  };

  const pendingResults = cars.filter((car) => {
    const matchMake =
      pendingFilters.make.length === 0 ||
      pendingFilters.make.includes(car.make);
    const matchModel =
      pendingFilters.model.length === 0 ||
      pendingFilters.model.includes(car.model);
    const matchYear =
      pendingFilters.year.length === 0 ||
      pendingFilters.year.includes(car.year.toString());
    const matchFuelType =
      pendingFilters.fuelType.length === 0 ||
      pendingFilters.fuelType.includes(car.fuelType ?? "");
    const matchTransmission =
      pendingFilters.transmission.length === 0 ||
      pendingFilters.transmission.includes(car.transmission ?? "");
    const matchBodyType =
      pendingFilters.bodyType.length === 0 ||
      pendingFilters.bodyType.includes(car.bodyType ?? "");
    return (
      matchMake &&
      matchModel &&
      matchYear &&
      matchFuelType &&
      matchTransmission &&
      matchBodyType
    );
  }).length;

  const isLoading = cars.length === 0;
  const visibleCars = filteredCars.slice(0, visibleCount);
  const hasMoreToShow = visibleCount < filteredCars.length;

  return (
    <div className="relative">
      <div className="flex flex-col lg:flex-row px-4 py-8 gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 sticky top-4 self-start">
          {isInitialLoading ? (
            <SkeletonFilter />
          ) : (
            <Filters
              onApplyFilters={handleApplyFilters}
              pendingFilters={pendingFilters}
              setPendingFilters={setPendingFilters}
              resultsCount={pendingResults}
            />
          )}
        </aside>

        {/* Car Grid */}
        <section className="flex-1">
          {/* Sort and Filters Row */}
          <div className="sticky top-0 z-10 bg-white pb-4 pt-2">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                {/* Active Filters - Mobile/Tablet */}
                <div className="lg:hidden flex-1 mr-4">
                  {!isLoading &&
                  Object.values(pendingFilters).some(
                    (arr) => arr.length > 0
                  ) ? (
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Active Filters:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(pendingFilters).map(
                          ([category, values]) =>
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
                  ) : (
                    !isLoading && (
                      <span className="text-sm text-muted-foreground">
                        Use filters to find your perfect match
                      </span>
                    )
                  )}
                </div>

                {/* Sort Dropdown */}
                <div className="lg:ml-auto">
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-52">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                      <SelectItem value="price-low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="mileage-low">
                        Mileage: Low to High
                      </SelectItem>
                      <SelectItem value="mileage-high">
                        Mileage: High to Low
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Mobile Filters Button */}
              <div className="lg:hidden">
                <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                  <SheetTrigger asChild>
                    <Button className="w-full">Advanced Filters</Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <VisuallyHidden>
                        <SheetTitle>Filter Drawer</SheetTitle>
                      </VisuallyHidden>
                    </SheetHeader>
                    <div className="py-4">
                      <Filters
                        onApplyFilters={(filters) => {
                          handleApplyFilters(filters);
                        }}
                        pendingFilters={pendingFilters}
                        setPendingFilters={setPendingFilters}
                        resultsCount={pendingResults}
                        onClose={() => setIsDrawerOpen(false)}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>

          {/* No results */}
          {!isInitialLoading && !isFiltering && filteredCars.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center text-gray-600 space-y-4">
              <p className="text-lg font-semibold">
                No cars found with the selected filters.
              </p>
              <p className="max-w-sm">
                Please refine your filters to see available cars.
              </p>
              <Button variant="outline" onClick={handleResetFilters}>
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 content-start">
              {isInitialLoading || isFiltering
                ? Array.from({ length: isInitialLoading ? 6 : 6 }).map(
                    (_, i) => <SkeletonCard key={i} />
                  )
                : visibleCars.map((car) => (
                    <Card
                      key={car._id}
                      className="hover:shadow-lg transition rounded-xl overflow-hidden group relative border"
                    >
                      <CardHeader className="p-0 relative">
                        <Image
                          src={
                            urlFor(car.images?.[0])
                              ?.width(256)
                              .height(192)
                              .quality(75)
                              .url() ||
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDI1NiAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMTkyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjggOTZDMTA5LjY2IDk2IDk0LjY2NjcgMTExIDk0LjY2NjcgMTI5LjMzQzk0LjY2NjcgMTQ3LjY2IDEwOS42NiAxNjIuNjYgMTI4IDE2Mi42NkMxNDYuMzQgMTYyLjY2IDE2MS4zMyAxNDcuNjYgMTYxLjMzIDEyOS4zM0MxNjEuMzMgMTExIDE0Ni4zNCA5NiAxMjggOTZaIiBmaWxsPSIjRDREOUUxIi8+CjxwYXRoIGQ9Ik0xMjggMTQ2LjY2QzExOS4xNyAxNDYuNjYgMTEyIDEzOS40OSAxMTIgMTMwLjY2QzExMiAxMjEuODMgMTE5LjE3IDExNC42NiAxMjggMTE0LjY2QzEzNi44MyAxMTQuNjYgMTQ0IDEyMS44MyAxNDQgMTMwLjY2QzE0NCAxMzkuNDkgMTM2LjgzIDE0Ni42NiAxMjggMTQ2LjY2WiIgZmlsbD0iI0M3Q0RENyIvPgo8L3N2Zz4K"
                          }
                          alt={`${car.year} ${car.make} ${car.model} ${car.trim}`}
                          width={256}
                          height={192}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (isFavorite(car._id)) {
                              removeFromFavorites(car._id);
                            } else {
                              addToFavorites(car);
                            }
                          }}
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              isFavorite(car._id)
                                ? "text-red-500 fill-red-500"
                                : "text-gray-500"
                            }`}
                          />
                        </Button>
                      </CardHeader>

                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-md font-semibold line-clamp-1">
                            {car.year} {car.make} {car.model} {car.trim}
                          </h3>
                          {car.isAvailable ? (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                              In Stock
                            </span>
                          ) : (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                              Sold
                            </span>
                          )}
                        </div>

                        {car.address && (
                          <p className="text-xs text-muted-foreground">
                            {car.address}
                          </p>
                        )}

                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            Mileage: {car.mileage?.toLocaleString()} km
                          </span>
                          <span className="text-blue-600 font-semibold text-sm">
                            {formatCurrency(car.price)}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 text-xs">
                          {car.fuelType && (
                            <span className="bg-gray-100 px-2 py-0.5 rounded">
                              {car.fuelType}
                            </span>
                          )}
                          {car.transmission && (
                            <span className="bg-gray-100 px-2 py-0.5 rounded">
                              {car.transmission}
                            </span>
                          )}
                          {car.bodyType && (
                            <span className="bg-gray-100 px-2 py-0.5 rounded">
                              {car.bodyType}
                            </span>
                          )}
                        </div>

                        <Link
                          href={`/inventory/${car.slug.current}`}
                          onClick={handleCarClick}
                        >
                          <Button className="mt-3 w-full">View Details</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
            </div>
          )}

          {/* Show More */}
          {hasMoreToShow &&
            !isInitialLoading &&
            !isFiltering &&
            filteredCars.length > 0 && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={async () => {
                    setIsLoadingMore(true);
                    await new Promise((res) => setTimeout(res, 500));
                    setVisibleCount((prev) => prev + LOAD_MORE_COUNT);
                    setIsLoadingMore(false);
                  }}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? (
                    <svg
                      className="animate-spin mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                  ) : (
                    "View More"
                  )}
                </Button>
              </div>
            )}
        </section>
      </div>
    </div>
  );
};

export default InventoryCarCard;

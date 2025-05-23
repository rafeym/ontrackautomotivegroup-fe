"use client";

import { useFavorites } from "@/context/FavoritesContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { urlFor } from "@/lib/imageUrl";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchSanityQuery } from "@/lib/fetchSanity";
import { getAllCarsQuery } from "@/lib/queries";
import { Car } from "@/lib/types";

const Favourites = () => {
  const { favorites, removeFromFavorites } = useFavorites();
  const [isLoading, setIsLoading] = useState(true);
  const [validFavorites, setValidFavorites] = useState<Car[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function validateFavorites() {
      try {
        const allCars: Car[] = await fetchSanityQuery(getAllCarsQuery);
        const validCarIds = new Set(allCars.map((car) => car._id));

        favorites.forEach((favorite) => {
          if (!validCarIds.has(favorite._id)) {
            removeFromFavorites(favorite._id);
          }
        });

        if (isMounted) {
          setValidFavorites(
            favorites.filter((favorite) => validCarIds.has(favorite._id))
          );
        }
      } catch (error) {
        console.error("Error validating favorites:", error);
        if (isMounted) {
          setValidFavorites([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    validateFavorites();

    return () => {
      isMounted = false;
    };
  }, [favorites, removeFromFavorites]);

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-16 min-h-[calc(100vh-200px)]">
        <div className="max-w-7xl mx-auto h-full">
          <h1 className="text-4xl font-bold mb-6">Your Favorites</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-t-xl" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-10 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Your Favorites</h1>
        {validFavorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-400px)]">
            <p className="text-gray-600 text-lg text-center">
              You have not added any cars to your favorites yet.
            </p>
            <Link href="/inventory">
              <Button className="mt-4">Browse Inventory</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {validFavorites.map((car) => (
              <Card
                key={car._id}
                className="hover:shadow-lg transition rounded-xl overflow-hidden group relative border"
              >
                <CardHeader className="p-0 relative">
                  <img
                    src={urlFor(car.images?.[0])?.url()}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    alt={`${car.year} ${car.make} ${car.model} ${car.trim}`}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeFromFavorites(car._id);
                    }}
                  >
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
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

                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Mileage: {car.mileage?.toLocaleString()} km</span>
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

                  <Link href={`/inventory/${car.slug.current}`}>
                    <Button className="mt-3 w-full">View Details</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Favourites;

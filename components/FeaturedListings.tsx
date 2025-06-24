"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getLatestCarsQuery } from "@/lib/queries";
import { Car } from "@/lib/types";
import { urlFor } from "@/lib/imageUrl";
import { formatCurrency } from "@/lib/utils";
import { cachedSanityClient } from "@/lib/sanityClient";

export function FeaturedListings() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLatestCars() {
      try {
        const latestCars = await cachedSanityClient.fetch(getLatestCarsQuery);
        setCars(latestCars);
      } catch (error) {
        console.error("Error loading latest cars:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadLatestCars();
  }, []);

  return (
    <section className="py-16 px-4 md:px-8 bg-gray-50">
      {/* Section Header */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-bold">Our Newest Inventory</h2>
          <p className="text-gray-600">
            Hand-picked cars recently added to our inventory
          </p>
        </div>
        <Link href="/inventory">
          <Button variant="outline">Browse Inventory</Button>
        </Link>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {isLoading
          ? // Loading skeleton
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="overflow-hidden shadow-sm animate-pulse">
                <div className="w-full h-48 bg-gray-200" />
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mt-2" />
                </CardHeader>
                <CardContent className="p-4">
                  <div className="w-full h-10 bg-gray-200 rounded" />
                </CardContent>
              </Card>
            ))
          : cars.map((car) => (
              <Card
                key={car._id}
                className="hover:shadow-lg transition rounded-xl overflow-hidden group relative border"
              >
                <CardHeader className="p-0">
                  <img
                    src={urlFor(car.images?.[0])?.url()}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    alt={`${car.year} ${car.make} ${car.model} ${car.trim}`}
                  />
                </CardHeader>

                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold line-clamp-1">
                      {car.year} {car.make} {car.model} {car.trim}
                    </h3>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                      Just In
                    </span>
                  </div>

                  {car.address && (
                    <p className="text-sm text-muted-foreground">
                      {car.address}
                    </p>
                  )}

                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Mileage: {car.mileage?.toLocaleString()} km</span>
                    <span className="text-blue-600 font-semibold">
                      {formatCurrency(car.price)}
                    </span>
                  </div>

                  <Link href={`/inventory/${car.slug.current}`}>
                    <Button className="mt-3 w-full">View Details</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
      </div>
    </section>
  );
}
